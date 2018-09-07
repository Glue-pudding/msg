# Table API
Table API是对DataSet和DataStream的一种封装，提供和SQL类似的关系操作接口。

### 依赖关系
Table API是flink-table工程的一部分，因此要使用TableAPI，需将flink-table加入工程依赖中。
```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-table_2.10</artifactId>
  <version>1.2-SNAPSHOT</version>
</dependency>
```

### 使用方式
* Register注册表方式
<br>通过register接口将表注册到TableEnvironment，然后stream通过ingest访问表名，batch通过scan接口访问表名。
 * Stream
 ```scala
     // set up execution environment
     val env = StreamExecutionEnvironment.getExecutionEnvironment
     val tEnv = TableEnvironment.getTableEnvironment(env)
     env.setParallelism(1)

     val dataStream: DataStream[Order] = env.addSource(new JOrdersGeneratorSource)
     tEnv.registerDataStream("OrderA", dataStream)
     tEnv.ingest("OrderA").select('*).toDataStream[Order].print()

     env.execute()
 ```
 * Batch
```scala
val env = ExecutionEnvironment.getExecutionEnvironment
    val tEnv = TableEnvironment.getTableEnvironment(env)
    env.setParallelism(1)

    val dataSet: DataSet[Order] = env.readCsvFile[Order](...)
    tEnv.registerDataSet("OrderA", dataSet)
    tEnv.scan("OrderA").select('*).toDataSet[Order].print()

    env.execute()
```
* ToTable转换表方式
 <br>调用DataStream或者DataSet的toTable方法转换为表即可使用，本质上也是在toTable接口里将表注册到table环境中
 * Stream
 ```scala
     // set up execution environment
     val env = StreamExecutionEnvironment.getExecutionEnvironment
     val tEnv = TableEnvironment.getTableEnvironment(env)
     env.setParallelism(1)

     val dataStream: DataStream[Order] = env.addSource(new JOrdersGeneratorSource)
     dataStream.toTable(tEnv).select('*).toDataStream[Order].print()

     env.execute()
 ```
 * Batch
 ```scala
 val env = ExecutionEnvironment.getExecutionEnvironment
     val tEnv = TableEnvironment.getTableEnvironment(env)
     env.setParallelism(1)

     val dataSet: DataSet[Order] = env.readCsvFile[Order](...)
     dataSet.toTable(tEnv).select('*).toDataSet[Order].print()

     env.execute()
 ```

