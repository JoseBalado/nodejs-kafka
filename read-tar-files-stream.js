const Kafka = require('node-rdkafka')
const fs = require('fs');

const topicName = 'log-tar-files'
const stream = Kafka.Producer.createWriteStream({
  'debug' : 'all',
  //'metadata.broker.list': '172.17.0.1:9092', // only one Kafka broker
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
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
const fileStream = fs.createReadStream('logs/TravelService_faff39a6-dcbd-4a5c-b7a0-689990ff8f04_QS_20180330062501_frontend-stats.tar.gz')

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

stream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream')
  console.error(err);
})

