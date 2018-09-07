# IntelljIdea Debug时Attach Code方法    
> 刘新春    
> 2017年1月10日

在IntelljIdea调试jar代码的过程中，如果没有源代码source.jar会进行反编译，反编译的代码没有注释等必备说明，读起来比较费力。这时最好用原始源代码。

反编译的代码会在编辑框顶上弹出浅色横条：     
![attachSources](./pictures/attachSources.png)   
可以点击任意蓝字：    
* 如果连网，且maven仓库提供source的jar包，则可以点击“Download Sources”会自动下载源码jar包    
* 如果上面方法不奏效，可以找出生成该jar包的工程，点击“Choose Sources”，将工程目录载入。

**下面讲一个手残问题**    
如果不小心在“Choose sources”的过程中将工程目录选错了，如何纠正呢？ 解决方案如下：    
* 点击工具栏File，在弹出的对话框中选择    
  ![projectStructure.png](./pictures/projectStructure.png)     
* 选择Libraries选项，在一堆jar包中选择你直接依赖的jar包（如：在pom中指定的直接依赖包是flink-streaming-scala_2.10-1.3-SNAPSHOT.jar）     
  ![libraries.png](./pictures/libraries.png)    
* 点中source，点击“-”将其删除     
* 点击“+”, 把正确的source目录加上    
* 点击“OK”
