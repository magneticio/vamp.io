---
date: 2016-09-15T09:00:00+00:00
title: Architecture
aliases:
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
5. Depending on the regulatory frameworks under which your organization operates your **audit data may need to be very long-lived**. 

In terms of Vamp topology:
* If Vamp will be managing services on two or more clusters, then Vamp, Vault, MySQL and Elasticsearch should be deployed on a separate cluster
* Vault, MySQL and Elasticsearch must use storage that will survive a cluster restart
* Data from both Vault and MySQL is needed to "recover" Vamp to it's previous state after a restart
* Vamp Gateway Agents
  * To reduce the risk of traffic loss, you must always have a minimum of two VGAs running, load-balanced and on different nodes
  * The VGAs have short-term resilience. Running VGAs will continue to function if they lose their connection to Vault but new instances cannot be started without a Vault connection


### Quickstart topology

{{< note title="Note!" >}}
**Do not deploy this topology in production!** It does not include persistent storage.
{{< /note >}}

![architecture](/images/diagram/v100/vampee-arch-quickstart.png)

### Separate management and service clusters

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc.png)

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-alldeps.png)

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql-vault.png)

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-alldeps.png)
