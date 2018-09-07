# 1 watermark主要作用    

watermark主要用来解决在eventTime时的数据流的乱序问题。把watermark的时间作为 **参考的标准时间轴** 来使用。

# 2 watermark的使用

watermark使用在eventTime的场景中，需在env中设置时间为EventTime。    
```
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)
```

4秒滑动事件时间窗口，每2秒滑动一次，最多允许2秒的事件时间延迟，延迟超过2秒的事件丢弃：    
```
tempStm.keyBy(...)
  .window(SlidingEventTimeWindows.of(Time.seconds(4), Time.seconds(2)))
  .allowedLateness(Time.seconds(2))
  .apply(...)
  .addSink(...)
```

在使用EventTime时，必须使用DataStream类的assignTimestampsAndWatermarks方法来设置数据流中的每个元素的时间戳，并且按照一定的机制来注入watermark，有两种机制用来设置时间戳和注入watermark。

### a 使用周期性的watermark 

```
val tempStm = proxyInput.assignTimestampsAndWatermarks(new AssignerWithPeriodicWatermarks[TradeRequest] {

  override def extractTimestamp(element: TradeRequest, previousElementTimestamp: Long): Long = {
    element.timestamp
  }

  override def getCurrentWatermark(): Watermark = {
    new Watermark(System.currentTimeMillis())
})
```
上面的例子中在数据流proxyInput上添加了一个算子，该算子用来对数据流中的每一个元组打上时间戳，也就是事件时间，接口 `extractTimestamp` 用来给输入的元组打时间戳，    
接口 `getCurrentWatermark` 用来产生watermark，该接口是定时调用的，周期性地产生watermark，watermark产生的机制是用户自定义的。周期通过env中的executeConfig来设置：    
```
env.getConfig.setAutoWatermarkInterval(2000) //ms
```
假如watermark的周期被设置成2秒，这样，接口 `getCurrentWatermark` 每2秒调用一次（内部起了定时器），如果返回的watermark值是有效的（不为null且要比上一次发射的watermark值要大，基于时间不会倒退的常识 :-D），就会发射一个watermark到下游算子。

### b 使用间断的watermark       

```
val tempStm = proxyInput.assignTimestampsAndWatermarks(new AssignerWithPunctuatedWatermarks[TradeRequest] {

  override def extractTimestamp(element: TradeRequest, previousElementTimestamp: Long): Long = {
    element.timestamp
  }

  override def checkAndGetNextWatermark(lastElement: TradeRequest, extractedTimestamp: Long):Watermark={

    val currTime = System.currentTimeMillis()
      new Watermark(currTime)
  }
})
```
上面的例子中，接口 `extractTimestamp` 用来给数据流中的每一个元组打时间戳，接口 `checkAndGetNextWatermark` 用来校验元组并产生watermark，注意，该接口是每来一个元组时调用的，与接口 `extractTimestamp` 是一致的，可以在数据流的元组上做文章，当某些特殊的元组到来时发送watermark，该接口有一定的缺陷，如名称所示，周期不固定，如果某两个元组之间的时间间隔很长的话，watermark产生的频率也就很小，可能会影响一些操作的及时性。

上述两种方法内部原理实际上都是通过内部算子（`TimestampsAndPeriodicWatermarksOperator`和 `TimestampsAndPunctuatedWatermarksOperator`）来实现的，这两个算子在流图中只要排在依赖于事件时间操作的算子之前就可以了。

# 3 watermark的实现原理       

## 下图是每来一个数据元组时窗口算子的内部处理流程，以滑动的事件时间窗口为例：    
![processElement](./pictures/flink_watermark_1.jpg)

## 下图是每来一个watermark时窗口算子的内部处理流程：
![processWatermark](./pictures/flink_watermark_2.jpg)
