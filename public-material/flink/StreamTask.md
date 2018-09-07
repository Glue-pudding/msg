# StreamTask类介绍

> 刘新春 2016年11月24日

### 1. StreamTask简介

在Flink的流处理中，TaskManager调用`StreamTask`类的子类完成分配的任务。`StreamTask`类为所有流处理中任务`task`的基类，其中一个任务`task`是本地TaskManager部署、运行作业的基本单位。每个任务`task`中运行一个或多个`StreamOperator`，这些`StreamOperator`构成一个`operator`的链（Chain）。链中的`StreamOperator`被同步执行。通常一个链中包含联系的`map/flapmap/filter`任务。具体如下图所示：

![TaskManager.png](./pictures/TaskManager.png)

如在下面代码：

```scala
aa.flatMap(_.split(" "))
  .map(_.toInt)
  .filter(_ >=0)
```

其中，每个算子，如`map`都是一个`StreamOperator`，这三个`StreamOperator`是连续的操作，因此，将它们构成一个链（Chain），分配到同一个`StreamTask`中。

### 2. StreamTask类的继承关系

下图为`StreamTask`类的继承关系，图中列出了每个类/接口的关键成员变量和方法，具体如图所示：

![StreamTask](./pictures/StreamTask.png)

`StreamTask`算子链中算子的基类`StreamOperator`的类结构如下图所示：

![StreamOperator](./pictures/StreamOperator.png)

`StreamTask`中进行数据处理的接口主要是`invok()`, 一个任务完整的生命周期大致如下：

-- restoreState() -->保存链（Chain）中所有的算子（`operators`）的状态

--  invoke()

​       |

​        +----> 创建基本配置信息（如config等），下载链中的所有算子；

​        +----> operators.setup()；

​        +----> task specific init()；

​        +----> open-operators()；

​        +----> run()；

​        +----> close-operators()；

​        +----> dispose-operators()；

​        +----> common cleanup；

​        +----> task specific cleanup()

### 3. 运行过程

####  3.1 初始化阶段

以下代码为例：

```scala
env.addSource(new EventsGeneratorSource)
  .map(x=>x.userId)
  .filter(_>10000)
  .print
```

* 在`invoke()`中，首先初始化配置信息，然后初始化`headOperator`，并指向`source`算子。由于3个简单的算子连续，因此将其划分到同一个`StreamTask`中，并放到算子链`operatorChain`中，具体如下图所示：

![operatorChain](./pictures/OperatorChains.png)

其中，`headOperator`算子必须是一个输入或两个输入（`one-input` or `two-input`）的任务`task`。

在`operatorChain`中，每个算子自己的`output`会指向后继算子的信息。

在`headOperator.setup()`函数中，将`operatorChain`中`headOperator`后继算子的信息添加到`headOperator`的`output`变量中，构成一个完成的链。具体见：

```java
if (headOperator != null) {
  headOperator.setup(this, configuration, operatorChain.getChainEntryPoint())
}
```

此时，`headOperator`的`output`指向其后继算子:

![headerOperatorOutput](./pictures/HeaderOperatorOutput.png)

* 接着运行`init()`方法，获取该`StreamTask`持有的资源，本例中没有持有任何资源，该方法中不进行任何操作。

```java
@Override
protected void init() {
  // does not hold any resources, so no initialization needed
}
```

* 然后保存各个算子的初始化状态到`lazyResourceState`变量中，本例中不持有任何资源，因此，`lazyReourceState`为空（`null`）；

* 接着调用`openAllOperators()`方法，将所有的算子打开:

  ```java
  private void openAllOperators() throws Exception {
    for (StreamOperator<?> operator : operatorChain.getAllOperators()) {
      if (opertaor != null) {
        operator.open();
      }
    }
  }
  ```

  具体每个算子的`open()`方法做什么，在下文中将介绍。

#### 3.2 run阶段

该阶段从`headOperator`作为入口，处理数据。

```java
@Override
protected void run() throws Exeception {
  headOperator.run(getCheckpointLock());
}
```

