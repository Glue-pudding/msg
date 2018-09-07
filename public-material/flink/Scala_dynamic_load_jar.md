# Scala/Java动态加载Jar包
> 刘新春
> 2016年12月16日

在Flink代码中有很多类似ClassLoader之类的变量，该变量的作用主要是动态加载Jar包中的某些类，类似C++中动态加载so包的dlopen。举个小例子简要说明一下用法，供大家参考及阅读代码。

## 1. 抽象类定义
假设我们有一个基类`OperatorBase`,定义如下：
```java
abstract class OperatorBase {

  def invoke(): Unit

}
```
该类经过打包后放在`libBase.jar`中，包路径为：`com.huawei.rt.base`中。

## 2. 子类定义
假设我们某个人写了一个扩展类`Operator`，继承了上述父类， 定义如下：
```java
class Operator extends OperatorBase {
  override def invoke(): Unit = {

    println("hello, world.")
  }
}
```
该类打包之后放在`lib.jar`中，包路径为：`com.huawei.rt.lib`。

## 动态加载
我们书写一段代码，动态加载`Operator`并调用其方法`invoke()`:
```java
import java.io.File
import java.net.URLClassLoader

import com.huawei.rt.base.OperatorBase

object ScalaMain{

  def main(args: Array[String]): Unit = {

    val path = "D://2016/jar/lib.jar"

    val myClassLoader = new URLClassLoader(Array((new File(path)).toURI.toURL))

    val clazz: Class[_] = myClassLOader.loadClass("com.huawei.rt.lib.Operator")
    val operator = clazz.newInstance().asInstanceOf[OperatorBase]
    operator.invoke()

  }
}
```

通过父类的抽象方法，我们调到了子类的具体实现。
