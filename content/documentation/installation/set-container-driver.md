---
date: 2016-09-30T12:00:00+00:00
title: Set container driver
---

Vamp can be configured to work with the following container drivers:

* [Docker](#docker)
* [Mesos/Marathon](#mesos-marathon)
* [Kubernetes](#kubernetes)
* [Rancher](#rancher)

## Docker
Vamp can talk directly to a Docker daemon and its driver is configured by default. This is useful for local testing, Docker Swarm support is coming soon.
Vamp can even run inside Docker while deploying to Docker.

1. Install Docker as per Docker's installation manual ([docs.docker.com - install Docker engine](https://docs.docker.com/installation/))
2. Check the `DOCKER_*` environment variables Vamp uses to connect to Docker, i.e.

    ```
    DOCKER_HOST=tcp://192.168.99.100:2376
    export DOCKER_MACHINE_NAME=default
    DOCKER_TLS_VERIFY=1
    DOCKER_CERT_PATH=/Users/tim/.docker/machine/machines/default
    ```

3. If Vamp can't find these environment variables, it falls back to using the `unix:///var/run/docker.sock` Unix socket for communicating with Docker.
4. Update the container-driver section in Vamp's config file. If you use a package installer like `yum` or `apt-get` you can find this file in `/usr/share/vamp/conf/application.conf`:

    ```
    ...
    container-driver {
      type = "docker"
      response-timeout = 30 # seconds, timeout for container operations
    }
    ...
    ```
    See [Vamp configuration](/documentation/installation/configure-vamp/) for details of the the Vamp `application.conf` file
5. (Re)start Vamp by restarting the Java process by hand.   

## Mesos/Marathon
Vamp can use the full power of Marathon running on either a DCOS cluster or custom Mesos cluster. You can use Vamp's DSL, or you can pass native Marathon options by [using a dialect in a blueprint.](/documentation/using-vamp/blueprints/#dialects)  

1. Set up a DCOS cluster using Mesosphere's assisted install on AWS ([mesosphere.com - product](https://mesosphere.com/product/)).  
If you prefer, you can build your own Mesos/Marathon cluster. Here are some tutorials and scripts to help you get started:

  * Mesos Ansible playbook ([github.com/mhamrah - ansible mesos playbook](https://github.com/mhamrah/ansible-mesos-playbook))
  * Mesos Vagrant ([github.com/everpeace - vagrant-mesos](https://github.com/everpeace/vagrant-mesos))
  * Mesos Terraform ([github.com/ContainerSolutions - Terraform Mesos](https://github.com/ContainerSolutions/terraform-mesos))

3. Whichever way you set up Marathon, in the end you should be able to see something like this:  
![](/images/screens/marathon-screenshot.png)

4. Make a note of the Marathon endpoint (host:port) and update the container-driver section in [Vamp's config file](/documentation/installation/configure-vamp/). If you use a package installer like `yum` or `apt-get` you can find this file in `/usr/share/vamp/conf/application.conf`. Set the "url" option to the Marathon endpoint.

    ```
    ...
    container-driver {
      type = "marathon"
      url = "http://<marathon_host>:<marathon_port>" 
      response-timeout = 30 # seconds, timeout for container operations
    }
    ...
    ```    
5. (Re)start Vamp by restarting the Java process by hand.   

## Kubernetes
Specify Kubernetes as the container driver in the Vamp `application.conf` file.   

Taken from the example `application.conf` file for Kubernetes ([github.com/magneticio - vamp-kubernetes](https://github.com/magneticio/vamp-docker/blob/master/vamp-kubernetes/application.conf)):

```
  ...
  container-driver {

    type = "kubernetes"

    kubernetes {
      url = "https://kubernetes"
      service-type = "LoadBalancer"
    }
    ...
```

## Rancher

Specify Rancher as the container driver in the Vamp `application.conf` file.   

Taken from the example `application.conf` file for Rancher ([github.com/magneticio - vamp-rancher](https://github.com/magneticio/vamp-docker/blob/master/vamp-rancher/application.conf)):

```
  ...
  container-driver.type = "rancher"
  ...

```

{{< note title="What next?" >}}
* [Configure Vamp](/documentation/installation/configure-vamp)
* [Configure Elastic Stack](/documentation/installation/configure-elastic-stack)
* Follow the [getting started tutorials](/documentation/tutorials)
{{< /note >}}