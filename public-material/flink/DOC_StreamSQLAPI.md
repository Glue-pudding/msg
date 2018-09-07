# Flink SQL
Flink允许用户使用SQL对表或流进行查询，利用calcite进行SQL的解析优化，在标准SQL基础上扩展了对流的查询，包括window等。

### 依赖关系
SQL是flink-table工程的一部分，因此要使用SQL，需将flink-table加入工程依赖中。
```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-table_2.10</artifactId>
  <version>1.2-SNAPSHOT</version>
</dependency>
```

### SQL on Batch tables
##### 示例
```scala
val env = ExecutionEnvironment.getExecutionEnvironment
val tableEnv = TableEnvironment.getTableEnvironment(env)

// read a DataSet from an external source
val ds: DataSet[(Long, String, Integer)] = env.readCsvFile(...)
// register the DataSet under the name "Orders"
tableEnv.registerDataSet("Orders", ds, 'user, 'product, 'amount)
// run a SQL query on the Table and retrieve the result as a new Table
val result = tableEnv.sql(
  "SELECT SUM(amount) FROM Orders WHERE product LIKE '%Rubber%'")
```

##### 约束
当前版本支持select、project、inner equi-joins、grouping、non-distinct aggregates和sort。

* Join
 <br> 批上的join现在只支持等值join，不支持非等值和笛卡尔积
 ```scala
 tEnv.registerDataSet("OrderA", orderA, 'a, 'b, 'c)
  tEnv.registerDataSet("OrderB", orderB, 'e, 'd, 'f)

  // union the two tables
  val result = tEnv.sql(
    "select a1.a, b1.d from OrderA as a1 join OrderB as b1 on a1.a = b1.e").toDataSet[(Long, String)].print()
```

* 聚合
 <br> 不支持distinct，其他支持函数见语法支持范围-函数及表达式-聚合函数。
 ```scala
 val result = tEnv.sql(
      "select a, sum(c) from OrderA group by a, b order by a limit 2").toDataSet[(Long, Integer)].print()
 ```

### SQL on Streaming tables
##### 示例
在使用sql查询之前，必须先将表注册进tableEnv中。
```scala
import org.apache.flink.api.scala._
import org.apache.flink.table.api.scala._

val env = StreamExecutionEnvironment.getExecutionEnvironment
val tableEnv = TableEnvironment.getTableEnvironment(env)

// read a DataStream from an external source
val ds: DataStream[(Long, String, Integer)] = env.addSource(...)
// register the DataStream under the name "Orders"
tableEnv.registerDataStream("Orders", ds, 'user, 'product, 'amount)
// run a SQL query on the Table and retrieve the result as a new Table
val result = tableEnv.sql(
  "SELECT product, amount FROM Orders WHERE product LIKE '%Rubber%'")
```
##### 约束
当前streaming SQL只支持SELECT, FROM, WHERE和UNION，聚合及join都尚未支持。

### 语法支持范围
##### 数据类型
* 基础类型： VARCHAR, BOOLEAN, TINYINT, SMALLINT, INTEGER/INT, BIGINT, REAL/FLOAT, DOUBLE, DECIMAL, DATE, TIME, TIMESTAMP, INTERVAL YEAR TO MONTH, INTERVAL DATE TO SECOND
* 复合类型：
 * POJO类：使用.进行字段引用，例如： MyTable.pojoColumn.myField/ MyTable.pojoColumn.*
 * Array：使用[]进行引用，例如myArray[1], Array常量可以这样构造：ARRAY[1,2,3]
```scala
tEnv.sql("select ARRAY[1,2,3] FROM OrderA").toDataStream[Array[Int]]
```

#### 函数及表达式
* **比较操作**
<br> =, <>, >, >=, <, <=
<br> value is null / value is not null
<br> value is [not] distinct from value2 *两值是否不相等*
<br> value1 [not] between value2 and value3
<br> string1 [not] like string2
<br> string1 [not] similar to string2
<br> value [not] in (value [, value]\*)
<br> exists (sub-query) *streamsql暂不支持*

* **逻辑操作**
<br> boolean1 OR/AND boolean2
<br> NOT boolean
<br> boolean is [not] false/true/unknown

* **算数操作**
<br> +/- value
<br> value1 +-*/ value2 /**/
<br> POWER(num1, num2)
<br> ABS(num)
<br> MOD(num1, num2)
<br> SQRT(num)
<br> LOG10(num)
<br> EXP(num)
<br> CEIL(num)
<br> FLOOR(num)

* **字符串操作**
<br> string || string 字符串拼接
<br> CHAR_LENGTH(string) 计算长度
<br> CHARACTER_LENGTH(string) 计算长度
<br> UPPER(string) 转为大写
<br> LOWER(string) 转为小写
<br> POSITION(string1 IN string2) 返回字符串1在字符串2第一次出现的位置
<br> TRIM( { BOTH | LEADING | TRAILING } string1 FROM string2) 返回字符串2去除头或尾出现的字符串1后的结果
<br> OVERLAY(string1 PLACING string2 FROM integer [ FOR integer2 ])
字符串替换
<br> SUBSTRING(string FROM integer) 获取子字符串
<br> SUBSTRING(string FROM integer FOR integer) 从特定位置获取子字符串
<br> INITCAP(string) 将每个单词的首字母转为大写，其余字母转为小写

