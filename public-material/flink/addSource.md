# Execution addSource过程    
> 刘新春     
> 2016年12月19日    

Flink的输入源算子有多种，例如从文件中读取、从socket中读取等，Flink还提供用户自定义的输入方式，主要通过addSource()来实现。本文我们以addSource()为例，探讨Flink添加算子的过程。(代码中用到了很多Java中的`Type`,`Type`的具体细节请参阅[这里](JavaType.md))   

假设我们添加一个source算子`JEventsGeneratorSource`，该算子主要功能是生成随机的`Tuple2<Long, JEvent>`信息，并向外发送。具体的类继承关系如下：   
```java
public class JEventsGeneratorSource extends RichParallelSourceFunction<Tuple2<Long, JEvent>> implements CHeckpointed {

}
```
算子添加过程主要包括两部分：（1）获取source算子相关的数据类型，生成输出数据的`TypeInformation`信息，该数据结构主要用来描述输出数据的类中每个变量的信息；（2）生成该算子出的流`DataStreamSource`。这个流程图如下所示：    
![AddSourceFunc](./pictures/AddSourceFunc.png)     
具体代码如下:

```java
public <OUT> DataStreamSource<OUT> addSource(SourceFunction<OUT> function, String sourceName, TypeInformation<OUT> typeInfo) {

		if(typeInfo == null) {
			if (function instanceof ResultTypeQueryable) {
				typeInfo = ((ResultTypeQueryable<OUT>) function).getProducedType();
			} else {
				try {
					typeInfo = TypeExtractor.createTypeInfo(
							SourceFunction.class,
							function.getClass(), 0, null, null);
				} catch (final InvalidTypesException e) {
					typeInfo = (TypeInformation<OUT>) new MissingTypeInfo(sourceName, e);
				}
			}
		}

		boolean isParallel = function instanceof ParallelSourceFunction;

		clean(function);
		StreamSource<OUT, ?> sourceOperator;
		if (function instanceof StoppableFunction) {
			sourceOperator = new StoppableStreamSource<>(cast2StoppableSourceFunction(function));
		} else {
			sourceOperator = new StreamSource<>(function);
		}

		return new DataStreamSource<>(this, typeInfo, sourceOperator, isParallel, sourceName);
	}
```
一般情况下，入参`function`即为用户自定义的source算子（此处为`JEventsGeneratorSource`），`sourceName`和`typeInfo`为默认值和`null`。

## 生成`TypeInformation`

该功能主要有`TypeExtractor`类来实现。首先我们看一下`JEventsGeneratorSource`类的继承关系。

![JEventsGeneratorSource](./pictures/JEventGeneratorSource.png)

其中`OUT`为`Tuple2<Long, JEvent>`.

在生成`TypeInformation`的过程中，最终会调用`privateCreateTypeInfo()`方法，该方法主要有两种作用：（1）是遍历整个类之间的继承关系，获取必要的输出数据所需的泛型；（2）获取真正的输出数据类型信息。     

### 输出数据所需的泛型     

该部分中主要按照Java的继承关系进行检查，首先检查当前类应用（`implements`）的接口(`interface`)，其次，检查其继承（`extends`）的超类(`super class`)。并将其保存在`typeHierarchy`(`ArrayList<Type>`)。该过程是个迭代。具体代码如下：
```java
private static Type getParameterType(Class<?> baseClass, ArrayList<Type> typeHierarchy, Class<?> clazz, int pos) {
		if (typeHierarchy != null) {
			typeHierarchy.add(clazz);
		}
		Type[] interfaceTypes = clazz.getGenericInterfaces();

		// search in interfaces for base class
		for (Type t : interfaceTypes) {
			Type parameter = getParameterTypeFromGenericType(baseClass, typeHierarchy, t, pos);
			if (parameter != null) {
				return parameter;
			}
		}

		// search in superclass for base class
		Type t = clazz.getGenericSuperclass();
		Type parameter = getParameterTypeFromGenericType(baseClass, typeHierarchy, t, pos);
		if (parameter != null) {
			return parameter;
		}

		throw new InvalidTypesException("The types of the interface " + baseClass.getName() + " could not be inferred. " +
						"Support for synthetic interfaces, lambdas, and generic or raw types is limited at this point");
	}
```

代码中首先将检查的当前类放入`typeHierarchy`中，然后（1）调用`getGenericInterfaces`获取其接口类，然后调用`getParameterTypeFromGenericType`检查`interfaces`,如果接口中没有泛型，就不继续检查；（2）调用`getGenericSuperclass`获取父类，然后调用`getParameterTypeFromGenericType`检查检查其父类。在`getParameterTypeFromGenericType`中会进行三种检查：（1）是不是基类；（2）是不是泛型类；（3）是不是类。如果是基类的话，返回其泛型，否则继续调用`getParameterType`对其父类或进行RawType进行检查。 具体代码如下：

