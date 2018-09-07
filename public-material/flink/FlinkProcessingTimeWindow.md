# Flink窗口组织形式
> 刘新春 2016年12月5日    

在窗口中，数据以Panes的形式保存。所谓Panes字面意思比较形象--窗格。Window当然是由窗格构成的啦。如下图所示：    
![Panes](pictures/Panes.png)

滑动窗口由多个连续的`pane`组成。假设窗口大小为20秒，每隔5秒滑动一次，即：   
```java
window(SlidingProcessingTimeWindows.of(Time.seconds(20), Time.seconds(5)))
```
其中，每5秒滑动进来的数据构成一个`pane`。

## Panes介绍

在`Window`类中以`AbstractKeyedPanes<IN, OUT, STATE, OUT> panes`的形式存在。每个`pane`的基类为`AbstractKeyedTimePanes`，主要有以下方法或成员变量：    
* `latestPane: KeyMap<Key, Aggregate>`    
  用来保存最新的`pane`,实际上每个`pane`是有一个Map链表构成的。
* `previousPanes: ArrayDeque<KeyMap<Key, Aggregate>>`    
  用来保存窗口还未老化的`panes`，该数据结构是一个由双向链表构成的数组。   
* `addElementToLatestPane(element: Type): void`   
  将数据添加到最新的一个`pane`中。
* `evaluateWindow()`    
  根据窗口中的数据计算结果。
* `slidePanes(panesToKeep: int): void`    
  当窗口中`pane`的数量低于要求的数量时，只添加；如果大于等于，则先删除最老`pane`,再添加新的`pane`。具体代码如下：
  ```java
  public void slidePanes(int panesToKeep) {
    if(panesToKeep > 1) {
      //the current pane become the latest previous pane
      previousPanes.addLast(latestPane);
    }

    // truncate the history
    while (previousPanes.size() >= panesToKeep){
      previousPanes.removeFirst();
    }
    //we need a new latest pane
    latestPane = new KeyMap<>();
  }
  ```
* `traverseAllPanes()`    
  遍历所有`pane`
* `writeToOutput(final DataOutputView out, final TypeSerializer<Key> keySerializer, final TypeSerializer<Aggregate> aggSerializer)`     
  将窗口中所有数据写入到输出流中，代码如下：
  ```java
  public void writeToOutput(final DataOutputView output, final TypeSerializer<Key> keySerializer, final TypeSerializer<Aggregate> aggSerializer) throws IOException {
    output.writeInt(BEGIN_OF_STATE_MAGIC_NUMBER);

    int numPanes = getNumPanes();
    output.writeInt(numPanes);

    // write from past
    Iterator<KeyMap<Key, Aggregate>> previous = previousPanes.iterator();
    for (int paneNum = 0; paneNum < numPanes; paneNum++) {
      output.writeInt(BEGIN_OF_PANE_MAGIC_NUMBER);
      KeyMap<Key, Aggregate> pane = (paneNum == numPanes - 1) ? latestPane : previous.next();

			output.writeInt(pane.size());
			for (KeyMap.Entry<Key, Aggregate> entry : pane) {
				keySerializer.serialize(entry.getKey(), output);
				aggSerializer.serialize(entry.getValue(), output);
			}
    }
  }
  ```
  在流中以`BEGIN_OF_STATE_MAGIC_NUMBER`来分割整个窗口(`state`),以`BEGIN_OF_PANE_MAGIC_NUMBER`来分割每个`pane`，`pane`内部是一系列的`key-value`。
* `readFromInput(final DataInputView input, final TypeSerializer<Key> keySerializer, final TypeSerializer<Aggregate> aggSerializer)`    
  从流中读取整个窗口,代码如下：
  ```java
  public void readFromInput(final DataInputView input, final TypeSerializer<Key> keySerializer, final TypeSerializer<Aggregate> aggSerializer) throws IOException {
    validateMagicNumber(BEGIN_OF_STATE_MAGIC_NUMBER, input.readInt());
  		int numPanes = input.readInt();

  		// read from the past towards the presence
  		while (numPanes > 0) {
  			validateMagicNumber(BEGIN_OF_PANE_MAGIC_NUMBER, input.readInt());
  			KeyMap<Key, Aggregate> pane = (numPanes == 1) ? latestPane : new KeyMap<Key, Aggregate>();

  			final int numElementsInPane = input.readInt();
  			for (int i = numElementsInPane - 1; i >= 0; i--) {
  				Key k = keySerializer.deserialize(input);
  				Aggregate a = aggSerializer.deserialize(input);
  				pane.put(k, a);
  			}

  			if (numPanes > 1) {
  				previousPanes.addLast(pane);
  			}
  			numPanes--;
  		}
    }
  ```
