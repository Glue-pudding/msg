# 入伙指南     
> 刘新春     
> 2016年12月28日     

## 1. 简介     
进入本伙需要掌握以下技能：    
* Scala    
* Java     
* Git基本操作     
* Maven基本操作     
* Intellij IDEA    
* Flink    

## 2. 基本路线图    
### 2.1 软件安装     
本教程以Linux平台为基础。Windows下也有相关软件，配置基本相同。本教程使用的相关软件如下：    

| 软件名称 | 版本号 |    
| ---- | ---- |    
| Scala | 2.11.8 |    
| Java  | 8u111-linux-x64 |    
| Git   | 2.11 |     
| Maven | 3.3.9 |     
| Intellij IDEA | 2016.3 |     
| Flink | 1.1.4 |     


#### 2.1.1 Java安装   
从Oracle官网下载最新版JDK，目前最新版为jdk-8u111-linux-x64.tar.gz. 本例中将java安装在/home/apps/中。执行以下命令:    
* 解压jdk-8u111-linux-x64.tar.gz    
  tar zxvf jdk-8u111-linux-x64.tar.gz    
* 建立软链接    
  ln -s jdk1.8.0_111 java    
* 将路径加到全局配置文件/etc/profile中    
  export JAVA_HOME=/home/apps/java    
  export CLASSPATH=$JAVA_HOME/jre:$JAVA_HOME/lib    
  export PATH=$PATH:$JAVA_HOME/bin    
* 将路径加入到个人配置文件～/.bash_profile    
  export JAVA_HOME=/home/apps/java    
  export CLASSPATH=$JAVA_HOME/jre:$JAVA_HOME/lib    
  export PATH=$PATH:$JAVA_HOME/bin    
* 载入配置文件    
  source /etc/profile    
* 执行java -version看是否安装成功

*注意： 加入全局配置文件，只有重启操作系统才能永久生效，临时生效可以只source /etc/profile;在跟人配置文件中加入一环境变量，每次启动一个新终端都会自动重载~/.bash_profile使其生效。      
#### 2.1.2 Scala安装    
从Scala官方网站下载最新版Scala，到写本指南为止，最新版为scala-2.12.1, Flink开发均基于2.11.*版本，因此本指南以scala-2.11.8为准,安装到/home/apps目录下。执行以下命令：    
* 解压scala-2.11.8.tgz    
  tar zxvf scala-2.11.8.tgz    
* 建立软链接   
  ln -s scala-2.11.8 scala    
* 将路径加到全局配置文件/etc/profile中    
  export SCALA_HOME=/home/apps/scala    
  export PATH=$PATH:$SCALA_HOME/bin    
* 将路径加到个人配置文件中~/.bash_profile    
  export SCALA_HOME=/home/apps/scala    
  export PATH=$PATH:SCALA_HOME/bin    
* 载入配置文件    
  source /etc/profile    
* 执行scala -version查看scala是否安装成功     

#### 2.1.3 安装git    
* 检查平台上是否已经安装git
  git --version    
* 如果未安装请到官网下载最新的git linux版本安装    
* git安装需要openssl和curl的支持，下载openssl并安装    

**Git简单使用**     
* 从github上下载代码    
  git clone ***.git     
  如果下载某个分支    
  git clone ***.git -b 分支名称     
* 检查当前分支     
  git branch    
* 检查所有分支    
  git branch -a   
* 以当前分支为基础创建新的分支    
  git checkout -b 新分支名称    
* 切换分支    
  git checkout 分支名称    
* 提交代码    
  git add .    
  git commit -m "说句话"    
  git pull origin 分支名称   
  git push origin 分支名称   
  
* 冲突处理    
  在执行git pull origin 分支名称时可能产生冲突，根据冲突提示，修改并重新提交    

  在黄云下无法从github上下载代码，可以在w3上搜索cntlm配置手册，下载cntlm并安装，设置git代理即可。    


* 上传忽略个人工程相关    
  在项目根目录下创建.gitignore文件，里面每行添加一个需要忽略的文件,如：     
  * *.iml    
  * .idea    
  * target     
  * dependency-reduced-pom.xml     

