---
date: 2016-09-13T09:00:00+00:00
title: Requirements
---

Vamp consists of server- and client-side components that work together with elements in your architecture to handle orchetstration, routing, persistence and metrics aggregation. A running Vamp installation has the following requirements:

## Container scheduler  (orchestration)
Vamp talks directly to your choice of container scheduler. We currently support [DC/OS](/documentation/installation/dcos), [Kubernetes](/documentation/installation/kubernetes) and [Rancher](/documentation/installation/rancher).

## Key value store
Vamp depends on a key-value (KV) store for non-direct communication between Vamp and instances of the Vamp Gateway Agent (VGA). There is no direct connection between Vamp and the VGA instances - all communication is done by managing specific KV in the store.  Currently we support:

* **ZooKeeper** ([apache.org - zookeeper](https://zookeeper.apache.org/)).  
Vamp and VGAs can use an existing DC/OS ZooKeeper cluster.
* **etcd** ([coreos.com - etcd](https://coreos.com/etcd/docs/latest/))  
Vamp and VGAs can use an existing Kubernetes etcd cluster.
* **Consul** ([consul.io](https://www.consul.io/))

## Elastic Search (persistence and metrics)
Vamp uses Elastic Search (ES) for persistence (e.g. for artifacts and events) and for aggregating the metrics used by Vamp workflows and the Vamp UI. As Vamp is not demanding in ES resources, it can comfortably work with an existing ES cluster.  
Currently we use Logstash to organise sending data to Elastic Search in the required format, but you could also opt for an alternative solution.

## HAproxy  (routing)
Each Vamp Gateway Agent (VGA) requires its own instance of HAproxy. This is a hard requirement, so to keep things simple we have a Docker container with Vamp Gateway Agent (VGA) and HAproxy, available from the Docker hub ([hub.docker.com - magneticio/vamp-gateway-agent](https://hub.docker.com/r/magneticio/vamp-gateway-agent/)).  
Read more about [how Vamp works with HAproxy](/documentation/how-vamp-works/routing-and-load-balancing/)

{{< note title="What next?" >}}
* Read about [routing and load balancing](/documentation/how-vamp-works/routing-and-load-balancing)
* Find out about [using Vamp](/documentation/using-vamp/artifacts)
{{< /note >}}

