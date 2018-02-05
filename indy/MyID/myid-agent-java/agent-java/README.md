# Sovrin Agent

Sovrin Agent REST API implemented in Kotlin and Java Spark using Indy SDK Java Wrapper

## Getting Started

These instructions will get you a copy of the project up and running on your linux machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

```bash
sudo apt-get install openjdk-8-jdk maven
```

### Deployment


### Run test nodes

```bash
docker build -f github.com/hyperledger/indy-sdk/blob/master/ci/indy-pool.dockerfile -t indy_pool .
docker run -it -p 9701-9709:9701-9709 indy_pool
```

### Build your own clone of the SDK

```bash
cd ./indy-sdk/libindy
cargo build
mvn clean install
```

Or download precompiled vesion from the Indy build repo:

### Include the binary in the project

```bash
cp libindy.so target/
```

### Run the API

```bash
cd target
java -jar myid-agent-1.0-jar-with-dependencies.jar
```

## Running the tests

```bash
mvn test
```

## API Functionality

http://instance.address/schema

This url documents the methods and functionality provided by the SDK.

## Built With

* [Indy SDK](https://github.com/hyperledger/indy-sdk) - The official SDK for Hyperledger Indy
* [Spark Java](http://whttp://sparkjava.com/) - A micro framework for creating web applications in Kotlin and Java 8
* [Maven](https://maven.apache.org/) - Dependency Management
