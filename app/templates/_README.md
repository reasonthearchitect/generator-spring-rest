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