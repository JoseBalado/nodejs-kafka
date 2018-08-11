const Kafka = require('node-rdkafka')
const { pipeline } = require('stream')

const sourceTopic = 'mywings-01'
const destinationTopic = 'mywings-01-utc'

const readStream = Kafka.KafkaConsumer.createReadStream({
  'debug': 'all',
  // 'metadata.broker.list': '172.17.0.1:9092', // use when there is only one Kafka broker
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
  'group.id': 'consumer-group',
  'socket.keepalive.enable': true,
  'enable.auto.commit': false
}, {
  'auto.offset.reset': 'earliest' // consume from the start
}, {
  topics: [sourceTopic],
  waitInterval: 0,
  objectMode: false
});

const writeStream = Kafka.Producer.createWriteStream({
  'debug' : 'all',
  //'metadata.broker.list': '172.17.0.1:9092', // only one Kafka broker
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
  'dr_cb': true  //delivery report callback, doesn't seem to work
}, {}, {
  topic: destinationTopic
});

readStream.consumer.on('ready', (value1, value2) => {
  console.log('Producer stream is ready:', value1, '\n', JSON.stringify(value2, null, '\t'))
  /* This is equivalent to the previous two lines
  stream.consumer.getMetadata({
      topic: sourceTopic,
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
  readStream.consumer.queryWatermarkOffsets(sourceTopic, 0, 5000, (err, offsets) => {
    if(err) {
      console.log('err:', err)
    } else {
      console.log('offsets for', sourceTopic, ':', offsets)
    }
  })
})

readStream.on('error', function(err) {
  if (err) console.log(err);
  process.exit(1);
});

readStream.on('data', data => {
  console.log('Got message')
  writeStream.write(new Buffer.from(data.toString().replace(/TZ[+-][0-9]{0,2}/g, "000Z")))
})

/* this is equivalent to `stream.on('data', data =>`
  stream
    .pipe(process.stdout);
*/

readStream.consumer.on('event.error', function(err) {
  console.log('event.error', err);
})

