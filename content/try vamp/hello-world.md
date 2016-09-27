---
date: 2016-09-13T09:00:00+00:00
title: Hello world

---

{{< warning title="Warning!" >}}
Quick setups are designed for demo purposes only - they are not production grade setups!
{{< /warning >}}

## Overview

This Vamp quick setup will run Mesos, Marathon ([mesosphere.github.io - Marathon](https://mesosphere.github.io/marathon/)) and Vamp inside a local Docker container with Vamp's Marathon driver. We will do this in three simple steps (although it's really just one `docker run` command). If you get stuck or need help you can [find us on Gitter] (https://gitter.im/magneticio/vamp)

#### Steps:

1. Get Docker
2. Run Vamp
3. Check Vamp is up and running

{{< tip >}}
You could also start with one of our [other quick setups](/resources/run-vamp/quick-setup/), but we recommend hello world as it's the most straightforward.
{{< /tip >}}

## In depth

### Step 1: Get Docker

Please install one of the following for your platform/architecture

- Docker 1.9.x (Linux) or higher (Vamp works with Docker 1.12 too), OR
- [Docker Toolbox 1.12.x] (https://github.com/docker/toolbox/releases) if on Mac OS X 10.8+ or Windows 7+ 

{{< note title="Note" >}}
Vamp hello world on Docker for Mac or Windows is currently not supported. We're working on this so please check back. 
{{< /note >}}

### Step 2: Run Vamp

Use the instructions below to start the `magneticio/vamp-docker:0.8.5-marathon` container, taking care to pass in the right parameters. 

#### Linux

A typical command would be:
```
docker run --privileged \
           --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v $(which docker):/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=`hostname -I | awk '{print $1;}'`" \
           magneticio/vamp-docker:0.8.5-marathon
```

Mounting volumes is important. [Read this great article about starting Docker containers from/within another Docker container](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).

{{< note title="Note" >}}
Marathon port is 9090 (e.g. `http://localhost:9090/`) instead of the default 8080. 
{{< /note >}}

#### Mac OS X 10.8+ or Windows 7+

A typical command on Mac OS X running Docker Toolbox would be:
```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v `docker-machine ssh default "which docker"`:/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=`docker-machine ip default`" \
           magneticio/vamp-docker:0.8.5-marathon
```
  
{{< note title="Note" >}}
If you installed Docker Toolbox, please use Docker Quickstart Terminal. We don't currently support Kitematic.
{{< /note >}}

### Step 3: Check Vamp is up and running

After some downloading and booting, your Docker log will show Vamp has launched and report something like:

```
...Bound to /0.0.0.0:8080
```

Now check if Vamp is home on `http://{docker-machine ip default}:8080/` and you're ready for the [Vamp Sava tutorials](/try-vamp/sava-tutorials/)

![](/images/screens/quicksetup-marathon-infopanel-v090.gif)

Exposed services:


 HAProxy statistics | [http://localhost:1988](http://localhost:1988) (username/password: haproxy) 


- HAProxy statistics [http://localhost:1988](http://localhost:1988) (username/password: haproxy)
- Elasticsearch HTTP [http://localhost:9200](http://localhost:9200)
- Kibana [http://localhost:5601](http://localhost:5601)
- Sense [http://localhost:5601/app/sense](http://localhost:5601/app/sense)
- Mesos [http://localhost:5050](http://localhost:5050)
- Marathon [http://localhost:9090](http://localhost:9090)
- Chronos [http://localhost:4400](http://localhost:4400)
- Vamp [http://localhost:8080](http://localhost:8080)

If you run on Docker machine, use `docker-machine ip default` instead of `localhost`.

{{< note title="Note" >}}
This set up runs all of Vamp's components in one container. This is definitely not ideal, but works fine for kicking the tires.
You will run into cpu, memory and storage issues pretty soon though. Also, random ports are assigned by Vamp which you might not have exposed on either Docker or your Docker Toolbox Vagrant box.  
{{< /note >}}


## What next?

* Now you're all set to follow our [Vamp Sava tutorials](/try-vamp/sava-tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

If you need help you can also find us on [Gitter] (https://gitter.im/magneticio/vamp)