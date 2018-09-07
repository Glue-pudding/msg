# Flink状态checkpoint的Backend

> 刘新春 2016年11月29日

Flink状态备份主要有3种backend，分别是内存、文件和RocksDB。即：
* MemoryStateBackend
* FsStateBackend
* RocksDBStateBackend

其中前两者位于`org.apache.flink.runtime.state` 目录下（包：flink-runtime_2.11-1.1.3.jar），后者位于`org.apache.flink.contrib.streaming.state` 目录下（包：flink-statebackend-rocksdb_2.11-1.1.3.jar）。本文主要描述FsStateBackend和RocksDBStateBackend。（本文以flink-1.1.3为基础）

## 1. Backend的作用

Backend主要用在Flink的checkpoint机制中，当checkpoint制作快照时需要将快照保存到一个稳定的容器中，这个容器即为Backend，这个容器可以是内存、文件系统也可以是数据库。在Flink中，内存使用MemoryBackend，文件系统使用FsStateBackend，而数据库使用内嵌式数据库RocksDB。

## 2. Flink基本状态

Flink状态是内核的关键概念之一，位于flink-core-1.1.3.jar包的org.apache.flink.common.state目录下。主要接口/类如下：
```
state------
  |-- AppendingState
  |-- FoldingState
  |-- FoldingStateDescriptor
  |-- ListState
  |-- ListStateDescriptor
  |-- MergingState
  |-- OperatorState
  |-- ReducingState
  |-- ReducingStateDescriptor
  |-- State
  |-- StateBackend
  |-- StateDescriptor
  |-- ValueState
  |-- ValueStateDescriptor
  ```

它们相互之间的继承关系如下图所示：

![State](./pictures/State.png)



其中，State为各种不同类型的状态的接口，这些所谓的状态只能被`KeyedDataStream`的方法使用。对外暴露的状态主要有以下四种：

* ValueState    
  主要用来保存单值状态（single-value state）,可以作为分布式快照的一部分
* ListState    
  主要用来保存操作（Operations）的链表状态（list state），可以作为分布式快照的一部分
* FoldingState    
  主要用来保存可折叠的状态，由FoldFunction产生的状态
* ReducingState    
  主要用来保存Reduce的状态，由ReduceFunction产生的状态

创建这些状态的基类为`StateDescriptor`,该基类的作用为使用绑定的`StateBackend`创建一个实际的`state`对象。在这里`StateBackend`，具体内部内容如下：

```java
public interface StateBackend {

  /**
  * 创建并返回一个ValueState
  * @param stateDesc 内包含 state的名称
  * @param <T> value的类型
  */
  <T> ValueState<T> createValueState (ValueStateDescriptor<T> stateDesc) throws Exception;
  /**
  * 创建并返回一个ListState
  * @param stateDesc 内包含state的名称
  * @param <T> values的类型
  */
  <T> ListState<T> createListState (ListStateDescriptor<T> stateDesc) throws Exception;
  /**
  * 创建并返回一个ReducingState
  * @param stateDesc 内包含state的名称
  * @param <T> values的类型
  */
  <T> ReducingState<T> createReducingState (ReducingStateDescriptor<T> stateDesc) throws Exception;

  /**
  * 创建并返回一个FoldingState
  * @param stateDesc 内包含state的名称
  * @param <T> FoldingState输入的values的类型
  * @param <ACC> FoldingState输出的类型
  */
  <T, ACC> FoldingState<T, ACC> createFoldingState (FoldingStateDescriptor<T, ACC> stateDesc) throws Exception;
}
```
该接口怎么使用呢？（这段代码简直吊炸天，用了面向对象的多种方法）具体如下图所示：
![StateBackend](./pictures/StateBackend.png)
在`AbstractStateBackend`中方法`getPartitionedSate()`接口使用传入的`StateDescriptor`的`bind()`接口获取具体`StateBackend`中的一个空白状态，在此内部重载了`StateBackend`内部的获取各种类型的函数，这些函数内部调用`AbstractStateBackend`子类的具体方法，获取具体`StateBackend`的空白状态。
代码如下：

```java
AbstractStateBackend implements java.io.Serializable {
  ...
  protected <N, T> ValueState<T> createValueState (TypeSerializer<N> namespaceSerializer, ValueStateDescriptor<T> stateDesc) throws Exception;

  protected abstract <N, T> ListState<T> createListState (TypeSerializer<N> namespaceSerializer, ListStateDescriptor<T> stateDesc) throws Exception;

  protected abstract <N, T> ReducingState<T> createReducingState (TypeSerializer<N> namespaceSerializer, ReducingStateDescriptor<T> stateDesc) throws Exception;

  protected abstract <N, T, ACC> FoldingState<T, ACC> createFoldingState (TypeSerializer<N> namespaceSerializer, FoldingStateDescriptor<T, ACC> stateDesc) throws Exception;

  ...
  public <N, S extends State> S getPartitionedSate (final N namespace, final TypeSerializer<N> namespaceSerializer, final StateDescriptor<S, ?> StateDescriptor) throws Exception {

    ...
    S kvstate = StateDescriptor.bind (new StateBackend() {
      @Override
      public <T> ValueState<T> createValueState(ValueStateDescriptor<T> stateDesc) throws Exception {
				return AbstractStateBackend.this.createValueState(namespaceSerializer, stateDesc);
			}

      @Override
			public <T> ListState<T> createListState(ListStateDescriptor<T> stateDesc) throws Exception {
				return AbstractStateBackend.this.createListState(namespaceSerializer, stateDesc);
			}

			@Override
			public <T> ReducingState<T> createReducingState(ReducingStateDescriptor<T> stateDesc) throws Exception {
				return AbstractStateBackend.this.createReducingState(namespaceSerializer, stateDesc);
			}

			@Override
			public <T, ACC> FoldingState<T, ACC> createFoldingState(FoldingStateDescriptor<T, ACC> stateDesc) throws Exception {
				return AbstractStateBackend.this.createFoldingState(namespaceSerializer, stateDesc);
			}
    });
  }

}
```
## 3. Backend
### 3.1 AbstractStateBackend

