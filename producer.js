const kafka = require('kafka-node')
const Producer = kafka.Producer
const KeyedMessage = kafka.KeyedMessage
const client = new kafka.Client()
const producer = new Producer(client)
const km = new KeyedMessage('key', 'message')
const payloads = [
        { topic: 'backoffice', messages: '{ text: "fourth color is yellow" }', partition: 0 },
        { topic: 'backoffice', messages: '{ text: "fifth color is green" }', partition: 0 }
     
      ]

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data)
        process.exit(0)
    })
})
 
producer.on('error', function (err) {
  console.log('ERROR ', err.toString())
})

