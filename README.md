## [More documentation](https://bertrandszoghy.wordpress.com/2017/06/27/nodejs-querying-messages-in-apache-kafka/)

### start Zookeeper
./bin/zookeeper-server-start.sh ./config/zookeeper.properties

### start Kafka broker
./bin/kafka-server-start.sh ./config/server.properties

### Create a topic
./bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic backoffice

### List topics
./bin/kafka-topics.sh --list --zookeeper localhost:2181


## Produce and consume topics using the Kafka shell script
### Create a new topic
./bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic mytopic
### Produce a message in the topic using the Kafka shell script
./bin/kafka-console-producer.sh --broker-list localhost:9092 --topic mytopic

#### Then introduce two texts fro this message, separate both lines hitting enter
Read clients  
Read TV Shows

#### Leave the prompt open

### Consume the message in the topic using the Kafka shell script
./bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic mytopic --from-beginning

### The first two messages are listed while the prompt remains open

# Install Kafka with Docker
https://github.com/wurstmeister/kafka-docker

# Install rdkfafka Linux
sudo apt-get install libssl-dev

# Starting Zookeeper and one Kafka Broker
docker-compose -f docker-compose-single-broker.yml up -d


# Starting Zookeeper and three Kafka Broker
## Investigate the proper configuration of docker-compose.yml to allow connection to a cluster of Kafka brokers
docker-compose up -d zookeeper  
docker-compose up --scale kafka=3


# Enter in a container:
./start-kafka-shell.sh

## Show Kafka commands inside the container
kafka + tab, show all possible scripts

## Folder where all Kafka commands are stored
/opt/kafka/bin/

