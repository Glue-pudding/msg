# Flink state backend概览

*时金魁 2016/11/15*

开启checkpoint后，快照数据要持久化，下面详细分析rocksDB的持久化方式。

> * state backend见[这里](https://ci.apache.org/projects/flink/flink-docs-master/dev/state_backends.html#the-rocksdbstatebackend),
> * state见[这里](https://ci.apache.org/projects/flink/flink-docs-release-1.2/dev/state.html)

##	准备

```scala
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-statebackend-rocksdb_2.11</artifactId>
  <version>1.2-SNAPSHOT</version>
</dependency>
```



##	如何持久化state

有三类对象可以持久化：ValueState[T]、ReducingState[T]、ListState[T]，`T`就是我们要持久化的对象类型。

使用支持状态持久化的两种方式：
1. 实现RichFlatMapFunction接口的UDF
2. 使用keyBy(...).mapWithState(...)


UDF再实现`Checkpointed`接口，就可以对状态对象快照和恢复快照。

##	调用入口

Flink作业提交后，通过Flink Cient提交给JobManager和TaskManager调度，最后执行入口是`StreamTask`的`invoke()`函数。

`invoke()`首先实例化`stateBackend = createStateBackend()`确定使用哪个state backend。在提交的Flink作业中可以设置两个backend参数`state.backend`和`savepoints.state.backend.fs.dir`。`savepoints.state.backend.fs.dir`用来设置保存目录，支持HDFS和普通文件路径。`state.backend`有三个可选项：`jobmanager`、`filesystem`、` rocksdb`。

| state backend | backend             |
| ------------- | ------------------- |
| jobmanager    | MemoryStateBackend  |
| filesystem    | FsStateBackend      |
| rocksdb       | RocksDBStateBackend |

在createStateBackend()中实例化RocksDBStateBackend对象后，就可以在运行时保存状态数据了。

##	checkpoint触发状态持久化的全过程

1. [client] CliFrontend
   `bin/flink` -> `main(final String[] args)` -> `savepoint(String[] args)` -> `savepoint(String[] args)` -> `triggerSavepoint()`  => 向JobManager发送Actor消息`TriggerSavepoint`

2. [Flink Master] JobManager 

   收到Actor消息：`CancelJobWithSavepoint`或者`TriggerSavepoint` => CheckpointCoordinator

3. [Flink Master] CheckpointCoordinator

   triggerSavepoint()` -> `triggerCheckpoint()`  -> `Execution`

4. [Flink worker] Execution

   `Execution#triggerCheckpoint()`拿到Slot所持有的`taskManagerGateway`，调用其`triggerCheckpoint()`函数

5. [Flink worker] ActorTaskManagerGateway

   `ActorTaskManagerGateway`调用`triggerCheckpoint()`，向TaskManager发送`TriggerCheckpoint` Actor消息

6. [Flink worker] TaskManager

   TaskManager收到Actor消息:`TriggerCheckpoint`，根据taskExecutionId查询到当前taskManager中管理的Task，task触发`triggerCheckpointBarrier()`。

7. [Flink worker] Task

   在新的线程中执行StreamTask的`triggerCheckpoint(..)`，即进入StreamTask

8. [Flink worker] StreamTask

   进入`StreamTask`中执行checkpoint操作：

   1. -> `triggerCheckoint(..)`

   2. -> `performCheckpoint(..)`，broadcase checkpoint barrier object `CheckpointBarrier`，传播到DAG的其他执行节点上，通知做checkpoint

   3. -> `checkpointState(..)`，生成一个新的CheckpointingOperation，执行checkpoint

   4. -> `executeCheckpointing()`，遍历所有的operator，在operator上执行`snapshotState()，`异步等待执行结果

   5. -> `AbstractStreamOperator#snapshotState()`

   6. -> `RocksDBKeyedStateBackend#snapshot(..)`，RocksDB对当前状态做快照

      ​

`RocksDBKeyedStateBackend#snapshot()`执行动作`snapshotOperation.takeDBSnapShot(checkpointId, timestamp)`，其中`stateBackend.db.getSnapshot()`会触发RocksDB对其当前状态打一个快照。至此，状态快照执行完毕。

从上述八个步骤来看，要触发一个checkpoint操作，需要从命令行参数，到JobManager，CheckpointCoordinator触发保存checkpoint操作，异步等待结果。最终到Task，选择一个backend(MemoryStateBackend、FsStateBackend、RocksDBStateBackend)做最终的状态持久化。

