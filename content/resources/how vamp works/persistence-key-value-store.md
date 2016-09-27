---
date: 2016-09-13T09:00:00+00:00
title: Persistence and key-value (KV) store
---

## Persistence 
Vamp uses Elasticsearch (ES) as main persistence (e.g. for artifacts and events). 
Vamp is not demanding in ES resources, so either a small ES installation is sufficient or Vamp indexes (index names are configurable) can be stored in an existing ES cluster.


## Key-value (KV) store
Vamp depends on a key-value (KV) store for non-direct communication between Vamp and the Vamp Gateway Agents (VGA).
We currently support:

* ZooKeeper ([apache.org - zookeeper](https://zookeeper.apache.org/))
* etcd ([coreos.com - etcd](https://coreos.com/etcd/docs/latest/)) 
* Consul ([consul.io](https://www.consul.io/))

Typically, there should be one Vamp instance and one or more VGA instances.  

{{< note title="Note!">}}
* There is no direct connection between Vamp and the VGA instances - all communication is done by managing specific KV in the store.  
* Since Mesos depends on ZooKeeper, the same ZooKeeper cluster can be used for Vamp and VGA's.
{{< /note >}}


