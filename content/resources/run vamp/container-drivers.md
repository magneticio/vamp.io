---
date: 2016-09-13T09:00:00+00:00
title: container drivers
---

Vamp supports multiple container-orchestration platforms and the list of supported container-orchestration platforms will expand in the future.   
When you install Vamp, you choose your container-orchestration platform and configure the appropriate driver. Think of how ORM's work: a single DSL/language with support for multiple databases through a driver system.

Currently supported container drivers:

- [Docker](#docker)
- [Mesosphere Marathon](?#mesosphere-marathon)
- Kubernetes ([quick setup with Kubernetes](/resources/run-vamp/quick-setup/quick-setup-kubernetes/))

{{< note title="Note!" >}}
Vamp Gateway Agent **should always** be able to find and route traffic to addresses of any of the containers deployed, regardless of the container driver. For further details, see [how Vamp works](/resources/how-vamp-works/).
{{< /note >}}

## Docker

Vamp can talk directly to a Docker daemon and its driver is configured by default. This is useful for local testing.
Vamp can even run inside Docker while deploying to Docker.

{{< note title="Note!" >}}
* As of release 0.8.0 Vamp has been tested against Docker 1.9.x and Docker Machine 0.5.x. 
* For release 0.7.9, Vamp's Docker driver only supports Docker 1.7+. Please refer to the Github issue in Docker's repo on why this is necessary. ([github.com/docker - issues: "Drop support for RHEL6/CentOS6"](https://github.com/docker/docker/issues/14365)).
{{< /note >}}

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
5. (Re)start Vamp by restarting the Java process by hand.   

## Mesosphere Marathon

Vamp can use the full power of Marathon running on either a DCOS cluster or custom Mesos cluster. You can use Vamp's DSL, or you can pass native Marathon options by [using a dialect in a blueprint.](/resources/using-vamp/blueprints/#dialects)

1. Set up a DCOS cluster using Mesosphere's assisted install on AWS ([mesosphere.com - product](https://mesosphere.com/product/)).  
{{< tip >}}
If you prefer, you can build your own Mesos/Marathon cluster. Here are some tutorials and scripts to help you get started:

  * Mesos Ansible playbook ([github.com/mhamrah - ansible mesos playbook](https://github.com/mhamrah/ansible-mesos-playbook))
  * Mesos Vagrant ([github.com/everpeace - vagrant-mesos](https://github.com/everpeace/vagrant-mesos))
  * Mesos Terraform ([github.com/ContainerSolutions - Terraform Mesos](https://github.com/ContainerSolutions/terraform-mesos))
{{< /tip >}}

3. Whichever way you set up Marathon, in the end you should be able to see something like this:  
![](/images/screens/marathon-screenshot.png)

4. Make a note of the Marathon endpoint (host:port) and update the container-driver section in [Vamp's config file](/configuration/). If you use a package installer like `yum` or `apt-get` you can find this file in `/usr/share/vamp/conf/application.conf`. Set the "url" option to the Marathon endpoint.

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