其中，`getCheckpointLock()`为获取`StreamTask`的全局锁`lock`，该变量为`StreamTask`的成员变量，每当执行任务时，需要锁定整个`StreamTask`的内容。

经过一系列的准备工作，最终调用到用户自定义的算子中，本文为`EventsGeneratorSource`的`run()`函数中：

```scala
override def run(sourceContext: SourceContext[Event]): Unit = {
  
  while (true) {
    for (i <- 0 until 10000) {
      RandomString.getRandomString(200) match {
        case Some(info) => 
          val event = Event(Random.nextInt(1), info)
          sourceContest.collect(event)
          msgId += 1
        case None => 
          logger.error("the length of info should > 0")
      }
    }
    Thread.sleep(1000)
  }
}
```

#### 如何调用后继算子呢？

在上文代码中，`run()`函数是一个无限循环，如何调用后继的算子继续处理其输出呢？

答案在上文的`operatorChain`和`headOperator.setup`中。当`while`循环中调用`RandomString.getRandomString`产生一个字符串后，我们会将其包装成一个`Event`的对象，并调用上下文`sourceContext`的`collect`方法发送出去，秘密就在这里。

在上文中，我们已经将`headOperator`的后继算子的信息放到其`output`变量中，此时`collect`方法会通过`output`变量获取后继算子，调用后继算子的处理函数，继续获取此算子的后继算子，调用处理函数....直到该链结束。



### 3.3 close阶段

运行结束阶段，将buffer中所有的数据发送出去，并等待下游算子结束，然后释放资源，并退出。

注意：在`run()`方法之后即为结束阶段，因此，在实现自定义`source()`算子时，应该将该算子的`run()`方法写为`while(true)`的形式，保证其不断产生数据并输出。



### 4. CheckPoint机制

在`StreamTask`中，从`StatefulTask`继承以下三个方法：

* `void setInitialState(T stateHandle)`

* `boolean triggerCheckpoint(long checkpointId, long timestamp)`

* `void notifyCheckpointComplete(long checkpointId)`

这三个方法的作用依次是：

* `setInitialState`
  设置某个算子的初始状态，初始状态通常是上一次操作的状态

* `triggerCheckpoint`
  该方法或者被直接调用，通常是`source`算子；或者被同步调用，通常是收到栅栏（`barrier`）的时候

* `notifyCHeckpointComplete`
  当一个checkpoint结束的时候被调用（如：当协调器收到所有tasks的确认时）

#### 4.1 checkpoint的过程：
* 当`StreamTask`从通道中读取一个元组时，首先检查该元组是数据元组还是事件元组；
* 如果是数据元组，则走数据处理通道；
* 如果是`Barrier`则检查所有通道的数据是否到来，如果没有到来，则阻塞本通道；吐过已经到来，则制作快照。
* 在同一个`StreamTask`制作快照时，首先从`operatorChain`的尾部开始制作快照，然后一次一个算子(`Operator`)制作快照，并保存到`StateBackend`中。如在下面代码：
```scala
env.addSource(new EventsGeneratorSource)
  .keyBy("userId")
  .window(SlidingProcessingTimeWindows.of(Time.seconds(10), Time.seconds(5)))
  .apply(new WindowStatistic)
  .map(new PersionalMap2)
```

​    Flink会将作业分配到两个`StreamTask`中，其中一个是`source`，另一个是`window->Map`。以第二个`StreamTask`为例，其`operatorChain`为`operatorChain[0]=Map`，`operatorChain[1]=SlidingProcessTimeWindow` , 制作快照时首先从尾部开始制作，即：`operatorChain[0]=Map`， 然后才是`operatorChain[1]=SlidingProcessTimeWindow`。每个算子制作完自己的快照之后，保存到设定的`StateBackend`中。

#### 4.2 聚合算子快照与一般算子快照

在Flink中，算子有三种状态，分别是：

* `operatorState`
* `functionState`
* `kvStates`

窗口等聚合算子的快照制作过程与一般算子如`map/filter/source/flatmap`不太相同，如下所示，分别是`map`算子和`window`算子制作快照的调用链:

