---
title: Quick start Docker
type: documentation
weight: 35
draft: true
menu:
    main:
      parent: installation
---

# Vamp with Docker

The easiest way to get started with Vamp is by spinning up one of the Docker images from [vamp-docker repo](https://github.com/magneticio/vamp-docker) and the [public Docker hub](https://hub.docker.com/r/magneticio/vamp-docker/).
This setup will run Vamp inside a Docker container with Vamp's Docker driver.

>**Note**: Using Vamp only with Docker is meant only for non-production environment (e.g. development, testing). Please check out quick start with [DC/OS](/documentation/installation/dcos) or [Kubernetes](/documentation/installation/kubernetes).

## Step 1: Get Docker

Please install one of the following for your platform/architecture

- Docker 1.9.x or higher (Linux), OR
- [Docker Toolbox] (https://www.docker.com/docker-toolbox) if on Mac OS X 10.8+ or Windows 7+


## Step 2: Run Vamp

Start the `magneticio/vamp-docker:0.9.0` container, taking care to pass in the right parameters.

### Linux

A typical command would be:
{{% copyable %}}
```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v $(which docker):/bin/docker \
           magneticio/vamp-docker:0.9.0
```
{{% /copyable %}}

Mounting volumes is important. 
Great article about starting Docker containers from/within another Docker container can be found [here](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).


### Mac OS X 10.8+ or Windows 7+

A typical command on Mac OS X running Docker Toolbox would be:
{{% copyable %}}
```
docker run --net=host \
           -v ~/.docker/machine/machines/default:/certs \
           -e "DOCKER_TLS_VERIFY=1" \
           -e "DOCKER_HOST=`docker-machine url default`" \
           -e "DOCKER_CERT_PATH=/certs" \
           magneticio/vamp-docker:0.9.0
```
{{% /copyable %}}

> **Note:** If you installed Docker Toolbox please use "Docker Quickstart Terminal". At this moment we don't support Kitematic yet.

Please notice the mounting of the docker machine certificates. Please set this to your specific environment. 
You can get this info by running for instance `docker-machine config default`. 
If you don't use Docker Toolbox (or Boot2Docker), set the `DOCKER_HOST` variable to whatever is relevant to your system.
