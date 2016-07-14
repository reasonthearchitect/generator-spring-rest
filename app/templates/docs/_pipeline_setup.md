# <%= baseName %> Pipeline Configuration

The generator has created a pipeline script for use with the Concourse CI server. It assumes some familiarity with Concourse Ci as well as its command line interface. For a great tutorial of these tools capabilities please see: https://github.com/starkandwayne/concourse-tutorial

Note that this is, for the most part, a one time event. General development need not use this section.

## Configure Project Secrets

You will need to have a valid DockerHub account to set up the pipeline or have a Docker Regestry V2 set up.

In order to ensure that the projects secrets remain secret, you will need to configure the `credentials.yml` file. If this file does not exists, create it in the root of the project.

Please note that the generated `.gitignore` has this file listed so it is never saved in the repo.

The file must contain the following:

```
docker-hub-email: EMAIL
docker-hub-username: USERNAME
docker-hub-api-key: DOCKER_IO_API_KEY
docker-hub-image-name: IMAGE_NAME

```

The settings are fairly straight forward... simply replace everything in CAPS with your own settings.

## Connect to the Server

For your convinience, this generator includes the fly command line script. It is found in the root package. 

From the projects root folder (replacing the <YOUR_*> vars), run the following:

```
./fly --target <YOUR_TARGET_NAME> login  --concourse-url <YOUR_CONCOURSE_URL>

```

## Load the Pipeline

Once you have updated the `credentials.yml` file and connexted to the Concourse CI server, you will upload and run the pipeline for the first time.

From the projects root folder (replacing the <YOUR_*> vars), run the following and follow the command prompts:

```
./fly sp -t <YOUR_TARGET_NAME> configure -c pipeline.yml -p <%= baseName %> --load-vars-from=credentials.yml

```

As pipelines, by default, are paused upon inception, you will need to unpause the pipeline. 

From the projects root folder (replacing the <YOUR_*> vars), run the following:

```
./fly -t <YOUR_TARGET_NAME> unpause-pipeline -p <%= baseName %>

```

Now you may navigate to the Concourse CI sever web site to see the pipeline running. Note that fly will dump the URL for your pipeline on the console, however, just in case, your pipeline can be found here:

```
<YOUR_CONCOURSE_URL>/pipelines/<%= baseName %>
```

## Destroy the Pipeline

Should you need to destroy the pipeline, from the projects root folder (replacing the <YOUR_*> vars), run the following:

```
./fly -t <YOUR_TARGET_NAME> destroy-pipeline -p <%= baseName %>
```