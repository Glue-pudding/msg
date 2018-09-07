# SlidingEventTimeWindows数据处理流程及优化方案    
> 刘新春     
> 2017年1月4日     
> 本文档基于flink-1.1.4版本     

Event Time相关的窗口操作均与Watermark有关，会触发计算主要有两个地方，一个是当元组到来时；另一个是触发时间到来时。具体Watermark的信息请参阅[Watermark实现原理](./flink_watermark.md)。本文主要介绍SlidingEventTimeWindows的具体处理流程及优化方案，其他Event Time窗口类似。主要代码在`WindowOperator.java`中。    

## 1. 现有处理方式     

### 1.1 现有的处理过程      
#### 1.1.1 数据在StateBackend端的保存形式  
EventTimeWindow的原始数据均保存在StateBackend中，在StateBackend的抽象基类AbstractStateBackend中具有变量HashMap<String, KvState<?,?,?,?,?>> keyValueStatesByName用于保存原始数据，其中HashMap中第一个参数表示数据所属，即：属于哪种数据，在EventTimeWindow中，用于保存窗口数据时该参数的内容为"window-contents"，第二个参数是'KvState'，保存窗口数据时`KvState`具体是`ListState`(其他State详见[StateBackend](StateBackend.md).在`StateBackend`内部数据按命名空间保存数据，命名空间一共可以分成三层：ColumnFamily、namespace、以及key,具体如下：
* ColumnFamily由系统分配产生    
* namespace某个窗口的序列化字符串，即：可以简单的认为是窗口的跨度（如[80, 1000)）
* key为数据本身的key。具体如下所示：

![Column](./pictures/column.png)  

在实际`RocksDBStateBackend`中namespace和key值是在一起的，当写入某个数值时，代码如下：  
```java
@Override
public void add(V value) throws IOException {
  ByteArrayOutputStream baos = new ByteArrayOutputStream();
  DataOutputViewStreamWrapper out = new DataOutputViewStreamWrapper(baos);
  try {
    writeKeyAndNamespace(out);
    byte[] key = baos.toByteArray();

    baos.reset();

    valueSerializer.Serialize(value, out);
    backend.db.merge(columnFamily, writeOptions, key, baos.toByteArray);
  } catch (Exception e) {
    throw new RuntimeException("Error while adding data to RocksDB", e);
  }

}
```   
其中:     
(1)`writeKeyAndNamespace(out)`是将key和namespace的序列化数据写入到输出流中，中间用*（42）隔开。    
```java
protected void writeKeyAndNamespace(DataOutputView out) throws IOException {
  backend.keySerializer().Serialize(backend.currentKey, out);
  out.writeByte(42);
  namespaceSerializer.serialize(currentNamespace, out);
}
```

(2)`db.merge()`是RocksDB的接口，用于将同一个key值下将新的value值与现有的value值合并。   

#### 1.1.2 窗口的组织形式     
每一个新的窗口均由`WindowAssigner`产生，在SlidingEventTimeWindow中，该`WindowAssigner`是指`SlidingEventTimeWindows`，每当一个新的元组到来时，均产生一系列存在重合的，以slide为间隔的完整窗口。如，以下代码：
```java
datastream.keyBy(0)
  .window(SlidingEventTimeWindows.of(Time.seconds(20), Time.seconds(5)))
  .apply(new JWindowStatistic())
```
实际是设置了`WindowAssigner`（`SlidingEventTimeWindows`）,告诉它每次产生的窗口大小及滑动的大小，当一个新元组到来时便调用assignWindows接口产生一系列空白窗口。具体代码如下：     
```java
@Override
public Collection<TimeWindow> assignWindows(Object element, long timestamp, WindowAssignerContext) {
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
上述代码中，每个元组到来都会产生size/slide个窗口，假设窗口大小为20秒，滑动周期为5秒，假设在第102秒到来一个元组，则产生的窗口如下图所示：    
![EventTimeWindow](./pictures/eventwindow.png)      

#### 1.1.3 窗口计算触发过程    

** （1）处理元组分支触发窗口计算 **

整个Event time window的操作都在WindowOperator的processElement中完成的。具体细节可以参阅[flink watermark](./flink_watermark.md)的文档，这里稍作说明。    
![processElement](./pictures/processElement.png)     

在该过程中有个判断是否需要触发计算的动作，具体代码如下：     
```java
@Override
public TriggerResult onElement(Object element, long timestamp, TimeWindow window, TriggerContext ctx) throws Exception {
  if (window.maxTimestamp() <= ctx.getCurrentWatermark()) {
    // if the watermark is already past the window fire immediately
    return TriggerResult.FIRE;
  } else {
    ctx.registerEventTimeTimer(window.maxTimestamp());
    return TriggerResult.CONTINUE;
  }
}
```

由以上代码可以看出，本过程只返回`FIRE`和`CONTINUE`两个结果。    

** （2）Watermark分支触发窗口计算 **     

该分支主要通过收到watermark元组时调用。调用过程如下:    

![processWaterMark](./pictures/processWatermark.png)       

在上图中判断当前Timer的时间戳大于watermark的时间戳的一个原因是认为时间总是递增的，每来一个新元组产生的一系列Window都是递增的，虽然不同数据到来可能产生相同的窗口，但通过下面两个数据结构的配合即可实现按递增顺序触发。   
* protected transient Set<Timer<K, W>> watermarkTimers;    
* protected transient PriorityQueue<Timer<K, W>> watermarkTimerQueues;    
其中第一个变量用于记录某个窗口对应的Timer是否已经放入watermarkTimerQueues队列，第二个变量按时间递增的顺序放入Timers.

*说明*
TriggerResult是一个二维的enum，此处设计比较巧妙，注意`processElement()`接口和`processWaterMark()`方法中的context.onElement()和context.onEventTime()之间通过TriggerResult的配合。

## 2. 拟改进处理方式    
### 2.1 现有处理方式存在的弊端    
现有处理方式中，每个元组到来都会生成`(size / slide)`个窗口，且该元组均保存到这些窗口对应的`StateBackend`中，即：每个元组到来时，便会产生`(size / slide)`个这样的备份。这大量占用了`StateBackend`的空间，`(size / slide)`的值越大，产生的备份冗余越多。如：`MemoryStateBackend`和`RocksDBStateBackend`数据均暂存在内存里，占用大量的内存空间，进行备份时也会占用大量的备份时间及空间。

### 2.2 拟解决方案    

![optimization](./pictures/optimization.png)    

如图所示，如果将各个窗口投影到一个一维空间中，相邻的一个或几个窗口之间存在大量的重叠。为此，将原来按窗口为单位存储数据，改为按slide(pane)为单位存储数据，当某个新元组到来时，只检查其属于哪个slide(pane)，改为每个slide(pane)对应一个`WindowState`。当触发计算是，需要将该pane及后面连续几个pane取出，构成一个完整窗口并计算，当watermark触发cleanup操作，删除slide(pane)时，需要将所有maxTimestamp < (watermark.time - watermark.time % slide -size)的pane清除。

#### 2.1.1 SlidingEventTimeWindows.java改进     

新元组到来时，不再产生一系列窗口，而是产生一个slide(pane)，该slide(pane)需要包含以下信息：    
* start 该pane的起始时间点    
* end 该pane的结束时间点    
* window size 设置的窗口大小    

**定义SlidingEventTimePane类**         
为了保证兼容性，该类应该继承`TimeWindow`类，否则无法使用原来的结构。
```java
class SlidingEventTimePane extends TimeWindow {

  private final long windowSize;

  public SlidingEventTimePane(long start, long end, long windowSize) {
      super(start, end);
      this.windowSize = windowSize;
  }

  // 其他必备方法
  ...

}
```
**改写SlidingEventTimeWindows的assignWindows()方法**    
使其只产生一个对应的pane        
```java
@Override
public Collection<TimeWindow> assignWindows(Object element, long timestamp, WindowAssignerContext context) {
  if (timestamp > Long.MIN_VALUE) {
    List<TimeStamp> windows = new ArrayList<>((int) (slide / slide));
    long start = timestamp - timestamp % slide;
    windows.add(new SlidingEventTimePane(start, start + slide, size));
    return windows;
  } else {
    //异常处理
  }
}

```

**改写WindowOperator类的processElement()方法**    
为防止带来副作用，在判断windowAssigner类型时添加专门处理SlidingEventTimeWindows类型。
```java
if (windowAssigner instanceof MergingWindowAssigner) {
  //deal with session window
} else if (windowAssigner instanceof SlidingEventTimeWindows) {
  //deal with Sliding Event Time window
} else {
  //deal with other windows
}
```
为保持与现有的各种辅助接口相兼容，在做各种判断前，需要根据SlidingEventTimePanes生成现有窗口信息。并使用这个窗口来判断是否应该触发计算或清空。如下图：    
![paneTime](./pictures/paneTime.png)   

一个SlidingEventTimePane存在的时间为从创建到最后覆盖本pane的窗口为止。当一个pane产生时，需要向`watermarkTimerQueues`队列中添加触发计算时间和删除pane的时间。其中，触发计算时间：    install.md

```java
val evaluateTime = pane.maxTimestamp
```

删除时间：  
```java
val cleanupTime = pane.start + windowSize + allowedLateness
```
