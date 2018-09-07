#  Flink Client作业提交

Flink client是提交Flink作业的必经路口，可以向standalone／yarn／mesos集群提交作业。提交作业时，需要安全认证以及与集群之间的安全通信。

命令行提交Flink作业，会调用`CliFrontend`，解析参数，选择一个client（yarn/mesos/standalone）;准备好作业执行的context后，调用作业的main()函数；用户作业最后执行execut(..)，获取JobManager的actor地址，提交作业，作业提交的结果消息写入client，最后返回到CliFrontend。

##  入口

`bin/flink` —> `CliFrontend`

```shell
...
exec $JAVA_RUN $JVM_ARGS "${log_setting[@]}" -classpath "`manglePathList "$CC_CLASSPATH:$INTERNAL_HADOOP_CLASSPATHS"`" org.apache.flink.client.CliFrontend "$@"
```

##  参数解析

自定义命令行接口CustomCommandLine有三个实现类：DefaultCLI、FlinkYarnCLI、FlinkYarnSessionCLI。

**FlinkYarnSessionCLI支持的命令行参数为：**

```
  Options for yarn-cluster mode:
     -yD <arg>                            Dynamic properties
     -yd,--yarndetached                   Start detached
     -yid,--yarnapplicationId <arg>       Attach to running YARN session
     -yj,--yarnjar <arg>                  Path to Flink jar file
     -yjm,--yarnjobManagerMemory <arg>    Memory for JobManager Container [in
                                          MB]
     -yn,--yarncontainer <arg>            Number of YARN container to allocate
                                          (=Number of Task Managers)
     -ynm,--yarnname <arg>                Set a custom name for the application
                                          on YARN
     -yq,--yarnquery                      Display available YARN resources
                                          (memory, cores)
     -yqu,--yarnqueue <arg>               Specify YARN queue.
     -ys,--yarnslots <arg>                Number of slots per TaskManager
     -yst,--yarnstreaming                 Start Flink in streaming mode
     -yt,--yarnship <arg>                 Ship files in the specified directory
                                          (t for transfer)
     -ytm,--yarntaskManagerMemory <arg>   Memory per TaskManager Container [in
                                          MB]
     -yz,--yarnzookeeperNamespace <arg>   Namespace to create the Zookeeper
                                          sub-paths for high availability mode
```

**FlinkYarnCli的命令行参数如下：**

```
  Options for yarn mode:
     -ya,--yarnattached                   Start attached
     -yD <arg>                            Dynamic properties
     -yj,--yarnjar <arg>                  Path to Flink jar file
     -yjm,--yarnjobManagerMemory <arg>    Memory for JobManager Container [in
                                          MB]
     -yqu,--yarnqueue <arg>               Specify YARN queue.
     -yt,--yarnship <arg>                 Ship files in the specified directory
                                          (t for transfer)
     -yz,--yarnzookeeperNamespace <arg>   Namespace to create the Zookeeper
                                          sub-paths for high availability mode
```

DefaultCLI、FlinkYarnCLI、FlinkYarnSessionCLI三个自定义命令行，使用`commons-cli`解析，三者命令参数各有不同。命令行参数解析后生成`ProgramOptions`对象，其包含：jarFilePath, entryPointClass, classpaths, programArgs, parallelism, detachedMode等成员变量。

##  构建用户程序

生成的ProgramOptions会重新选择一些字段封装成PackagedProgram对象。

##  创建客户端

前面得到的三个命令行对象DefaultCLI、FlinkYarnCLI、FlinkYarnSessionCLI，对应三种集群资源调度。与yarn/mesos/standalone集群交互的时候，需要对应的client，因为不同的集群，作业提交方式及其API是不同的。

FlinkYarnSessionCLI／FlinkYarnCLI／DefaultCLI三个命令行对象，DefaultCLI排在最后。三者依次检测是否为用户选择的命令行对象。`-m yarn-cluster`会选择FlinkYarnSessionCLI，`-m yarn`会选择FlinkYarnCLI，前两者都不是的话就选择DefaultCLI。

命令行对象中`-m localhost:6123`和`-z localhost:2181`两个参数添加到Configuration对象中，再构建一个StandaloneClusterDescriptor对象，检索得到StandaloneClusterClient对象。client对象接下来会用于连接JobManager提交Flink作业。

##  执行用户程序

用户提交的作业用PackagedProgram对象表示。PackagedProgram中包含main()函数的入口类，要么是`Program`的子类，即isUsingProgramEntryPoint；要么不是`Program`的子类，即isUsingInteractiveMode，交互式作业执行模式。

PackagedProgram以及StandaloneClusterClient会被封装到`ContextEnvironmentFactory`对象中，ContextEnvironmentFactory包含client，jarFilesToAttach，classpathsToAttach，userCodeClassLoader，defaultParallelism，isDetached，lastEnvCreated（ExecutionEnvironment），savepointSettings（SavepointRestoreSettings）。ContextEnvironmentFactory在用户作业程序中初始化上下文，上下文中设置ExecutionEnvironmentFactory对象，一旦作业正式启动后，会获取该上下文环境并提交作业到集群中执行。

这里是本地交互式提交Flink作业，program执行invokeInteractiveModeForExecution，检索到jar包中包含main函数的主类，反射得到main()函数的Method对象，`调用Method对象的invoke()方法，执行main()`。开始进入用户作业程序，执行作业提交。

##  提交作业，返回结果

前面ContextEnvironmentFactory对象中包含`client:ClusterClient`对象，取出上下文中的jar路径、classpath、classloader、savepointSettings以及Flink作业的`StreamGraph`对象，client执行run函数，提交作业。

Flink作业有同步等待和定时监测结果两种方式，这里是同步等待方式。

提交作业就要与JobManager通信，建立一个连接需要知道目标ip和port，以及本地ip和port。本地检测到可用端口，同时检测远端JobManager的akka地址是否可用，形如：`akka.tcp://flink@localhost:6123/user/jobmanager`

一旦连接的本地ip:port和akka地址都可用，创建ActorSystem，actorSystem生成一个actor对象用于向JobManager发送消息。actor发送一个`JobGraph`消息，生成一个`JobListeningContext`对象，异步等待。一旦收到成功或失败的消息，会逐级返回到CliFrontend，打印结果。

##  附录A：Flink ClusterClient akka actorSystem configure

```yaml
akka {
  actor {
    provider = "akka.remote.RemoteActorRefProvider"
  }

  remote {
    startup-timeout = 100 seconds

    transport-failure-detector{
      acceptable-heartbeat-pause = 6000 s
      heartbeat-interval = 1000 s
      threshold = 300.0
    }

    watch-failure-detector{
      heartbeat-interval = 10 s
      acceptable-heartbeat-pause = 60 s
      threshold = 12.0
    }

    netty {
      tcp {
        transport-class = "akka.remote.transport.netty.NettyTransport"
        port = 0
        bind-port = 0
        connection-timeout = 20 s
        maximum-frame-size = 10485760b
        tcp-nodelay = on
      }
    }

    log-remote-lifecycle-events = off
  }
}
       
akka {
  remote {
    netty {
      tcp {
        hostname = localhost
        bind-hostname = 0.0.0.0
      }
    }
  }
}
```



##	附录B：全图

![](pictures/flink_client_full.png)

