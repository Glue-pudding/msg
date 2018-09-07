# Flink作业配置参数    
> 刘新春    
> 2016年12月19日   

Flink环境变量的参数配置主要通过两个类来实现，一个是`ExecutionConfig`，一个是`CheckpointConfig`。前者主要是设置一些基本的作业设置；后者主要包括checkpoint的信息。   
## 1. `ExecutionConfig`

 该类主要包括：
 * 作业并发度   
 * 重启策略    
 * watermark默认间隔    
 * 全局作业参数GlobalJobParameters, 该参数目前是一个Map    
 * 序列化信息，主要有两种，一种是Kryo，另一种是Pojo，一般情况下可以不设置。

## 2. `CheckpointConfig`    

 该类主要包括：   
 * checkpointingMode 默认情况下使用exactly once    
 * checkpointInterval, 如果不进行设置，该值为-1,即不进行checkpoint，如果设置的值大于0，则表示开启checkpoint
 * checkpointTimeout，默认10分钟，即一次checkpoint必须在十分钟内完成
 * minPauseBetweenCheckpoints, 两次checkpoint之间的暂停间隔    
 * maxConcurrentCHeckpoints，即同时允许有几个周期的checkpoint的barrier在topology中做快照。

 实际进行checkpoint时，需要综合考虑checkpointInterval、checkpointTimeout、minPauseBetweenCheckpoints以及maxConcurrentCHeckpoints来决定何时发送下一个周期的barrier。
