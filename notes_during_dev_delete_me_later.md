eval $(docker-machine env default)

docker-machine create --driver virtualbox default


docker run --name st-kafka -p 2181:2181 -p 9092:9092 -e ADVERTISED_HOST=`docker-machine ip default` -e ADVERTISED_PORT=9092 -d spotify/kafka

docker exec -ti st-kafka bash -c "/opt/kafka_*/bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic testy"


docker exec -ti st-kafka bash -c "/opt/kafka_*/bin/kafka-topics.sh --list --zookeeper localhost:2181"

docker exec -ti st-kafka bash -c "/opt/kafka_*/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test"

docker exec -ti st-kafka bash -c "/opt/kafka_*/bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginning"


Basic Read Me for <%= baseName %>

See talk on https://www.youtube.com/watch?v=MyW2x35mTF8 for ConcourseCI and building an infrustructure pipeline.

ConcourseCI on AWS: https://github.com/starkandwayne/concourse-bosh-lite/tree/master/concourse

Bosh DataPipeline Genesis: https://github.com/starkandwayne/genesis


fly --target bosh-lite login  --concourse-url http://54.175.72.65:8080

tutorial: https://github.com/starkandwayne/concourse-tutorial#04---basic-pipeline



ssh -i /home/ubuntu/.ssh/id_rsa ec2-user@ec2-107-21-196-105.compute-1.amazonaws.com

Your identification has been saved in /home/ubuntu/.ssh/id_rsa.
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub

CONCOURSE_LITE=https://github.com/concourse/concourse-lite


//change the credentials file.
./fly sp -t aws configure -c pipeline.yml -p <%= baseName %> --load-vars-from=credentials.yml

./fly -t aws unpause-pipeline -p <%= baseName %>

./fly -t aws destroy-pipeline -p <%= baseName %>