```java
private static Type getParameterTypeFromGenericType(Class<?> baseClass, ArrayList<Type> typeHierarchy, Type t, int pos) {
		// base class
		if (t instanceof ParameterizedType && baseClass.equals(((ParameterizedType) t).getRawType())) {
			if (typeHierarchy != null) {
				typeHierarchy.add(t);
			}
			ParameterizedType baseClassChild = (ParameterizedType) t;
			return baseClassChild.getActualTypeArguments()[pos];
		}
		// interface that extended base class as class or parameterized type
		else if (t instanceof ParameterizedType && baseClass.isAssignableFrom((Class<?>) ((ParameterizedType) t).getRawType())) {
			if (typeHierarchy != null) {
				typeHierarchy.add(t);
			}
			return getParameterType(baseClass, typeHierarchy, (Class<?>) ((ParameterizedType) t).getRawType(), pos);
		}			
		else if (t instanceof Class<?> && baseClass.isAssignableFrom((Class<?>) t)) {
			if (typeHierarchy != null) {
				typeHierarchy.add(t);
			}
			return getParameterType(baseClass, typeHierarchy, (Class<?>) t, pos);
		}
		return null;
	}
```   
*instanceof是用来判断一个对象实例是否是一个类或借口或其子类子接口的实例，而isAssignableFrom是用来判断一个类Class1和另一个类Class2是否相同或是另一个类的子类或接口*
在上面的例子中首先检查`interface`类型的`Checkpointed`, `Checkpointed`与基类没有任何关系，因此返回`null`，然后检查`superclass`。执行到最后会在ParallelSourceFunction处停止，`typeHierarchy`中存储的信息依次是：
```java
0->JEventsGeneratorSource
1->RichParallelSourceFunction<Tuple2<Long, JEvent>>
2->RichParallelSourceFunction
3->ParallelSourceFunction<OUT>
4->ParallelSourceFunction
5->SourceFunction<T>
```
之后会将`OUT`返回。


### 输出真正的数据类型信息

该部分主要通过`createTypeInfoFromInputs()`接口完成。该接口的入参为获取的泛型信息`OUT`，类间的继承关系`typeHierarchy`,生真正的输出类型`Tuple2<Long, JEvent>`的`TypeInformation`。过程如下：
首先根据`typeHierarchy`从底层检查泛型，找到与当前`OUT`相等的泛型，判断是否相等的条件是名称相等且`OUT`是否是在同一个类（基类、子类）上声明的泛型。如果是，返回`true`;否则，`false`。
```java
private static boolean sameTypeVars(Type t1, Type t2) {
		if (!(t1 instanceof TypeVariable) || !(t2 instanceof TypeVariable)) {
			return false;
		}
		return ((TypeVariable<?>) t1).getName().equals(((TypeVariable<?>) t2).getName())
				&& ((TypeVariable<?>) t1).getGenericDeclaration().equals(((TypeVariable<?>) t2).getGenericDeclaration());
	}
```
然后，如果是`true`,判断当前`OUT`是否是具体的类，如果是，则找到。
```java
if (sameTypeVars(curVarOfCurT, inTypeTypeVar)) {
  Type curVarType = ((ParameterizedType) curT).getActualTypeArguments()[paramIndex];

  // another type variable level
  if (curVarType instanceof TypeVariable<?>) {
    inTypeTypeVar = (TypeVariable<?>) curVarType;
  }
  // class
  else {
    return curVarType;
  }
}
```
据此，生成真正数据类型的`TypeInformation`

## 生成`DataStreamSource`

主要是new一个`DataStreamSource`，构造函数的入参是Stream的上下文信息`StreamExecutionEnvironment`、出流的`TypeInformation`信息、算子`StreamSource`,以及并发度和算子名称。继承关系如下图所示：    

![DataStreamSource](./pictures/DataStreamSource.png)     

在`SingleOutputDataStreamSource`中会根据算子名称、算子、输出数据类型（`TypeInformation`）以及算子并发度生成`SourceTransformation`。`SourceTransformation`的继承关系如图所示:      

![SourceTransformation](./pictures/SourceTransformation.png)

该数据结构继承`StreamTransformation`, `StreamTransformation`主要保存本拓扑中一个唯一的ID、 算子名称、输出数据类型、并发度、缓存超时时间等。`SourceTransformation`处具有`StreamTransformation`的数据结构外，还具有保存算子的数据结构，用于保存`source算子`
