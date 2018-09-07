# StreamExecutionEnvironment     
> 刘新春    
> 2016年12月13日     

## 1. StreamExecutionEnvironment的功能    
用户每次向Flink提交作业，都会生成一个StreamExecutionEnvironment。StreamExecutionEnvironment主要功能如下：
* 提供作业执行的配置信息    
  * 该功能主要由`config`变量提供，`config`是一个`ExecutionConfig`类型的变量。后续会介绍包含的具体内容。    
* 提供作业checkpoint的配置信息    
  * 该功能主要由`checkpointCfg`变量提供，`checkpointCfg`是一个`checkpointCfg`类型的变量。后续会介绍其包含的具体内容。     
* 提供`StateBackend`的配置信息    
  * 该功能主要由`defaultStateBackend`变量提供，`defaultStateBackend`是一个`AbstractStateBackend`类型的变量。该类型的具体内容及作用在[StateBackend](http://code.huawei.com/real-time-team/FlinkCodeReading/blob/master/StateBackend.md)已经详细介绍（注意：Flink-1.1.3版本与1.2版本有较大差异，尤其是`RocksDBStateBackend`,写作文档时以Flink-1.1.3版本为基础）。    
* 添加外界输入流   
  * Flink提供多种输入源，同时也允许用户自定义输入源；
  * 提供从集合（Collection）、文件（text file）、socket等输入源输入；
  * 通过`addSource()`和`SourceFunction`提供用户自定义输入源。
* 生成流图、执行计划等
* 提交作业。     

## 2. 内容详解

### 2.1 分类

Flink主要提供两种类型的环境变量：    
* `LocalStreamEnvironment`    
* `RemoteStreamEnvironment`

前者在本地模式下使用，后者在分布式环境下使用。

### 2.2 时间种类    

Flink可以按3种时间类型处理数据，分别是:
* processing time   
   * 按系统当前时间处理数据
* ingestion time
   * 按进入Flink的时间处理数据
* event time
   * 按事件发生的时间处理数据

具体定义和注释在`TimeCharacteristic`中。    
```java
public enum TimeCharacteristic {
  ProcessingTime,    
  IngestionTime,    
  EventTime
}
```

### 2.3 程序执行配置信息(`ExecutionConfig`)

主要提供以下信息：    
* 任务的并发度（`parallelism`）    
* 任务失败时尝试次数（`numberOfExecutionRetries`）    
* 任务全局信息（`globalJobParameter`）    
* 对某些类的序列化类（`registeredTypesWithKryoSerializers`）
* 重启策略（`restartStrategyConfiguration`）
* watermark的间隔周期（`autoWatermarkInterval`）
* 等等       

### 2.4 checkpoint配置信息（`checkpointConfig`）

主要提供以下信息：
* Checkpoint的模式（`checkpointingMode`）    
* Checkpoint的时间间隔（`checkpointInterval`,其中-1表示关闭，默认是-1）
* Checkpoint的超时时间（`checkpointTimeout`）    
* 同时Checkpoint周期的个数（`maxConcurrentCheckpoints`）      
* Checkpoint触发间隔（`minPauseBetweenCHeckpoints`，该变量与`checkpointInterval`以及`maxConcurrentCheckpoints`结合决定下一次checkpoint什么时候触发）

### 2.5 `RemoteSreamEnvironment`

#### 2.5.1 `RemoteStreamEnvironment`初始化    

`RemoteStreamEnvironment`初始化时带有`JobManager`的IP地址及端口号，以及用户任务Jar包的路径，client配置信息，全局环境变量等，具体代码如下：
```java
public ReomteStreamEnvironment(String host, int port, COnfiguration clientConfiguration, String[] jarFiles, URL[] globalClasspaths) {
  if (!ExecutionEnvironment.areExplicitEnvironmentsAllowed()) {
			throw new InvalidProgramException(
					"The RemoteEnvironment cannot be used when submitting a program through a client, " +
							"or running in a TestEnvironment context.");
		}

		if (host == null) {
			throw new NullPointerException("Host must not be null.");
		}
		if (port < 1 || port >= 0xffff) {
			throw new IllegalArgumentException("Port out of range");
		}

		this.host = host;
		this.port = port;
		this.clientConfiguration = clientConfiguration == null ? new Configuration() : clientConfiguration;
		this.jarFiles = new ArrayList<>(jarFiles.length);
		for (String jarFile : jarFiles) {
			try {
				URL jarFileUrl = new File(jarFile).getAbsoluteFile().toURI().toURL();
				this.jarFiles.add(jarFileUrl);
				JobWithJars.checkJarFile(jarFileUrl);
			} catch (MalformedURLException e) {
				throw new IllegalArgumentException("JAR file path is invalid '" + jarFile + "'", e);
			} catch (IOException e) {
				throw new RuntimeException("Problem with jar file " + jarFile, e);
			}
		}
		if (globalClasspaths == null) {
			this.globalClasspaths = Collections.emptyList();
		}
		else {
			this.globalClasspaths = Arrays.asList(globalClasspaths);
		}
}
```

其中`jarFiles`保存jar包的路径，如果用户不传入配置信息，那么会生成一个默认的配置信息。`JobWithJars.checkJarFile(jarFileUrl)`的作用主要是检查该jar包是否存在，具体代码如下：
```java
public static void checkJarFile(URL jar) throws IOException {
        File jarFile;
        try {
            jarFile = new File(jar.toURI());
        } catch (URISyntaxException var3) {
            throw new IOException("JAR file path is invalid \'" + jar + "\'");
        }

        if(!jarFile.exists()) {
            throw new IOException("JAR file does not exist \'" + jarFile.getAbsolutePath() + "\'");
        } else if(!jarFile.canRead()) {
            throw new IOException("JAR file can\'t be read \'" + jarFile.getAbsolutePath() + "\'");
        }
    }
```

#### 2.5.2 流图（`StreamGraph`）生成
