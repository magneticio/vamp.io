---
date: 2016-09-13T09:00:00+00:00
title: Persistence and key-value (KV) store
---

## Persistence 
Vamp uses Elasticsearch (ES) as main persistence (e.g. for artifacts and events). 
Vamp is not demanding in ES resources, so a small ES installation is sufficient for Vamp indices (index names are configurable). Vamp can also use an existing ES cluster.


## Key-value (KV) store
Vamp depends on a key-value (KV) store for non-direct communication between Vamp and instances of the Vamp Gateway Agent (VGA). There is no direct connection between Vamp and the VGA instances - all communication is done by managing specific KV in the store.  Currently we support:

* **ZooKeeper** ([apache.org - zookeeper](https://zookeeper.apache.org/)).  
Vamp and VGAs can use an existing DC/OS ZooKeeper cluster.
* **etcd** ([coreos.com - etcd](https://coreos.com/etcd/docs/latest/))  
Vamp and VGAs can use an existing Kubernetes etcd cluster.
* **Consul** ([consul.io](https://www.consul.io/))

{{< note title="What next?" >}}
* Read about [routing and load balancing](/documentation/how-vamp-works/routing-and-load-balancing)
* 
* 
{{< /note >}}

