# Flink Internal

>Flink内核解析

>**重要：文档版权归华为所有，未授权不得传播。**

##  Flink SQL


|  序号  | 模块                                       | 内容                              | 作者   |
| :--: | ---------------------------------------- | ------------------------------- | ---- |
|  1   | [Flink Table API 用法和原理介绍](./Flink_table_API_usage) | Flink Table API的用法和实现原理         | 张如聪  |
|  2   | [FlinkStreamSQL](http://code.huawei.com/risk/risk-doc/blob/master/docs/FlinkPrinciple/flinkprinciple) | Flink StreamSQL的用法和实现原理         | 张如聪  |
|  3   | [Flink SQL图解](flink_sql_full_progress)   | Flink SQL内部解析和codegen的过程        | 时金魁  |
|  4   | [StreamExecutionEnvironment系列](./StreamExecutionEnvironment系列) | StreamExectutionEnvironment执行过程 | 刘新春  |
|  5   | -                                        | -                               | -    |


## Flink Runtime


|  序号  | 模块                                       | 内容                                       | 作者   |
| :--: | ---------------------------------------- | ---------------------------------------- | ---- |
|  1   | [StreamTask](./StreamTask)               | StreamTask运行过程和checkpoint过程              | 刘新春  |
|  2   | [flinkcep](./flink-cep)                  | flink cep的用法                             | 张赵中  |
|  3   | [StateBackend](./StateBackend)           | checkpoint时StateBackend功能及作用             | 刘新春  |
|  4   | [FlinkProcesingTimeWindow](./FlinkProcessingTimeWindow) | flink的ProcessingTimeWindow机制及实现          | 刘新春  |
|  5   | [FlinkWindow](./FlinkWindow)             | Flink主要window的实现机制，对上面FlinkProcessingTimeWindow的补充 | 刘新春  |
|  6   | [Scala/Java动态加载jar包](Scala_dynamic_load_jar) | Flink内部有很多ClassLoader的用法，稍微讲解一下作用        | 刘新春  |
|  7   | [Flink State Backend概览](flink_state_backend) | Flink State Backend调用过程                  | 时金魁  |
|  8   | [flink watermark](flink_watermark)       | Flink watermark的使用及内部实现原理                | 张赵中  |
|  9   | [Flink Client作业提交](flink_client)      | Flink命令行提交作业的过程                          | 时金魁  |

## Akka Actor    
>Akka Actor是Flink使用的消息通信的框架，下面链接介绍了Akka Actor的基本的原理，大家有空可以看一下，全英文的，翻译起来工作量太大。

|  序号  | 模块                                       |
| :--: | ---------------------------------------- |
|  1   | [Introducing](./IntroducingActors)       |
|  2   | [ActorMessage](./ActorMessage-1)         |
|  3   | [Logging and Testing](./LoggingAndTestingActors-2) |
|  4   | [ActorMessage-Request and Response](./ActorMessaging-RequestAndResponse-3) |
|  5   | [ActorSystem](./ActorSystem-4)           |
|  6   | -                                        |
|  7   | -                                        |

## Flink代码阅读基础资源
1. [intelliJ IDEA多线程调试](intelliJIDEA)
2. [Java Type介绍](JavaType)      
3. [RocksDB安装](INSTALL)         
4. [IntelliJ远程调试教程](http://qifuguang.me/2015/09/18/IntelliJ远程调试教程/)     
5. [Flink release发布包打包手册](release-install)      
6. [Flink Debug jar包加源代码方法](intellJIdeaAttachCode)  


## 会议分享
1. [第一次Flink Meetup总结](flink_meetup_1_summary)
2. [第一次Flink Meeup分享](https://github.com/pusuo/streaming-resource/tree/master/flink-meetup-hz-20161105)
