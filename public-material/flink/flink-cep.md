# Flink CEP

flinkCEP是flink提供的一个*复杂事件处理* (Complex Event Processing)的库。它允许你能够在无边界的数据流上比较容易地检测出复杂事件的模式。复杂事件来源于匹配序列。这能够让你在数据流中快速地发现重要的价值所在。    
【注意】需要应用模式匹配的**DataStream**事件（events）是需要实现 *equals()* 和 *hashcode()* 方法的，因为这些方法用来比较和匹配事件。

#### Started   
#### The Pattern API  

- Detecting Patterns    
- Selecting from Patterns    
- Handling Timed Out Partial Patterns    

#### Examples ####

# Started

想要深入了解的话，最好是从一个简单的例子开始。接下来，你需要在你的工程pom.xml文件中添加对flinkCEP的依赖。   
```
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-cep_2.10</artifactId>
  <version>1.1.3</version>
</dependency>
```
```
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-cep-scala_2.10</artifactId>
  <version>1.1.3</version>
</dependency>
```
现在可以使用模式的API来运行你的第一个CEP程序：    
```
DataStream<Event> input = ...

Pattern<Event, ?> pattern = Pattern.begin("start").where(evt -> evt.getId() == 42)
    .next("middle").subtype(SubEvent.class).where(subEvt -> subEvt.getVolume() >= 10.0)
    .followedBy("end").where(evt -> evt.getName().equals("end"));

PatternStream<Event> patternStream = CEP.pattern(input, pattern);

DataStream<Alert> result = patternStream.select(pattern -> {
    return createAlertFrom(pattern);
});
```
```
val input: DataStream[Event] = ...

val pattern = Pattern.begin("start").where(_.getId == 42)
  .next("middle").subtype(classOf[SubEvent]).where(_.getVolume >= 10.0)
  .followedBy("end").where(_.getName == "end")

val patternStream = CEP.pattern(input, pattern)

val result: DataStream[Alert] = patternStream.select(createAlert(_))
```
注意到为了使程序看起来更紧凑，我们在程序中使用了*java* 8的 *lambda* 表达式。    

# The Pattern API

模式API允许你快速地定义复杂事件的模式。    

每一个模式都是由多个阶段或者状态组成。为了从一个状态跳转到下一个状态，用户需要指定条件。这些条件可以是一些连续事件条件或者一些过滤条件。    
每一个模式都是以一个初始状态开始：    
```
Pattern<Event, ?> start = Pattern.<Event>begin("start");
```
```
val start : Pattern[Event, _] = Pattern.begin("start")
```
每个状态必须要有一个唯一的名字用来标识将要发生的匹配事件。另外，我们也可以使用 *where* 方法在开始事件上添加过滤条件。    
```
start.where(new FilterFunction<Event>() {
    @Override
    public boolean filter(Event value) {
        return ... // some condition
    }
});
```
```
start.where(event => ... /* some condition */)
```
我们也可以使用 *subtype* 方法来限制到来的事件必须为初始事件（此处初始类型是 *Event*）的一种子类型。    
```
start.subtype(SubEvent.class).where(new FilterFunction<SubEvent>() {
    @Override
    public boolean filter(SubEvent value) {
        return ... // some condition
    }
});
```
```
start.subtype(classOf[SubEvent]).where(subEvent => ... /* some condition */)
```
正如我们看到的那样，*subtype* 条件也可以和 *filter* 条件结合起来一起使用。事实上，你可以通过 *where* 和 *subtype* 方法使用多个条件。这些条件是使用逻辑 **AND** 操作符结合起来的。    
接下来，我们可以追加下一个状态来检测复杂模式。我们可以通过模式来控制事件发生的连续性。    
严格的连续性意味着，两个事件必须直接地先后发生，中间不能发生其他的事件。严格的连续模式可以通过 *next* 方法来创建。    
```
Pattern<Event, ?> strictNext = start.next("middle");
```
```
val strictNext: Pattern[Event, _] = start.next("middle")
```
非严格的连续性意味着在两个匹配的事件中间允许发生其他的事件。非严格的连续性模式可以通过 *followby* 方法来创建。    
```
Pattern<Event, ?> nonStrictNext = start.followedBy("middle");
```
```
val nonStrictNext : Pattern[Event, _] = start.followedBy("middle")
```
我们也可以对模式施加一些约束使之有效。例如，可以通过使用 *within* 方法定义模式在10秒内发生才有效。    
```
next.within(Time.seconds(10));
```
```
next.within(Time.seconds(10))
```
| 模式操作     | 描述                                       |
| -------- | ---------------------------------------- |
| Begin    | 定义一个开始模式状态: ```val start = Pattern.begin[Event]("start") ``` |
| Next     | 追加新的模式状态,匹配事件需在前面匹配事件后紧接着发生。```val next = start.next("middle") ``` |
| followby | 追加新的模式状态，两个匹配的事件之间允许发生其他的事件 ```val followedBy = start.followedBy("middle") ``` |
| Where    | 在模式状态上定义过滤条件，只有符合条件的事件才能匹配上模式 ``` patternState.where(event => ... /* some condition */) ``` |
| Subtype  | 在模式状态上定义子类型条件，只有事件类型是定义的子类型才能匹配上模式 ```patternState.subtype(classOf[SubEvent]) ``` |
| Within   | 在匹配模式的事件序列上定义一个最大事件间隔，如果一个未完成的事件序列超过给定的时间，该事件将被丢弃 ```patternState.within(Time.seconds(10)) ``` |

