# TaskManager
> 刘新春 2016年12月1日

TaskManager主要用来执行Flink独立的任务，它实际上是一个actor，TaskManager主要有以下阶段组成：    
* "Waiting to be registered"    
 在该阶段，TaskManager周期性的向JobManager发送[[RegisterTaskManager]]消息，JobManager收到消息后反馈一个[[AcknowledgeRegistration]]消息作为响应。在收到该消息后，TaskManager停止发送注册消息，并根据JobManager的消息进行初始化。    


 * “Operational”    
 在这个阶段，TaskManager接收处理任务的消息，如[[SubmitTask]]、[[CancelTask]],[[FailTask]]。如果TaskManager与JobManager切断联系时间过长，TaskManager会回退到"Waiting to be registered"状态。
ActorAKKA
