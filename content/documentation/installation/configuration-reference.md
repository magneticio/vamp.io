---
date: 2016-09-13T09:00:00+00:00
title: Configuration reference
menu:
  main:
    parent: "Installation"
    weight: 110
draft: true
---

Defaults settings are specified in `reference.conf`. Required parameters with no default must be specified in `application.conf` or using environment variables and/or Java system properties (not advised). 

[Info](documentation/installation/configuration-reference/#info), [Stats](documentation/installation/configuration-reference/#stats), [Persistence](documentation/installation/configuration-reference/#persistence), [Container driver](documentation/installation/configuration-reference/#container-driver), [Workflow driver](documentation/installation/configuration-reference/#workflow-driver), [Dictionary](documentation/installation/configuration-reference/#dictionary), [http-api](documentation/installation/configuration-reference/#http-api), [Gateway driver](documentation/installation/configuration-reference/#gateway-driver), [Pulse](documentation/installation/configuration-reference/#pulse), [Operation](documentation/installation/configuration-reference/#operation), [Lifter](documentation/installation/configuration-reference/#lifter)

## Info
Description
```
info {
  message = "Hi, I'm Vamp! How are you?"
  timeout = 3 seconds
}
```

Parameter | Required |  Default |  Details  
----------|----------|--------|--------
message |          |    Hi, I'm Vamp! How are you? |  The welcome message displayed in the Vamp info pane
timeout |          |    3 seconds |  Response timeout for each component (e.g. Persistance, Container Driver...)

## Stats
Description
```
stats {
  timeout = 5 seconds
}
```

Parameter |Required |  Default |  Details  
----------|---------|--------|--------
  timeout |   |   5 seconds  |  Response timeout for each component

## Persistence
{{< note title="Updated for Vamp 0.9.1" >}}
* In the [Vamp configuration](/documentation/installation/configure-vamp/#persistence) we set `persistence caching` by default to `false`. In our Vamp images we set this to `true` to make it easier on the persistence store load. Check out this [default Vamp 0.9.1 configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) for reference.
* We've added a key-value store as a persistence data store. Check out this [default Vamp 0.9.1 configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) for reference.
{{< /note >}}

Vamp uses Elasticsearch for persistence and a key-value store to hold the HAProxy configuration. Currently supported options: 
                                                                                                
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

Parameter                                     | Required |  Default |  Details  
----------------------------------------------|----------|----------|----------
  response-timeout                          |          |   5 seconds  |  
  database.type                             |  |   -  |  `elasticsearch` / `key-value` / `in-memory`
  database.elasticsearch.url               |  |  -   |  
  database.elasticsearch.response-timeout   |  |  5 seconds   |  Timeout for elasticsearch operations
  database.elasticsearch.index              |  |  vamp-persistence   |  
  database.key-value.caching                |  |  false   |  
  key-value-store.type                      |  |   -  | `zookeeper` / `etcd` / `consul`
  key-value-store.base-path                 |  |  `/vamp`  |  
  key-value-store.zookeeper.servers         |  |  -   |  Required when `persistence.key-value-store.type = "zookeeper" `
  key-value-store.zookeeper.session-timeout |  |   5000  |   
  key-value-store.zookeeper.connect-timeout |  |   5000  |  
  etcd.url                                 |  |  -   |  Rquired when `persistence.key-value-store.type = "etcd" `  
  consul.url                                |  |   -  |  Required when `persistence.key-value-store.type = "consul" ` 

## Container driver
Vamp can be configured to work with Docker, Mesos/Marathon, Kubernetes or Rancher container drivers. Only configuration for the specified `container-driver.type` is required. See the provided template docker images for example configurations ([github.com/magneticio - Vamp Docker](https://github.com/magneticio/vamp-docker)).
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

Parameter            | Required  |  Default |  Details  
---------------------|---|--------|--------
 type              |   |  -   |  `docker` / `kubernetes` / `marathon` / `rancher`
 response-timeout  |   |  30 seconds   |  Timeout for container operations
 mesos.url         |   |   -  |  Used for information. Required only when `container-driver.type = "marathon" `

### Container-driver.docker
Required only when `container-driver.type = "docker" `. The default image provided in the vamp-docker github repo contains all the settings required ??? 
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

Parameter                      | Required |  Default |  Details  
-------------------------------|---|--------|--------
  workflow-name-prefix       |  |   vamp-workflow-  |  
  repository.email           |  |  -   |  
  repository.username        |  |   -  |  
  repository.password        |  |   -  |       
  repository.server-address  |  |   -  |  
          
### Container-driver.kubernetes
Required only when `container-driver.type = "kubernetes" `. The default image provided in the vamp-docker github repo contains all the settings required ??
```
  kubernetes {
    url = ""
    workflow-name-prefix = "vamp-workflow-"
    service-type = "NodePort"
    create-services = true
    vamp-gateway-agent-id = "vamp-gateway-agent"
    token = "/var/run/secrets/kubernetes.io/serviceaccount/token"
  }
```

Parameter                   | Required |  Default |  Details  
----------------------------|---|--------|--------
  url                     |  |   -  |  
  workflow-name-prefix    |  |  vamp-workflow-   |  
  service-type            |  |   NodePort  |   `NodePort` / `LoadBalancer`              
  create-services         |  |   true  |  
  vamp-gateway-agent-id   |  |  vamp-gateway-agent   |  
  token                   |  |  /var/run/secrets/kubernetes.io/serviceaccount/token   |  
### Container-driver.marathon
Required only when `container-driver.type = "marathon" `. The default image provided in the vamp-docker github repo contains all the settings required ??
```
  marathon {
    user = ""
    password = ""
    url = ""
    sse = true
    workflow-name-prefix = "vamp/workflow-"
  }
```

Parameter                  | Required  |  Default |  Details  
---------------------------|---|--------|--------
  user                   |   |   -  |  
  password              |   |   -  |       
  url                    |   |   -  |  
  sse                    |   |   true  |  
  workflow-name-prefix   |   |   vamp/workflow-  |  

### Container-driver.rancher
Required only when `container-driver.type = "rancher" `. The default image provided in the vamp-docker github repo contains all the settings required ??
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

Parameter | Required |  Default |  Details  
---------|-----|--------|--------
  url  | |   -  |  
  workflow-name-prefix  | |   vamp-workflow-  |            
  user  | |   -  |  
  password  | |   -  |       
  environment.name  | |  -   |       
  environment.deployment.name-prefix  | |  -   |       
     
## Workflow driver
Description
```
workflow-driver {
  type = "none"
  response-timeout = 30 seconds

  vamp-url = ""

  chronos.url = ""

  workflow {
    deployable = {
      type = "container/docker"
      definition = ""
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
}
```

Parameter | Required |  Default |  Details  
----------|---|-----|--------
  type   | |  none   |  `docker` (daemon) / `marathon` (daemon) / `kubernetes` (daemon) / `rancher` (daemon) / `chronos` (time and event triggered) / `none`. Can be combined (csv), e.g. `marathon,chronos`
  response-timeout   |  |  30 seconds   |  Timeout for container operations
  vamp-url   |  |  -   |  
  chronos.url   |  |   -  |  

### Worflow-driver.workflow
```
  workflow {
    deployable = {
      type = "container/docker"
      definition = ""
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

Parameter |  Default |  Details  
----------|--------|--------
  deployable.type   |  container/docker   |  
  deployable.definition   |  -   |  
  environment-variables  |   -  |  
  scale   |   `instances = 1`, `cpu = 0.1`, `memory = 64MB`  |  Default scale. Used if not specified in workflow
  arguments  |   -  |  
  network   |   BRIDGE  |  
  command  |   -  |  

## Dictionary
Description
```
dictionary {
  response-timeout = 5 seconds
}
```

Parameter |  Default |  Details  
----------|--------|--------
  response-timeout   |  5 seconds   |  Timeout for container operations

## http-api
Configure the port, host name and interface that Vamp runs on using the `http-api.port`
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

Parameter |  Default |  Details  
----------|--------|--------
  interface   |   0.0.0.0  |  
  host   |   localhost  |  
  port   |  8080   |  The port Vamp runs on
  response-timeout   |   10 seconds  |  HTTP response timeout
  strip-path-segments   |   0  |  
  sse.keep-alive-timeout   |   15 seconds  |  timeout after an empty comment (":\n") will be sent in order keep connection alive
  ui.directory   |   -  |  
  ui.index  |   -  |  index file, e.g. ${vamp.http-api.ui.directory}"/index.html"

## Gateway driver
The gateway-driver section configures how traffic should be routed through Vamp Gateway Agent. 
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

Parameter |  Default |  Details  
----------|--------|--------
  host   |   localhost  |  note: host of cluster hosts will have this value (e.g. db.host). Vamp Gateway Agent / Haproxy, internal IP
  response-timeout   |  30 seconds   |  timeout for gateway operations
  elasticsearch.metrics.index   |  -   |  
  elasticsearch.metrics.type   |   -  |  

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
Parameter |  Default |  Details  
----------|--------|--------
  version   |   1.5  |  `1.5` / `1.6`
  ip   |   127.0.0.1  |  local IP used for chaining gateways.  HAProxy backend server IP
  template   |   -  |  template file, if not specified the default will be used /io/vamp/gateway_driver/haproxy/template.twig
  socket-path   |   `/usr/local/vamp`  |  
  virtual-hosts.ip   |   0.0.0.0  |  IP, if virtual hosts are enabled
  virtual-hosts.port   |  80   |  Port, if virtual hosts are enabled
  tcp-log-format   |   see above example  |  
  http-log-format   |  see above example   |  

## Pulse
Description
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

Parameter |  Default |  Details  
----------|--------|--------
  elasticsearch.url   |  -   |  e.g http://localhost:9200
  elasticsearch.index.name   |   vamp-pulse  |  
  elasticsearch.index.time-format.event   |  YYYY-MM-dd   |  
  response-timeout   |  30 seconds   |  timeout for pulse operations

## Operation
The operation section holds all parameters that control how Vamp executes against “external” services: this also includes Vamp Pulse and Vamp Gateway Agent.
```
operation {

  synchronization {

    initial-delay = 5 seconds
    period = 6 seconds

    mailbox {
      mailbox-type = "akka.dispatch.BoundedMailbox"
      mailbox-capacity = 10
      mailbox-push-timeout-time = 0s
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

Parameter | Required|  Default |  Details  
---------|---|--------|--------
  sla.period   |  |  5 seconds  |  
  escalation.period   |  |  5 seconds  |  
  health.window   |  |  30 seconds  |  
  metrics.window   |  |  30 seconds  | 
     
### operation.synchronisation

```
  synchronization {

    initial-delay = 5 seconds
    period = 6 seconds

    mailbox {
      mailbox-type = "akka.dispatch.BoundedMailbox"
      mailbox-capacity = 10
      mailbox-push-timeout-time = 0s
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

Parameter  | Required |  Default |  Details  
----------|---|------|--------
 initial-delay   | |  5 seconds  |  
 period    | |  6 seconds  |  synchronization will be active only if period is greater than 0
 mailbox.mailbox-type    | |  akka.dispatch.BoundedMailbox   |  Until we get available akka.dispatch.NonBlockingBoundedMailbox
 mailbox.mailbox-capacity  |  |   10  |  Until we get available akka.dispatch.NonBlockingBoundedMailbox
 mailbox.mailbox-push-timeout-time    |  |  0s  |  Until we get available akka.dispatch.NonBlockingBoundedMailbox
 timeout.ready-for-deployment    |  |  600 seconds  |  
 timeout.ready-for-undeployment    |  |  600 seconds   |  
 check.cpu    |  |  false  |  
 check.memory   |  |  false   |  
 check.instances   |  |  false   |  
     
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

Parameter |  Default |  Details  
----------|--------|--------
  scale   |  instances = 1, cpu = 1,  memory = 1GB  |  Default scale, used if not specified in blueprint
  arguments   |   -  |  split by first '='

### operation.gateway

```
  gateway {
    port-range = 40000-45000
    response-timeout = 5 seconds
  }
```

Parameter |  Default |  Details  
----------|--------|--------
  port-range   |  40000-45000   |   range of port values that can be used for Vamp internal gateways. **These ports need to be available on all Vamp Gateway Agent hosts**
  response-timeout   |   5 seconds  |  timeout for container operations

### operation.gateway.virtual-hosts

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

Parameter |  Default |  Details  
----------|--------|--------
  enabled   |  true   |  
  formats.gateways   |   $gateway.vamp  |  
  formats.deployment-port   |  $port.$deployment.vamp   |  
  formats.deployment-cluster-port   |  $port.$cluster.$deployment.vamp   |  
     
------
## Lifter
Lifter is the Vamp bootstrap installer. The lifter configuration specifies items that Vamp should run on startup. No items are included by default in `reference.conf`, these need to be added in `application.conf`. We advise that you at least run the Vamp Health and Metrics workflows, as these are required for the Vamp UI.

For example:

```
  lifter.artifact {

    files = [
      "/usr/local/vamp/artifacts/breeds/vga.js",
      "/usr/local/vamp/artifacts/workflows/vga.yml"
    ]

    resources = [
      "breeds/health.js",
      "workflows/health.yml",
      "breeds/metrics.js",
      "workflows/metrics.yml"
    ]
  }
```

## Akka
Vamp is based on the Akka library. This can be tweaked in `application.conf`. Refer to the akka documentation for details ???


## Spray can
Depreciated. Do not use.

{{< note title="What next?" >}}
* Read about [how to configure Vamp](documentation/installation/how-to-configure-vamp)
* Look at some [example configurations](documentation/installation/example-configurations)
* Follow the [tutorials](/documentation/tutorials/overview)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}