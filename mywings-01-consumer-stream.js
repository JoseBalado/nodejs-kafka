const Kafka = require('node-rdkafka')
const Transform = require('stream').Transform


const topicName = 'mywings-01'

var stream = Kafka.KafkaConsumer.createReadStream({
  'debug': 'all',
  // 'metadata.broker.list': '172.17.0.1:9092', // use when there is only one Kafka broker
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
  'group.id': 'consumer-group',
  'socket.keepalive.enable': true,
  'enable.auto.commit': false
}, {
  'auto.offset.reset': 'earliest' // consume from the start
}, {
  topics: [topicName],
  waitInterval: 0,
  objectMode: false
});

stream.consumer.on('ready', (value1, value2) => {
  console.log('Producer stream is ready:', value1, '\n', JSON.stringify(value2, null, '\t'))
  /* This is equivalent to the previous two lines
  stream.consumer.getMetadata({
      topic: topicName,
      timeout: 10000
    }, function(err, metadata) {
      if (err) {
        console.error('Error getting metadata');
        console.error(err);
      } else {
        console.log('Got metadata');
        console.log(metadata);
      }
  })
  */
  stream.consumer.queryWatermarkOffsets(topicName, 0, 5000, (err, offsets) => {
    if(err) {
      console.log('err:', err)
    } else {
      console.log('offsets for', topicName, ':', offsets)
    }
  })
})

stream.on('error', function(err) {
  if (err) console.log(err);
  process.exit(1);
});

stream.on('data', data => {
  console.log('Got message')
  console.log(data.toString())
})

/* this is equivalent to `stream.on('data', data =>`
  stream
    .pipe(process.stdout);
*/

stream.consumer.on('event.error', function(err) {
  console.log('event.error', err);
})

