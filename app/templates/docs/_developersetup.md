# <%= baseName %> Developer Setup

This section will guide the user through the set up and configuration of their environment.

## Getting Docker Up & Running

In order to leverage docker locally, you will need to install VirtualBox and Docker:

*[VirtualBox](https://www.virtualbox.org/wiki/Downloads)
*[Docker for Mac](https://docs.docker.com/engine/installation/mac/)
*[Docker for Windows](https://docs.docker.com/engine/installation/windows/)


## The Docker Compose Script

To get Kafka up an running in docker with a compose script... and zookeeper, etc, you will need to run the following command:

```
docker-compose -f app/templates/docker-kafka/docker-compose-single-broker.yml up
```

## Stopping the Containers For A Fresh Restart

Sometimes you will need to stop, and remove the docker containers in order to refresh the development environment. 

The following command line argumenst will purge the intances from the system.

```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)
```


