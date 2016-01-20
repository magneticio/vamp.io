---
title: Installation Details
weight: 30
type: documentation
menu:
  main:
    parent: installation
---

# Installation Details

The main 2 component of Vamp platform are [Vamp](https://github.com/magneticio/vamp) and [Vamp Gateway Agent](https://github.com/magneticio/vamp-gateway-agent)(VGA).

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

### Vamp Gateway Agent

Prerequisites:

- [Go](https://golang.org/)
- [git](https://git-scm.com/)


Steps:

- checkout the source from the official [repo](https://github.com/magneticio/vamp-gateway-agent). Current `master` branch is backward compatible with the latest 0.8.2 Vamp build. Alternatively tag `0.8.2` can be used even though it may not contain the latest changes or bug fixes.
- set Go environment variables
- run:

```
go get github.com/tools/godep
godep restore
go install
go build
```

Example can be found [here](https://github.com/magneticio/vamp-docker/blob/master/clique-base/make.sh)

## Running


