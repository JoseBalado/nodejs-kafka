var Transform = require('stream').Transform;

var Kafka = require('node-rdkafka');

var stream = Kafka.KafkaConsumer.createReadStream({
  // 'metadata.broker.list': '172.17.0.1:9092', // only one Kafka broker
  'metadata.broker.list': '172.17.0.1:32768',
  'group.id': 'librd-test',
  'socket.keepalive.enable': true,
  'enable.auto.commit': false
}, {}, {
  topics: 'mywings-01',
  waitInterval: 0,
  objectMode: false
});

stream.on('error', function(err) {
  if (err) console.log(err);
  process.exit(1);
});

stream
  .pipe(process.stdout);

stream.on('error', function(err) {
  console.log(err);
  process.exit(1);
});

stream.consumer.on('event.error', function(err) {
  console.log(err);
})
