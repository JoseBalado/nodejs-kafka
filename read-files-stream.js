const Kafka = require('node-rdkafka')
const fs = require('fs');

const topicName = 'log-files'
const stream = Kafka.Producer.createWriteStream({
  'debug' : 'all',
  //'metadata.broker.list': '172.17.0.1:9092', // only one Kafka broker
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
  'dr_cb': true  //delivery report callback, doesn't seem to work
}, {}, {
  topic: topicName
});


stream.producer.on('ready', (value1, value2) => {
  console.log('Producer stream is ready:', value1, JSON.stringify(value2, null, '\t'))
  /* This is equivalent to the previous two lines
  stream.producer.getMetadata({
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
  stream.producer.queryWatermarkOffsets(topicName, 0, 5000, (err, offsets) => {
    if(err) {
      console.log('err:', err)
    } else {
      console.log('offsets for', topicName, ':', offsets)
    }
  })
})


// Store file data chunks in this array
const chunks = [];

// Read file into stream.Readable
const fileStream = fs.createReadStream('logs/0e50c350f704b1771a8b706f2c946eba_linux_Data_log-2018-04-05T08-13-09TZ+0.txt')

// An error occurred with the stream
fileStream.once('error', (err) => {
  // Be sure to handle this properly!
  console.error(err)
})

// Data is flushed from fileStream in chunks,
// this callback will be executed for each chunk
fileStream.on('data', (chunk) => {
  chunks.push(chunk); // push data chunk to array
  // We can perform actions on the partial data we have so far!
})

// File is done being read
fileStream.once('end', () => {
  // create the final data Buffer from data chunks;
  stream.write(Buffer.concat(chunks))
  // Of course, you can do anything else you need to here, like emit an event!
})

//readStream.on('data', data => {
//  console.log('Got message')
//  writeStream.write(Buffer.from(data.toString().replace(/TZ[+-][0-9]{0,2}/g, "000Z")))
//})

//const maxMessages = 10
//for (var i = 0; i < maxMessages; i++) {
//  const value = new Buffer.from(`{"previousURL":"^","currentURL":"/wireless","currentParams":{},"timeStamp":"2018-06-19T12:38:0${i}.TZ-2"}`)
//  stream.write(value)
//}

stream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream')
  console.error(err);
})

// doesn't seem to work
stream.on('delivery-report', function(err, report) {
  console.log('delivery-report: ', JSON.stringify(report))
});

