# Prerequisites
### Install Kafka with Docker
```
https://github.com/wurstmeister/kafka-docker
```

### node-rdkfafka for Linux depends on C/C++ rdkafka library that needs to be compiled. It has the following dependency
```
sudo apt-get install libssl-dev
```

## Initial set-up
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

### Show a lits of brokers
```
broker-list.sh
```

### Inside the Docker container, create a topic
```
kafka-topics.sh --create --topic mytopic --partitions 4 --zookeeper $ZK --replication-factor 1
```

### Show information about the topic 'mytopic'
```
$KAFKA_HOME/bin/kafka-topics.sh --describe --topic mytopic --zookeeper $ZK
```

## Create a consumer
### Launch a docker container where the consumer will be executed
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

### Inside the Docker container
```
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic=mytopic --bootstrap-server=172.17.0.1:9092 --from-beginning
```

### Launch the producer, setting 'HOST_IP' and 'ZK' varibles
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

## Create a producer
```
$KAFKA_HOME/bin/kafka-console-producer.sh --topic=mytopic --broker-list=`broker-list.sh`
```

### Send messages writing after the prompt `>` and pressing enter. The consumer will print the message
```
> hello
>
```




# Starting a cluster with three Kafka nodes
```
docker-compose up -d zookeeper
docker-compose up -d --scale kafka=3
```

### The following command sets the variable HOST_IP to 172.17.0.1 and ZK to 172.17.0.1:2181. HOST_IP is the IP of the Docker container network. '2181' is the default port for Zookeeper
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

### Inside the container, get a list of topics
```
kafka-topics.sh --zookeeper $ZK --list
```

### Show a lits of brokers. Note, if the script `start-kafka-shell.sh` is not passed the HOST_IP and ZK environment variables, only the ports are shown and this command will not work for consumer or producer: --bootstrap-server=\`broker-list.sh\`.
```
broker-list.sh
```

## Create a new topic
### Inside the Docker container, create a topic called 'mytopic'
```
kafka-topics.sh --create --topic mytopic --partitions 4 --zookeeper $ZK --replication-factor 2
```

### Show information about the topic 'mytopic'
```
$KAFKA_HOME/bin/kafka-topics.sh --describe --topic mytopic --zookeeper $ZK
```

## Create a consumer when there are multiple brokers
### Launch a docker container where the consumer will be executed
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

### Inside the Docker container, show information about the topic 'mytopic'
```
$KAFKA_HOME/bin/kafka-topics.sh --describe --topic mytopic --zookeeper $ZK
```

### Launch a consumer
```
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic=mytopic --bootstrap-server=`broker-list.sh` --from-beginning
```

### or use the IP and Port of one the brokers shown by 'broker-list.sh' command pass directly the result of 'broker-list.sh'
```
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic=mytopic --bootstrap-server=172.17.0.1:32768 --from-beginning
```

## Create a producer
### Start a docker container, setting 'HOST_IP' and 'ZK' varibles
```
./start-kafka-shell.sh 172.17.0.1 172.17.0.1:2181
```

### Launch the producer
```
$KAFKA_HOME/bin/kafka-console-producer.sh --topic=mytopic --broker-list=\`broker-list.sh\`
```

### Send messages writing after the prompt `>` and pressing enter. The consumer will print the message
```
> hello
>
```




# Notes
## Folder where all Kafka commands are stored
```
/opt/kafka/bin/
```

