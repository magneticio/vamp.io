---
date: 2016-09-15T09:00:00+00:00
title: Deployment Models
aliases:
    - /documentation/how-vamp-works/
    - /documentation/how-vamp-works/architecture-and-components/
menu:
  main:
    identifier: "deployment-models-v100"
    parent: "How Vamp works"
    weight: 20
---

## Architectural considerations
The Vamp architecture consists seven key components: four core components and three dependencies. The core Vamp components are Vamp, Lifter, the Vamp Gateway Agents (VGAs) and Vamp Workflow Agents. The dependencies are Hashicorp Vault (Vault), MySQL and Elasticsearch.

Whilst Vamp can be deployed in a number of different configurations, there are some key data and security considerations that should be taken into account:

1. **Containers are short-lived**. For example, the Kubernetes documentation specifically says pods [won’t survive scheduling failures, node failures, or other evictions, such as due to lack of resources, or in the case of node maintenance](https://kubernetes.io/docs/concepts/workloads/pods/pod/)
2. **Nodes are frequently short-lived**, they can be removed if the cluster is resized, they can fail like any other VM, or be replaced in the case of maintenance
3. **Services are generally longer lived** than both the containers which implement the service and the nodes which the containers run
4. **Cluster and service configuration data is longer lived** than the clusters and services that they define
5. There is an increasing trend of **legal requirements to hold data within national data centres**
6. Depending on the regulatory frameworks under which your organization operates your **audit data may need to be very long-lived** 

In terms of Vamp deployment models:

* If Vamp will be managing services on two or more clusters, then Vamp, Lifter and the dependencies should be deployed on a separate cluster
* Vault, MySQL and Elasticsearch must use storage that will survive a cluster restart
* Data from both Vault and MySQL is needed to "recover" Vamp to it's previous state after a cluster restart
* Vamp Gateway Agents
  * To reduce the risk of traffic loss, you must always have a minimum of two VGAs running, load-balanced and on different nodes
  * The VGAs have short-term resilience. Running VGAs will continue to function if they lose their connection to Vault but new instances cannot be started without a Vault connection


### All-in-one cluster model

{{< note title="Note!" >}}
**Do not deploy the Quickstart model in production!**
The dependencies deployed by the Lifter installer does not include persistent storage.
{{< /note >}}

The all-in-one cluster model is only suitable for short-lived, lower volume development clusters where long-term durability is not a factor and costs are more important than data security.

![quickstart model](/images/diagram/v100/vampee-arch-quickstart.png)

### Separate management and service clusters models

We highly recommend separating the management-focused components (Lifter and Vamp) from the operational-focused components (the Vamp Gateway Agents and workflows). Each environment on each service cluster requires a minimum of two VGAs running on different nodes plus one workflow agent.

As a minimum, we highly recommend using a managed MySQL service rather than running MySQL in the management cluster with external storage.

![mgnt-svc-ext-mysql model](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql.png)

Vault should also be outside the management cluster but if you choose to run Vault in the management cluster we highly recommend using MySQL as the storage backend.

![mgnt-svc-ext-mysql-vault model](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql-vault.png)

In all cases, external storage should be used for Elasticsearch since it is used to store the Vamp audit logs.

A single node Elasticsearch cluster residing in the management cluster is sufficient when the total traffic volume across all environments is low. A multi-node Elasticsearch cluster should be used for high traffic volume applications or lower volume applications where the audit logging needs to meet specific regulatory requirements.

If some of the service clusters are located in a different data centre (cloud region) to the one used for the management cluster, then it may make sense to use an Elasticsearch that is located in the same cloud region. Different Elasticsearch clusters can be specified at the tenant (organization) level and also at the environment level.

![vampee-arch-mgnt-svc-ext-mysql-vault-remote-es model](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql-vault-remote-es.png)

The VGAs use Elasticsearch to log extensive meta-data about the service traffic passing through each gateways. The Quantification Workflow then aggregates this data for use by other workflows and also for display in the Vamp UI. Since Vamp only makes use of the aggregated data, for high traffic volume applications it makes sense to store and process the VGA logs within the same region.

Vamp is designed to provide strong data security and only collects meta-data, it does not in any way store or process the payloads of the traffic passing VGAs. However, to simplify compliance with the EU General Data Protection Regulation (GDPR) and other national data protection regulations, we recommend the following:

1. That you use an Elasticsearch cluster in the same data centre (cloud region) as your management cluster to store the audit logs and also for countries that do not have geographical restrictions on data processing and storage. Co-located Elasticsearch clusters should be used if the traffic volumes are high
1. That you use an Elasticsearch cluster in a EU data centre (cloud region) for applications that service users in the EU
2. Where necessary, that you use a separate Elasticsearch cluster in each country that has it's own national regulatory requirements. For example, a separate Elasticsearch cluster in Germay for applications that service users in Germany

{{< note title="What next?" >}}
* Read about the [requirements to run Vamp](/documentation/how-vamp-works/v1.0.0/requirements)
{{< /note >}}
