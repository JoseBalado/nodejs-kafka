# Prerequisites
### Install Kafka with Docker
```
https://github.com/wurstmeister/kafka-docker
```

### node-rdkfafka for Linux depends on C/C++ rdkafka library that needs to be compiled. It has the following dependency
```
sudo apt-get install libssl-dev
```

### Alternatively install it from the repository
```
sudo apt-get install librdkafka1 librdkafka-dev
```

### Get the latest version of librdkafka library
[syslogng-kafka](http://syslogng-kafka.readthedocs.io/en/latest/installation_librdkafka.html)


# Initial set-up
### In the docker-compose yml files substitute the IP in 'KAFKA_ADVERTISED_HOST_NAME' by the IP of your Docker interface

### Start a single broker
```
docker-compose -f docker-compose-single-broker.yml up
```

#### Starting a cluster with three Kafka nodes
```
docker-compose up -d zookeeper
docker-compose up -d --scale kafka=3
```

### Alternatively this will start start one Zookeeper instance and and three Kafka brokers with these fixed ports: 172.17.0.1:32769, 172.17.0.1:32770, 172.17.0.1:32768 
### Read the docker file `docker-3brokers.yml` for more information about configuration options
```
docker-compose -f docker-3brokers.yml up
```

# Managing topics
## Start a Kafka shell
### The following command sets the variable HOST_IP to 172.17.0.1 and ZK to 172.17.0.1:2181. HOST_IP is the IP of the Docker container network. '2181' is the default port for Zookeeper
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

### Show the value of the ZK variable
```
echo $ZK
```

### Now, inside this new running container, list all the topics
```
kafka-topics.sh --zookeeper $ZK --list
```

### Show a lits of brokers. Note, if the script `start-kafka-shell.sh` is not passed the HOST_IP and ZK environment variables, only the ports are shown and this command will not work for consumer or producer: --bootstrap-server=\`broker-list.sh\`.
```
broker-list.sh
```


## Create a new topic
### Inside the Docker container, create a topic with a replication factor of 3, this needs at least 3 Kafka brokers
```
kafka-topics.sh --create --topic mytopic --partitions 4 --zookeeper $ZK --replication-factor 3
```

### Show information about the topic 'mytopic'
```
$KAFKA_HOME/bin/kafka-topics.sh --describe --topic mytopic --zookeeper $ZK
```
## Create a producer
### Start a docker container, setting 'HOST_IP' and 'ZK' variables
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

### Launch the producer
```
$KAFKA_HOME/bin/kafka-console-producer.sh --topic=mytopic --broker-list=`broker-list.sh`
```

### Send messages writing after the prompt `>` and pressing enter. The consumer will print the message
```
> hello
>
```


## Create a consumer
### Launch a docker container where the consumer will be executed
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

### Now, inside the Docker container, launch a consumer
```
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic=mytopic --bootstrap-server=`broker-list.sh` --from-beginning
```

### or use the IP and Port of one the brokers shown by 'broker-list.sh' command pass directly the result of 'broker-list.sh'
```
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic=mytopic --bootstrap-server=172.17.0.1:32768 --from-beginning
```


### Delete a topic
```
kafka-topics.sh --zookeeper $ZK --delete  --topic mytopic
```




# Notes
## Folder where all Kafka commands are stored
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
/opt/kafka/bin/
```

## Retain all topics forever
(https://stackoverflow.com/questions/39735036/make-kafka-topic-log-retention-permanent)
```
If you want to retain all topics forever, you can set both log.retention.hours and log.retention.bytes to -1.
```

