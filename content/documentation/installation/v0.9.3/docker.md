---
date: 2016-09-30T12:00:00+00:00
title: Docker
menu:
  main:
    identifier: "docker-v093"
    parent: "Installation"
    weight: 70
---

{{< note title="Note!" >}}
Vamp v0.9.3 has not been tested on the latest local version of Docker.
Docker Swarm support is coming soon, see [github.com - issue #690: Docker swarm support](https://github.com/magneticio/vamp/issues/690)
{{< /note >}}

Vamp can talk directly to a Docker daemon and its driver is configured by default. This is useful for local testing. Vamp can even run inside Docker while deploying to Docker.  You can pass native Docker options by [using the Docker dialect in a Vamp blueprint.](/documentation/using-vamp/blueprints/#dialects).

#### Set Docker as the Vamp container driver
1. Install Docker as per Docker's installation manual ([docs.docker.com - install Docker engine](https://docs.docker.com/engine/installation/))
2. Check the `DOCKER_*` environment variables Vamp uses to connect to Docker, i.e.

    ```
    DOCKER_HOST=tcp://192.168.99.100:2376
    export DOCKER_MACHINE_NAME=default
    DOCKER_TLS_VERIFY=1
    DOCKER_CERT_PATH=/Users/tim/.docker/machine/machines/default
    ```

3. If Vamp can't find these environment variables, it falls back to using the `unix:///var/run/docker.sock` Unix socket for communicating with Docker.
4. Update the `container-driver` section in the Vamp `application.conf` config file. If you use a package installer like `yum` or `apt-get` you can find this file in `/usr/share/vamp/conf/application.conf`

    ```
    ...
    container-driver {
      type = "docker"
      response-timeout = 30 # seconds, timeout for container operations
    }
    ...
    ```
5. (Re)start Vamp by restarting the Java process by hand.


![](/images/logos/docker-member.jpg)

{{< note title="What next?" >}}
* Find out [how to configure Vamp](/documentation/configure/v0.9.3/configure-vamp)
* Check the [configuration reference](/documentation/configure/v0.9.3/configuration-reference)
* Look at some [example configurations](/documentation/configure/v0.9.3/example-configurations)
* Follow the [tutorials](/documentation/tutorials/)
{{< /note >}}