* **CASE表达式**
<br> CASE value
WHEN value1 [, value11 ]* THEN result1
[ WHEN valueN [, valueN1 ]* THEN resultN ]*
[ ELSE resultZ ]
END
```SQL
example: case attr1 when 1 then 10 when 2 then 20 else 30 end
```
CASE
WHEN condition1 THEN result1
[ WHEN conditionN THEN resultN ]*
[ ELSE resultZ ]
END
```SQL
example: case when attr > 30 then 10 when attr > 20 then 20 else 10 end
```
NULLIF(value1, value2) 若value1==value2则返回null，否则返回value1
<br>COALESCE(value, value [, value ]* ) 返回第一个不为空的value

* **类型转换**
<br>CAST(value AS type)
```SQL
example: cast(amount as VARCHAR(10))
```

* **时间函数**
<br>**DATE string**
*将日期字符串转换为date类型，格式"yy-mm-dd"*
<br>**TIME string**
*将时间字符串转换为Time类型，格式"hh:mm:ss"*
<br>**TIMESTAMP string**
*将时间字符串转换为Timestamp类型，格式"yy-mm-dd hh:mm:ss.fff"*
```scala
example:
tEnv.sql("select Date '2015-10-11'  FROM  OrderA").toDataStream[Date]
tEnv.sql("select Time '12:14:50'  FROM  OrderA").toDataStream[Time]
tEnv.sql("select Timestamp '2015-10-11 12:14:50'  FROM  OrderA").toDataStream[Timestamp]
```
<br>**INTERVAL string range**
*区间范围。E.g. INTERVAL '10 00:00:00.004' DAY TO SECOND, INTERVAL '10' DAY, or INTERVAL '2-10' YEAR TO MONTH return intervals*
<br>**CURRENT_DATE**
*返回当前UTC日期*
<br>**CURRENT_TIME**
*返回当前UTC时间.*
<br>**CURRENT_TIMESTAMP**
*返回当前UTC时间戳.*
<br>**LOCALTIME**
*返回本地时间.*
<br>**LOCALTIMESTAMP**
*返回本地时间戳.*
<br>**EXTRACT(timeintervalunit FROM temporal)**
*提取部分数据. E.g. EXTRACT(DAY FROM DATE '2006-06-05')即提取天数，返回5.*
<br>**FLOOR(timepoint TO timeintervalunit)**
*向下对齐时间. E.g. FLOOR(TIME '12:44:31' TO MINUTE)按分钟对齐到12:44:00.*
<br>**CEIL(timepoint TO timeintervalunit)**
*向上对齐时间. E.g. CEIL(TIME '12:44:31' TO MINUTE)按分钟对齐到12:45:00.*

* **聚合函数**
<br>**COUNT(value [, value]\*)**
*返回value不为空的个数.*
<br>**COUNT(\*)**
*返回元组个数*
<br>**AVG(numeric)**
*平均值*
<br>**SUM(numeric)**
*求和*
<br>**MAX(value)**
*最大值*
<br>**MIN(value)**
*最小值*

* **数组函数**
<br>**CARDINALITY(ARRAY)**
*返回数组元素个数*
<br>**ELEMENT(ARRAY)**
*返回只包含一个元素的数组的元素*

#### 自定义函数
Flink支持用户自定义scalar函数和table函数，scalar函数和table函数的区别在于scalar函数只能返回一个值，而table函数可以返回多列多行。
* Scalar函数
<br> 实现scalar函数需继承org.apache.flink.table.functions.ScalarFunction并实现eval和getResultType方法。
 * eval 计算逻辑
 * getResultType 一般情况下flink会自动推导出结果类型，所以无需重写，若对于比较复杂的类型用户需重新以保证准确性。

```scala
object TimestampModifier extends ScalarFunction {
  def eval(t: Long): Long = {
    t % 1000
  }

  override def getResultType(signature: Array[Class[_]]): TypeInformation[_] = {
    Types.TIMESTAMP
  }
}

val tableEnv = TableEnvironment.getTableEnvironment(env)

// use the function in Scala Table API
myTable.select('value, TimestampModifier('value))

// register and use the function in SQL
tableEnv.registerFunction("TimestampModifier", TimestampModifier)
tableEnv.sql("SELECT string, TimestampModifier(value) FROM MyTable");
```
* Table函数
<br>Table函数与scalar函数类似，不同在于它需要指定输出的元组泛型。实现Table函数需继承org.apache.flink.table.functions.TableFunction。注意，若用scala，则不能将TableFunction实现为Object，object是单例对象，会引起并发问题。

```scala
// The generic type "(String, Int)" determines the schema of the returned table as (String, Integer).
class Split extends TableFunction[(String, Int)] {
  def eval(str: String): Unit = {
    // use collect(...) to emit a row.
    str.split(" ").foreach(x -> collect((x, x.length))
  }
}

val tableEnv = TableEnvironment.getTableEnvironment(env)
val myTable = ...         // table schema: [a: String]

// Use the table function in the Scala Table API (Note: No registration required in Scala Table API).
val split = new Split()
// "as" specifies the field names of the generated table.
myTable.join(split('a) as ('word, 'length)).select('a, 'word, 'length);
myTable.leftOuterJoin(split('a) as ('word, 'length)).select('a, 'word, 'length);

// Register the table function to use it in SQL queries.
tableEnv.registerFunction("split", new Split())

// Use the table function in SQL with LATERAL and TABLE keywords.
// CROSS JOIN a table function (equivalent to "join" in Table API)
tableEnv.sql("SELECT a, word, length FROM MyTable, LATERAL TABLE(split(a)) as T(word, length)");
// LEFT JOIN a table function (equivalent to "leftOuterJoin" in Table API)
tableEnv.sql("SELECT a, word, length FROM MyTable LEFT JOIN TABLE(split(a)) as T(word, length) ON TRUE");
```
