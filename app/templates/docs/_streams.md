# <%= baseName %> Streams Development

This document is for the creation and development of a stream within the microservice. Note that this document is not intended to provide an in-depth tutorial. For details on leveraging Spring Streams please refer to the following documentation.

* http://docs.spring.io/spring-cloud-stream/docs/1.0.2.RELEASE/reference/htmlsingle/index.html

## Kinds Of Streams

Although the above documenation goes into details about the types of streams created, here is a very brief overview for those that just want to get started:

* Sink: A sink stream will be the listener to a streams topic.

* Source: The source, publisher, of a stream

* Processor: Both a sink and a source... generallly, you will sink (get) a message, manipulate it, and publish it as a source. 

## Create A Stream

Creating a stream in the application container is as simple as typing the following:

```
yo spring-rest:stream <STREAM_NAME>
```

You will need to answer a few questions at command line before the stream is generated for you.

TODO: Finish of this documentation.

