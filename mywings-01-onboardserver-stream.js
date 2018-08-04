const Kafka = require('node-rdkafka');

const stream = Kafka.Producer.createWriteStream({
  // 'debug' : 'all',
  'metadata.broker.list': 'localhost:9092',
}, {}, {
  topic: 'mywings-01'  
});

const topicName = 'mywings-01';

const maxMessages = 10;
for (var i = 0; i < maxMessages; i++) {
  const value = new Buffer.from(`${topicName}-log: ${i}\n`);
  stream.write(value);
}

stream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream');
  console.error(err);
})

