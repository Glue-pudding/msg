#    Flink SQL图解
>*时金魁 2016/09/12*

##    了解Calcite

[calcite](http://calcite.apache.org)是apache的一个高性能SQL开源框架，它支持标准SQL解析、验证和JDBC驱动，支持查询优化，扩展了SQL以支持流式查询(streaming query)。支持window、filter

```
SELECT STREAM rowtime,
  productId,
  units,
  SUM(units) OVER (ORDER BY rowtime RANGE INTERVAL '1' HOUR PRECEDING) unitsLastHour
FROM Orders;
```

更多详见[apache calcite](http://calcite.apache.org)

##    示例代码

下面的示例代码来自flink官方example: `StreamSQLExample`

```
object StreamSQLExample {
  def main(args: Array[String]): Unit = {
    // set up execution environment
    val env = StreamExecutionEnvironment.getExecutionEnvironment
    val tEnv: StreamTableEnvironment = TableEnvironment.getTableEnvironment(env)
    val orderA: DataStream[Order] = env.fromCollection(Seq(Order(1L, "beer", 3), Order(1L, "diaper", 4), Order(3L, "rubber", 2)))
    val orderB: DataStream[Order] = env.fromCollection(Seq(Order(2L, "pen", 3), Order(2L, "rubber", 3), Order(4L, "beer", 1)))
    // register the DataStreams under the name "OrderA" and "OrderB"
    tEnv.registerDataStream("OrderA", orderA, 'user, 'product, 'amount)
    tEnv.registerDataStream("OrderB", orderB, 'user, 'product, 'amount)
    // union the two tables
    val result = tEnv.sql(
      """
        |SELECT STREAM * FROM OrderA WHERE amount > 2
        |UNION ALL
        |SELECT STREAM * FROM OrderB WHERE amount < 2
      """.stripMargin
    )
    result.toDataStream[Order].print()
    env.execute()
  }
  case class Order(user: Long, product: String, amount: Int)
}
```

其中调用`sql()`函数来解析SQL生成`Table`对象。
`result.toDataStream[Order].print()`这句代码通过隐式转换，调用`toDataStream[Order]`函数，这个就是Flink支持Streaming SQL的入口。

##    Flink如何支持Streaming SQL
从入口函数`toDataStream[Order]`进去，可以看到Flink通过calcite的SQL最优化生成一个关系表达式对象`RelNode`，再进一步把calcite的这个表达式**翻译**成Flink可以执行的**函数对象**。

实际的过程是：

`Source` => `DataStream[Any]` => SQL Query -> `RelNode` -> `translateToPlan()` -> `codegen()` -> `function`对象 => `DataStream[Any]`包含`function`对象

其中有三个过程：

1.    即流数据源生成一个数据流对象（代表尚未执行的实际的数据流）
2.    根据输入的SQL，做一系列的处理：查询优化、翻译calcite的SQL处理过程为Java源代码、源代码编译成字节码、生成Flink transform中的转换函数对象
3.    把转换对象分装到`DataStream`中

简言之，就是把Calcite用SQL表达的事情，翻译成Flink框架支持的函数（前面这些都是定义*lazy*的*尚未执行的过程*），然后运行Flink作业。

##    三个阶段
我们可以人为的把Flink对Calcite的支持，分为三个阶段：

1.    SQL解析、验证、生成关系树
2.    SQL优化
3.    Flink翻译Flink逻辑计划为转换函数

###    第一阶段：SQL解析、验证、生成关系树

![](pictures/flink_sql_parser.jpg)

首先生成默认的Calcite配置对象，然后把文本的SQL语句用Calcite解析成`SQLNode`，再做SQL验证，最后转化成一个关系树对象`RelRoot`，即根对象。最后把关系树对象封装为Flink的`Table`表对象。

`DataSet`和`DataStream`都是基于`Table`。

这个阶段主要是使用calcite提供的SQL能力。

###    第二阶段：SQL优化

![](pictures/flink_sql_op.jpg)

上图仅画出关键部分。

上图列出了20个优化规则，解析输入的SQL语句生成SQL最优关系树，逐个执行这些优化规则，生成一个最优的flink逻辑计划，这个逻辑计划最后生成一个Flink可执行的转换函数。

*这里有诸多隐式转换和match*

###    第三阶段：Flink翻译Flink逻辑计划为转换函数
这里是重头戏，也是Flink正在支持calcite特性的主要地方。

可分为两个部分：

1.    翻译逻辑计划为Flink可执行算子，codegen
2.    字节码生成和新建算子对象

####    3.1    翻译逻辑计划为Flink可执行算子

![](pictures/flink_sql_tranform.jpg)

Flink目前支持5个转换对象：`DataStreamCalc`、`DataStreamScan`、`DataStreamUnion`、`DataStreamValues`、`StreamTableSourceScan`，这些对象的核心函数是:`translateToPlan()`，顾名思义是翻译逻辑计划为Flink可执行算子。

上面五位主要是把逻辑计划翻译成Flink可执行算子，即：把SQL过程翻译成flink的转换函数。转换函数主要有：`MapRunner`、`FlatMapRunner`、`FlatJoinRunner`。这些对象核心函数为: `open()`，即编译源代码，生成字节码，新建flink转换算子对象。

上述`5+3`位兄弟是核心。

SQL语句被解析为不同的可执行部分，如：

```
SELECT STREAM * FROM OrderA WHERE amount > 2
UNION ALL
SELECT STREAM * FROM OrderB WHERE amount < 2
```

这个过程会被calcite解析为：

```
todu
```

这些操作SQL操作函数，如果不复杂，Flink可以不需要codegen直接生成结果`DataStream[Any]`对象，如:`DataStreamValues`。有些这需要生成源代码，编译为字节码，`new`一个算子对象实例，这个算子对象封装在`DataStream`中。

>    这里是Flink支持Calcite的主要地方

####    3.2    字节码生成
![](pictures/flink_sql_codegen.jpg)

文本类的源代码（见附录）需要被Java编译器编译后才能被jvm执行。这里编译器采用的是又快又小巧的[janino](http://janino-compiler.github.io/janino/)

| Flink算子          | 运行时函数              | 继承自                  |
| ---------------- | ------------------ | -------------------- |
| `MapRunner`      | `map(in: IN): OUT` | MapFunction          |
| `FlatMapRunner`  | `flatMap(...)`     | FlatMapFunction      |
| `FlatJoinRunner` | `join(...)`        | RichFlatJoinFunction |

这些运行时函数才是最关键的，会在运行时被调用，实际上调用生成自定义函数。

##    附录A: Flink SQL大图

![](pictures/flink_sql_full.jpg)

##    附录B: DataStreamScan codegen生成的源代码
----------

```
public class DataSetSourceConversion$9 implements org.apache.flink.api.common.functions.MapFunction {

  transient org.apache.flink.api.table.Row out = new org.apache.flink.api.table.Row(3);

  public DataSetSourceConversion$9() throws Exception {
  }

  @Override
  public Object map(Object _in1) throws Exception {
    table.StreamSQLExample.Order in1 = (table.StreamSQLExample.Order) _in1;

    java.lang.Integer tmp$6 = (java.lang.Integer) in1.amount();
    boolean isNull$8 = tmp$6 == null;
    int result$7;
    if (isNull$8) {
      result$7 = -1;
    } else {
      result$7 = tmp$6;
    }

    java.lang.Long tmp$0 = (java.lang.Long) in1.user();
    boolean isNull$2 = tmp$0 == null;
    long result$1;
    if (isNull$2) {
      result$1 = -1;
    } else {
      result$1 = tmp$0;
    }

    java.lang.String result$4 = (java.lang.String) in1.product();
    boolean isNull$5 = (java.lang.String) in1.product() == null;

    if (isNull$2) {
      out.setField(0, null);
    } else {
      out.setField(0, result$1);
    }

    if (isNull$5) {
      out.setField(1, null);
    } else {
      out.setField(1, result$4);
    }

    if (isNull$8) {
      out.setField(2, null);
    } else {
      out.setField(2, result$7);
    }

    return out;
  }
}
```

###    附录C：DataStreamCalc codegen生成的源代码
---------

```
public class DataStreamCalcRule$23 implements org.apache.flink.api.common.functions.FlatMapFunction {
    transient org.apache.flink.api.table.Row out = new org.apache.flink.api.table.Row(3);
    
    public DataStreamCalcRule$23() throws Exception {}

    @Override
    public void flatMap(Object _in1, org.apache.flink.util.Collector c) throws Exception {
      org.apache.flink.api.table.Row in1 = (org.apache.flink.api.table.Row) _in1;
      
      java.lang.Integer tmp$16 = (java.lang.Integer) in1.productElement(2);
      boolean isNull$18 = tmp$16 == null;
      int result$17;
      if (isNull$18) {
        result$17 = -1;
      }
      else {
        result$17 = tmp$16;
      }
      
      java.lang.Long tmp$10 = (java.lang.Long) in1.productElement(0);
      boolean isNull$12 = tmp$10 == null;
      long result$11;
      if (isNull$12) {
        result$11 = -1;
      }
      else {
        result$11 = tmp$10;
      }
      
      java.lang.String result$14 = (java.lang.String) in1.productElement(1);
      boolean isNull$15 = (java.lang.String) in1.productElement(1) == null;
      
      int result$19 = 2;
      boolean isNull$20 = false;
      
      boolean isNull$22 = isNull$18 || isNull$20;
      boolean result$21;
      if (isNull$22) {
        result$21 = false;
      }
      else {
        result$21 = result$17 > result$19;
      }
      
      if (result$21) {
        
      
      if (isNull$12) {
        out.setField(0, null);
      }
      else {
        out.setField(0, result$11);
      }
      
      
      if (isNull$15) {
        out.setField(1, null);
      }
      else {
        out.setField(1, result$14);
      }
      
      
      if (isNull$18) {
        out.setField(2, null);
      }
      else {
        out.setField(2, result$17);
      }
      
        c.collect(out);
      }
      
    }
}
```


------EOF------
