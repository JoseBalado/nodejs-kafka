var Transform = require('stream').Transform;

var Kafka = require('node-rdkafka');

var stream = Kafka.KafkaConsumer.createReadStream({
  // 'metadata.broker.list': '172.17.0.1:9092', // use when there is only one Kafka broker
  'debug': 'all',
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
  'group.id': 'librd-test',
  'socket.keepalive.enable': true,
  'enable.auto.commit': false
}, {
//  'auto.offset.reset': 'earliest' // consume from the start
}, {
  topics: 'mywings-01',
  waitInterval: 0,
  objectMode: false
});

stream.consumer.on('ready', (value1, value2) => {
  console.log('Producer stream is ready:', value1, '\n', value2)
  /* This is equivalent to the previous two lines
  stream.consumer.getMetadata({
      topic: 'mywings-01',
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
  stream.consumer.queryWatermarkOffsets('mywings-01', 0, 5000, (err, offsets) => {
    console.log('err:', err)
    console.log('offsets:', offsets)
  });
})

stream.on('error', function(err) {
  if (err) console.log(err);
  process.exit(1);
});

//stream
//  .pipe(process.stdout);

stream.on('data', function(data) {
  console.log('Got message')
  console.log(data.toString());
});

stream.consumer.on('event.error', function(err) {
  console.log('event.error', err);
})

