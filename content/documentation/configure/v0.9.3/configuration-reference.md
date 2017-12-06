---
date: 2016-09-13T09:00:00+00:00
title: Configuration reference
menu:
  main:
    identifier: "configuration-reference-v093"
    parent: "Configuration"
    weight: 30
aliases:
    - /documentation/installation/v0.9.3/configuration-reference
---

{{< note title="The information on this page applies to Vamp v0.9.3" >}}

* Switch to the [latest version of this page](/documentation/configure/configuration-reference).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

This page describes the structure and parameters in the Vamp configuration files (reference.conf and application.conf).
For details on how to customise your Vamp configuration, see [how to configure Vamp](/documentation/configure/v0.9.3/configure-vamp/).

**Vamp:**

* [Vamp configuration](/documentation/configure/v0.9.3/configuration-reference/#vamp-configuration)
* [Vamp lifter](/documentation/configure/v0.9.3/configuration-reference/#vamp-lifter-configuration)

**By vendor:**

* [DC/OS (Mesos, Marathon & Chronos)](/documentation/configure/v0.9.3/configuration-reference/#dc-os-configuration)
* [Kubernetes](/documentation/configure/v0.9.3/configuration-reference/#kubernetes-configuration)
* [Rancher](/documentation/configure/v0.9.3/configuration-reference/#rancher-configuration)
* [Docker](/documentation/configure/v0.9.3/configuration-reference/#docker-configuration)
* [Elasticsearch](/documentation/configure/v0.9.3/configuration-reference/#elasticsearch-configuration)
* [Zookeeper](/documentation/configure/v0.9.3/configuration-reference/#zookeeper-configuration)
* [Consul](/documentation/configure/v0.9.3/configuration-reference/#consul-configuration)
* [etcd](/documentation/configure/v0.9.3/configuration-reference/#etcd-configuration)
* [Redis](/documentation/configure/v0.9.3/configuration-reference/#redis-configuration)
* [HAProxy](/documentation/configure/v0.9.3/configuration-reference/#haproxy-configuration)

## Vamp configuration
The full Vamp `reference.conf` file can be found in the Vamp project repo ([github.com/magneticio - Vamp reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)).

### Vamp { }
Vamp configuration is described in sections, nested inside a parent `vamp {}` tag. Usage, defaults and requirements for each section are outlined below: [info](/documentation/configure/v0.9.3/configuration-reference/#info), [stats](/documentation/configure/v0.9.3/configuration-reference/#stats), [model](/documentation/configure/v0.9.3/configuration-reference/#model), [persistence](/documentation/configure/v0.9.3/configuration-reference/#persistence), [container driver](/documentation/configure/v0.9.3/configuration-reference/#container-driver), [workflow driver](/documentation/configure/v0.9.3/configuration-reference/#workflow-driver), [http-api](/documentation/configure/v0.9.3/configuration-reference/#http-api), [gateway driver](/documentation/configure/v0.9.3/configuration-reference/#gateway-driver), [pulse](/documentation/configure/v0.9.3/configuration-reference/#pulse), [operation](/documentation/configure/v0.9.3/configuration-reference/#operation), [common](/documentation/configure/v0.9.3/configuration-reference/#common)

### akka { }
Vamp is based on the Akka library. Akka configuration is included in `reference.conf` inside the `akka {}` tag. These settings can be tweaked in `application.conf` (advanced use only). Refer to the akka documentation for details.

-------

### Info
Settings required for gathering information on Vamp and components (memory and load). You can also specify an intro message here.
```
info {
  message = "Hi, I'm Vamp! How are you?"
  timeout = 3 seconds
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
message  | - |    Hi, I'm Vamp! How are you? |  The welcome message displayed in the Vamp info pane
timeout    | - |    3 seconds |  Response timeout for each component (e.g. Persistance, Container Driver...). How long we will wait for components to reply on an API info call. Should be less than `http-api.response-timeout`.



-------

### Stats
Aggrgated statistics for Vamp.
```
stats {
  timeout = 5 seconds
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  timeout  | - |  5 seconds  |  Response timeout for each component

-------
### Model

```
model {
  default-deployable-type = "container/docker"
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  default-deployable-type  | container/docker, container/rkt  |  container/docker  |  The default container type

-------

### Persistence
Vamp uses Elasticsearch or a key-value store for persistence. The key-value store is also used to hold the HAProxy configuration. Currently supported options:

* ZooKeeper ([apache.org - ZooKeeper](https://zookeeper.apache.org/))
* etcd ([coreos.com  - etcd documentation](https://coreos.com/etcd/docs/latest/))
* Consul ([consul.io](https://www.consul.io/))

```
persistence {
  response-timeout = 5 seconds

  database {
    type: "" # key-value or in-memory
    key-value {
      caching = false
    }
  }

  key-value-store {
    type = ""
    base-path = "/vamp"
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  response-timeout   |  -  |   5 seconds  |
  database.type   |  elasticsearch, key-value, in-memory  |   -  |  set in `application.conf`
  database.key-value.caching               | true, false   |  false  |  set this to true to make it easier on the persistence store load
  key-value-store.type                     | zookeeper, etcd, consul   |   -  |  set in `application.conf`
  key-value-store.base-path                | -  |  /vamp  |

-------

### Container driver
Vamp can be configured to work with Docker, Mesos/Marathon, Kubernetes or Rancher container drivers. Only configuration for the specified `container-driver.type` is required.
See the [example configurations](/documentation/configure/v0.9.3/example-configurations).
```
container-driver {
  type = ""
  network = "BRIDGE"
  namespace = "io.vamp"
  response-timeout = 30 seconds # timeout for container operations

}
```
Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
 type            |  docker, kubernetes, marathon, rancher     |  -   |  set in `application.conf`. Also include the configuration section for the specified container driver type (see below).
 network  | -   |  BRIDGE   |  Default network
 namespace  | -   |  -   |
 response-timeout  | -   |  30 seconds   |  Timeout for container operations


-------

### Workflow driver
Used for Vamp workflows.
```
workflow-driver {
  type = "none"
  response-timeout = 30 seconds

  workflow {
    deployables = {
      application.javascript = {
        type = "container/docker"
        definition = "" # workflow agent
        environment-variables = []
        arguments: []
        network = "BRIDGE"
        command = ""
      }
    }
    scale {         # default scale, if not specified in workflow
      instances = 1
      cpu = 0.1
      memory = 64MB
    }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  type  | docker, marathon, kubernetes, rancher, chronos, none |   none   |  Daemon (docker, marathon, kubernetes, rancher), time and event triggered (chronos). Can be combined (csv), e.g. `marathon,chronos`
  response-timeout  | -  |  30 seconds   |  Timeout for container operations
  deployables.application.javascript  | - |   `type = `"container/docker", definition = "" # workflow agent, environment-variables = [], arguments: [], network = "BRIDGE", command = ""`  |   Applied to every application/javascript breed type.
  scale   | - |    instances = 1 cpu = 0.1 memory = 64MB  |  Default scale. Used if not specified in workflow

-------

### http-api
Configuration for the Vamp API.
```
http-api {

  interface = 0.0.0.0
  port = 8080

  response-timeout = 10 seconds

  strip-path-segments = 0

  sse.keep-alive-timeout = 15 seconds

  ui {
    directory = ""
    index = ""
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  interface  | -   |   0.0.0.0  |
  port   | - |   8080   |  The port Vamp runs on
  response-timeout   | - |    10 seconds  |  HTTP response timeout
  strip-path-segments   | - |    0  |
  sse.keep-alive-timeout   | - |    15 seconds  |  timeout after an empty comment (":\n") will be sent in order keep connection alive
  ui.directory   | - |   -  |  set in `application.conf` to use the Vamp UI
  ui.index  | - |    -  |  index file, e.g. `${vamp.http-api.ui.directory}"/index.html"`. Set in `application.conf` to use the Vamp UI

-------

### Gateway driver
The gateway-driver section configures how traffic should be routed through Vamp Gateway Agent. Read more about how Vamp uses these parameters for [service discovery](/documentation/using-vamp/service-discovery).
```
gateway-driver {
  host = "localhost"
  response-timeout = 30 seconds
  marshallers = []
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  host    | - |   localhost  |  The Vamp Gateway Agent/HAProxy, internal IP. To simplify service discovery, Vamp supports using specific environment parameters. `{cluster_name}.host` will have the value of this parameter (`vamp.gateway-driver.host`)
  response-timeout    | - |  30 seconds   |  timeout for gateway operations
  marshallers   | -  |  -   |  set in application.conf or 3rd-party reference.conf

-------

### Pulse
Handles all Vamp events.

```
pulse {
  type = "" # no-store
  response-timeout = 30 seconds
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  type   | no-store or 3rd party option  |  ""   |  Set in application.conf. When set to no-store it will not be possible to aggregate events and there will be problems getting metrics.
  response-timeout   | -   |  30 seconds   |  timeout for pulse operations

-------

### Operation
The operation section holds all parameters that control how Vamp executes against “external” services: this also includes Vamp Pulse and Vamp Gateway Agent.
```
operation {

  reload-configuration = true
  reload-configuration-delay = 2s

  synchronization {

    initial-delay = 5 seconds
    period = 6 seconds

    mailbox {
      mailbox-type = "akka.dispatch.NonBlockingBoundedMailbox"
      mailbox-capacity = 100
    }

    timeout {
      ready-for-deployment = 600 seconds #
      ready-for-undeployment = 600 seconds #
    }

    check {
      cpu = false
      memory = false
      instances = true
    }
  }

  deployment {
    scale {
      instances = 1
      cpu = 1
      memory = 1GB
    }

    arguments = []
  }

  gateway {
    port-range = 40000-45000
    response-timeout = 5 seconds
  }

  sla.period = 5 seconds
  escalation.period = 5 seconds

  health.window = 30 seconds

  metrics.window = 30 seconds

  gateway.virtual-hosts = {
    enabled = true
    formats {
      gateway = "$gateway.vamp"
      deployment-port = "$port.$deployment.vamp"
      deployment-cluster-port = "$port.$cluster.$deployment.vamp"
    }
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  reload-configuration   | true, false    |  true  |  if set to false, dynamic configuration will not be possible (configuration must be set at runtime)
  reload-configuration-delay   |      |  2s  |  allows for delay in initialisation when reloading config from external source (key value store)
  synchronisation   | -    |  -  |  see below [operation.synchronisation](/documentation/configure/v0.9.3/configuration-reference/#operation-synchronisation)
  deployment   | -    |  -  |  see below [operation.deployment](/documentation/configure/v0.9.3/configuration-reference/#operation-deployment)
  gateway   | -    |  -  |  see below [operation.gateway](/documentation/configure/v0.9.3/configuration-reference/#operation-gateway)
  sla.period    | -   |  5 seconds  |  controls how often an SLA checks against metrics
  escalation.period   | -    |  5 seconds  |  controls how often Vamp checks for escalation events
  health.window    | -   |  30 seconds  |
  metrics.window    | -   |  30 seconds  |
  gateway.virtual-hosts    | -   |  - |   see below [operation.gateway](/documentation/configure/v0.9.3/configuration-reference/#operation-gateway-virtual-hosts)

### operation.synchronisation

```
  synchronization {

    initial-delay = 5 seconds
    period = 6 seconds

    mailbox {
      mailbox-type = "akka.dispatch.NonBlockingBoundedMailbox"
      mailbox-capacity = 100
    }

    timeout {
      ready-for-deployment = 600 seconds
      ready-for-undeployment = 600 seconds
    }

    check {
      cpu = false
      memory = false
      instances = true
    }
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
 initial-delay  | -   |   5 seconds  |
 period  | -    |   6 seconds  |  controls how often Vamp performs a sync between Vamp and the container driver. synchronization will be active only if period is greater than 0
 mailbox.mailbox-type   | -   |   akka.dispatch.NonBlockingBoundedMailbox   |
 mailbox.mailbox-capacity | -   |     100  |  Queue for operational tasks (deployments etc.)
 timeout.ready-for-deployment   | -   |    600 seconds  |  controls how long Vamp waits for a service to start. If the service is not started before this time, the service is registered as "error". If set to 0, Vamp will keep trying forever.
 timeout.ready-for-undeployment  | -    |   600 seconds   |  similar to "ready-for-deployment" (above), but for the removal of services.
 check.cpu   | true, false   |    false  |
 check.memory  | true, false |    false   |
 check.instances  | true, false |    false   |

### operation.deployment

```
  deployment {
    scale {
      instances = 1
      cpu = 1
      memory = 1GB
    }

    arguments = []
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  scale   | - |  instances = 1 cpu = 1  memory = 1GB  |  default scale, used if not specified in blueprint
  arguments | -  |   -  |  Docker command line arguments, e.g. "security-opt=seccomp:unconfined". Split by first '='

### operation.gateway
For each cluster and service port within the same cluster a gateway is created - this is exactly as one that can be created using Gateway API.
That means specific conditions and weights can be applied on traffic to/from cluster services - A/B testing and canary releases support.
`vamp.operation.gateway.port-range` is range of port values that can be used for these cluster/port gateways. These ports need to be available on all Vamp Gateway Agent hosts.
```
  gateway {
    port-range = 40000-45000
    response-timeout = 5 seconds
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  port-range   | - |  40000-45000   |   range of port values that can be used for Vamp internal gateways. These ports need to be available on all Vamp Gateway Agent hosts
  response-timeout  | -   |   5 seconds  |  timeout for container operations

### operation.gateway.virtual-hosts
Defines the standard Vamp virtual host gateway format.

```
  gateway.virtual-hosts = {
    enabled = true
    formats {
      gateway = "$gateway.vamp"
      deployment-port = "$port.$deployment.vamp"
      deployment-cluster-port = "$port.$cluster.$deployment.vamp"
    }
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  enabled  | true, false |  true   |  if set to false, Vamp will not automatically generate gateway virtual host names. You can still specify in gateways/blueprints.
  formats.gateways  | -  |   $gateway.vamp  |  name format
  formats.deployment-port   | - |  $port.$deployment.vamp   |  name format
  formats.deployment-cluster-port   | - |  $port.$cluster.$deployment.vamp   |  name format

------

### Common

```
common.http.client.tls-check = true
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  http.client.tls-check  | true, false  |  true  |  If set to false tls-check will be disabled, for example to allow Vamp to accept invalid certificates.

---

## Vamp Lifter configuration
([github.com/magneticio - vamp-lifter reference.conf](https://github.com/magneticio/vamp-lifter/blob/master/src/main/resources/reference.conf)).

```
vamp.lifter {

  pulse.enabled = true

  persistence.enabled = true

  artifact {

    enabled = true

    override = false

    postpone = 5 seconds # postpone initalization

    files = []

    resources = []
  }
}
```

---

## DC/OS configuration
([github.com/magneticio - vamp-dcos reference.conf](https://github.com/magneticio/vamp-dcos/blob/master/src/main/resources/reference.conf)).

```

vamp {
  container-driver {
    # type = "" # marathon
    mesos.url = ""
    marathon {
      user = ""
      password = ""
      url = ""
      sse = true
      expiration-period = 30 seconds
      reconciliation-period = 0 seconds
      workflow-name-prefix = "/vamp/workflow-"
    }
  }
  workflow-driver {
    # type = "" # marathon (daemon), chronos (time and event triggered)
    # it's possible to combine (csv): 'marathon,chronos'
    chronos.url = ""
  }
}
```

---

## Kubernetes configuration
([github.com/magneticio - vamp-kubernetes reference.conf](https://github.com/magneticio/vamp-kubernetes/blob/master/src/main/resources/reference.conf)).

```
vamp {
  container-driver {
    # type = "kubernetes"
    kubernetes {
      url = ""
      namespace = "default"
      workflow-name-prefix = "vamp-workflow-"
      service-type = "NodePort" # NodePort or LoadBalancer
      create-services = true
      vamp-gateway-agent-id = "vamp-gateway-agent"
      bearer = ""
      token = "/var/run/secrets/kubernetes.io/serviceaccount/token"
    }
  }
  # workflow-driver.type = "kubernetes"
}
```

---

## Rancher configuration
([github.com/magneticio - vamp-rancher reference.conf](https://github.com/magneticio/vamp-rancher/blob/master/src/main/resources/reference.conf)).

```
vamp {
  container-driver {
    # type = "rancher"
    rancher {
      url = ""
      workflow-name-prefix = "vamp-workflow-"
      user = ""
      password = ""
      environment {
        name = "vamp"
        deployment.name-prefix = ""
      }
    }
  }
  # workflow-driver.type = "rancher"
}
```

---

## Docker configuration
([github.com/magneticio - vamp-docker reference.conf](https://github.com/magneticio/vamp-docker/blob/master/src/main/resources/reference.conf)).

```
vamp {
  container-driver {
    # type = "docker"
    docker {
      workflow-name-prefix = "vamp_workflow"
      repository {
        email = ""
        username = ""
        password = ""
        server-address = ""
      }
    }
  }
  # workflow-driver.type = "docker"
}
```

---

## Elasticsearch configuration
([github.com/magneticio - vamp-elasticsearch reference.conf](https://github.com/magneticio/vamp-elasticsearch/blob/master/src/main/resources/reference.conf)).

```
vamp {
  persistence.database {
    # type: "elasticsearch"
    elasticsearch {
      url = ""
      response-timeout = 5 seconds # timeout for elasticsearch operations
      index = "vamp-persistence"
    }
  }
  pulse {
    # type = "elasticsearch"
    elasticsearch {
      url = "" # e.g http://localhost:9200
      index {
        name = "vamp-pulse"
        time-format.event = "YYYY-MM-dd"
      }
    }
  }
}
```

---

## Zookeeper configuration
([github.com/magneticio - vamp-zookeeper reference.conf](https://github.com/magneticio/vamp-zookeeper/blob/master/src/main/resources/reference.conf)).
The key-value store is also used to hold the HAProxy configuration and dynamic configuration changes.

```
vamp.persistence.key-value-store {
  # type = "zookeeper"
  zookeeper {
    servers = ""
    session-timeout = 5000
    connect-timeout = 5000
  }
}
```

---

## Consul configuration
([github.com/magneticio - vamp-consul reference.conf](https://github.com/magneticio/vamp-consul/blob/master/src/main/resources/reference.conf)).
The key-value store is also used to hold the HAProxy configuration and dynamic configuration changes.

```
vamp.persistence.key-value-store {
  # type = "consul"
  consul.url = ""
}
```

---

## etcd configuration
([github.com/magneticio - vamp-etcd reference.conf](https://github.com/magneticio/vamp-etcd/blob/master/src/main/resources/reference.conf)).
The key-value store is also used to hold the HAProxy configuration and dynamic configuration changes.

```
vamp.persistence.key-value-store {
  # type = "etcd"
  etcd.url = ""
}
```

---

## Redis configuration
([github.com/magneticio - vamp-redis reference.conf](https://github.com/magneticio/vamp-redis/blob/master/src/main/resources/reference.conf)).

```
vamp.persistence.key-value-store {
  # type = "redis"
  redis {
    host = ""
    port = 6379
  }
}
```

---

## HAProxy configuration
([github.com/magneticio - vamp-haproxy reference.conf](https://github.com/magneticio/vamp-haproxy/blob/master/src/main/resources/reference.conf)).

```
# vamp.gateway-driver.marshallers = [
#   {
#     type = "haproxy"
#     name = "1.7"
#     template {
#       file = "" # if specified it will override the resource template
#       resource = "/io/vamp/gateway_driver/haproxy/template.twig" # it can be empty
#     }
#   }
# ]
```

{{< note title="What next?" >}}
* Read about [how to configure Vamp](/documentation/configure/v0.9.3/configure-vamp)
* Look at some [example configurations](/documentation/configure/v0.9.3/example-configurations)
* Follow the [tutorials](/documentation/tutorials/)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}
