# 流图生成   
> 刘新春    
> 2016年12月21日    

在flink中主要由三种流图，分别是`StreamGraph`、`JobGraph`和`ExecutionGraph`.Flink首先根据`StreamExecutionEnvironment`中的环境`List<StreamTransformation<?>>`信息生成`StreamGraph`,由`StreamGraph`生成`JobGraph`，在Flink Client会将`JobGraph`提交到JobManager,由JobManager根据`JobGraph`生成`ExecutionGraph`。本文主要涉及前两个`Graph`。

## 收集算子信息    

收集算子主要是通过执行用户main函数中的代码实现的。如下面所示代码：    
```java
env.addSource(new JEventGeneratorSource())
   .keyBy(0)
   .window(SlidingProcessTimeWindow.of(Time.seconds(20), Time.seconds(5)))
   .apply(new JWindowStatistic())
   .map(new JPersonMap())
```
在上述代码中，每调用一个算子会生成一个Operator及`StreamTransformation`并将其插入到`env`下的`List<StreamTransformation<?>> transformations`中，为构建`StreamGraph`提供信息。`StreamTransformation`中一般提供以下信息：
* NodeId ：该ID为整个流应用中唯一的一个ID，通过自增的方式产生    
* 算子名称    
* 算子输出数据类型   
* 算子并发度   
* 共享slot Group（`String slotSharingGroup`）
* 等等       
每个具体的算子会带有与自身算子相关成员变量，如该算子的函数`Function`等。目前，Flink Stream提供的transformation有以下几种：       
![StreamTransformation](./pictures/StreamTransformation.png)      
`DataStream`的每个算子都对应其中的一个`StreamTransformation`，例如：`Source`算子对应其中的`SourceTransformation`。 `Source`算子并不在`transformations`中。

举几个典型的例子（1）map；（2）window；（3）keyBy。

### map算子    

首先获取与Map算子的输出流的`TypeInformation`，然后根据`TypeInformation`生成`OneInputTransformation`,根据此`Transformation`生成`SingleOutputStreamOperator`,最后将`OneInputTransformation`添加到`transformations`中。如图所示为自定义类`JPersionMap`的继承关系：       
![JPersonMap](./pictures/JPersonMap.png)      

#### 获取输出数据类型(`TypeInformation`)    

与前文addSource类似，获取数据类型主要是通过`TypeExtractor`实现的，Map函数的输出类型获取主要通过`getMapReturnTypes()`实现的，在其内部同样需要调用`TypeExtractor`的`privateCreateTypeInfo()`方法实现。

* 首先检查其父类接口`interface`，本例中父类接口只有`MapFunction<T, O>`,父类超类`super`。    
* 本例中只有父类接口，输出类型位于父类接口第二个参数，获取该参数的实际数据类型。      
* 根据第二个参数的具体类型，生成实际的`TypeInformation`。

#### 生成`StreamTransformation`      

该功能主要通过`DataStream`中的`transform`方法实现。生成一个`OneInputTransformation`的`StreamTransformation`并将其插入到`transformations`中。最后返回一个与`OneInputTransformation`绑定的数据流.    

### window算子    

如图所示，window自定义窗口类的继承关系：    
![JWindow](./pictures/JWindow.png)

### 获取输出数据类型(`TypeInformation`)    
首先通过`TypeExtractor`获取对应的数据类型，在本例中输出类型位于泛型`WindowFunction<IN, OUT, KEY, W extends Window>`的第二个位置，具体类型为`<Tuple2<Long, JEvent>, Long, Tuple, TimeWindow>`，即：这里为`Long`，生成具体的`TypeInformation`

### 生成`StreamTransformation`   
同样也是通过`DataStream`中的`transform()`方法实现的，会生成一个`OneInputTransformation`,并将其插入到`transforamtions`中，最后返回一个与`OneInputTransformation`绑定的数据流

### keyBy算子     

`keyBy`算子是个虚算子，并不会生成真的`StreamTranstormation`

最终会生成如图所示的数据结构:    
![transformations](./pictures/transformations.png)    
其中，`SourceTransformation`（source）和`PartitionTransformation`（keyBy）是虚节点，而`OneInputTransformation`(window和map)是实节点。实节点会保存在`StreamExecutionEnvironment`的`transformations`变量中。Flink Client根据`transformations`生成`StreamGraph`。

## 生成`StreamGraph`     

`StreamGraph`包含以下重要信息, 用来构建`StreamGraph`：    
```java
private final StreamExecutionEnvironment environment;
private final ExecutionConfig executionConfig;
private final CheckpointConfig CheckpointConfig;

private boolean chaining;
private Map<Integer, StreamNode> streamNode;
private Set<Integer> sources;
private Set<Integer> sinks;
private Map<Integer, Tuple2<Integer, List<String>>> virtualSelectNode;
private Map<Integer, Tuple2<Integer, StreamPartitioner<?>>> virtualPartitionNodes;
```

如图所示为由`transformations`转化成`StreamGraph`的流程图：    
![transform](./pictures/transform.png)   

`transform`是一个迭代的过程，不断获取`transformation`自身的输入，然后将其转化成`StreamNode`放到`StreamGraph`中。每个`StreamNode`包含以下内容：    
```java
transient private StreamExecutionEnvironment env;
private final int id;
private Integer parallelism = null;
private Long bufferTimeout = null;
private String operatorName;
private String slotSharingGroup;
private KeySelector<?,?> statePartitioner1;
private KeySelector<?,?> statePartitioner2;
private TypeSerializer<?> stateKeySerializer;

...
private transient StreamOperator<?> operator;
...
private List<StreamEdge> inEdges = new ArrayList<StreamEdge>();
private List<StreamEdge> outEdges = new ArrayList<StreamEdge>();

private final Class<? extends AbstractInvokable> jobVertexClass;
```

该迭代直到找到`source`或已经输入`transformation`已经转换为止。
