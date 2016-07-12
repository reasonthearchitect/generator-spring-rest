#!/bin/sh

cd resource-<%= baseName %>

export TERM=${TERM:-dumb}

gradle -Dorg.gradle.native=false build

ls build/libs

cp build/libs/<%= baseName %>.jar ../resource-jar

cp Dockerfile ../resource-jar
