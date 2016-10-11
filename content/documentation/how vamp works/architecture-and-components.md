---
date: 2016-09-13T09:00:00+00:00
title: Architecture and components
---

## Architecture 
Vamp and the Vamp Gateway Agent require specific elements in your architecture to handle orchetstration, routing, persistence and metrics aggregation. There is no set architecture required for running Vamp and every use case or specific combination of tools and platforms can have its own set up.

#### Example topology
The below diagram should be used more as an overview than required architecture. For example, Mesos/Marathon stack is included even though it is not a hard dependency.
![architecture](/images/diagram/Architecture-and-components.svg)

## Vamp components

Vamp consists of server- and client-side components that work together with elements in your architecture to handle orchetstration, routing, persistence and metrics aggregation.


### Vamp UI  
The Vamp UI is a graphical web interface for managing Vamp in a web browser. Packaged with Vamp.

### Vamp CLI  
The Vamp CLI is a command line interface for managing Vamp and providing integration with (shell) scripts.

### Vamp  
Vamp is the main API endpoint, business logic and service coordinator. Vamp talks to the configured container manager (Docker, Marathon, Kubernetes etc.) and synchronizes it with Vamp Gateway Agent (VGA)  via ZooKeeper, etcd or Consul. Vamp uses Elasticsearch for artifact persistence and to store events (e.g. changes in deployments). Typically, there should be one Vamp instance and one or more VGA instances.  

### Vamp workflows
Vamp workflows are small applications (for example using JavaScript or your own containers) that automate changes of the running system, and its deployments and gateways. We have included a few workflows out of the box, such as health and metrics, which are used by the Vamp UI to report system status and to enable autoscaling and self-healing.

### Vamp Gateway Agent (VGA)  
Vamp Gateway Agent (VGA) reads the HAProxy configuration from ZooKeeper, etcd or Consul and reloads HAProxy on each configuration change with as close to zero client request interruptions as possible. Typically, there should be one Vamp instance and one or more VGA instances.     
Logs from HAProxy are read over socket and pushed to Logstash over UDP.  VGA will handle and recover from ZooKeeper, etcd, Consul and Logstash outages without interrupting the HAProxy process and client requests.  