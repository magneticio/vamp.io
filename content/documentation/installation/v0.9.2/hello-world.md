---
date: 2016-09-13T09:00:00+00:00
title: Hello world
menu:
  main:
    identifier: "hello-world-v092"
    parent: "Installation"
    weight: 20
---

{{< note title="The information on this page applies to Vamp v0.9.2" >}}

* Switch to the [latest version of this page](/documentation/installation/hello-world).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}


The Vamp hello world setup will run Mesos, Marathon ([mesosphere.github.io - Marathon](https://mesosphere.github.io/marathon/)) and Vamp 0.9.2 inside a local Docker container with Vamp's Marathon driver.  We will do this in three simple steps (although it's really just one `docker run` command). You can use the hello world setup to work through the [getting started tutorials](/documentation/tutorials/) and try out some of Vamp's core features.

{{< note >}}
This hello world set up is designed for demo purposes only - it is not production grade.
{{< /note >}}

#### Requirements
* At least 8GB of memory

## Get Docker

Please install one of the following for your platform/architecture

- Docker 1.9.x (Linux) or higher (Vamp works with Docker 1.12 too), OR
- [Docker Toolbox 1.12.x] (https://github.com/docker/toolbox/releases) if on Mac OS X 10.8+ or Windows 7+

Vamp hello world on Docker for Mac or Windows is currently not supported. We're working on this so please check back.

## Run Vamp

Start the `magneticio/vamp-docker:0.9.2-marathon` container, taking care to pass in the right parameters for your system:

#### Mac OS X 10.8+ or Windows 7+

If you installed Docker Toolbox, please use the Docker Quickstart Terminal. We don't currently support Kitematic. A typical command on Mac OS X running Docker Toolbox would be:
```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v `docker-machine ssh default "which docker"`:/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=$(docker-machine ip default)" \
           magneticio/vamp-docker:0.9.2
```

#### Linux

```
docker run --privileged \
           --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v $(which docker):/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=$(hostname -I | awk '{print $1;}')" \
           magneticio/vamp-docker:0.9.2
```

Mounting volumes is important. [Read this great article about starting Docker containers from/within another Docker container](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).

## Check Vamp is up and running

After some downloading and booting, your Docker log will show the Vamp has launched and report:
`...Binding: 0.0.0.0:8080`

Now you can check if Vamp is home on `http://{docker-machine ip default}:8080/` and you're ready for the [Vamp getting started tutorials](/documentation/tutorials/)

![](/images/screens/v092/quicksetup-marathon-infopanel.png)

Click on the **?** in the top right corner of any screen for quick access to page help, related documentation and tutorials.

![](/images/screens/v092/quicksetup-helppanel.png)

## Access the exposed services

All the services exposed in this demo are listed below. Note that if you run on Docker machine you will need to switch `localhost` for `docker-machine ip default`.


Exposed services |
----------|--------
HAProxy statistics        |       [http://localhost:1988](http://localhost:1988) (username/password: haproxy)
Elasticsearch HTTP        |      [http://localhost:9200](http://localhost:9200)
Kibana        |       [http://localhost:5601](http://localhost:5601)
Sense        |      [http://localhost:5601/app/sense](http://localhost:5601/app/sense)
Mesos        |       [http://localhost:5050](http://localhost:5050)
Marathon       |      [http://localhost:9090](http://localhost:9090) (Note that the Marathon port is 9090 and not the default 8080)
Chronos        |       [http://localhost:4400](http://localhost:4400)
Vamp UI       |      [http://localhost:8080](http://localhost:8080)


## Summing up

This set up runs all of Vamp's components in one container. You will run into cpu, memory and storage issues pretty soon though. Also, random ports from 31000 - 32000 and 40000 - 45000 are assigned by Vamp which you might not have exposed on either Docker or your Docker Toolbox Vagrant box.  This is definitely not ideal, but works fine for kicking the tires.
Now you're all set to follow our [getting started tutorials](/documentation/tutorials/).

{{< note title="What next?" >}}
* Follow the [getting started tutorials](/documentation/tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

If you need help you can also find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