### 支持的操作
| Operators          | Description                              |
| :----------------- | ---------------------------------------- |
| **Select**         | 和SQL SELECT一样，支持select\*. <br>val in = ds.toTable(tableEnv, 'a, 'b, 'c); <br>val result = in.select('a, 'c as 'd);<br>val result = in.select('\*); |
| **As**             | 别名.<br>val in = ds.toTable(tableEnv).as('a, 'b, 'c); |
| **Where / Filter** | 过滤操作.<br>val in = ds.toTable(tableEnv, 'a, 'b, 'c);<br>val result = in.filter('a % 2 === 0);<br>val result = in.where('b === "red"); |
| **GroupBy**        | 分组操作. <br>val in = ds.toTable(tableEnv, 'a, 'b, 'c);<br>val result = in.groupBy('a).select('a, 'b.sum as 'd); |
| **Join**           | 只支持两表join，不支持流join，必须有等值条件.<br>val left = ds1.toTable(tableEnv, 'a, 'b, 'c);<br>val right = ds2.toTable(tableEnv, 'd, 'e, 'f);<br>val result = left.join(right).where('a === 'd).select('a, 'b, 'e); |
| **LeftOuterJoin**  | 左外连接，约束同join.<br>val left = tableEnv.fromDataSet(ds1, 'a, 'b, 'c)<br>val right = tableEnv.fromDataSet(ds2, 'd, 'e, 'f)<br>val result = left.leftOuterJoin(right, 'a === 'd).select('a, 'b, 'e) |
| **RightOuterJoin** | 右外连接，约束同join. <br>val left = tableEnv.fromDataSet(ds1, 'a, 'b, 'c)<br>val right = tableEnv.fromDataSet(ds2, 'd, 'e, 'f)<br>val result = left.rightOuterJoin(right, 'a === 'd).select('a, 'b, 'e) |
| **FullOuterJoin**  | 外连接，约束同join. <br>val left = tableEnv.fromDataSet(ds1, 'a, 'b, 'c)<br>val right = tableEnv.fromDataSet(ds2, 'd, 'e, 'f)<br>val result = left.fullOuterJoin(right, 'a === 'd).select('a, 'b, 'e) |
| **Union**          | 两表合并，并且会去除重复的记录.<br>val left = ds1.toTable(tableEnv, 'a, 'b, 'c);<br>val right = ds2.toTable(tableEnv, 'a, 'b, 'c);<br>val result = left.union(right); |
| **UnionAll**       | 两表合并，不进行去重.<br>val left = ds1.toTable(tableEnv, 'a, 'b, 'c);<br>val right = ds2.toTable(tableEnv, 'a, 'b, 'c);<br>val result = left.unionAll(right); |
| **Intersect**      | 两表交集，重复记录只输出一次.<br>val left = ds1.toTable(tableEnv, 'a, 'b, 'c);<br>val right = ds2.toTable(tableEnv, 'e, 'f, 'g);<br>val result = left.intersect(right); |
| **IntersectAll**   | 两表交集，重复记录输出多次.<br>val left = ds1.toTable(tableEnv, 'a, 'b, 'c);<br>val right = ds2.toTable(tableEnv, 'e, 'f, 'g);<br>val result = left.intersectAll(right); |
| **Minus**          | 表1在表2中不存在的记录，重复记录只输出一次.<br>val left = ds1.toTable(tableEnv, 'a, 'b, 'c);<br>val right = ds2.toTable(tableEnv, 'a, 'b, 'c);<br>val result = left.minus(right); |
| **MinusAll**       | 表1在表2中不存在的记录，重复记录输出多次.<br>val left = ds1.toTable(tableEnv, 'a, 'b, 'c);<br>val right = ds2.toTable(tableEnv, 'a, 'b, 'c);<br>val result = left.minusAll(right); |
| **Distinct**       | 去除重复记录. <br>val in = ds.toTable(tableEnv, 'a, 'b, 'c);<br>val result = in.distinct(); |
| **Order By**       | 按字段排序.<br>val in = ds.toTable(tableEnv, 'a, 'b, 'c);<br>val result = in.orderBy('a.asc); |
| **Limit**          | 限制输出条数. <br>val in = ds.toTable(tableEnv, 'a, 'b, 'c);<br>val result = in.orderBy('a.asc).limit(3); // 前三条不输出 <br>val in = ds.toTable(tableEnv, 'a, 'b, 'c);<br>val result = in.orderBy('a.asc).limit(3, 5); //从第四条起输出5条 |
| **Window**         | 窗口具体见下一章节 |

### 函数及数据类型
Table API支持的数据类型和内置函数与SQL是一样的，区别在于使用方式，TableAPI是接口方式，e.g. user.isNull, user.substring(1,2)，这里就不一一列举了。

### 窗口
对于流，聚合操作只能在有限的数据上进行，这就有了窗口。TableAPI当前只支持group-window，即按照一定group(个数或时间)触发计算及输出。Group-window又分为以下三大类：
#####  Tumble 跳跃窗口
跳跃窗口之间数据不重叠，周期到达时才进行计算。

| Method | Required | Description|
| ------ | -------- | ---------- |
| over   | Yes      | 窗口周期    |
| on     | Option   | 设置event-time    |
| as     | Option   | 窗口别名   |

* Tumbling Event-time Window
<br>```dataStream.toTable(tEnv).window(Tumble.over("5.minutes").on("rowtime"))```
* Tumbling Processing-time Window
<br>```dataStream.toTable(tEnv).window(Tumble.over("5.minutes"))```
* Tumbling Row-count Window
<br>```dataStream.toTable(tEnv).window(Tumble.over("5.rows").as("w"))```
* Tumbling Row-count Window with groupBy
<br>```dataStream.toTable(tEnv).groupby("user").window(Tumble.over("5.rows").as("w"))```

##### Slide 滑动窗口
滑动窗口可以设置窗口周期和滑动周期，若滑动周期小于串钩周期，则窗口之间会有重叠。

| Method | Required | Description|
| ------ | -------- | ---------- |
| over   | Yes      | 窗口周期    |
| every   | Yes      | 触发周期   |
| on     | Option   | 设置event-time    |
| as     | Option   | 窗口别名   |

* Sliding Event-time Window
<br>```dataStream.toTable(tEnv).window(Slide.over("5.minutes").every("1.minutes").on("rowtime"))```
* Sliding Processing-time Window
<br>```dataStream.toTable(tEnv).window(Slide.over("5.minutes").every("1.minutes"))```
* Sliding Row-count Window
<br>```dataStream.toTable(tEnv).window(Slide.over("5.rows").every("1.rows").as("w"))```
* Sliding Row-count Window with groupBy
<br>```dataStream.toTable(tEnv).groupby("user").window(Slide.over("5.rows").every("1.rows").as("w"))```

##### Session 会话窗口
会话窗口可以设置不活跃周期，即当一天记录到来后多久没有新记录到达则该窗口结束。

| Method | Required | Description|
| ------ | -------- | ---------- |
| withGap | Yes     | 不活跃周期    |
| on     | Option   | 设置event-time    |
| as     | Option   | 窗口别名   |

* Session Event-time Window
<br>```dataStream.toTable(tEnv).window(Session.withGap("5.minutes").on("rowtime"))```
* Session Processing-time Window
<br>```dataStream.toTable(tEnv).window(Session.withGap("5.minutes"))```
* Session Processing-time Window with groupBy
<br>```dataStream.toTable(tEnv).groupby("user").window(Session.withGap("5.minutes").as("w"))```
