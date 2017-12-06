---
date: 2016-09-13T09:00:00+00:00
title: Hello world
menu:
  main:
    identifier: "hello-world-v094"
    parent: "Installation"
    weight: 20
---

{{< note title="The information on this page applies to Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/installation/hello-world).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Want to give Vamp a go? The hello world setup described below runs Vamp inside a local Docker container - a perfect environment to try out Vamp's core features and work through the [Vamp tutorials](/documentation/tutorials/).
Vamp hello world runs Mesos, Marathon ([mesosphere.github.io - Marathon](https://mesosphere.github.io/marathon/)) and Vamp 0.9.4 together with Vamp's Marathon driver.

**Requirements:**  At least 8GB of memory

{{< note >}}
This hello world set up is designed for testing purposes only - it is not production grade.
{{< /note >}}

## Get Docker

We will run Vamp in a local Docker container. If you don't already have Docker installed, please install one of the following for your platform/architecture:

- [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- **Linux**: Docker 1.9.x (Vamp works with Docker 1.12 too)
- **Windows 7+**: [Docker Toolbox 1.12.x](https://github.com/docker/toolbox/releases)

Vamp hello world on Docker for Windows is currently not supported. We're working on this so please check back.
Mac running Docker toolbox can install [Vamp hello world v0.9.4](/documentation/installation/v0.9.4/hello-world/)

## Run Vamp

Start the `magneticio/vamp-docker:0.9.4` container, taking care to pass in the right parameters for your system:

### Docker for Mac
Docker machine should have access to **at least 3GB memory**, make sure this is set correctly before you continue.

```
docker run -v /var/run/docker.sock:/var/run/docker.sock \
           -v /usr/bin/docker:/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=192.168.65.2" \
           -p 8080:8080 -p 5050:5050 \
           -p 9090:9090 -p 8989:8989 \
           -p 4400:4400 -p 9200:9200 \
           -p 5601:5601 -p 2181:2181 \
           magneticio/vamp-docker:0.9.4
```

### Docker toolbox (Windows 7+)

If you installed Docker Toolbox, please use the Docker Quickstart Terminal. We don't currently support Kitematic.

```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v `docker-machine ssh default "which docker"`:/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=$(docker-machine ip default)" \
           magneticio/vamp-docker:0.9.4
```

#### Docker (Linux)

```
docker run --privileged \
           --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v $(which docker):/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=$(hostname -I | awk '{print $1;}')" \
           magneticio/vamp-docker:0.9.4
```

Mounting volumes is important. [Read this great article about starting Docker containers from/within another Docker container](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).

## Check Vamp is up and running

After some downloading and booting, your Docker log will show the blue Vamp ASCII logo.

![](/images/screens/v094/vamp_ascii_logo.png)

Now you can check if Vamp is home on `localhost:8080` and you're ready for the [Vamp getting started tutorials](/documentation/tutorials/)

![](/images/screens/v094/quicksetup-marathon-infopanel.png)

Click on the **?** in the top right corner of any screen for quick access to page help, related documentation and tutorials.

![](/images/screens/v094/quicksetup-helppanel.png)

## Access the exposed services

All the services exposed in this demo are listed below.

Exposed services |
----------|--------
HAProxy statistics        |       [http://localhost:1988](http://localhost:1988) (username/password: haproxy) not on Docker for Mac
Elasticsearch HTTP        |      [http://localhost:9200](http://localhost:9200)
Kibana        |       [http://localhost:5601](http://localhost:5601)
Sense        |      [http://localhost:5601/app/sense](http://localhost:5601/app/sense)
Mesos        |       [http://localhost:5050](http://localhost:5050)
Marathon       |      [http://localhost:9090](http://localhost:9090) (Note that the Marathon port is 9090 and not the default 8080)
Chronos        |       [http://localhost:4400](http://localhost:4400)
Vamp UI       |      [http://localhost:8080](http://localhost:8080)


## Summing up

This set up runs all of Vamp's components in one container. You will run into CPU, memory and storage issues pretty soon though. Also, random ports from 31000 - 32000 and 40000 - 45000 are assigned by Vamp which you might not have exposed on either Docker or your Docker Toolbox Vagrant box.  This is definitely not ideal, but works fine for kicking the tires.
Now you're all set to follow our [getting started tutorials](/documentation/tutorials/).

{{< note title="What next?" >}}
* Follow the [getting started tutorials](/documentation/tutorials/)
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

If you need help you can also find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
