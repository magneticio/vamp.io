---
date: 2016-03-09T19:56:50+01:00
title: Hello world
menu:
  main:
    parent: TRY VAMP
    identifier: Hello world
    weight: 05
---

This Hello world quick setup will run Mesos, [Marathon](https://mesosphere.github.io/marathon/) and Vamp inside a local Docker container with Vamp's Marathon driver. We will do this in three simple steps (although it's really just one docker run command):

1. Get docker
2. Run Vamp
3. Check Vamp is up and running

> NB If you need help you can also find us on [Gitter] (https://gitter.im/magneticio/vamp)

## Step 1: Get Docker

Please install one of the following for your platform/architecture

- Docker 1.10.x (Linux) or higher (Vamp works with Docker 1.11 too), OR
- [Docker Toolbox 1.11.x] (https://github.com/docker/toolbox/releases) if on Mac OS X 10.8+ or Windows 7+ 

> **Note:** Running the Vamp quick setup on earlier versions of Docker is also possible, even though it is recommended at least version 1.9.x.

## Step 2: Run Vamp

Start the `magneticio/vamp-docker:0.8.5-marathon` container, taking care to pass in the right parameters. 

### Linux

A typical command would be:
```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v $(which docker):/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=`hostname -I | awk '{print $1;}'`" \
           magneticio/vamp-docker:0.8.5-marathon
```

Mounting volumes is important. 
Great article about starting Docker containers from/within another Docker container can be found [here](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).

> **Note:** Marathon port is 9090 (e.g. http://localhost:9090/) instead of default 8080. 


### Mac OS X 10.8+ or Windows 7+

A typical command on Mac OS X running Docker Toolbox would be:
```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v `docker-machine ssh default "which docker"`:/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=`docker-machine ip default`" \
           magneticio/vamp-docker:0.8.5-marathon
```

> **Note:** If you installed Docker Toolbox please use "Docker Quickstart Terminal". At this moment we don't support Kitematic yet.

## Step 3: Check Vamp is up and running

After some downloading and booting, your Docker log will show Vamp launch and report something like:

```
...Bound to /0.0.0.0:8080
```

Now check if Vamp is home on `http://{docker-machine ip default}:8080/` and you're ready for the [Vamp Sava tutorials](/deploy/)

![](/img/screenshots/vamp_ui_home.gif)

Exposed services:

- HAProxy statistics [http://localhost:1988](http://localhost:1988) (username/password: haproxy)
- Elasticsearch HTTP [http://localhost:9200](http://localhost:9200)
- Kibana [http://localhost:5601](http://localhost:5601)
- Sense [http://localhost:5601/app/sense](http://localhost:5601/app/sense)
- Mesos [http://localhost:5050](http://localhost:5050)
- Marathon [http://localhost:9090](http://localhost:9090)
- Chronos [http://localhost:4400](http://localhost:4400)
- Vamp [http://localhost:8080](http://localhost:8080)

If you run on Docker machine, use `docker-machine ip default` instead of `localhost`.

> **Note:** This runs all of Vamp's components in one container. This is definitely not ideal, but works fine for kicking the tires.
You will run into cpu, memory and storage issues pretty soon though. Also, random ports are assigned by Vamp which you might not have exposed on either Docker or your Docker Toolbox Vagrant box.  

Now you're ready to follow our [Vamp Sava tutorials](/deploy-your-first-blueprint/).

Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

> NB If you need help you can also find us on [Gitter] (https://gitter.im/magneticio/vamp)