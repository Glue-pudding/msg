## Table API window执行流程
Table API当前只支持group window, row window还在开发中，groupwindow包括sliding window，tumble window和session window三大类。
<br>示例：
```java
val env = StreamExecutionEnvironment.getExecutionEnvironment
val tEnv = TableEnvironment.getTableEnvironment(env)

val orderA: DataStream[Order] = env.fromCollection(Seq(
  Order(1L, "beer", 3),
  Order(2L, "diaper", 4),
  Order(3L, "diaper", 4)))

orderA.toTable(tEnv, 'a, 'b, 'c)
.window(Slide.over("4.seconds").every("1.seconds").as("w"))
.select("a.sum")
.toDataStream[Long].print()
```
首先在调用TableAPI时会根据接口生成Flink的逻辑树，逻辑树节点包括Project、WindowAggregate、CatalogNode等，每个节点里都包含validate以及construct方法，construct负责生成对应的calcite relNode节点。生成calcite逻辑树后，经过一系列的规则优化，包括flink的几条DataStream转换规则，最终生成DataStreamRelNode Tree，到此逻辑计划生成完毕。而每个DataStreamRelNode都包含一个translatetoPlan的函数，通过层层调用translate函数构成最终的DataStream。

 ![TableAPITr](pictures/TableAPITr.png)

 下面主要介绍DataStreamAggregate的translateToPlan方法：

 <br>首先调用transformToAggregateFunctions生成相应的Aggregate function，aggfunction包括四个函数initiate(),
 prepare(), merge() 和 evaluate()，Aggregate类包括以下几种：
  - SumAggregate
  - AvgAggregate

Agg Function用于两个阶段，一个是Map阶段，在map阶段使用prepare函数去做project操作，即只获取groupby字段和用来做聚合的字段。
另一个是GroupReduce阶段，这个阶段使用merge()分组，然后使用evalute去计算真正的聚合值，因此，对应两个阶段，在流图上会生成两个转换，一个是map，一个是WindowStream。
* PrepareMap转化
```java
val mapFunction = AggregateUtil.createPrepareMapFunction(
      namedAggregates,
      grouping,
      inputType)

  val mappedInput = inputDS.map(mapFunction).name(prepareOpName)
```
* WindowStream生成
  <br>根据是否有group调用相应的createKeyedWindowedStream或者createNonKeyedWindowedStream去生成窗口
  ```java
  case ProcessingTimeTumblingGroupWindow(_, size) if isTimeInterval(size.resultType) =>
     stream.window(TumblingProcessingTimeWindows.of(asTime(size)))

   case ProcessingTimeTumblingGroupWindow(_, size) =>
     stream.countWindow(asCount(size))
  ```
 窗口中包含两个Function，reducefunction和windowfunction，reducefunction是用来真正做聚合操作的，这里的windowfunction只是做一个colloct操作。
  + reduceFunction
    ```java
    val reduceFunction = AggregateUtil.createIncrementalAggregateReduceFunction(
          namedAggregates,
          inputType,
          getRowType,
          grouping)
    ```
  + windowfunction
  ```java
  val windowFunction = AggregateUtil.createWindowIncrementalAggregationFunction(
            window,
            namedAggregates,
            inputType,
            rowRelDataType,
            grouping,
            namedProperties)
  ```
 将两个函数apply给窗口即可，若有groupby操作，则需在map操作之后做一个key转化，val keyedStream = mappedInput.keyBy(groupingKeys: _*);到此，窗口和聚合的执行逻辑就生成完毕。
