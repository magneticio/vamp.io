---
title: Configuration
weight: 11
type: documentation
menu:
  main:
    parent: installation
---

# Configuring Vamp

Vamp comes together with an application.conf file. This file contains all the configurable settings. When installing Vamp through a package manager (yum, apt-get) you can find this file in `/usr/share/vamp/conf`. The config files are [HOCON type](https://github.com/typesafehub/config) files.

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
    info {
      message = "Hi, I'm Vamp! How are you?"
      timeout = 5 # seconds, response timeout for each components info point
    }
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

### container drivers

Configurations for the container drivers have their own page. Please check here [how to set up and use container drivers](/documentation/installation/container_drivers/)

### gateway-driver

The gateway-driver section configures where Vamp can find ZooKeeper and how traffic should be routed through Vamp Gateway Agent. See the below example on how to configure this:

```hocon
vamp {
  gateway-driver {
    host = "10.193.238.26"              # Vamp Gateway Agent / Haproxy, internal IP.
    response-timeout = 30               # seconds
  }
}  
``` 

The reason for the need to configure this is that when services are deployed, they need to be able to find Vamp Gateway Agent in their respective networks. This can be a totally different network than where Vamp is running.

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
}
```  
