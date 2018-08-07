
const Kafka = require('node-rdkafka');

var consumer = new Kafka.KafkaConsumer({
  //'debug': 'all',
  //'metadata.broker.list': 'localhost:9092',
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
  'group.id': 'node-rdkafka-consumer-flow-example',
  'enable.auto.commit': false
}, {
  'auto.offset.reset': 'earliest' // consume from the start
});

var topicName = 'topic';

//logging debug messages, if debug is enabled
consumer.on('event.log', function(log) {
  console.log(log);
});

//logging all errors
consumer.on('event.error', function(err) {
  console.error('Error from consumer');
  console.error(err);
});

//counter to commit offsets every numMessages are received
var counter = 0;
var numMessages = 5;

consumer.on('ready', function(arg) {
  console.log('consumer ready.' + JSON.stringify(arg));

  consumer.subscribe([topicName]);
  //start consuming messages
  consumer.consume();
});
