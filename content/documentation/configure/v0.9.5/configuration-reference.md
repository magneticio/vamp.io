---
date: 2016-09-13T09:00:00+00:00
title: Configuration reference
menu:
  main:
    identifier: "configuration-reference-v095"
    parent: "Configuration"
    weight: 30
---

This page describes the structure and parameters in the default Vamp configuration files (reference.conf).
For details on how to customise your Vamp configuration, see [how to configure Vamp](/documentation/configure/v0.9.5/configure-vamp/).

**Vamp:**

* [Vamp configuration](/documentation/configure/v0.9.5/configuration-reference/#vamp-configuration)
* [Vamp lifter](/documentation/configure/v0.9.5/configuration-reference/#vamp-lifter-configuration)

**By vendor:**

* [DC/OS (Mesos, Marathon & Chronos)](/documentation/configure/v0.9.5/configuration-reference/#dc-os-configuration)
* [Kubernetes](/documentation/configure/v0.9.5/configuration-reference/#kubernetes-configuration)
* [Rancher](/documentation/configure/v0.9.5/configuration-reference/#rancher-configuration)
* [Docker](/documentation/configure/v0.9.5/configuration-reference/#docker-configuration)
* [AWS](/documentation/configure/v0.9.5/configuration-reference/#aws-configuration)
* [Elasticsearch](/documentation/configure/v0.9.5/configuration-reference/#elasticsearch-configuration)
* [MySQL](/documentation/configure/v0.9.5/configuration-reference/#mysql-configuration)
* [PostgreSQL](/documentation/configure/v0.9.5/configuration-reference/#postgresql-configuration)
* [Microsoft SQL server](/documentation/configure/v0.9.5/configuration-reference/#microsoft-sql-server-configuration)
* [In-Memory only](/documentation/configure/v0.9.5/configuration-reference/#in-memory-only-persistence)
* [Zookeeper](/documentation/configure/v0.9.5/configuration-reference/#zookeeper-configuration)
* [Consul](/documentation/configure/v0.9.5/configuration-reference/#consul-configuration)
* [etcd](/documentation/configure/v0.9.5/configuration-reference/#etcd-configuration)
* [Redis](/documentation/configure/v0.9.5/configuration-reference/#redis-configuration)
* [HAProxy](/documentation/configure/v0.9.5/configuration-reference/#haproxy-configuration)

## Vamp configuration
The Vamp reference.conf files can be found in the respective Vamp project repos. The usage, default setting and requirements for each section are outlined below:

[bootstrap](/documentation/configure/v0.9.5/configuration-reference/#vamp-bootstrap), [common](/documentation/configure/v0.9.5/configuration-reference/#vamp-common), [container driver](/documentation/configure/v0.9.5/configuration-reference/#vamp-container-driver), [gateway driver](/documentation/configure/v0.9.5/configuration-reference/#vamp-gateway-driver), [http-api](/documentation/configure/v0.9.5/configuration-reference/#vamp-http-api), [model](/documentation/configure/v0.9.5/configuration-reference/#vamp-model), [operation](/documentation/configure/v0.9.5/configuration-reference/#vamp-operation), [persistence](/documentation/configure/v0.9.5/configuration-reference/#vamp-persistence), [pulse](/documentation/configure/v0.9.5/configuration-reference/#vamp-pulse), [workflow driver](/documentation/configure/v0.9.5/configuration-reference/#vamp-workflow-driver)

---

### Vamp - bootstrap
([github.com/magneticio - bootstrap reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf))

Vamp is based on the Akka library. Akka configuration is included in the bootstrap reference.conf inside the `akka {}` tag. These settings can be tweaked in `application.conf` (advanced use only). Refer to the akka documentation for details.

```
vamp {
  namespace = "default"
  bootstrap.timeout = 3 seconds
}

akka {

  loglevel = "INFO"
  log-dead-letters = 0
  log-config-on-start = off
  log-dead-letters-during-shutdown = off
  loggers = ["akka.event.slf4j.Slf4jLogger"]
  event-handlers = ["akka.event.slf4j.Slf4jEventHandler"]

  actor.default-mailbox.mailbox-type = "akka.dispatch.SingleConsumerOnlyUnboundedMailbox"

  default-dispatcher.fork-join-executor.pool-size-max = 32
  jvm-exit-on-fatal-error = true

  http.server.server-header = ""
}
```

-------

### Vamp - common
([github.com/magneticio - common reference.conf](https://github.com/magneticio/vamp/blob/master/common/src/main/resources/reference.conf))

```
vamp.common.http.client.tls-check = true
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  http.client.tls-check  | true, false  |  true  |  If set to false tls-check will be disabled, for example to allow Vamp to accept invalid certificates.

---

### Vamp - container driver
([github.com/magneticio - container_driver reference.conf](https://github.com/magneticio/vamp/blob/master/container_driver/src/main/resources/reference.conf))

Vamp can be configured to work with Docker, Mesos/Marathon, Kubernetes or Rancher container drivers. Only configuration for the specified `container-driver.type` is required.
See the [example configurations](/documentation/configure/v0.9.5/example-configurations) and the associated reference.conf files:

* [DC/OS (Mesos, Marathon & Chronos)](/documentation/configure/v0.9.5/configuration-reference/#dc-os-configuration), [Kubernetes](/documentation/configure/v0.9.5/configuration-reference/#kubernetes-configuration), [Rancher](/documentation/configure/v0.9.5/configuration-reference/#rancher-configuration), [Docker](/documentation/configure/v0.9.5/configuration-reference/#docker-configuration), [AWS](/documentation/configure/v0.9.5/configuration-reference/#aws-configuration).

```
vamp.container-driver {
  type = ""
  network = "BRIDGE"
  label-namespace = "io.vamp"
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

### Vamp - gateway driver
([github.com/magneticio - gateway_driver reference.conf](https://github.com/magneticio/vamp/blob/master/gateway_driver/src/main/resources/reference.conf))

The gateway-driver section configures how traffic should be routed through Vamp Gateway Agent. Read more about how Vamp uses these parameters for [service discovery](/documentation/using-vamp/service-discovery).
```
vamp.gateway-driver {
  host = "" # vamg gateway agent host
  response-timeout = 30 seconds # timeout for gateway operations
  marshallers = []
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  host    | - |   -  |  The Vamp Gateway Agent/HAProxy, internal IP. To simplify service discovery, Vamp supports using specific environment parameters. `{cluster_name}.host` will have the value of this parameter (`vamp.gateway-driver.host`)
  response-timeout    | - |  30 seconds   |  timeout for gateway operations
  marshallers   | -  |  -   |  set in application.conf or 3rd-party reference.conf

-------

### Vamp - http-api
([github.com/magneticio - http-api reference.conf](https://github.com/magneticio/vamp/blob/master/http_api/src/main/resources/reference.conf))

Configuration for the Vamp API.
```
vamp.http-api {
  port = 8080
  interface = 0.0.0.0
  response-timeout = 10 seconds # HTTP response timeout
  strip-path-segments = 0
  sse.keep-alive-timeout = 15 seconds # timeout after an empty comment (":\n") will be sent in order keep connection alive
  websocket.stream-limit = 100
  ui {
    directory = ""
    index = "" # index file, e.g. ${vamp.http-api.ui.directory}"/index.html"
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  port   | - |   8080   |  The port Vamp runs on
  interface  | -   |   0.0.0.0  |
  response-timeout   | - |    10 seconds  |  HTTP response timeout
  strip-path-segments   | - |    0  |
  sse.keep-alive-timeout   | - |    15 seconds  |  timeout after an empty comment (":\n") will be sent in order keep connection alive
  websocket.stream-limit   | - |   100  |
  ui.directory   | - |   -  |  set in `application.conf` to use the Vamp UI
  ui.index  | - |    -  |  index file, e.g. `${vamp.http-api.ui.directory}"/index.html"`. Set in `application.conf` to use the Vamp UI

-------

### Vamp - model
([github.com/magneticio - model reference.conf](https://github.com/magneticio/vamp/blob/master/model/src/main/resources/reference.conf))

```
vamp.model.default-deployable-type = "container/docker"
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  default-deployable-type  | container/docker, container/rkt  |  container/docker  |  The default container type

-------

### Vamp - operation
([github.com/magneticio - operation reference.conf](https://github.com/magneticio/vamp/blob/master/operation/src/main/resources/reference.conf))

The Vamp operation reference.conf holds all parameters that control how Vamp executes against “external” services: this also includes Vamp Pulse and Vamp Gateway Agent.

* **operation.gateway:** For each cluster and service port within the same cluster a gateway is created - this is exactly the same as one that can be created using Gateway API.
That means specific conditions and weights can be applied on traffic to/from cluster services - A/B testing and canary releases support.
`vamp.operation.gateway.port-range` is range of port values that can be used for these cluster/port gateways. These ports need to be available on all Vamp Gateway Agent hosts.
* **operation.gateway.virtual-hosts:** Defines the standard Vamp virtual host gateway format.

```
vamp.operation {

  info {
    message = "Hi, I'm Vamp! How are you?"
    timeout = 3 seconds # response timeout for each component (e.g. Persistance, Container Driver...)
  }

  stats.timeout = 5 seconds # response timeout for each component

  reload-configuration = true
  reload-configuration-delay = 2s

  synchronization {

    initial-delay = 5 seconds #
    period = 6 seconds # synchronization will be active only if period is greater than 0

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
      health-checks = false
    }
  }

  deployment {
    scale {         # default scale, if not specified in blueprint
      instances = 1
      cpu = 1
      memory = 1GB
    }

    arguments = []   # split by first '='
  }

  gateway {
    port-range = 40000-45000
    response-timeout = 5 seconds # timeout for container operations
  }

  sla.period = 5 seconds # sla monitor period
  escalation.period = 5 seconds # escalation monitor period

  health.window = 30 seconds #

  metrics.window = 30 seconds #

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
  info.message  | - |    Hi, I'm Vamp! How are you? |  The welcome message displayed in the Vamp info pane
  info.timeout    | - |    3 seconds |  Response timeout for each component (e.g. Persistance, Container Driver...). How long we will wait for components to reply on an API info call. Should be less than `http-api.response-timeout`.
  stats.timeout  | - |  5 seconds  |  Response timeout for each component
  reload-configuration   | true, false    |  true  |  if set to false, dynamic configuration will not be possible (configuration must be set at runtime)
  reload-configuration-delay   |      |  2s  |  allows for delay in initialisation when reloading config from external source (key value store)
 synchronisation.initial-delay  | -   |   5 seconds  |
 synchronisation.period  | -    |   6 seconds  |  controls how often Vamp performs a sync between Vamp and the container driver. synchronization will be active only if period is greater than 0
 synchronisation.mailbox.mailbox-type   | -   |   akka.dispatch.NonBlockingBoundedMailbox   |
 synchronisation.mailbox.mailbox-capacity | -   |     100  |  Queue for operational tasks (deployments etc.)
 synchronisation.timeout.ready-for-deployment   | -   |    600 seconds  |  controls how long Vamp waits for a service to start. If the service is not started before this time, the service is registered as "error". If set to 0, Vamp will keep trying forever.
 synchronisation.timeout.ready-for-undeployment  | -    |   600 seconds   |  similar to "ready-for-deployment" (above), but for the removal of services.
 synchronisation.check.cpu   | true, false   |    false  |
 synchronisation.check.memory  | true, false |    false   |
 synchronisation.check.instances  | true, false |    false   |
 synchronisation.check.health-checks  | true, false |    false   |
  deployment.scale   | - |  instances = 1 cpu = 1  memory = 1GB  |  default scale, used if not specified in blueprint
  deployment.arguments | -  |   -  |  Docker command line arguments, e.g. "security-opt=seccomp:unconfined". Split by first '='
  gateway.port-range   | - |  40000-45000   |   range of port values that can be used for Vamp internal gateways. These ports need to be available on all Vamp Gateway Agent hosts
  gateway.response-timeout  | -   |   5 seconds  |  timeout for container operations
  sla.period    | -   |  5 seconds  |  controls how often an SLA checks against metrics
  escalation.period   | -    |  5 seconds  |  controls how often Vamp checks for escalation events
  health.window    | -   |  30 seconds  |
  metrics.window    | -   |  30 seconds  |
  gateway.virtual-hosts.enabled  | true, false |  true   |  if set to false, Vamp will not automatically generate gateway virtual host names. You can still specify in gateways/blueprints.
  gateway.virtual-hosts.formats.gateways  | -  |   $gateway.vamp  |  name format
  gateway.virtual-hosts.formats.deployment-port   | - |  $port.$deployment.vamp   |  name format
  gateway.virtual-hosts.formats.deployment-cluster-port   | - |  $port.$cluster.$deployment.vamp   |  name format


-------

### Vamp - persistence
([github.com/magneticio - persistence reference.conf](https://github.com/magneticio/vamp/blob/master/persistence/src/main/resources/reference.conf))

Vamp uses a database or memory for persistence.

```
vamp.persistence {
    response-timeout = 5 seconds #

    database {
      index = "vamp-persistence-"${vamp.namespace}

       type: "mysql" # mysql, postgres, sqlserver or in-memory
       sql {
        url = "jdbc:mysql://localhost:3306/vamp-${namespace}?useSSL=false"
        user = "root"
        password = "vamp"
        delay = 3s
        synchronization {
          period = 30s
        }
       }

      type: "postgres" # mysql, postgres, sqlserver or in-memory
      sql {
        url = "jdbc:postgresql://localhost:5432/vamp-${namespace}?useSSL=false"
        user = "postgres"
        password = "vamp"
        delay = 3s
        synchronization {
          period = 30s
        }
      }

      type: "sqlserver" # mysql, postgres, sqlserver or in-memory
      sql {
        url = "jdbc:sqlserver://localhost:1433;trustServerCertificate=false;database=vamp-${namespace};encrypt=false;loginTimeout=30;hostNameInCertificate=*.localhost;"
        user = "sa"
        password = "Vamp1234567890$$$"
        delay = 3s
        synchronization {
          period = 30s
        }
      }
    }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  response-timeout   |  -  |   5 seconds  |
  database.type   |  mysql, postgres, sqlserver, in-memory  |   -  |  set in `application.conf`
  database.type.sql.url   |  -  |   varies according to database.type  |
  database.type.sql.user   |  -  |   varies according to database.type  |
  database.type.sql.password   |  - |   varies according to database.type  |
  database.type.sql.delay   |  -  |   3s |
  database.type.sql.sychronisation.period   |  -  |   30s  |


-------

### Vamp - pulse
([github.com/magneticio - pulse reference.conf](https://github.com/magneticio/vamp/blob/master/pulse/src/main/resources/reference.conf))

Handles all Vamp events.

```
vamp.pulse {
  type = "" # no-store
  response-timeout = 30 seconds # timeout for pulse operations
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  type   | no-store or 3rd party option  |  ""   |  Set in application.conf. When set to no-store it will not be possible to aggregate events and there will be problems getting metrics.
  response-timeout   | -   |  30 seconds   |  timeout for pulse operations

-------

### Vamp - workflow driver
([github.com/magneticio - workflow driver reference.conf](https://github.com/magneticio/vamp/blob/master/workflow_driver/src/main/resources/reference.conf))

Used for Vamp workflows.
```
vamp.workflow-driver {
  type = "" # it's possible to combine (csv): 'type_x,type_y'
  response-timeout = 30 seconds # timeout for container operations
  workflow {
    deployables = []
    scale {         # default scale, if not specified in workflow
      instances = 1
      cpu = 0.1
      memory = 64MB
    }
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  type  | docker, marathon, kubernetes, rancher, chronos, none |   none   |  Daemon (docker, marathon, kubernetes, rancher), time and event triggered (chronos). Can be combined (csv), e.g. `marathon,chronos`
  response-timeout  | -  |  30 seconds   |  Timeout for container operations
  workflow.deployables  | - |   []  |
  workflow.scale   | - |    instances = 1 cpu = 0.1 memory = 64MB  |  Default scale. Used if not specified in workflow

-------


## Vamp Lifter configuration
([github.com/magneticio - vamp-lifter reference.conf](https://github.com/magneticio/vamp-lifter/blob/master/src/main/resources/reference.conf)).

```
30 lines (20 sloc)  342 Bytes
vamp.lifter {

  pulse.enabled = true

  persistence.enabled = true

  sql {
    connection {
      url = ""
      database-url = ""
    }
    database = ""
    user = ""
    password = ""
  }

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
      namespace-constraint = []
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

## AWS configuration
([github.com/magneticio - vamp-aws reference.conf](https://github.com/magneticio/vamp-aws/blob/master/src/main/resources/reference.conf))

```
vamp {
  container-driver {
    # type = "ecs"
    ecs {
      workflow-name-prefix = "vamp_workflow"

      aws {
        region = ""
        cluster = ""
        access-key-id = ""
        secret-access-key = ""
      }
    }
  }
  # workflow-driver.type = "ecs"
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
      index = "vamp-persistence-${namespace}"
    }
  }
  pulse {
    # type = "elasticsearch"
    elasticsearch {
      url = "" # e.g http://localhost:9200
      index {
        name = "vamp-pulse-${namespace}"
        time-format.event = "YYYY-MM-dd"
      }
    }
  }
}
```

---

## MySQL configuration
([github.com/magneticio - vamp-mysql reference.conf](https://github.com/magneticio/vamp-mysql/blob/master/src/main/resources/reference.conf))

```
vamp.persistence.database {
  # type: "mysql"
}
```

---

## PostgreSQL configuration
([github.com/magneticio - vamp-postgresql reference.conf](https://github.com/magneticio/vamp-postgresql/blob/master/src/main/resources/reference.conf))

```
vamp.persistence.database {
  # type: "postgres"
}
```

---

## Microsoft SQL server configuration
([github.com/magneticio - vamp-sqlserver reference.conf](https://github.com/magneticio/vamp-sqlserver/blob/master/src/main/resources/reference.conf))

```
vamp.persistence.database {
  # type: "sqlserver"
}
```

---

## In-Memory only persistence

```
vamp.persistence.database {
  type: "in-memory"
}
```

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

---


{{< note title="What next?" >}}
* Read about [how to configure Vamp](/documentation/configure/v0.9.5/configure-vamp)
* Look at some [example configurations](/documentation/configure/v0.9.5/example-configurations)
* Follow the [tutorials](/documentation/tutorials/)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}
