---
date: 2016-09-13T09:00:00+00:00
title: Vamp binaries
---
This page will explain the options to get and run the Vamp binaries.

>**Note** If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)


## Build from source

### Vamp

Prerequisites:

- OpenJDK or Oracle Java version of 1.8.0_40 or higher. Check the version with `java -version`
- [git](https://git-scm.com/)
- [sbt](http://www.scala-sbt.org/index.html)
- [npm](https://www.npmjs.com/) and [Gulp](http://gulpjs.com/)

Steps:

1. Checkout the source from the official [repo](https://github.com/magneticio/vamp). `master` branch contains the latest released version (e.g. 0.9.0). Versions are tagged.
  Since `vamp-ui` is a separate project and added as a git submodule to Vamp (`ui` subdirectory) it is necessary to checkout the submodule as well:
  `git clone --recursive git@github.com:magneticio/vamp.git` or specific branch: `git clone --recursive --branch 0.9.0 git@github.com:magneticio/vamp.git`
2. Run `./build-ui.sh && sbt test assembly`
2. After the build `./bootstrap/target/scala-2.11` directory will contain the binary with name matching `vamp-assembly-*.jar`

* Check this [example](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/make.sh).

### Vamp Gateway Agent (VGA)

Prerequisites:

- [Go](https://golang.org/)
- [git](https://git-scm.com/)

Steps:

1. Checkout the source from the official [repo](https://github.com/magneticio/vamp-gateway-agent). Current `master` branch is backward compatible with the latest 0.9.0 Vamp build.
2. Set Go variables depending on target environment
3. Run:

```
go get github.com/tools/godep
godep restore
go install
CGO_ENABLED=0 go build -v -a -installsuffix cgo
```

* More details can found on the [project page](https://github.com/magneticio/vamp-gateway-agent)
* Check this [example](https://github.com/magneticio/vamp-docker/blob/master/clique-base/make.sh)

## Download Vamp

The Vamp binaries are available for download at:

* [Vamp](https://bintray.com/magnetic-io/downloads/vamp/view)
* [Vamp CLI](https://bintray.com/magnetic-io/downloads/vamp-cli/view)
* [Vamp Gateway Agent (VGA)](https://bintray.com/magnetic-io/downloads/vamp-gateway-agent/view)

VGA Docker images with HAProxy can be pulled from the [Docker hub](https://hub.docker.com/r/magneticio/vamp-gateway-agent/).

## Run Vamp

### Vamp

Let's assume that Vamp binary is `vamp.jar`.
OpenJDK or Oracle Java version of 1.8.0_40 or higher needs to be installed. Check the version with `java -version`

Example:
```
java -Dlogback.configurationFile=logback.xml -Dconfig.file=application.conf -jar vamp.jar
```

`logback.xml` is log configuration. 
Vamp uses [Logback](http://logback.qos.ch/) library and on the Logback project page can be found additional information about using the Logback and log file configuration format.
An example file can be found [here](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/conf/logback.xml).

`application.conf` is the main Vamp configuration file. 
[Default values](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) are loaded on start and `application.conf` may override any of them.
Processing configuration is based on this [library](https://github.com/typesafehub/config). 
Additional information about syntax and usage can be found on the library project page.
An example of configuration can be found [here](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/conf/application.conf). 

Additional command line argument [example](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/start.sh) from Vamp quick start.

#### Docker image

Vamp Docker image is also [available](https://hub.docker.com/r/magneticio/vamp/).
Default Vamp configuration used in the image is [here](https://github.com/magneticio/vamp-docker/tree/master/vamp/conf) - `application.conf` is a subset of full [configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf).
Still few parameters needs to be provided, for example:

```
java -Dvamp.persistence.key-value-store.zookeeper.servers="192.168.99.100:2181" \
     -Dvamp.container-driver.url="http://192.168.99.100:9090" \
     -Dvamp.gateway-driver.host="192.168.99.100" \
     -Dvamp.pulse.elasticsearch.url="http://192.168.99.100:9200" \
     -Dlogback.configurationFile=/usr/local/vamp/logback.xml \
     -Dconfig.file=/usr/local/vamp/application.conf \
     -jar /usr/local/vamp/vamp.jar
```

Alternatively using volumes:
 
```
docker run --net=host -v PATH_TO_LOCAL_CONFIG_DIR:/usr/local/vamp/conf magneticio/vamp:0.9.0
```

### Vamp Gateway Agent (VGA)

Documentation can be found on the [project page](https://github.com/magneticio/vamp-gateway-agent).
An [example](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/supervisord.conf) of command line arguments is in `[program:VampGatewayAgent]` section.

VGA instance can have different command line parameters (e.g. Logstash URLs), and the common thing between them all is only the HAProxy configuration read from KV store.
Thus all HAProxy instances will be configured with the same configuration always.