* 一般算子
  在上面的代码段中，我们对`PersionalMap2`继承`Checkpointed`接口，代码如下：

  ```scala
  class PersonalMap2 extends MapFunction[Int, Int] with Checkpointed[Option[Int]] {
    
    private var count = 0
    
    override def map (value: Int): Int = {
      count += 1
      value + 1
    }
    
    override def snapshotState (checkpointId: Long, checkpointTimestamp: Long): Option[Int] ={
      Some(count)
    }
    
    override def resourceState (state: Option[Int]): Unit = {
      state match {
        case Some(c) => count = c
        case None
      }
    }
  ```

  调用链如下所示：

  ```scala
  operator
   |-->AbstrectUdfStreamOperator.snapshotOperatorState()                 |--operatorState=null
        |-->super(AbstractStreamOperator).snapshotOperatorState()=>state-|--functionState=null
        |-->userFunction                 |--operatorState=null           |--kvStates=null
        |    |-->snapshotState() =>state-|--functionState=udfState
        |                                |--kvStates=null
        |-->写入StateBackend
  ```

  由以上调用链可知，如果`map`算子继承了`Checkpointed`接口，即：`userFunction`(此处为用户自定义的`map`类)为`Checkpointed`的子类，因此会调用用户自定义的`snapshotState()`方法，获取快照，该快照的句柄将被保存到`state`的`functionState`中。

  最后，会获取`StateBackend`将该`state`写入到`StateBackend`中。
* 聚合算子

​       在上文中，我们对`WindowStatistic`类也继承`Checkpointed`接口，具体如下：

```scala
class WindowStatistic extends WindowFunction[Event, Int, Tuple, TimeWindow] with Checkpointed[Option[List[Event]]] {
  
  private var snap: Option[List[Event]] = None
  
  override def apply(key: Tuple, window: TimeWindow, input: Iterator[Event], out: Collector[Int]): Unit = {
    
    var count = 0
    val it = input.toList.iterator
    while (it.hasNext) {
      count += 1
      it.next()
    }
    snap = Some(it.toList)
    out.collect(count)
  }
  
  override def snapshotState (checkpointId: Long, checkpointTimestamp: Long): Option[List[Event]] = {
    
    snap
  }
  
  override def restoreState (state: Option[List[Event]]): Unit = {
    
    snap = state
  }
}
```

调用链如下所示：

```scala
operator
 |-->AbstractAlignedProcessingTimeWindowOperator.snapshotOperatorState()
     |-->super(AbstractUdfStreamOperator).snapshotOperatorState()         |-operatorState=null
     |   |-->super(AbstractStreamOperator).snapshotOperatorState()=>state-|-functionState=null
     |   |-->userFunction "XX"(false)      |--operatorState=null          |-kvStates=null
     |   |-->得到的state跟初始相同,即：state-|--functionState=null
     |                                     |--kvStates=null
     |-->获取窗口数据panes,并保存到StateBackend中
```

以上调用链可以看出，窗口类算子比一般算子多一层调用，另外，`userFunction`判断是否为`Checkpointed`类时，返回值为`false`，即：不认为该窗口类算子为`Checkpointed`类的子类。因此，不会调用用户自定义的`snapshotState()`接口，也就不会保存用户自定义的状态。与一般算子调用`AbstractUfStreamOperator.snapshotOperatorState`不同，返回的`state`没有`functionState`。最后在外层`AbstractAlignedProcessingWindowOperator.snapshotOperatorState()`中获取窗口数据，并保存到`StateBackend`中。（窗口数据是以`pane`的形式组织的，每个`pane`为一个滑动周期）

* 太坑了！为什么我们自定义的窗口继承了`Checkpointed`接口，但在判断`userFunction`是否为`Checkpointed`类时为`false`呢？(经与社区联系，确认这是个BUG)

可能的原因是:Flink对Window类又包装了一层，用Debug跟进去之后发现`userFunction`为一个`ScalaWindowFunctionWrapper`类，其内部有一个变量`func`才是我们自定义的`WindowStatistic`类!
