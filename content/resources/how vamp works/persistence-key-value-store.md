---
date: 2016-09-13T09:00:00+00:00
title: Persistence and key-value (KV) store
---

## Persistence 
Vamp uses Elasticsearch (ES) as main persistence (e.g. for artifacts and events). 
Vamp is not demanding in ES resources, so either a small ES installation is sufficient or Vamp indexes (index names are configurable) can be stored in an existing ES cluster.


## Key-value (KV) store
Vamp depends on a key-value (KV) store for communication between Vamp and the Vamp Gateway Agents (VGA).
We currently support:

* [ZooKeeper](https://zookeeper.apache.org/)
* [etcd](https://coreos.com/etcd/docs/latest/) 
* [Consul](https://www.consul.io/)

Typically, there should be one Vamp instance and one or more VGA instances.  
There is **no direct connection between Vamp and the VGA instances** - all communication is done by managing specific KV in the store.  


>**Note:**
>
* Since Mesos depends on ZooKeeper, the same ZooKeeper cluster can be used for Vamp and VGA's.


## VGA and HAProxy

All communication between VAmp and the VGA instances is done by managing specific KV in the store. 
When Vamp needs to update the HAProxy configuration (e.g. when a new service has been deployed) Vamp will generate the new configuration and store it in the KV store.
The VGA's read specific value and reload HAProxy instances. 

Since VGA (and HAProxy) is a single point of failure (proxy to all traffic), it is recommended for high availability to have more than one VGA instance.
VGA instances can be added or removed any time. Once VGA starts running it will pick up the HAProxy configuration from the configured KV store and reload the HAProxy instance.
This also mean Vamp (not VGA), can be restarted, stopped etc. without main consequences on running services. There would be no HAProxy configuration update, but, once Vamp is up, it will sync the HAProxy configuration (e.g. if Marathon restarted some service, so hosts/ports are changed).  

>**Note:**
>
* There should be one dedicated HAProxy for each VGA. 
* Vamp also supports custom HAProxy configuration - base configuration should be used as a template and HAProxy frontends and backends are appended by VGA.
* To correctly set up Vamp with single/multiple VGA instances, check out [Vamp gateway driver configuration](/resources/run-vamp/vamp-configuration#gateway-driver).

