---
date: 2016-09-13T09:00:00+00:00
title: Configure Vamp
---

Vamp can be configured using one or a combination of the Vamp `application.conf` HOCON file ([github.com/typesafehub - config](https://github.com/typesafehub/config)), environment variables and system properties.

For example:
```bash

export VAMP_INFO_MESSAGE=Hello # overriding Vamp info message (vamp.info.message)

java -Dvamp.gateway-driver.host=localhost \
     -Dlogback.configurationFile=logback.xml \
     -Dconfig.file=application.conf \
     -jar vamp.jar
```

## The Vamp `application.conf` file

The Vamp `application.conf` consists of the following sections. All sections are nested inside a parent `vamp {}` tag.

* [rest-api](/documentation/installation/configure-vamp/#rest-api)
* [persistence](/documentation/installation/configure-vamp/#persistence)
* [container-drivers](/documentation/installation/configure-vamp/#container-drivers)
* [gateway-driver](/documentation/installation/configure-vamp/#gateway-driver)
* [operation](/documentation/installation/configure-vamp/#operation)

### rest-api
Configure the port, host name and interface that Vamp runs on using the `rest-api.port`

```
vamp {
  rest-api {
    interface = 0.0.0.0
    host = localhost
    port = 8080
    response-timeout = 10 seconds # HTTP response time out
  }
}    
```


### persistence

{{< note title="Updated for Vamp 0.9.1" >}}
* In the [Vamp configuration](/documentation/installation/configure-vamp/#persistence) we set `persistence caching` by default to `false`. In our Vamp images we set this to `true` to make it easier on the persistence store load. Check out this [default Vamp 0.9.1 configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) for reference.
* We've added a key-value store as a persistence data store. Check out this [default Vamp 0.9.1 configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) for reference.
{{< /note >}}

Vamp uses Elasticsearch for persistence and ZooKeeper ([apache.org - ZooKeeper](https://zookeeper.apache.org/)), etcd ([coreos.com  - etcd documentation](https://coreos.com/etcd/docs/latest/)) or Consul ([consul.io](https://www.consul.io/)) for key-value store (keeping HAProxy configuration).

```yaml
vamp {
  persistence {
    response-timeout = 5 seconds

    database {
      type: "elasticsearch" # elasticsearch or in-memory (no persistence)
      elasticsearch.url = ${vamp.pulse.elasticsearch.url}
    }

    key-value-store {

      type = "zookeeper"    # zookeeper, etcd or consul
      base-path = "/vamp"   # base path for keys, e.g. /vamp/...

      zookeeper {
        servers = "192.168.99.100:2181"
      }

      etcd {
        url = "http://192.168.99.100:2379"
      }

      consul {
        url = "http://192.168.99.100:8500"
      }
    }
  }
}
```

`zookeeper`, `etcd` or `consul` configuration is needed based on the type, e.g. if `type = "zookeeper"` then only `zookeeper.servers` should be set.

### Container drivers

Vamp can be configured to work with the following container drivers:

* [Docker](/documentation/installation/configure-vamp/#docker)
* [Mesos/Marathon](/documentation/installation/configure-vamp/#mesos-marathon)
* [Kubernetes](/documentation/installation/configure-vamp/#kubernetes)
* [Rancher](/documentation/installation/configure-vamp/#rancher)

#### Docker
Vamp can talk directly to a Docker daemon and its driver is configured by default. This is useful for local testing, Docker Swarm support is coming soon.
Vamp can even run inside Docker while deploying to Docker.

1. Install Docker as per Docker's installation manual ([docs.docker.com - install Docker engine](https://docs.docker.com/engine/installation/))
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

#### Mesos/Marathon
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

#### Kubernetes
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

#### Rancher

Specify Rancher as the container driver in the Vamp `application.conf` file.   

Taken from the example `application.conf` file for Rancher ([github.com/magneticio - vamp-rancher](https://github.com/magneticio/vamp-docker/blob/master/vamp-rancher/application.conf)):

```
  ...
  container-driver.type = "rancher"
  ...

```

### gateway-driver

The gateway-driver section configures how traffic should be routed through Vamp Gateway Agent. See the below example on how to configure this:

```yaml
vamp {
  gateway-driver {
    host: "10.193.238.26"              # Vamp Gateway Agent / Haproxy, internal IP.
    response-timeout: 30 seconds

    haproxy {
      ip: 127.0.0.1                    # HAProxy backend server IP

      template: ""                     # Path to template file, if not specified default will be used

      virtual-hosts {
        ip: "127.0.0.1"                # IP, if virtual hosts are enabled
        port: 40800                    # Port, if virtual hosts are enabled
      }
    }
  }
}  
```

The reason for the need to configure `vamp.gateway-driver.host` is that when services are deployed, they need to be able to find Vamp Gateway Agent in their respective networks. This can be a totally different network than where Vamp is running.
Let's use an example: `frontend` and `backend` service, `frontend` depends on `backend` - in Vamp DSL that would be 2 clusters (assuming the same deployment).
There are different ways how `frontend` can discover its dependency `backend`, and to make things simpler Vamp supports using specific environment parameters.

```yaml
---
name: my-web-app
clusters:
  frontend:
    services:
      breed:
        name: my-frontend:1.0.0
        deployable: magneticio/my-frontend:1.0.0
        ports:
          port: 8080/http
        environment_variables:
          BACKEND: http://$backend.host:$backend.ports.port
        dependencies:
          backend: my-backend:1.0.0
  backend:
    services:
      breed:
        name: my-backend:1.0.0
        deployable: magneticio/my-backend:1.0.0
        ports:
          port: 8080/http

```
In this example `$backend.host` will have the value of the `vamp.gateway-driver.host` configuration parameter, while `$backend.ports.port` the next available port from `vamp.operation.gateway.port-range`.
`frontend` doesn't connect to `backend` directly but via Vamp Gateway Agent(s) - given on these host and port parameters.
This is quite simmilar to common pattern to access any clustered application.
For instance if you want to access DB server, you will have an address string based on e.g. DNS name or something simmilar.
Note that even without Vamp, you would need to setup access to `backend` in some similar way.
With Vamp, access is via VGA's and that allows specific routing (conditions, weights) needed for A/B testing and canary releasing.
Additional information can be found on [service discovery page](/documentation/how-vamp-works/service-discovery/).

### operation

The operation section holds all parameters that control how Vamp executes against "external" services: this also includes Vamp Pulse and Vamp Gateway Agent.

```yaml
operation {
  sla.period = 5 seconds        # controls how often an SLA checks against metrics
  escalation.period = 5 seconds # controls how often Vamp checks for escalation events
	synchronization {
    period = 4 seconds          # controls how often Vamp performs
                                # a sync between Vamp and the container driver.
    timeout {
      ready-for-deployment: 600	seconds   # controls how long Vamp waits for a
                                          # service to start. If the service is not started
                                          # before this time, the service is registered as "error"
      ready-for-undeployment: 600 seconds # similar to "ready-for-deployment", but for
                                          # the removal of services.
    }
   }

  gateway {
    port-range = 40000-45000
    response-timeout = 5 seconds # timeout for container operations

    virtual-hosts.formats {      # name format
      gateway                 = "$gateway.vamp"
      deployment-port         = "$port.$deployment.vamp"
      deployment-cluster-port = "$port.$cluster.$deployment.vamp"
    }
  }

  deployment {
    scale {         # default scale, if not specified in blueprint
      instances: 1
      cpu: 1
      memory: 1GB
    }

    arguments: []   # split by first '=',
                    # Docker command line arguments, e.g. "security-opt=seccomp:unconfined"
  }
}
```  

For each cluster and service port within the same cluster a gateway is created - this is exactly as one that can be created using Gateway API.
That means specific conditions and weights can be applied on traffic to/from cluster services - A/B testing and canary releases support.
`vamp.operation.gateway.port-range` is range of port values that can be used for these cluster/port gateways.
These ports need to be available on all Vamp Gateway Agent hosts.


## Environment variables

Each configuration parameter can be replaced by an environment variable. Environment variables have precedence over configuration from `application.conf` or system properties.  Read more about [environment variables](/documentation/using-vamp/environment-variables/).

### Environment variable names
Environment variable names are based on the configuration parameter name converted to upper case. All non-alphanumerics should be replaced by an underscore `_`

```
vamp.info.message           ⇒ VAMP_INFO_MESSAGE
vamp.gateway-driver.timeout ⇒ VAMP_GATEWAY_DRIVER_TIMEOUT
```


{{< note title="What next?" >}}
* Follow the [getting started tutorials](/documentation/tutorials/)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}
