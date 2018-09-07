## intelliJ IDEA 多线程调试

> 刘新春 2016年11月25日

在Flink调试的时候，需要多线程调试。以下举例：

```scala
env.addSource(new EventsGeneratorSource())
  .keyBy("userId")
  .window(SlidingProcessingTimeWindow.of(Time.seconds(10), Time.seconds(5)))
  .apply(new WindowStatic())
  .map(x=>(System.currentTimeMillis(), x))
```

在该段代码中，flink会将其划分成两个`Task`来处理，即：

* Source: Custom Source (1/1) 
* Fast SlidingProcessingTimeWindow(1000, 5000) of WindowStream.apply(WindowStream.scala) -> Map(1/1)

两个Task都跑`StreamTask`这个类，断点时会首先在Source这个线程中，如何切换到另一个线程调试呢？如图所示：

* 首先在断点的红点处右键，选中“Thread”选项
  ![Thread](./pictures/Thread.png)

* 然后运行"debug",这时会出现如下窗口：

  ![Debug](./pictures/Debug.png)

在红圈的地方可以选择你需要调试的线程，在图中显示的是第一个线程，现在选中的是第二个线程：

![Debug2](./pictures/Debug2.png)