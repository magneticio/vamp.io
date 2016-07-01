---
title: Configuration
weight: 20
type: documentation
menu:
  main:
    parent: installation
---

# Configuring Vamp

Vamp can be configured using one of or combining:

- `application.conf` [HOCON](https://github.com/typesafehub/config) file
- environment variables
- system properties

Example:
```bash

export VAMP_INFO_MESSAGE=Hello # overriding Vamp info message (vamp.info.message)

java -Dvamp.gateway-driver.host=localhost \
     -Dlogback.configurationFile=logback.xml \
     -Dconfig.file=application.conf \
     -jar vamp.jar
```

## Environment variable configuration

Each configuration parameter can be replaced by an environment variable.
Environment variable name is based on configuration parameter name - all non-alphanumerics are replaced with `_` and converted to upper case:

```
vamp.info.message           ⇒ VAMP_INFO_MESSAGE
vamp.gateway-driver.timeout ⇒ VAMP_GATEWAY_DRIVER_TIMEOUT
```

>**Note**: environment variables have precedence to `application.conf` or system properties.


## Vamp `application.conf` sections

The Vamp `application.conf` consists of the following sections. All sections are nested inside a parent `vamp {}` tag.

### rest-api
Configure the port, host name and interface that Vamp runs on using the `rest-api.port` 

```
vamp {
  rest-api {
    interface = 0.0.0.0
    host = localhost
    port = 8080
    response-timeout = 10 # seconds, HTTP response time out
  }
}    
``` 


### persistence

Vamp uses Elasticsearch for persistence and [ZooKeeper](https://zookeeper.apache.org/), [etcd](https://coreos.com/etcd/docs/latest/) or [Consul](https://www.consul.io/) for key-value store (keeping HAProxy configuration). 

```hocon
vamp {
  persistence {
    response-timeout = 5 # seconds

    database {
      type: "elasticsearch" # elasticsearch or in-memory (no persistence)
      elasticsearch.url = ${vamp.pulse.elasticsearch.url}
    }

    key-value-store {
    
      type = "zookeeper"  # zookeeper, etcd or consul
      base-path = "/vamp" # base path for keys, e.g. /vamp/...

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

### container drivers

Configurations for the container drivers have their own page. Please check here [how to set up and use container drivers](/documentation/installation/container_drivers/)

### gateway-driver

The gateway-driver section configures how traffic should be routed through Vamp Gateway Agent. See the below example on how to configure this:

```hocon
vamp {
  gateway-driver {
    host = "10.193.238.26"              # Vamp Gateway Agent / Haproxy, internal IP.
    response-timeout = 30               # seconds

    haproxy.ip = 127.0.0.1              # HAProxy backend server IP
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
Additional information can be found on [service discovery page](/documentation/about-vamp/service-discovery/).

### operation

The operation section holds all parameters that control how Vamp executes against "external" services: this also includes Vamp Pulse and Vamp Gateway Agent.

```hocon
operation {
	sla.period = 5      # seconds, controls how often an SLA checks against metrics
  escalation.period = 5 # seconds, controls how often Vamp checks for escalation events.
	synchronization {
    period = 4          # seconds, controls how often Vamp performs 
                        # a sync between Vamp and the container driver.
    timeout {
      ready-for-deployment: 600	    # seconds, controls how long Vamp waits for a 
                                    # service to start. If the service is not started 
                                    # before this time, the service is registered as "error"
      ready-for-undeployment: 600 	# seconds, similar to "ready-for-deployment", but for
                                    # the removal of services.
    }
   }
  
  gateway {
    port-range = 40000-45000
    response-timeout = 5 # seconds, timeout for container operations
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