## Detecting Pattern
为了应用模式产生事件流，你必须创建一个 **PatternStream**。给定一个输入流 *input* 和一个模式 *pattern*，你可以通过如下方式创建 **PatternStream**:    
```
val input : DataStream[Event] = ...
val pattern : Pattern[Event, _] = ...

val patternStream: PatternStream[Event] = CEP.pattern(input, pattern)
```
## Selecting from Patterns
一旦获取了一个 **PatternStream** 就可以通过 *select* 或者 *flatselect* 方法来对检测到的事件序列来进行选择并输出想要的结果。   
select方法要求实现 **PatternSelectFunction** 类。该类有一个 *select* 方法，该方法会在每一个匹配事件序列产生时被调用。它接收一个 *map* 作为参数，这个 *map* 里存储了匹配事件的 *string/event* 对,作为 *key* 的 *string* 就是前面定义的每个模式状态的名称，*select* 方法返回一个确定的结果。
```
class MyPatternSelectFunction<IN, OUT> implements PatternSelectFunction<IN, OUT> {
    @Override
    public OUT select(Map<String, IN> pattern) {
        IN startEvent = pattern.get("start");
        IN endEvent = pattern.get("end");
        return new OUT(startEvent, endEvent);
    }
}
```
**PatternFlatSelectFunction** 类与 **PatternSelectFunction** 比较类似，唯一的不同是，该类的的*select*方法可以返回任意数量的结果数据。为了实现这点，*select*方法接收一个*collector*作为参数，专门用来存放输出的元素。    
```
class MyPatternFlatSelectFunction<IN, OUT> implements PatternFlatSelectFunction<IN, OUT> {
    @Override
    public void select(Map<String, IN> pattern, Collector<OUT> collector) {
        IN startEvent = pattern.get("start");
        IN endEvent = pattern.get("end");

        for (int i = 0; i < startEvent.getValue(); i++ ) {
            collector.collect(new OUT(startEvent, endEvent));
        }
    }
}
```
## Handing Time Out Partial Patterns
任何时候，一旦通过使用*within*关键字让模式具有一个有限长度的窗口，因为有可能发生超过窗口长度的事件，这时就需要丢弃部分事件模式。为了设置对这种超时的处理方式，*select*和*flatselect* API允许指定一个超时*handler*的调用方式。对每一个超时的部分事件模式，超时*handler*都会被调用，超时*handler*接收两个参数，一个是已经匹配到的所有部分模式事件，另一个是检测到超时时的时间戳。    
为了处理这种部分模式，*select*和*flatselect* API提供了重载版本，第一个参数是一个超时函数，第二个参数是一个选择函数。这个超时函数有两个参数，第一个参数是个map，里面存放了超时时已经匹配上的部分模式的*string/event*对，第二个参数是超时发生时的时间戳。第一个参数的*string*是匹配上的模式状态由用户定义的名称。超时函数每次调用会返回一个确定的结果。超时函数的返回类型可以与*select*函数的返回类型不一。超时事件与*select*事件被包装在*Left*和*right*里，因此，输出结果的数据流类型是*Either*类型的*DataStream*。    
```
val patternStream: PatternStream[Event] = CEP.pattern(input, pattern)

DataStream[Either[TimeoutEvent, ComplexEvent]] result = patternStream.select{
    (pattern: mutable.Map[String, Event], timestamp:Long)=>TimeoutEvent()
} {
    pattern: mutable.Map[String, Event] => ComplexEvent()
}
```
*flatSelect* API与 *select* API类似，也提供了这样的一个重载版本，第一个参数是个超时函数，第二个参数是选择函数，与 *select* API不同的是，*flatSelect* 函数调用时参数有一个*Collector*，这个*Collector*用来存放任意数量的结果数据。    
```
val patternStream: PatternStream[Event] = CEP.pattern(input, pattern)

DataStream[Either[TimeoutEvent, ComplexEvent]] result = patternStream.flatSelect{
    (pattern: mutable.Map[String, Event], timestamp: Long, out: Collector[TimeoutEvent]) =>
        out.collect(TimeoutEvent())
} {
    (pattern: mutable.Map[String, Event], out: Collector[ComplexEvent]) =>
        out.collect(ComplexEvent())
}
```

# Examples
下面的例子在一个*keyed*数据流**Event**上检测模式 start->middle(name="error") -> end(name="critical")。event是由id作为key分区的，模式要求在10秒内发生。整个处理过程是以事件时间为基础的。    
java:
```
StreamExecutionEnvironment env = ...
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime);

DataStream<Event> input = ...

DataStream<Event> partitionedInput = input.keyBy(new KeySelector<Event, Integer>() {
	@Override
	public Integer getKey(Event value) throws Exception {
		return value.getId();
	}
});

Pattern<Event, ?> pattern = Pattern.<Event>begin("start")
	.next("middle").where(new FilterFunction<Event>() {
		@Override
		public boolean filter(Event value) throws Exception {
			return value.getName().equals("error");
		}
	}).followedBy("end").where(new FilterFunction<Event>() {
		@Override
		public boolean filter(Event value) throws Exception {
			return value.getName().equals("critical");
		}
	}).within(Time.seconds(10));

PatternStream<Event> patternStream = CEP.pattern(partitionedInput, pattern);

DataStream<Alert> alerts = patternStream.select(new PatternSelectFunction<Event, Alert>() {
	@Override
	public Alert select(Map<String, Event> pattern) throws Exception {
		return createAlert(pattern);
	}
});
```
scala:
```
val env : StreamExecutionEnvironment = ...
env.setStreamTimeCharacteristic(TimeCharacteristic.EventTime)

val input : DataStream[Event] = ...

val partitionedInput = input.keyBy(event => event.getId)

val pattern = Pattern.begin("start")
  .next("middle").where(_.getName == "error")
  .followedBy("end").where(_.getName == "critical")
  .within(Time.seconds(10))

val patternStream = CEP.pattern(partitionedInput, pattern)

val alerts = patternStream.select(createAlert(_)))
```