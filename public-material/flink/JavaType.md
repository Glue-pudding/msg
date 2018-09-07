# Java Type详解
>刘新春     
>2016年12月20日     

*说明*    
*在Flink中生成`TypeInformation`时会探测输出数据的具体类型，使用了Java中的`Type`，在此转载介绍。借花献佛，具体参考以下链接。*    

*http://loveshisong.cn/%E7%BC%96%E7%A8%8B%E6%8A%80%E6%9C%AF/2016-02-16-Type%E8%AF%A6%E8%A7%A3.html*       

*版权归以上链接作者所有，仅供学习，转载请注明出处*

## 反射相关接口  

![Type](./pictures/type.png)    

## `Type`    

`Type`是所有类型的父接口，如原始类型(raw types,对应Class)、参数化类型(parameterized types,对应ParameterizedType)、数组类型(array types,对应GenericArrayType)、类型变量(type variables,对应TypeVariable)和基本(原生)类型(primitive types,对应Class)，子接口有`ParameterizedType`,`TypeVariable<D>`,`GeneraicArrayType`,`WildcardType`，实现类有`Class`。

## `ParmeterizedType`   

具体的泛型类型，如Map<Integer, String>    
有如下方法：    

* `Type getRawType()`: 返回承载该泛型类型信息的对象，如上面的那个`Map<Integer, String>`,承载泛型信息的对象是`Map`;
* `Type[] getActualTypeArguments()`: 返回实际泛型类型列表，如上面的例子中`Map<Integer, String>`,会返回实际泛型列表中的两个元素`Integer`和`String`    
* `Type getOwnerType()`: 返回谁的member.

```java
public class TestMain {

    Map<Integer, String> map;
    public static void main(String[] args) throws Exception{
        Field f = TestMain.class.getDeclaredField("map");
        System.out.println(f.getGenericType());
        System.out.println(f.getGenericType() instanceof ParameterizedType);
        ParameterizedType pType = (ParameterizedType)f.getGenericType();
        System.out.println(pType.getRawType());
        for(Type type : pType.getActualTypeArguments()){
            System.out.println(type);
        }
        System.out.println(pType.getOwnerType());
    }
}
```
输出结果:
```java
java.util.Map<java.lang.Integer, java.lang.String>
true
interface java.util.Map
class java.lang.Integer
class java.lang.String
null
```

## `TypeVariable`    

类型变量，泛型信息在编译时会被转换为一个特定的类，而`TypeValue`就是用来反应在JVM编译该泛型前的信息。声明为:
```java
public interface TypeVariable<D extends GenericDeclaration> extends Type
```
即：内部用到了与`GenericDeclaration`相关的变量。`TypeVariable`可能指`GenericDeclaration`中声明的`<T>`和`<C extends Collection>`这些东西中的`T`和`C`。具有如下方法：    
* `Type[] getBounds()`: 获取类型变量的上边界，若未明确声明上边界则默认为`Object`    
* `D getGenericDeclaration()` : 获取声明该类型的变量实体    
* `String getName()` : 获取在源码定义时的名称    

注意：    

* 类型变量在定义的时候只能使用extends进行(多)边界限定, 不能用super;
* 为什么边界是一个数组? 因为类型变量可以通过&进行多个上边界限定，因此上边界有多个

```java
public class TestMain<K extends Comparable & Serializable, V> {

    K key;
    V value;

    public static void main(String[] args) throws Exception {

        Field fk = TestMain.class.getDeclaredField("key");
        Field fv = TestMain.class.getDeclaredField("value");

        System.out.println(fk.getGenericType() instanceof TypeVariable);
        System.out.println(fv.getGenericType() instanceof  TypeVariable);
        for(Type type : TestMain.class.getTypeParameters()){
            System.out.println(type);
        }
        System.out.println("GenericType:");
        TypeVariable keyType = (TypeVariable)fk.getGenericType();
        TypeVariable valueType = (TypeVariable)fv.getGenericType();

        System.out.println(keyType.getName());
        System.out.println(valueType.getName());

        System.out.println(keyType.getGenericDeclaration());
        System.out.println(valueType.getGenericDeclaration());

        System.out.println("K的上界：");
        for (Type type : keyType.getBounds()){
            System.out.println(type);
        }

        System.out.println("V的上界：");
        for (Type type : valueType.getBounds()){
            System.out.println(type);
        }
    }
}
```
输出结果：    
```java
true
true
K
V
GenericType:
K
V
class com.huawei.rt.checkpoint.TestMain
class com.huawei.rt.checkpoint.TestMain
K的上界：
interface java.lang.Comparable
interface java.io.Serializable
V的上界：
class java.lang.Object
```

## `GenericArrayType`   

泛型数组，组成数组的元素中有泛型则实现该接口，他的组成元素是`ParameterizedType`或`TypeVariable`类型，他只有一个方法：    
* `Type getGenericComponentType()`: 返回数组的组成对象，即被JVM编译后实际的对象.    

