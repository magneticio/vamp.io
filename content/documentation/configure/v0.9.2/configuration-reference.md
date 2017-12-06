---
date: 2016-09-13T09:00:00+00:00
title: Configuration reference
menu:
  main:
    identifier: "configuration reference-v092"
    parent: "Configuration"
    weight: 30
aliases:
    - /documentation/installation/v0.9.2/configuration-reference
---

{{< note title="The information on this page applies to Vamp v0.9.2" >}}

* Switch to the [latest version of this page](/documentation/configure/configuration-reference).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}


This page describes the structure and parameters in the Vamp configuration files (reference.conf and application.conf).
For details on how to customise your Vamp configuration, see [how to configure Vamp](/documentation/configure/v0.9.2/configure-vamp/).


## Vamp configuration parameters
The full `reference.conf` file can be found in the Vamp project repo ([github.com/magneticio - Vamp reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)).

### Vamp { }
Vamp configuration is described in sections, nested inside a parent `vamp {}` tag. Usage, defaults and requirements for each section are outlined below: [info](/documentation/configure/v0.9.2/configuration-reference/#info), [stats](/documentation/configure/v0.9.2/configuration-reference/#stats), [model](/documentation/configure/v0.9.2/configuration-reference/#model), [persistence](/documentation/configure/v0.9.2/configuration-reference/#persistence), [container driver](/documentation/configure/v0.9.2/configuration-reference/#container-driver), [workflow driver](/documentation/configure/v0.9.2/configuration-reference/#workflow-driver), [http-api](/documentation/configure/v0.9.2/configuration-reference/#http-api), [gateway driver](/documentation/configure/v0.9.2/configuration-reference/#gateway-driver), [pulse](/documentation/configure/v0.9.2/configuration-reference/#pulse), [operation](/documentation/configure/v0.9.2/configuration-reference/#operation), [lifter](/documentation/configure/v0.9.2/configuration-reference/#lifter), [common](/documentation/configure/v0.9.2/configuration-reference/#common)

### akka { }
Vamp is based on the Akka library. Akka configuration is included in `reference.conf` inside the `akka {}` tag. These settings can be tweaked in `application.conf` (advanced use only). Refer to the akka documentation for details.

-------

## Info
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

## Stats
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
## Model

```
model {
  default-deployable-type = "container/docker"
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  default-deployable-type  | container/docker, container/rkt  |  container/docker  |  The default container type

-------

## Persistence
Vamp uses Elasticsearch or a key-value store for persistence. The key-value store is also used to hold the HAProxy configuration. Currently supported options:

* ZooKeeper ([apache.org - ZooKeeper](https://zookeeper.apache.org/))
* etcd ([coreos.com  - etcd documentation](https://coreos.com/etcd/docs/latest/))
* Consul ([consul.io](https://www.consul.io/))

```
persistence {
  response-timeout = 5 seconds

  database {
    type: ""

    elasticsearch {
      url = ""
      response-timeout = 5 seconds
      index = "vamp-persistence"
    }

    key-value {
      caching = false
    }
  }

  key-value-store {
    type = ""
    base-path = "/vamp"

    zookeeper {
      servers = ""
      session-timeout = 5000
      connect-timeout = 5000
    }

    etcd.url = ""

    consul.url = ""
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  response-timeout   |  -  |   5 seconds  |
  database.type   |  elasticsearch, key-value, in-memory  |   -  |  set in `application.conf`
  database.elasticsearch.url               |   |  -   |  set in `application.conf`
  database.elasticsearch.response-timeout  | -  |  5 seconds   |  Timeout for elasticsearch operations
  database.elasticsearch.index             | -  |  vamp-persistence   |
  database.key-value.caching               | true, false   |  false  |  set this to true to make it easier on the persistence store load
  key-value-store.type                     | zookeeper, etcd, consul   |   -  |  set in `application.conf`
  key-value-store.base-path                | -  |  /vamp  |
  key-value-store.zookeeper.servers        | - |  -   |  Required when `persistence.key-value-store.type = "zookeeper" `
  key-value-store.zookeeper.session-timeout | - |   5000  |
  key-value-store.zookeeper.connect-timeout | - |   5000  |
  etcd.url                                 | - |  -   |  Rquired when `persistence.key-value-store.type = "etcd" `
  consul.url                               | -  |   -  |  Required when `persistence.key-value-store.type = "consul" `

-------

## Container driver
Vamp can be configured to work with Docker, Mesos/Marathon, Kubernetes or Rancher container drivers. Only configuration for the specified `container-driver.type` is required.
See the [example configurations](/documentation/configure/example-configurations).
```
container-driver {
  type = ""

  docker {
    workflow-name-prefix = "vamp-workflow-"
    repository {
      email = ""
      username = ""
      password = ""
      server-address = ""
    }
  }

  mesos.url = ""
  marathon {
    user = ""
    password = ""
    url = ""
    sse = true
    workflow-name-prefix = "vamp/workflow-"
  }

  kubernetes {
    url = ""
    workflow-name-prefix = "vamp-workflow-"
    service-type = "NodePort"
    create-services = true
    vamp-gateway-agent-id = "vamp-gateway-agent"
    bearer = ""
    token = "/var/run/secrets/kubernetes.io/serviceaccount/token"
  }

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

  response-timeout = 30 seconds
}
```
Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
 type            |  docker, kubernetes, marathon, rancher     |  -   |  set in `application.conf`. Also include the configuration section for the specified container driver type (see below).
 response-timeout  | -   |  30 seconds   |  Timeout for container operations
 mesos.url         | -   |   -  |  Used for information. Required only when `container-driver.type = "marathon" `

### Container-driver.docker
Required only when `container-driver.type = "docker" `.
```
  docker {
    workflow-name-prefix = "vamp-workflow-"
    repository {
      email = ""
      username = ""
      password = ""
      server-address = ""
    }
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  workflow-name-prefix      | -  |   vamp-workflow-  |
  repository.email          | -   |  -   |  Docker repository credentials
  repository.username       | -   |   -  |  Docker repository credentials
  repository.password       | -   |   -  |  Docker repository credentials
  repository.server-address  | -  |   -  |  Docker repository credentials

### Container-driver.kubernetes
Required only when `container-driver.type = "kubernetes" `.
See the [example configuration](/documentation/configure/example-configurations).
```
  kubernetes {
    url = ""
    workflow-name-prefix = "vamp-workflow-"
    service-type = "NodePort"
    create-services = true
    vamp-gateway-agent-id = "vamp-gateway-agent"
    bearer = ""
    token = "/var/run/secrets/kubernetes.io/serviceaccount/token"
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  url                   | -   |   -  |  Kubernetes API URL
  workflow-name-prefix   | -  |  vamp-workflow-   |
  service-type          | NodePort, LoadBalancer   |   NodePort  |
  create-services        | true, false   |   true  |  when set to false, gateways will not be exposed as a service (access will only be possible through gateway agent)
  vamp-gateway-agent-id  | -   |  vamp-gateway-agent   |
  bearer   | - | - |
  token                  | -  |  /var/run/secrets/kubernetes.io/serviceaccount/token   |

### Container-driver.marathon
Required only when `container-driver.type = "marathon" `. note that you should also set `container-driver.mesos.url`.

```
  marathon {
    user = ""
    password = ""
    url = ""
    sse = true
    workflow-name-prefix = "vamp/workflow-"
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  user             | -         |   -  |
  password           | -      |   -  |
  url                  | -     |   -  |
  sse                    | true, false   |   true  |  When set to true, Vamp will listen on Marathon events which allows for quicker reaction to Marathon changes
  workflow-name-prefix   | -   |   vamp/workflow-  |

### Container-driver.rancher
Required only when `container-driver.type = "rancher" `.
See the [example configuration](/documentation/configure/example-configurations).
```
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
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  url  | - |    -  |  Rancher API URL
  workflow-name-prefix  | -  |   vamp-workflow-  |
  user  | - |    -  |  API authentication credentials (if required)
  password | - |    -  |       API authentication credentials (if required)
  environment.name | - |   -   |
  environment.deployment.name-prefix | - |   -   |

-------

## Workflow driver
Used for Vamp workflows.
```
workflow-driver {
  type = "none"
  response-timeout = 30 seconds

  vamp-url = ""

  chronos.url = ""

  workflow {
   deployables = {
     "application/javascript" = {
        type = "container/docker"
        definition = ""
      }
    scale {
      instances = 1
      cpu = 0.1
      memory = 64MB
    }
    arguments: []
    network = "BRIDGE"
    command = ""
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  type  | docker, marathon, kubernetes, rancher, chronos, none |   none   |  Daemon (docker, marathon, kubernetes, rancher), time and event triggered (chronos). Can be combined (csv), e.g. `marathon,chronos`
  response-timeout  | -  |  30 seconds   |  Timeout for container operations
  vamp-url   | -|    -   |  The URL that workflow agent (workflows) will use to access Vamp. Set in `application.conf`. Required for all workflows which need to access Vamp.
  chronos.url   | - |     -  |  if you use chronos, set the URL in `application.conf`

### Workflow-driver.workflow
Applied when a worklow is deployed (run).

```
  workflow {
   deployables = {
     "application/javascript" = {
        type = "container/docker"
        definition = ""
      }
    }
    environment-variables = []
    scale {
      instances = 1
      cpu = 0.1
      memory = 64MB
    }
    arguments: []
    network = "BRIDGE"
    command = ""
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  deployables  | - |   ` "application/javascript" = { type = "container/docker" definition = "" `  |   Deployable type and definition applied to the specified breed type. Overridden for other breed types.
  environment-variables  | - |   -  |  will be added to every workflow
  scale   | - |    instances = 1 cpu = 0.1 memory = 64MB  |  Default scale. Used if not specified in workflow
  arguments  | - |    -  |  will be added to every workflow
  network   | - |    BRIDGE  |
  command  | - |    -  |  Docker command

-------

## http-api
Configuration for the Vamp API.
```
http-api {

  interface = 0.0.0.0
  host = localhost
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
  host   | - |    localhost  |
  port   | - |   8080   |  The port Vamp runs on
  response-timeout   | - |    10 seconds  |  HTTP response timeout
  strip-path-segments   | - |    0  |
  sse.keep-alive-timeout   | - |    15 seconds  |  timeout after an empty comment (":\n") will be sent in order keep connection alive
  ui.directory   | - |   -  |  set in `application.conf` to use the Vamp UI
  ui.index  | - |    -  |  index file, e.g. `${vamp.http-api.ui.directory}"/index.html"`. Set in `application.conf` to use the Vamp UI

-------

## Gateway driver
The gateway-driver section configures how traffic should be routed through Vamp Gateway Agent. Read more about how Vamp uses these parameters for [service discovery](/documentation/using-vamp/service-discovery).
```
gateway-driver {
  host = "localhost"
  response-timeout = 30 seconds

  haproxy {
    version = "1.6"
    ip = "127.0.0.1"
    template = ""
    socket-path = "/usr/local/vamp"
    virtual-hosts {
      ip = "0.0.0.0"
      port = 80
    }
    tcp-log-format = """{\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tw\":%Tw,\"Tc\":%Tc,\"Tt\":%Tt,\"B\":%B,\"ts\":\"%ts\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq}"""
    http-log-format = """{\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tq\":%Tq,\"Tw\":%Tw,\"Tc\":%Tc,\"Tr\":%Tr,\"Tt\":%Tt,\"ST\":%ST,\"B\":%B,\"CC\":\"%CC\",\"CS\":\"%CS\",\"tsc\":\"%tsc\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq,\"hr\":\"%hr\",\"hs\":\"%hs\",\"r\":%{+Q}r}"""
  }

  elasticsearch.metrics {
    index = "logstash-*"
    type = "haproxy"
  }
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  host    | - |   localhost  |  The Vamp Gateway Agent/HAProxy, internal IP. To simplify service discovery, Vamp supports using specific environment parameters. `{cluster_name}.host` will have the value of this parameter (`vamp.gateway-driver.host`)
  response-timeout    | - |  30 seconds   |  timeout for gateway operations
  elasticsearch.metrics.index   | -  |  -   |
  elasticsearch.metrics.type  | -   |   -  |

### Gateway-driver.haproxy
```
  haproxy {
    version = "1.6"
    ip = "127.0.0.1"
    template = ""
    socket-path = "/usr/local/vamp"
    virtual-hosts {
      ip = "0.0.0.0"
      port = 80
    }
    tcp-log-format = """{\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tw\":%Tw,\"Tc\":%Tc,\"Tt\":%Tt,\"B\":%B,\"ts\":\"%ts\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq}"""
    http-log-format = """{\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tq\":%Tq,\"Tw\":%Tw,\"Tc\":%Tc,\"Tr\":%Tr,\"Tt\":%Tt,\"ST\":%ST,\"B\":%B,\"CC\":\"%CC\",\"CS\":\"%CS\",\"tsc\":\"%tsc\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq,\"hr\":\"%hr\",\"hs\":\"%hs\",\"r\":%{+Q}r}"""
  }
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  version   |  1.5, 1.6 |   1.6  |
  ip    | - |   127.0.0.1  |  local IP used for chaining gateways.  HAProxy backend server IP
  template    | -  |  -  |  HAProxy configuration template file, can be edited to customise HAProxy configuration. If not specified the default will be used /io/vamp/gateway_driver/haproxy/template.twig
  socket-path   | -  |   `/usr/local/vamp`  |
  virtual-hosts.ip   | -  |   0.0.0.0  |  IP, if virtual hosts are enabled
  virtual-hosts.port  | -   |  80   |  Port, if virtual hosts are enabled
  tcp-log-format   | -  |   see above  |
  http-log-format  | -   |  see above   |

-------

## Pulse
Handles all Vamp events.

```
pulse {
  elasticsearch {
    url = ""
    index {
      name = "vamp-pulse"
      time-format.event = "YYYY-MM-dd"
    }
  }
  response-timeout = 30 seconds
}
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  elasticsearch.url   | -   |  -   |  e.g http://localhost:9200
  elasticsearch.index.name   | -   |   vamp-pulse  |
  elasticsearch.index.time-format.event   | |  YYYY-MM-dd   |
  response-timeout   | -   |  30 seconds   |  timeout for pulse operations

-------

## Operation
The operation section holds all parameters that control how Vamp executes against “external” services: this also includes Vamp Pulse and Vamp Gateway Agent.
```
operation {

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
  sla.period    | -   |  5 seconds  |  controls how often an SLA checks against metrics
  escalation.period   | -    |  5 seconds  |  controls how often Vamp checks for escalation events
  health.window    | -   |  30 seconds  |
  metrics.window    | -   |  30 seconds  |

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

## Lifter
Lifter is the Vamp bootstrap installer. The lifter configuration specifies items that Vamp should run on startup. No items are included by default in `reference.conf`, these need to be added in `application.conf`. We advise that you at least run the Vamp Health and Metrics workflows, as these are required for the Vamp UI.

For example (taken from the [DC/OS template application.conf](https://github.com/magneticio/vamp-docker-images/blob/master/vamp-dcos/application.conf)):

```
  lifter.artifact.files = [
    "/usr/local/vamp/artifacts/breeds/health.js",
    "/usr/local/vamp/artifacts/workflows/health.yml",
    "/usr/local/vamp/artifacts/breeds/metrics.js",
    "/usr/local/vamp/artifacts/workflows/metrics.yml",
    "/usr/local/vamp/artifacts/breeds/kibana.js",
    "/usr/local/vamp/artifacts/workflows/kibana.yml",
    "/usr/local/vamp/artifacts/breeds/vga.js",
    "/usr/local/vamp/artifacts/workflows/vga.yml"
    ]
  }
```
-------
## Common

```
common.http.client.tls-check = true
```

Parameter  |  Options  |  Default |  Details
------------|-------|--------|--------
  http.client.tls-check  | true, false  |  true  |  If set to false tls-check will be disabled, for example to allow Vamp to accept invalid certificates.




{{< note title="What next?" >}}
* Read about [how to configure Vamp](/documentation/configure/configure-vamp)
* Look at some [example configurations](/documentation/configure/example-configurations)
* Follow the [tutorials](/documentation/tutorials/)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}