`AbstractStateBackend`是`MemoryStateBackend`、`FsStateBackend`以及`RocksDBStateBackend`的基类。里面定义了几种重要的接口。具体该抽象类的结构如下如所示：
![AbstractStateBackend](./pictures/AbstractStateBackend.png)
* `keyValueStates: KvState<?,?,?,?,?>[]`    
  保存状态的列表，`KvState`中有`snapshot()`方法，可以制作自身的快照。
* `keyValueStatesByName: HashMap<String, KvState<?,?,?,?,?>>`    
  状态的索引。
* `getPartitionedSate()`
  创建或获取一个状态，具体实现请参阅上文和`AbstractStateBackend.java`
* `snapshotPartitionedState()`    
  遍历`keyValueStatesByName`,调用每个`KvState`的`snapshot()`接口，制作自身快照，将其保存到一个`HashMap<String, KvStateSnapshot<?,?,?,?,?>>`中。
* `checkpointStateSerializable()`    
  将状态写入checkpoint中

### 3.2 FsStateBackend

该类位于`org.apache.flink.runtime.state.filesystem`包中，该包的具体内容如下（即：与`FsStateBackend`相关的内容）：    
```
filesystem
  |-- AbstractFileStateHandle
  |-- AbstractFsState
  |-- AbstractFsStateSnapshot
  |-- FileSerializableStateHandle
  |-- FsFoldingState
  |-- FsListState
  |-- FsReducingState
  |-- FsStateBackend
  |-- FsStateBackendFactory
  |-- FsValueState
```

具体继承关系如下图所示：

![FsStateBackend](./pictures/FsStateBackend.png)

目前来看，在`checkpoint`中并没有使用到`backend`的创建状态的功能，即以下接口并没有使用：
* createValueState    
* createListState    
* createFoldingState    
* createReducingState    

#### 3.2.1 checkpoint过程
`checkpoint`使用`FsStateBackend`的过程如下：
* 当收到栅栏时，首先检查Operator的状态，得到一个空的`state`(`operatorState==null`,`functionState==null`,`KvState==null`)，测试使用的`map`,`filter`和`flatmap`都是这样；
* 然后调用用户自定义`snapshotState`接口，获取自定义状态；
* 调用`FsStateBackend`的`checkpointStateSerializable`接口将快照写到文件中。
* `checkpointStateSerializable`接口内部首先根据`basepath`、作业号和`checkpointId`创建文件，然后获取输出流，将状态序列化写入文件。

#### 3.2.2 FsStateBackend支持的文件系统
`FsStateBackend`可以使用三种形式的文件系统，依次是：
* 本地文件：以"file://"开头    
* HDFS：以"hdfs://"开头
* S3: 以"s3://"开头

#### 3.2.3 文件系统结构（以hdfs为例）
`hdfs://namenode:port/flink-checkpoints/<job-id>/chk-17/6ba7b810-9dad-11d1-80b4-00c04fd430c8`其中：    
* `hdfs://namenode:port/flink-checkpoints`表示根目录；
* `job-id`表示作业ID;
* `chk-17`表示具体的某个checkpoint;
* `6ba7b810-9dad-11d1-80b4-00c04fd430c8`表示根据UUID生成的具体保存快照的文件.

### 3.3 RocksDBStateBackend

该`Backend`包含在包`org.apache.flink.contrib.streaming.state`中，具体包含
```
state--
  |-- AbStractRocksDBState
  |-- OptionsFactory
  |-- PredefinedOptions
  |-- RocksDBFoldingState
  |-- RocksDBListState
  |-- RocksDBReducingState
  |-- RocksDBStateBackend
  |-- RocksDBValueState
```
下图为`RocksDBStateBackend`的类继承关系：
![RocksDBStateBackend](./pictures/RocksDBStateBackend.png)
`RocksDBStateBackend`将所有数据都放到RocksDB里，在Flink进行checkpoint时，用户自定义状态，实际上直接写到了`FsStateBackend`里。(在目前flink-1.1.3版本里是这样子的)，具体的细节如下：
* 在`RocksDBStateBackend`类中有一个`nonPartitionedStateBackend`变量，该变量在`RocksDBStateBackend`构造函数中会被赋予一个`FsStateBackend`的对象；    

```java
public RocksDBStateBackend(URI chechpointDataUri) throws IOException {

  FsStateBackend fsStateBackend = new FsStateBackend(chechpointDataUri);

  this.nonPartitionedStateBackend = fsStateBackend;
  this.checkpointDirectory = fsStateBackend.getBasePath();
}
```

* 当checkpoint调用`RocksDBStateBackend`的`checkpointStateSerializable`时，会调用`FsStateBackend`的`checkpointStateSerializable`方法，将快照写入到文件系统里。    

```java
public <S extends Serializable> StateHandle<S> checkpointStateSerializable (S state, long checkpointID, long timestamp) throws Exception {

  return nonPartitionedStateBackend.checkpointStateSerializable(state, checkpointID, timestamp);
}
```
