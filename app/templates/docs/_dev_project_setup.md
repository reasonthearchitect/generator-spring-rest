# <%= baseName %> Developer Project Setup

## Assumption

It is assumed that you have already completed the [Developer Environment Setup Section](dev_env_setup.md).

You know how to clone a project from a git repo.

## Clone The Project

Clone the project locally.

## Setup Kafka

Within the cloned project directory, you will first need to install Kafka locally. Note that leverages Docker-compose so that the setup is extremely simple... For detailed instuctions please see the following:

* [Kafka Cluster](kafka_setup.md)

## Windows vs *NIX

Note tha the following section uses the `./gradlew` command. If you are a Windows user, please substitute this for the 'gradlew.bat'

## Building And Runnning The Project

Before mounting the project into our IDE of choice, it is recommended to first build and run the project to ensure that no issues are encountered. In order to do this, from the projects root directory, simple type the following:

```
./gradlew build bootrun
```

### Validate That It Worked

If this is successful, to ensure that everything went ok, enter the following URL in your browser:

```
http://localhost:8080/health
```

Tbe page should display a simple JSON message about the containers health. Additionally, you can also browse to the following addressed for additional endpoint information:

```
http://localhost:8080/metrics

http://localhost:8080/api/v2/apidocs
```

### Before You Continue

Finally, ensure that you `kill` the container by pressing `Cntl + c` to ensure you stop the container before continuing.

## Mounting The Project Into Your IDE

```
This section does not cover NetBeans currently. 
```

The project has been configured to accomidate both IDEA and Eclipse users project creation from the command line.

### Convention

All commands are executed from the projects root directory.

### IntelliJ IDEA

In order to create the appropriate file, simply run the following command. Note that first time users need not run `cleanidea`, however, it is detailed in order to ensure any reloading is successful:

```
./gradlew cleanIdea idea
```

### Eclipse

In order to create the appropriate file, simply run the following command. Note that first time users need not run `cleanEclipse`, however, it is detailed in order to ensure any reloading is successful:

```
./gradlew cleanEclipse eclipse
```

### Load It Up

Once gradke has finished (note that all the source will also be downloaded so be patient), you will be able to load it into your IDE.

### Run It In The IDE

Navigate, in the IDE, to the `Application.java` file in your IDE. 

Right click on the `Application.java` file and select `run`.

Once SpringBoot has loaded you will be able to open your browser and navigate to the following URL's as listed above:

```
http://localhost:8080/health

http://localhost:8080/metrics

http://localhost:8080/api/v2/apidocs
```

## Finally

Happy hacking!
