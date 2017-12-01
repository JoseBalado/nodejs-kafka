const kafka = require('kafka-node')
const Consumer = kafka.Consumer
const client = new kafka.Client()
const consumer = new Consumer(client,
        [{ topic: 'backoffice', offset: 0}],
        [
          {
              autoCommit: false
          },
          // options = {
          //   fromOffset: 'latest'
          // }
        ]
    )

consumer.on('message', function (message) {
    console.log(message);
})

consumer.on('error', function (err) {
    console.log('Error:',err);
})

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
})