## 窗口运行机制

整个窗口的运行机制在`AbstractAlignedProcessingTimeWnidowOperator`中，有以下主要的接口：    
* `open()`    
   在启动时调用，主要作用为：
   * 设置触发周期、下一次触发滑动的时间、下一次计算时间（计算时间必须是滑动时间的倍数）,下一触发时间；
   * 处理已经放到`panes`中且已经过了触发周期的数据；    
   * 注册触发函数；
* `processElement()`    
   将到来的元组放入到最新的一个`pane`中
* `onProcessing()`    
  触发时间到来时调用此函数，在此函数中，如果触发时间等于下一次计算时间，则触发窗口计算；如果触发时间等于滑动时间，则进行滑动操作。同时设置下一次触发时间。具体代码如下：
  ```java
  @Override
  public void onProcessing(long timestamp) throws Exception {
    //first we check if we actually trigger the window function
    if (timestamp == nextEvalutionTime) {
      // compute and output the results
      computeWindow(timestamp);

      nextEvaluationTime += windowSlide;
    }

    // check if we slide the panes by one. this happen in addition to the
    // window computiation, or just by itself
    if (timestamp == nextSlidingTime) {
      panes.slidPanes(numPanesPerWindow);
      nextSlideTime += paneSize;
    }

    long nextTriggerTime = Math.min(nextEvalutionTime, nextSlideTime);
    getProcessingTimeService().registerTimer(nextTriggerTime, this);
  }
  ```
  触发时间的计算为: `nextTriggerTime = Math.min(nextEvalutionTime， nextSlideTime)`
* `computeWindow()`  
  调用`panes`的`evaluateWindow()`接口计算窗口数据。
* `snapshotState(FSDataOutputStream out, long checkpointId, long timestamp)`    
  对本窗口的数据进行快照并持久化，持久化的内容为窗口中所有panes中的数据。具体代码如下：
  ```java
  public void snapshotState(FSDataOutputStream out, long checkpointId, long timestamp) throws Exception {
    super.snapshotState(out, checkpointId, timestamp);

    //we write the panes with key/value maps into the stream, as well as when this state
    //should have triggered and slided  

    DataOutputViewStreamWrapper outView = new DataOutputViewStreamWrapper(out);

    outView.writeLong(nextEvaluationTime);
    outView.writeLong(nextSlidingTime);

    panes.writeToOutput(outView, keySerializer, stateTypeSerializer);

    outView.flush();
  }
  ```   
  在该段代码中，`super.snapshotState()`会检查用户是否自己实现了`Checkpointed`接口中的方法，如果实现了，则调用用户自定义`snapshotState()`接口,制作快照。代码如下：
  ```java
    @Override
    public void snapshotState(FSDataOutputStream out, long checkpointId, long timestamp) throws Exception {
      if (userFunction instanceOf CHechpointed){
        //unchecked
        Checkpointed<Serializable> chkFunction = (Checkpointed<Serializable>) userFunction;

        Serializable udfState;
        try{
          udfState = chkFunction.snapshotState(checkpointId, timestamp);
          if(udfState != null){
            out.write(1);
            InstantiationUtil.serializeObject(out, udfState);
          }else {
            out.write(0);
          } catch (Exception e) {
            throw new Exception("Failed to draw state snapshot from function: " + e.getMessage(), e);
          }
        }
      }
    }
  ```
  **该段代码后续可能更改, Checkpointed接口已经废弃**
* `restoreState()`   
  恢复快照的操作，`snapshotState()`的逆操作。具体不详细描述。
