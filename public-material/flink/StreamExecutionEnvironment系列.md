# StreamExecutionEnvironment
> 刘新春    
> 2016年12月19日    

`StreamExecutionEnvironment`是整个Flink Client的核心之一，主要功能为：    
* 设置必要的作业配置参数    
* 设置`checkpoint`相关配置参数
* 添加各种算子    
* 生成`JobGraph`、`StreamGraph`等    
* 与`JobManager`交互，向集群提交作业

接下来的章节主要介绍上面这几类功能。另外，`StreamExecutionEnvironment`目前可以分为两类，即：    
* `LocalStreamEnvironment`     
  * 当本地运行时会生成`LocalStreamEnvironment`，该方式适用于进行Debug
* `RemoteStreamEnvironment`    
  * 当在生产环境上集群运行时，会生成`RemoteStreamEnvironment`，内部包含`JobManager`的IP和port等。

如图所示，为`StreamExecutionEnvironment`的主要成员变量：    
![StreamExecutionEnvironment](./pictures/StreamExecutionEnvironment.png)

其中:
* `ExecutionConfig`中保存必要的作业配置参数
* `CheckpointConfig`中中保存`checkpoint`的配置参数    
* `addSource()`方法是添加算子的入口，会生成一条流    
  * 另外，Flink还提供一系列Source算子，在此不一一描述。    
* `execute()`方法完成流图生与`JobManager`交互等。每个功能的具体描述详见下面列表       

| 序号 |   功能  | 时间 |        
| --- | -------- | --- |     
| 1 | [配置参数](./Configuration.md) | 2016/12/19 |             
| 2 | [添加算子](./addSource.md) | 2016/12/19 |     
| 3 | [生成流图](./GeneratorGraph.md) | 2016/12/19 |    
| 4 | 提交作业 | 2016/12/19 |

另外，`StreamExecutionEnvironment`中还包括一些默认信息，如：   
* AbstractStateBackend，默认情况下，使用`MemoryStateStateBackend`，用户也可以设置`FsStateBackend`和`RocksDBStateBackend`    
* defaultLocalParallelism，该变量与可用CPU的核数有关，例如，使用节点有4个核，那么会设置为4    
* timeCharacteristic，默认情况下使用ProcessingTime    
* bufferTimeOut，默认为100ms   
* isChainingEnable，默认为true，即允许多个连续非shuffle算子放在同一个StreamTask中。    
