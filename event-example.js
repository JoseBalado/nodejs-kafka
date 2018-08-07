const Kafka = require('node-rdkafka');

var producer = new Kafka.Producer({
  'client.id': 'my-client', // Specifies an identifier to use to help trace activity in Kafka
  'metadata.broker.list': '172.17.0.1:32768,172.17.0.1:32769,172.17.0.1:32770',
  //'metadata.broker.list': 'localhost:9092', // Connect to a Kafka instance on localhost
  'dr_cb': true // Specifies that we want a delivery-report event to be generated
});

// Poll for events every 100 ms
producer.setPollInterval(100);

producer.on('delivery-report', function(err, report) {
  // Report of delivery statistics here:
  //
  console.log(report);
});
