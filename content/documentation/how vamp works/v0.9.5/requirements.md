---
date: 2016-09-13T09:00:00+00:00
title: Requirements
menu:
  main:
    identifier: "requirements-v095"
    parent: "How Vamp works"
    weight: 20
---

Vamp's components work together with elements in your architecture to handle orchestration, routing, persistence and metrics aggregation. To achieve this, Vamp requires access to a container scheduler, key value store, a relational database (optionally), Elastic Search and HAProxy (Vamp packages this is our Vamp Gateway Agent container).

## Container scheduler (orchestration)
Vamp talks directly to your choice of container scheduler. Currently we support [Mesos/Marathon](/documentation/installation/v0.9.5/mesos-marathon), [DC/OS](/documentation/installation/v0.9.5/dcos) and [Kubernetes](/documentation/installation/v0.9.5/kubernetes). (NB Vamp is also know to work with Rancher and single-machine Docker, but these are not tested against the latest version yet.) In case you’re “greenfield” and don’t have anything selected or running yet, check [which container scheduler?](/documentation/how-vamp-works/v0.9.5/which-container-scheduler)

## Key value store
Vamp depends on a key-value (KV) store for non-direct communication between Vamp and instances of the Vamp Gateway Agent (VGA). There is no direct connection between Vamp and the VGA instances, all communication is done by managing specific key-values in the key-value store. When Vamp needs to update the HAProxy configuration (e.g. when a new service has been deployed) Vamp will generate the new configuration and store it in the KV store. The VGAs read these configuration values and reload HAProxy instances accordingly.

Currently we support the following KV stores:

* **ZooKeeper** ([apache.org - zookeeper](https://zookeeper.apache.org/)).
Vamp and VGAs can use an existing DC/OS ZooKeeper cluster.
* **etcd** ([coreos.com - etcd](https://coreos.com/etcd/docs/latest/))
Vamp and VGAs can use an existing Kubernetes etcd cluster.
* **Consul** ([consul.io](https://www.consul.io/))

## Relational Database
Vamp persists artifacts such as blueprints, breeds and more. These artifacts are kept in-memory, but can also be persisted to a relational database. This will allow VAMP restarts and upgrades without any data loss. Currently, Vamp supports MySQL, PostgreSQL and Microsoft SQL Server. It's easy to extend to different SQL databases.

## Elastic Search
Vamp uses Elastic Search (ES) for aggregating and storing the metrics used by Vamp workflows and the Vamp UI. As Vamp is not demanding in ES resources, it can comfortably work with an existing ES cluster.

Currently we use Filebeat to send HAproxy logs to Elastic Search, but you could also opt for an alternative solution.

## HAProxy  (routing and reverse proxying)
Each Vamp Gateway Agent (VGA) requires its own instance of HAProxy. This is a hard requirement, so to keep things simple we provide a Docker container with both Vamp Gateway Agent (VGA) and HAProxy ([hub.docker.com - magneticio/vamp-gateway-agent](https://hub.docker.com/r/magneticio/vamp-gateway-agent/)).

{{< note title="What next?" >}}
* Find out how to [install Vamp](/documentation/installation/v0.9.5/overview)
* High level pointers for [choosing a container scheduler](/documentation/how-vamp-works/v0.9.5/which-container-scheduler)
{{< /note >}}
