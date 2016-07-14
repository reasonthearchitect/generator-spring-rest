# <%= baseName %> Kafka Setup

This section will guide the user through the set up and configuration of their environment.

## Getting Docker Up & Running

In order to leverage docker locally, you will need to install VirtualBox and Docker:

*[VirtualBox](https://www.virtualbox.org/wiki/Downloads)

*[Docker for Mac](https://docs.docker.com/engine/installation/mac/)

*[Docker for Windows](https://docs.docker.com/engine/installation/windows/)


## The Docker Compose Script

To get Kafka up an running in docker with a compose script... and zookeeper, etc, you will need to run the following command:

```
docker-compose -f docker-kafka/docker-compose-single-broker.yml up
```

## Testing The Setup

```
Note that you only need to do this if you are playing with Mac from the command line. If you are getting ready to jump into the project you need not bother.
```

Once docker has started, you will need to test the set up of the system.

By default, the instance has set up a queue called 'test'

### Install

In order to test the system, you will need to install the kafka distribution 0.10.0 as well as Scala. The following links are to the distributions for this system:

Scala:

* [For Mac Users](http://sourabhbajaj.com/mac-setup/Scala/README.html)

* [For Windows Users](http://www.scala-lang.org/download/install.html)

Kafka:

* [kafka with scala v2.11](http://kafka.apache.org/downloads.html)

### Test

```
Note that the following has been tested on Mac... You may need to change the '*.sh' for '*.bat' on windows.
```

You will need to open TWO 2 command prompt into the directory you have downloaded Kafka. For example, on my Mac I will do the followng:

```
cd ~/dev/tools/kafka_2.11-0.10.0.0
```


In the first command prompt, to see that the 'test' kafka instance is available, type the following:

```
bin/kafka-topics.sh --list --zookeeper localhost:2181
```

You should see the output:

```
test
```

Again in the first prompt, type the following:

```
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test
```

From here you can type something into the shell and hit enter... do as many messages as you would like.

Next, in the second command prompt window, type the folllowing to see the messages passed through kafka.

```
bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginning
```

You should see the output that you typed into the first window...

Togle between the windows and keep adding messages to see it in live stream.

## Stopping the Containers For A Fresh Restart

Sometimes you will need to stop, and remove the docker containers in order to refresh the development environment. 

The following command line argumenst will purge the intances from the system.

```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
```


