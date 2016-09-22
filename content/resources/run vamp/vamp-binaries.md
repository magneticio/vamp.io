---
date: 2016-09-13T09:00:00+00:00
title: Vamp binaries
---
This page will explain the options to get and run the Vamp binaries.

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)


## Build from source

### Vamp

#### Prerequisites

- OpenJDK or Oracle Java version of 1.8.0_40 or higher. Check the version with `java -version`
- git ([git-scm.com](https://git-scm.com/))
- sbt ([scala-sbt.org](http://www.scala-sbt.org/index.html))
- npm ([npmjs.com](https://www.npmjs.com/)) and Gulp ([gulpjs.com](http://gulpjs.com/))

#### Steps

1. Checkout the source from the official repo ([github.com/magneticio - Vamp](https://github.com/magneticio/vamp)):   
  * `git clone --recursive git@github.com:magneticio/vamp.git`  
  * or specific branch: `git clone --recursive --branch 0.9.0 git@github.com:magneticio/vamp.git`

{{< note title="Note!" >}} 
* `master` branch contains the latest released version (e.g. 0.9.0). Versions are tagged.
* `vamp-ui` is a separate project added as a git submodule to Vamp (`ui` subdirectory) it is, therefore, necessary to checkout the submodule as well  
{{< /note >}}

2. Run `./build-ui.sh && sbt test assembly`
2. After the build `./bootstrap/target/scala-2.11` directory will contain the binary with name matching `vamp-assembly-*.jar`

{{< tip  >}}
Check this example ([github.com/magneticio - Vamp docker quick start make.sh](https://github.com/magneticio/vamp-docker/blob/master/quick-start/make.sh)).
{{< /tip >}}

### Vamp Gateway Agent (VGA)

#### Prerequisites

- Go ([golang.org](https://golang.org/))
- git ([git-scm.com](https://git-scm.com/))

#### Steps

1. Checkout the source from the official [repo](https://github.com/magneticio/vamp-gateway-agent). Current `master` branch is backward compatible with the latest 0.9.0 Vamp build.
2. Set Go variables depending on target environment
3. Run:

```
go get github.com/tools/godep
godep restore
go install
CGO_ENABLED=0 go build -v -a -installsuffix cgo
```
{{< tip  >}}
* More details can found on the project page ([github.com/magneticio - Vamp gateway agent](https://github.com/magneticio/vamp-gateway-agent))
* Check this example ([github.com/magneticio - clique-base make.sh](https://github.com/magneticio/vamp-docker/blob/master/clique-base/make.sh))
{{< /tip >}}

## Download Vamp

Three Vamp binaries are available for download:

* Vamp ([bintray.com/magnetic-io - Vamp](https://bintray.com/magnetic-io/downloads/vamp/view))
* Vamp CLI ([bintray.com/magnetic-io - Vamp CLI](https://bintray.com/magnetic-io/downloads/vamp-cli/view))
* Vamp Gateway Agent (VGA) ([bintray.com/magnetic-io - Vamp gateway agent](https://bintray.com/magnetic-io/downloads/vamp-gateway-agent/view))

VGA Docker images with HAProxy can be pulled from the Docker hub ([hub.docker.com - magneticio Vamp gateway agent](https://hub.docker.com/r/magneticio/vamp-gateway-agent/)).

## Run Vamp

### Vamp binary

Let's assume that the Vamp binary is `vamp.jar`.
OpenJDK or Oracle Java version of 1.8.0_40 or higher needs to be installed. Check the version with `java -version`

#### Example
```
java -Dlogback.configurationFile=logback.xml -Dconfig.file=application.conf -jar vamp.jar
```

* `logback.xml` is the log configuration file.  
_Vamp uses the Logback library ([logback.qos.ch](http://logback.qos.ch/)). Additional information about using Logback and log file configuration format Logback project page._
* `application.conf` is the main Vamp configuration file.   
_Default values ([github.com/magneticio - reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)) are loaded on start and `application.conf` may override any of them.
Processing configuration is based on this library ([github.com/typesafehub - config](https://github.com/typesafehub/config)). 
Additional information about syntax and usage can be found on the library project page._

{{< tip  >}}
Check these examples:

* Example `Logback.xml` file ([github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/conf/logback.xml](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/conf/logback.xml)).
* Example `application.conf` filr ([github.com/magneticio - Vamp docker application.conf](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/conf/application.conf)). 
* Additional command line argument examples from Vamp quick start ([github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/start.sh](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/start.sh)).
{{< /tip >}}

### Vamp Docker image

A Vamp Docker image is available on the Docker hub ([hub.docker.com - magneticio Vamp](https://hub.docker.com/r/magneticio/vamp/)).
The default Vamp configuration used in the image is here ([github.com/magneticio - Vamp docker conf](https://github.com/magneticio/vamp-docker/tree/master/vamp/conf)) - this `application.conf` is a subset of the full configuration ([/github.com/magneticio - reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)).
A few parameters still need to be provided, for example:

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

Documentation can be found on the project page ([github.com/magneticio - Vamp gateway agent](https://github.com/magneticio/vamp-gateway-agent)).  

{{< note title="Note!" >}}
VGA instances may have different command line parameters (e.g. Logstash URLs), but always have a common HAProxy configuration read from the KV store.    
This means all HAProxy instances will always be configured with the same configuration.
{{< /note >}}

{{< tip  >}}
Check the example of command line arguments in the `[program:VampGatewayAgent]` section ([github.com/magneticio - Vamp docker supervisord.conf](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/supervisord.conf)). 
{{< /tip >}}



