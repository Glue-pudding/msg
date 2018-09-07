## flink窗口组织形式
### 对齐窗口（以ProcessingTimeWindow为代表）
>`AbstractAlignedProcessingTimeWindowOperator.java`

窗口是以`panes`的形式组织的，每滑动一次生成一个新的`pane`，滑出一个新的`pane`。即：`pane`是按时间滑动的窗口的基本单位。初始化时，根据当前系统时间设定窗口大小及滑动周期。代码如下：
```java
final long now = System.currentTimeMills();
nextEvaluationTime = now + windowSlide - (now % windowSlide);
nextSlideTime = now + paneSize - (now % paneSize);
```
然后根据`Math.min(nextEvaluationTime, nextSlideTime)`设置下一次触发器触发时间，触发器代码如下：
```java
@Override
public void trigger(long timestamp) throws Exception {
	// first we check if we actually trigger the window function
	if (timestamp == nextEvaluationTime) {
		// compute and output the results
		computeWindow(timestamp);

		nextEvaluationTime += windowSlide;
	}

	// check if we slide the panes by one. this may happen in addition to the
	// window computation, or just by itself
	if (timestamp == nextSlideTime) {
		panes.slidePanes(numPanesPerWindow);
		nextSlideTime += paneSize;
	}

	long nextTriggerTime = Math.min(nextEvaluationTime, nextSlideTime);
	registerTimer(nextTriggerTime, this);
}

private void computeWindow(long timestamp) throws Exception {
	out.setAbsoluteTimestamp(timestamp);
	panes.truncatePanes(numPanesPerWindow);
	panes.evaluateWindow(out, new TimeWindow(timestamp - windowSize, timestamp), this);
}
```
`pane`内部是一个hash链表，具体如图所示：   

![panee](./pictures/panee.png)


### Event时间窗（以EventTimeWindow为代表）
>`WindowOperator.java`

`EventTimewindow`的组织形式与`ProcessingTimeWindow`的完全不同，在`ProcessingTimeWindow`中的原始数据称为`partitionedState`,保存在算子自己内存的`panes`里，某条原始数据（RawData）在算子的窗口内存中仅有一份数据；而在`EventTimeWindow`将所有的原始数据保存在`StateBackend`中，另外，`EventTimeWindow`中存在多个窗口，窗口之间存在重叠，因此，一条原始数据（RawData）在窗口中可能有多个备份。（这是为嘛`RocksDBStateBackend`占用内存及压缩暴涨的原因）。如图所示，假设某个`EventTimeWindow`的大小为20秒，滑动周期为为5秒，当前时间为100秒。则会生成`20/5=4`个重叠的窗口，具体示意图如下：

![EventTimeWindow](./pictures/eventwindow.png)

当一个元组到来时，会生成一系列与上图所示的空窗口，具体代码如下：
> SlidingEventTimeWindows.java

```java
@Override
	public Collection<TimeWindow> assignWindows(Object element, long timestamp, WindowAssignerContext context) {
		if (timestamp > Long.MIN_VALUE) {
			List<TimeWindow> windows = new ArrayList<>((int) (size / slide));
			long lastStart = timestamp - timestamp % slide;
			for (long start = lastStart;
				start > timestamp - size;
				start -= slide) {
				windows.add(new TimeWindow(start, start + size));
			}
			return windows;
		} else {
			throw new RuntimeException("Record has Long.MIN_VALUE timestamp (= no timestamp marker). " +
					"Is the time characteristic set to 'ProcessingTime', or did you forget to call " +
					"'DataStream.assignTimestampsAndWatermarks(...)'?");
		}
	}
```

该段代码具有按`slide`向前对齐的能力，即：`lastStart = timestamp - timestamp % slide`向前对齐的能力。举例说明：假设一个滑动窗口的大小为20秒，滑动周期为5秒，当前时刻102秒到来一个新的数据，这时：`lastStart = 102 - 102 % 5 = 100`,即：生成 `20/5=4`个窗口依次是`[80-100),[75-95),[70-90),[65-85)`的空窗口。当另一个数据在104秒到来时，同样会生成这四个窗口。这些奇怪的窗口怎么用呢？`EventTimeWindow`与`ProcessingTimeWindow`区别之一就在这里。

这与算子状态的几个概念有关，即`partitionedState`和`nonPartitionedState`。基本上，`nonpartitionedState`是指用户自定义的状态、`ProcessingTimeWindow`中的原始数据等，这些数据一般在算子中仅有一份，而`partitionedState`指`EventTimeWindow`中的原始数据，这些数据在算子中存在多份，如上面的例子，当一个元组到来时要放在四个窗口中，保存为四份。

`EventTimeWindow`的原始数据保存在`StateBackend`里，而`ProcessingTimeWindow`的数据保存在算子的内存中。`StateBackend`抽象基类`AbstractStateBackend`中有变量`HashMap<String, KvState<?,?,?,?,?>>`用于保存原始数据。其中`HashMap`中第一个参数，表示数据所属，如在保存窗口数据时该参数的名称为"window-contents",第二个参数为`KvState`，保存窗口内容用的`KvState`是`ListState`(其他state详见[`StateBackend`](StateBackend.md)),内部按命名空间保存数据，命名空间一共分为三层:ColumnFamily、namespace、key。

* ColumnFamily 由系统自动分配
* namespace 某个窗口类的序列化字符传，即：可以简单的认为是上面描述的窗口（如:`[80, 100)`）
* key 为数据自身的key。

即：如下图所示，为`EventTimeWindow`的数据组织形式。     

![column](./pictures/column.png)

`EventTimeWindow`老化和计算周期有两个触发时机，一次是新元组到来时要检查窗口是否完全越过`watermark`,另一次是`watermark`到来时。如果整个窗口越过`watermark`，则触发窗口计算，并删除该窗口。代码分别在`WindowOperator.java`的`processElement()`函数的L387-L395行：
```java
TriggerResult triggerResult = context.onElement(element);

if (triggerResult.isFire()) {
	ACC contents = windowState.get();
	if (contents == null) {
		continue;
	}
	fire(window, contents);
}
```
和`StreamInputProcessor.java`的第165行`streamOperator.processWaterMark(new Watermark(lastEmittedWatermark))`

### SessionWindow

`SessionWindow`与`EventTimeWindow`的实现方案类似，不同的是每当一个数据到来时，其`EventTimeSessionWindows`Assigner仅会生成一个窗口，窗口的范围为数据的时间戳到改时间戳加Gap(sessionTimeout),代码如下:
```java
@Override
	public Collection<TimeWindow> assignWindows(Object element, long timestamp, WindowAssignerContext context) {
		return Collections.singletonList(new TimeWindow(timestamp, timestamp + sessionTimeout));
	}
```
如果窗口范围存在重叠，则将重叠的窗口进行合并。具体如图所示：

![sessionwindow](./pictures/sessionwindow.png)

当watermark到来时会触发窗口操作，窗口触发的条件为：大于窗口结束时间的watermark到达，否则窗口一直缓存。
