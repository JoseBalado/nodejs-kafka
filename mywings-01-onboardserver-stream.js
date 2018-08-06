const Kafka = require('node-rdkafka');

const stream = Kafka.Producer.createWriteStream({
  'debug' : 'all',
  // 'metadata.broker.list': '172.17.0.1:9092', // only one Kafka broker
  'metadata.broker.list': '172.17.0.1:32768',
  'dr_cb': true
}, {}, {
  topic: 'mywings-01'
});

const topicName = 'mywings-01';

stream.producer.on('ready', (value1, value2) => {
  console.log('Producer stream is ready:', value1, '\n', value2)
  /* This is equivalent to the previous two lines
  stream.producer.getMetadata({
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
})

const maxMessages = 10;
//for (var i = 0; i < maxMessages; i++) {
//  const value = new Buffer.from(`${topicName}-log: {"previousURL":"^","currentURL":"/wireless","currentParams":{},"timeStamp":"2018-06-19T12:38:0${i}.TZ-2"}`);
//  stream.write(value);
//}

stream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream');
  console.error(err);
})

stream.on('delivery-report', function(err, report) {
  console.log('delivery-report: ', JSON.stringify(report));
});

//  stream.consumer.queryWatermarkOffsets('mywings-01', 0, 5000, function(err, offsets) {
//    console.log('err:', err)
//    console.log('offsets:', offsets)
//  });
