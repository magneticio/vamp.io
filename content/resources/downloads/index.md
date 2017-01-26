---
date: 2016-10-19T09:00:00+00:00
title: Downloads
menu:
  main:
    parent: "Resources"
    weight: 10
---

#### Binaries
* [Vamp](/resources/downloads/#vamp)
* [Vamp Gateway Agent (VGA)](/resources/downloads/#vamp-gateway-agent-vga)
* [Vamp CLI](/resources/downloads/#vamp-cli)

#### Homebrew
* [Vamp CLI for MacOS X](/resources/downloads/#vamp-cli-for-macos-x)

#### Docker images
* [Vamp Gateway Agent (VGA) and HAProxy](/resources/downloads/#vamp-gateway-agent-vga-and-haproxy)
* [Vamp workflow agent](/resources/downloads/#vamp-workflow-agent)

#### Build from source
* [Build Vamp](/resources/downloads/#build-vamp)
* [Build Vamp Gateway Agent (VGA)](/resources/downloads/#build-vamp-gateway-agent-vga)

-----------

## Binaries

### Vamp
**Download: [bintray.com/magnetic-io - Vamp](https://bintray.com/magnetic-io/downloads/vamp/view)**  
**Requirements:** OpenJDK or Oracle Java version 1.8.0_40 or higher

#### Example
Let's assume that the Vamp binary is `vamp.jar`.
```
java -Dlogback.configurationFile=logback.xml -Dconfig.file=application.conf -jar vamp.jar
```

* `logback.xml` is the log configuration file ([example logback.xml file](https://github.com/magneticio/vamp-docker-images/blob/master/quick-start/logback.xml))  
Vamp uses the Logback library. Additional information about using Logback and the log file configuration format can be found on the Logback project page ([logback.qos.ch](http://logback.qos.ch/)).
* `application.conf` is the main Vamp configuration file ([example application.conf file](https://github.com/magneticio/vamp-docker-images/blob/master/quick-start/application.conf))  
Default values ([github.com/magneticio - reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)) are loaded on start and application.conf may override any of them.
Processing configuration is based on the typesafe library. Additional information about syntax and usage can be found on the project page ([github.com/typesafehub - config](https://github.com/typesafehub/config)).

### Vamp Gateway Agent (VGA)

**Download: [bintray.com/magnetic-io - Vamp Gateway Agent](https://bintray.com/magnetic-io/downloads/vamp-gateway-agent/view)**

Documentation can be found on the project page ([github.com/magneticio - Vamp Gateway Agent](https://github.com/magneticio/vamp-gateway-agent)).
### Vamp CLI

**Download: [bintray.com/magnetic-io - Vamp CLI](https://bintray.com/magnetic-io/downloads/vamp-cli/view)**  
**Requirements:** OpenJDK or Oracle Java version 1.8.0_40 or higher

#### Manual install - Windows and Linux
Inside the extracted Vamp CLI binary package ([bintray.com/magnetic-io - Vamp CLI](https://bintray.com/magnetic-io/downloads/vamp-cli/view)) is a `bin` directory. Add it to your PATH statement, open a Console/CMD window and type `vamp`.  
After installation, set Vamp’s host location:

* Vamp’s host location specified as a command line option ( `--host` )

```
vamp list breeds --host=http://192.168.59.103:8080
```

* Vamp’s host location specified via the environment variable `VAMP_HOST`

```
export VAMP_HOST=http://192.168.59.103:8080
```

## Homebrew
### Vamp CLI for MacOS X
**Download:** We have Homebrew support to install the Vamp CLI on MacOS X  
**Requirements:** OpenJDK or Oracle Java version 1.8.0_40 or higher  

#### Homebrew install - MacOS X

```bash
brew tap magneticio/vamp
brew install vamp
```

After installation, check if everything is properly installed with `vamp version`, then export the location of the Vamp host and check that the CLI can talk to Vamp:
```bash
export VAMP_HOST=http://localhost:8080
vamp info
```

## Docker images

### Vamp Gateway Agent (VGA) and HAProxy
Vamp Gateway Agent (VGA) Docker images with HAProxy can be pulled from the Docker hub ([hub.docker.com - magneticio Vamp Gateway Agent](https://hub.docker.com/r/magneticio/vamp-gateway-agent/)).

### Vamp Workflow Agent
A container for running small JavaScript-based workflows can be pulled from the Docker hub ([hub.docker.com - magneticio Vamp workfow agent](https://hub.docker.com/r/magneticio/vamp-workflow-agent/)).
 Usually this will be pulled automatically.

## Build from source

### Build Vamp
**Requirements:** OpenJDK or Oracle Java version of 1.8.0_40 or higher, git ([git-scm.com](https://git-scm.com/)), sbt ([scala-sbt.org](http://www.scala-sbt.org/index.html)), npm ([npmjs.com](https://www.npmjs.com/)) and Gulp ([gulpjs.com](http://gulpjs.com/))  
{{< note >}}
If you build from source (master branch) without a specific tag, you will build katana not the official release. Check the [katana documentation](documentation/release-notes/katana) for details of all changes since the last official release.
{{< /note >}}

1. Checkout the source from the official repo ([github.com/magneticio - Vamp](https://github.com/magneticio/vamp)):   
  {{< note title="Note!" >}}
  * `master` branch contains the latest released version (e.g. 0.9.2). Versions are tagged.
  * `vamp-ui` is a separate project added as a git submodule to Vamp (`ui` subdirectory) it is, therefore, necessary to also checkout the submodule  
  {{< /note >}}
  * `git clone --recursive git@github.com:magneticio/vamp.git`  
  * or specific branch: `git clone --recursive --branch 0.9.2 git@github.com:magneticio/vamp.git`


2. Run `./build-ui.sh && sbt test assembly`
2. After the build `./bootstrap/target/scala-2.11` directory will contain the binary with name matching `vamp-assembly-*.jar`

Check this example: [github.com/magneticio - Vamp docker quick start make.sh](https://github.com/magneticio/vamp-docker-images/blob/master/quick-start/make.sh).

### Running Vamp

Let’s assume that Vamp binary is vamp.jar. OpenJDK or Oracle Java version of 1.8.0_40 or higher needs to be installed. Check the version with `java -version`

Example:

`java -Dlogback.configurationFile=logback.xml -Dconfig.file=application.conf -jar vamp.jar

logback.xml` is log configuration. Vamp uses the [Logback](http://logback.qos.ch/) library and additional information about using the Logback and log file configuration format can be found on the Logback project page. An example file can be found [here](https://github.com/magneticio/vamp-docker-images/blob/master/quick-start/logback.xml).

`application.conf` is the main Vamp configuration file. [Default](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) values are loaded on start and `application.conf` may override any of them. Processing configuration is based on [this](https://github.com/typesafehub/config) library. Additional information about syntax and usage can be found on the library project page. An example of configuration can be found [here](https://github.com/magneticio/vamp-docker-images/blob/master/vamp-dcos/application.conf).

### Build Vamp Gateway Agent (VGA)

**Requirements:** Go ([golang.org](https://golang.org/)) and git ([git-scm.com](https://git-scm.com/))
{{< note >}}
If you build from source (master branch) without a specific tag, you will build katana not the official release. Check the [katana documentation](documentation/release-notes/katana) for details of all changes since the last official release.
{{< /note >}}

1. Checkout the source from the official repo ([github.com/magneticio - Vamp gateway agent](https://github.com/magneticio/vamp-gateway-agent)). Current `master` branch is backward compatible with the latest 0.9.2 Vamp build.
2. Set Go variables depending on target environment
3. Run:

```
go get github.com/tools/godep
godep restore
go install
CGO_ENABLED=0 go build -v -a -installsuffix cgo
```

Check this example: [github.com/magneticio - clique-base make.sh](https://github.com/magneticio/vamp-docker-images/blob/master/clique-base/make.sh). More details can found on the project page: [github.com/magneticio - Vamp gateway agent](https://github.com/magneticio/vamp-gateway-agent).
