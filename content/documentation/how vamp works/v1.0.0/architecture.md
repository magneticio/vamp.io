---
date: 2016-09-15T09:00:00+00:00
title: Architecture
aliases:
    - /documentation/how-vamp-works/
menu:
  main:
    identifier: "architecture-v100"
    parent: "How Vamp works"
    weight: 10
---

## Architecture
The Vamp architecture consists seven key components: four core components and three dependencies. The core Vamp components are Vamp, Lifter, the Vamp Gateway Agents (VGAs) and Vamp Workflow Agents. The dependencies are Hashicorp Vault (Vault), MySQL and Elasticsearch.

Whilst Vamp can be deployed in a number of different configurations, there are some key data and security architecture that require consideration:

1. **Containers are short-lived**. For example, the Kubernetes documentation specifically says pods [won’t survive scheduling failures, node failures, or other evictions, such as due to lack of resources, or in the case of node maintenance](https://kubernetes.io/docs/concepts/workloads/pods/pod/)
2. **Nodes are frequently short-lived**, they can be removed if the cluster is resized, they can fail like any other VM, or be replaced in the case of maintenance
3. **Services are generally longer lived** than both the containers which implement the service and the nodes which the containers run
4. **Cluster and service configuration data is longer lived** than the clusters and services that they define
5. There is an increasing trend of **legal requirements to hold data within national data centres**
6. Depending on the regulatory frameworks under which your organization operates your **audit data may need to be very long-lived** 

In terms of Vamp topology:

* If Vamp will be managing services on two or more clusters, then Vamp, Lifter and the dependencies should be deployed on a separate cluster
* Vault, MySQL and Elasticsearch must use storage that will survive a cluster restart
* Data from both Vault and MySQL is needed to "recover" Vamp to it's previous state after a cluster restart
* Vamp Gateway Agents
  * To reduce the risk of traffic loss, you must always have a minimum of two VGAs running, load-balanced and on different nodes
  * The VGAs have short-term resilience. Running VGAs will continue to function if they lose their connection to Vault but new instances cannot be started without a Vault connection


### Quickstart topology

{{< note title="Note!" >}}
**Do not deploy this topology in production!** It does not include persistent storage.
{{< /note >}}

This all-in-one cluster topology is only suitable when evaluating Vamp and smaller, lower volume development clusters where costs are more important than data security and durability.

![architecture](/images/diagram/v100/vampee-arch-quickstart.png)

### Separate management and service clusters

We highly recommend separating the management-focused components (Lifter and Vamp) from the operational-focused components (the Vamp Gateway Agents and workflows). Each environment on each service cluster requires a minimum of two VGAs running on different nodes plus one workflow agent.

As a minimum, we highly recommend using a managed MySQL service rather than running MySQL in the management cluster with external storage.

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql.png)

Vault should also be outside the management cluster but if you choose to run Vault in the management cluster we highly recommend using MySQL as the storage backend.

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql-vault.png)

In all cases, external storage should be used for Elasticsearch. A single Elasticsearch node is sufficient for where the total traffic volume across all environments is low.

A multi-node Elasticsearch cluster should be used for high traffic volume applications or lower volume applications where the audit logging needs to meet specific regulatory requirements.


{{< note title="What next?" >}}
* Read about the [requirements to run Vamp](/documentation/how-vamp-works/v1.0.0/requirements)
{{< /note >}}
