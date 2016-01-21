---
title: Installation Details
weight: 30
type: documentation
menu:
  main:
    parent: installation
---

# Installation Details

## Overview

The main 2 component of Vamp platform are [Vamp](https://github.com/magneticio/vamp) and [Vamp Gateway Agent](https://github.com/magneticio/vamp-gateway-agent)(VGA).

### Persistence and Key-Value (KV) store

Vamp uses Elasticsearch (ES) as main persistence (e.g. for artifacts and events). 
Vamp is not demanding in ES resources so either small ES installation is sufficient or Vamp indexes (index names are configurable) can be stored in an existing ES cluster.

Also Vamp depends on key-value (KV) store for communication between Vamp and Vamp Gateway Agents (VGA).
[ZooKeeper](https://zookeeper.apache.org/), [etcd](https://coreos.com/etcd/docs/latest/) and [Consul](https://www.consul.io/) are supported.
Typically there should be one Vamp instance and one or more VGA instances.
There is **no direct** connection between Vamp and VGA instances - all communication is done by managing specific KV in the store.
When Vamp needs to update HAProxy configuration (e.g. new service has been deployed), Vamp generates the configuration and stores it in the KV store.
VGA's read specific value and reload HAProxy instances.
There should be one dedicated HAProxy for each VGA. 
Currently Vamp doesn't support custom HAProxy configuration (any existing configuration will be overridden on change) - support for custom configuration is planned for the next 0.8.3 version.

Since VGA (and HAPRoxy) is a single point of failure (proxy to all traffic), it is recommended for high availability to have more than one VGA instance.
VGA instance can be added or removed any time - once VGA starts running it will pick up the HAProxy configuration from configured KV store and it will reload the HAProxy instance.
This also mean Vamp (not VGA), can be restarted, stopped etc. without main consequences on running services - there will be no HAProxy configuration update, but once Vamp is up, it will sync HAProxy configuration (e.g. if Marathon restarted some service, so hosts/ports are changed).  

Since Mesos depends on ZooKeeper, the same ZooKeeper cluster can be used for Vamp and VGA's.

In order to setup correctly Vamp with single/multiple VGA instances check out also gateway driver [configuration](/documentation/installation/configuration/#gateway-driver).

### Elasticsearch, Logstash and Kibana (ELK)

HAProxy (VGA) generates logs and make them accessible via open socket - check the [configuration](https://github.com/magneticio/vamp-gateway-agent/blob/master/haproxy.cfg) of `log`.
VGA is listening on log socket and any new messages is forwarded to Logstash instance.
Log format is configurable in Vamp configuration [vamp.gateway-driver.haproxy](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf).
Note that Logstash is listening on UDP port, but in principle any other lister can receive logs forwarded by VGA.
Different VGA's can use different Logstash instances.
Example of different Logstash/Elasticsearch setups can be found [here](https://www.elastic.co/guide/en/logstash/current/deploying-and-scaling.html).

In general for each HTTP/TCP request to HAProxy, several log messages are created (e.g. for gateway, service and instance level).
Using one of the simplest Logstash configuration should be sufficient for dozens of request per second or even more.
This also depends if ELK is used for custom application/service logs etc.

For default `vamp.gateway-driver.haproxy` log format, Logstash configuration can be found on VGA project [page](https://github.com/magneticio/vamp-gateway-agent).
It will transform logs to plain JSON which can be parsed easily later on (e.g. for Kibana visualization).
Logstash command line parameter example can be found [here](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/supervisord.conf) (Logstash section).

In short:

- in order to have effective feedback loop, HTTP/TCP logs should be collected, stored and analyzed
- collection and storing is done in combination of HAProxy, VGA and Logstash setup
- logs can be stored in Elasticsearch and later analyzed and visualized by Kibana.
 
Vamp can be configured to create Kibana `searches`, `visualisations` and `dashboards` automatically - `vamp.gateway-driver.kibana.enabled` configuration parameter.
Vamp will do this by inserting ES documents to Kibana index, so only URL to access ES is needed (by default reusing the same as for persistence).  

### Mesos/Marathon or Docker

Vamp supports via drivers Marathon and Docker (dev mode).
There is no specific Vamp demand a part of simple configuration string that needs to specified for Marathon `vamp.container-driver.url` and `vamp.container-driver.type` for specifying the type.

Vamp instance and VGA's can be managed inside Marathon - it should be taken care of port mapping, how to access them etc.
Simpler solution (for trials etc.) is to run Vamp and VGA's "outside" of Marathon.

## Building from the source

### Vamp

Prerequisites:

- OpenJDK or Oracle Java version of 1.8.0_40 or higher. Check the version with `java -version`
- [git](https://git-scm.com/)
- [sbt](http://www.scala-sbt.org/index.html)

Steps:

- checkout the source from the official [repo](https://github.com/magneticio/vamp). `master` branch contains the latest released version (e.g. 0.8.2). Versions are tagged.
- run `./build-ui.sh && sbt test assembly`
- after the build `./bootstrap/target/scala-2.11` directory will contain the binary with name matching `vamp-assembly-*.jar`

Example can be found [here](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/make.sh).

### Vamp Gateway Agent (VGA)

Prerequisites:

- [Go](https://golang.org/)
- [git](https://git-scm.com/)


Steps:

- checkout the source from the official [repo](https://github.com/magneticio/vamp-gateway-agent). Current `master` branch is backward compatible with the latest 0.8.2 Vamp build. Alternatively tag `0.8.2` can be used even though it may not contain the latest changes or bug fixes.
- set Go variables depending on target environment
- run:

```
go get github.com/tools/godep
godep restore
go install
go build
```

Example can be found [here](https://github.com/magneticio/vamp-docker/blob/master/clique-base/make.sh)

## Running

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

### Vamp Gateway Agent (VGA)

Documentation can be found on [project page](https://github.com/magneticio/vamp-gateway-agent).
An [example](https://github.com/magneticio/vamp-docker/blob/master/quick-start-marathon/supervisord.conf) of command line arguments is in `[program:VampGatewayAgent]` section.

VGA instance can have different command line parameters (e.g. Logstash urls), and the common thing between them all is only the HAProxy configuration read from KV store.
Thus all HAProxy instances will be configured with the same configuration always.