```java
public class TestMain<T> {

    public static void main(String[] args) throws Exception{

        Method method = Test.class.getDeclaredMethods()[0];
        System.out.println(method);

        Type[] types = method.getGenericParameterTypes();
        for(Type type : types){
            System.out.println(type instanceof GenericArrayType);
        }

    }
}

class Test<T> {
    public void show(List<String>[] pTypeArray, T[] vTypeArray, List<String> list, String[] Strings, int[] ints){

    }
}
```

* 第一个参数`List<String>[]`的组成元素`List<String>`是`ParameterizedType`类型，打印结果是`true`    
* 第二个参数`T[]`的组成元素`T`是`TypeVariable`类型，打印结果为`true`    
* 第三个参数`List<String>`不是数组，打印结果为`false`    
* 第四个参数`String[]`的组成元素`String`是普通对象，没有泛型，打印结果为`false`    
* 第五个参数`int[] pTypeArray`的组成元素，`int`是原生类型，也没有泛型，打印结果为`false`

## `WildcardType`    
该接口表示通配符泛型，比如`? extends Number`和`? super Integer`, 它具有如下方法：    
* `Type[] getUpperBounds()`: 获取泛型变量的上界    
* `Type[] getLowerBounds()`: 获取泛型变量的下界    

注意：
* 现阶段通配符只接受一个上边界或下边界，返回数组是为了以后扩展，实际上现在返回的数组的大小为1    

```java
public class TestMain {

    private List<? extends Number> a;
    private List<? super Integer> b;

    public static void main(String[] args) throws Exception{
        Field fieldA = TestMain.class.getDeclaredField("a");
        Field fieldB = TestMain.class.getDeclaredField("b");

        ParameterizedType pTypeA = (ParameterizedType) fieldA.getGenericType();
        ParameterizedType pTypeB = (ParameterizedType) fieldB.getGenericType();

        System.out.println(pTypeA.getActualTypeArguments()[0] instanceof WildcardType);
        System.out.println(pTypeA.getActualTypeArguments()[0] instanceof  WildcardType);

        WildcardType wTypeA = (WildcardType) pTypeA.getActualTypeArguments()[0];
        WildcardType wTypeB = (WildcardType) pTypeB.getActualTypeArguments()[0];

        System.out.println(wTypeA);
        System.out.println(wTypeB);

        System.out.println(wTypeA.getUpperBounds()[0]);
        System.out.println(wTypeB.getLowerBounds()[0]);

    }
  }
```
运行结果：

```java
true
true
? extends java.lang.Number
? super java.lang.Integer
class java.lang.Number
class java.lang.Integer

```

## `Type`及其子接口的来历

### 泛型出现之前的类型

没有泛型的时候，只有原始类型。此时，所有的原始类型都通过字节码文件类Class类进行抽象。Class类的一个具体对象就代表一个指定的原始类型。

### 泛型出现之后的类型

泛型出现之后，扩充了数据类型。从只有原始类型扩充了参数化类型、类型变量类型、限定符类型 、泛型数组类型。

### 与泛型有关的类型不能和原始类型统一到Class的原因

* 产生泛型擦除的原因    
原始类型和新产生的类型都应该统一成各自的字节码文件类型对象。但是由于泛型不是最初Java中的成分。如果真的加入了泛型，涉及到JVM指令集的修改，这是非常致命的。

* Java中如何引入泛型    
为了使用泛型又不真正引入泛型，Java采用泛型擦除机制来引入泛型。Java中的泛型仅仅是给编译器javac使用的，确保数据的安全性和免去强制类型转换的麻烦。但是，一旦编译完成，所有的和泛型有关的类型全部擦除。

* Class不能表达与泛型有关的类型    
因此，与泛型有关的参数化类型、类型变量类型、限定符类型 、泛型数组类型这些类型编译后全部被打回原形，在字节码文件中全部都是泛型被擦除后的原始类型，并不存在和自身类型对应的字节码文件。所以和泛型相关的新扩充进来的类型不能被统一到Class类中。

* 与泛型有关的类型在Java中的表示     
为了通过反射操作这些类型以迎合实际开发的需要，Java就新增了`ParameterizedType`, `TypeVariable<D>`, `GenericArrayType`, `WildcardType`几种类型来代表不能被归一到Class类中的类型但是又和原始类型齐名的类型。

* 引入`Type`的原因
为了程序的扩展性，最终引入了Type接口作为Class和`ParameterizedType`, `TypeVariable<D>`, `GenericArrayType`, `WildcardType`这几种类型的总的父接口。这样可以用`Type`类型的参数来接受以上五种子类的实参或者返回值类型就是Type类型的参数。统一了与泛型有关的类型和原始类型Class

* `Type`接口中没有方法的原因
从上面看到，`Type`的出现仅仅起到了通过多态来达到程序扩展性提高的作用，没有其他的作用。因此Type接口的源码中没有任何方法。
