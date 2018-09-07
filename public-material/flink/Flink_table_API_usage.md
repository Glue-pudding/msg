# Flink Table API 原理介绍

### 一、Flink Table API简介

Flink Table API 是Fllink提供的类SQL的SDK API。以Library的形式提供，在流和批上都可以用此API开发业务。

 ![TableAPI](pictures/TableAPI.png)



### 二、 Table API 能力概述

Table API 对外提供类SQL的API算子，提供过滤、映射、join、window等能力。各功能算子详情如下：

| Operators          | Description                              |
| :----------------- | ---------------------------------------- |
| **Select**         | Similar to a SQL SELECT statement. Performs a select operation. val in = ds.toTable(tableEnv, 'a, 'b, 'c); val result = in.select('a, 'c as 'd); |
| **As**             | Renames fields.val in = ds.toTable(tableEnv).as('a, 'b, 'c); |
| **Where / Filter** | Similar to a SQL WHERE clause. Filters out rows that do not pass the filter predicate.val in = ds.toTable(tableEnv, 'a, 'b, 'c);val result = in.filter('a % 2 === 0)or val in = ds.toTable(tableEnv, 'a, 'b, 'c);val result = in.where('b === "red"); |
| **GroupBy**        | Similar to a SQL GROUPBY clause. Groups rows on the grouping keys, with a following aggregation operator to aggregate rows group-wise. val in = ds.toTable(tableEnv, 'a, 'b, 'c);val result = in.groupBy('a).select('a, 'b.sum as 'd); |
| **Join**           | Similar to a SQL JOIN clause. Joins two tables. Both tables must have distinct field names and an equality join predicate must be defined using a where or filter operator.val left = ds1.toTable(tableEnv, 'a, 'b, 'c);val right = ds2.toTable(tableEnv, 'd, 'e, 'f);val result = left.join(right).where('a === 'd).select('a, 'b, 'e); |
| **LeftOuterJoin**  | Similar to a SQL LEFT OUTER JOIN clause. Joins two tables. Both tables must have distinct field names and at least one equality join predicate must be defined.val left = tableEnv.fromDataSet(ds1, 'a, 'b, 'c)val right = tableEnv.fromDataSet(ds2, 'd, 'e, 'f)val result = left.leftOuterJoin(right, 'a === 'd).select('a, 'b, 'e) |
| **RightOuterJoin** | Similar to a SQL RIGHT OUTER JOIN clause. Joins two tables. Both tables must have distinct field names and at least one equality join predicate must be defined. val left = tableEnv.fromDataSet(ds1, 'a, 'b, 'c)val right = tableEnv.fromDataSet(ds2, 'd, 'e, 'f)val result = left.rightOuterJoin(right, 'a === 'd).select('a, 'b, 'e) |
| **FullOuterJoin**  | Similar to a SQL FULL OUTER JOIN clause. Joins two tables. Both tables must have distinct field names and at least one equality join predicate must be defined. val left = tableEnv.fromDataSet(ds1, 'a, 'b, 'c)val right = tableEnv.fromDataSet(ds2, 'd, 'e, 'f)val result = left.fullOuterJoin(right, 'a === 'd).select('a, 'b, 'e) |
| **Union**          | Similar to a SQL UNION clause. Unions two tables with duplicate records removed, both tables must have identical field types.val left = ds1.toTable(tableEnv, 'a, 'b, 'c);val right = ds2.toTable(tableEnv, 'a, 'b, 'c);val result = left.union(right); |
| **UnionAll**       | Similar to a SQL UNION ALL clause. Unions two tables, both tables must have identical field types.val left = ds1.toTable(tableEnv, 'a, 'b, 'c);val right = ds2.toTable(tableEnv, 'a, 'b, 'c);val result = left.unionAll(right); |
| **Intersect**      | Similar to a SQL INTERSECT clause. Intersect returns records that exist in both tables. If a record is present in one or both tables more than once, it is returned just once, i.e., the resulting table has no duplicate records. Both tables must have identical field types.val left = ds1.toTable(tableEnv, 'a, 'b, 'c);val right = ds2.toTable(tableEnv, 'e, 'f, 'g);val result = left.intersect(right); |
| **IntersectAll**   | Similar to a SQL INTERSECT ALL clause. IntersectAll returns records that exist in both tables. If a record is present in both tables more than once, it is returned as many times as it is present in both tables, i.e., the resulting table might have duplicate records. Both tables must have identical field types.val left = ds1.toTable(tableEnv, 'a, 'b, 'c);val right = ds2.toTable(tableEnv, 'e, 'f, 'g);val result = left.intersectAll(right); |
| **Minus**          | Similar to a SQL EXCEPT clause. Minus returns records from the left table that do not exist in the right table. Duplicate records in the left table are returned exactly once, i.e., duplicates are removed. Both tables must have identical field types.val left = ds1.toTable(tableEnv, 'a, 'b, 'c);val right = ds2.toTable(tableEnv, 'a, 'b, 'c);val result = left.minus(right); |
| **MinusAll**       | Similar to a SQL EXCEPT ALL clause. MinusAll returns the records that do not exist in the right table. A record that is present n times in the left table and m times in the right table is returned (n - m) times, i.e., as many duplicates as are present in the right table are removed. Both tables must have identical field types.val left = ds1.toTable(tableEnv, 'a, 'b, 'c);val right = ds2.toTable(tableEnv, 'a, 'b, 'c);val result = left.minusAll(right); |
| **Distinct**       | Similar to a SQL DISTINCT clause. Returns records with distinct value combinations.val in = ds.toTable(tableEnv, 'a, 'b, 'c);val result = in.distinct(); |
| **Order By**       | Similar to a SQL ORDER BY clause. Returns records globally sorted across all parallel partitions.val in = ds.toTable(tableEnv, 'a, 'b, 'c);val result = in.orderBy('a.asc); |
| **Limit**          | Similar to a SQL LIMIT clause. Limits a sorted result to a specified number of records from an offset position. Limit is technically part of the Order By operator and thus must be preceded by it. val in = ds.toTable(tableEnv, 'a, 'b, 'c);val result = in.orderBy('a.asc).limit(3); // returns unlimited number of records beginning with the 4th record or val in = ds.toTable(tableEnv, 'a, 'b, 'c);val result = in.orderBy('a.asc).limit(3, 5); // returns 5 records beginning with the 4th record |
| **Window**         | Groups the records of a table by assigning them to windows defined by a time or row interval |

### 三、Table API 执行原理介绍

 ![Table API context](pictures/Table API context.png)

如上图所示，Table API的执行原理如下：

1、用户使用Table API对外提供类SQL的语法开发应用；

2、Table API对类SQL的语法进行合法性检验，并在每个算子中，转换成calcite的逻辑树节点；最终形成calcite的逻辑计划；

3、采用calcite对逻辑树进行优化，生成最优的Flink物理计划；

4、对物理计划采用janino codegen生成代码，生成用DataStream  描述的流应用，提交到Flink平台执行；

### 四、Table API执行流程介绍

 ![Table API Flow](pictures/Table API Flow.png)

1、获取table stream执行环境：

```
val env = StreamExecutionEnvironment.getExecutionEnvironment
val tEnv = TableEnvironment.getTableEnvironment(env)
```

在table环境中，包含一个calcite存放表元数据定义、UDF函数定义的根节点，在同一个table环境中只有一个根节点。

2、获取输入源，将输入tuple转成table类。

```
val orderA = env.fromCollection(Seq(
  Order(1L, "beer", 3),
  Order(1L, "diaper", 4),
  Order(3L, "rubber", 2))).toTable(tEnv)
  其中order类的定义如下：
  case class Order(user: Long, product: String, amount: Int)
```

在toTable函数中，会将table元数据的定义注册到calcite中.并生成table类对象。

3、用户使用table类提供的公共语法描写流业务应用。

```
val result: DataStream[Order] = orderA.select('user, 'product, 'amount)
  .where('amount > 2)
  .toDataStream[Order]
```

table类提供fliter、as、select、where、distinct、join等公共语法。

4、每个公共方法，都对应一个算子，在该算子中，对语法做检验，并将该语法转成calcite的逻辑计划树节点。最终形成calcite的逻辑计划树。

```
val result: DataStream[Order] = orderB.select('user, 'product, 'amount)
  .where('amount > 3)
  .toDataStream[Order]
```

形成的最终calcite的逻辑计划树为：

LogicalFilter(condition=[>($2, 3)])
  LogicalTableScan(table=[[_DataStreamTable_1]])

5、优化逻辑计划，生成最优的物理计划：
1）使用calcite的启发式优化模型和如下优化规则集对逻辑计划进行优化：

```
      // convert a logical table scan to a relational expression
      TableScanRule.INSTANCE,
      EnumerableToLogicalTableScan.INSTANCE,

      // calc rules
      FilterToCalcRule.INSTANCE,
      ProjectToCalcRule.INSTANCE,
      FilterCalcMergeRule.INSTANCE,
      ProjectCalcMergeRule.INSTANCE,
      CalcMergeRule.INSTANCE,

      // prune empty results rules
      PruneEmptyRules.FILTER_INSTANCE,
      PruneEmptyRules.PROJECT_INSTANCE,
      PruneEmptyRules.UNION_INSTANCE,

      // push and merge projection rules
      ProjectFilterTransposeRule.INSTANCE,
      FilterProjectTransposeRule.INSTANCE,
      ProjectRemoveRule.INSTANCE,

      // simplify expressions rules
      ReduceExpressionsRule.FILTER_INSTANCE,
      ReduceExpressionsRule.PROJECT_INSTANCE,
      ReduceExpressionsRule.CALC_INSTANCE,

      // merge and push unions rules
      UnionEliminatorRule.INSTANCE,

      // translate to DataStream nodes
      DataStreamAggregateRule.INSTANCE,
      DataStreamCalcRule.INSTANCE,
      DataStreamScanRule.INSTANCE,
      DataStreamUnionRule.INSTANCE,
      DataStreamValuesRule.INSTANCE,
      DataStreamCorrelateRule.INSTANCE,
      StreamTableSourceScanRule.INSTANCE
```

2）优化后，最后采用DataStreamAggregateRule、DataStreamCalcRule、DataStreamScanRule、DataStreamUnionRule、DataStreamValuesRule、DataStreamCorrelateRule、StreamTableSourceScanRule这7个规则将calcite的节点转成flink的节点。和规则一一对应，flink包含DataStreamAggregate、DataStreamCalc、DataStreamScan、DataStreamUnion、DataStreamValues、DataStreamCorrelate、StreamTableSourceScan这7个节点。最后生成的物理计划如下图所示：

```
DataStreamCalc(select=[user, product, amount], where=[>(amount, 3)])
  DataStreamScan(table=[[_DataStreamTable_1]])
```

5、Codegen：根据最后的物理计划，即根据物理计划树，将节点业务逻辑生成java代码。
1）flink的DataStreamAggregate、DataStreamCalc、DataStreamScan、DataStreamUnion、DataStreamValues、DataStreamCorrelate、StreamTableSourceScan，这7个节点含有自己的代码生成函数（translateToPlan）。
a）DataStreamCalc：主要包含过滤、表示式计算、join等的codegen；
b) DataStreamScan:主要包含输入数据转换的codegen；

6、最后将java代码转成dataStream的公共算子，调度到flink进行执行；

### 五、Table API 关键类介绍

Table API最主要的是如下几个类：

1)StreamTableEnvironment类，该类继承TableEnvironment类，主要存放如下信息：

a)存储calcite 流定义的成员table；

b)存储calcite自定义函数的成员functionCatalog

c)calcite的优化规则；

 ![table enviroment](pictures/table enviroment.png)

2)Table 类：主要存放如下信息：

a）每个table对应的公共语法函数,每个语法函数中都会对语法做检验，并生成calcite的逻辑节点；

b) calcite的逻辑树；

 ![table](pictures/table.png)
