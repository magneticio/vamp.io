---
date: 2016-09-13T09:00:00+00:00
title: Requirements
aliases:
    - /documentation/how-vamp-works/requirements
menu:
  main:
    identifier: "requirements-v100"
    parent: "How Vamp works"
    weight: 30
---

Vamp requires access to a container scheduler (Kubernetes or DC/OS), a secure key-value store, a SQL database, and Elasticsearch.

## Container scheduler

### Kubernetes

Vamp supports Kubernetes 1.9.x and 1.10.x. Supoort for Kubernetes 1.11.x is currently in beta.

Vamp has been tested with:

* [Amazon Elastic Container Service for Kubernetes](https://aws.amazon.com/eks/) (EKS)
* [Azure Kubernetes Service](https://azure.microsoft.com/en-us/services/kubernetes-service/) (AKS)
* [Google Cloud Kubernetes Engine](https://cloud.google.com/kubernetes-engine/) (GKE)

### DC/OS

Vamp supports DC/OS and DC/OS Enterprise 1.9.x and later. Supoort for DC/OS 1.11.x is currently in beta.

## Dependencies

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql.png)

Vamp has three dependencies: a secure key-value store, a SQL database, and Elasticsearch for aggregated metrics.

### MySQL
MySQL version 5.7.x and later

Vamp uses MySQL to store the **blueprint and gateway definitions** and the **current states of the deployments, gateways and workflows**. The SQL database is also used to store the user role definitions and users. All data is securely stored.

**We highly recommend using a managed MySQL service rather than running the MySQL in the same cluster as Vamp**.

Vamp has been tested with:

* [Amazon RDS for MySQL](https://aws.amazon.com/rds/mysql/)
* [Azure Database for MySQL](https://azure.microsoft.com/en-us/services/mysql/)
* [Google Cloud SQL](https://cloud.google.com/sql/)

### Hashicorp Vault
Hashicorp Vault version 0.9.x and earlier. Support for version 0.10.x and later is currently in development.

Vamp uses Hashicorp Vault as a secure key-value to store the namespaces configurations, workflow scripts and Vamp Gateway Agent (VGA) configuration.

**DC/OS Enterprise** users can use the [DC/OS Enterprise Secret Store](https://docs.mesosphere.com/1.10/security/ent/secrets/)

**Vamp requires both the data stored in Vault and the data stored in MySQL following a cluster restart, etc.**

[Hashicorp provide an extensive deployment guide](https://www.vaultproject.io/guides/operations/deployment-guide.html). If you choose to run Vault in the same cluster as Vamp we highly recommend using MySQL as the storage backend.

### Elasticsearch
Elasticsearch version 6.2.x or later.

Vamp uses Elasticsearch to store raw traffic logs and aggregated health and traffic metrics. Elasticsearch is also used by Vamp for audit logging.

## Recommended cluster resources

### Separate management and service clusters

We highly recommend separating the management-focused components (Lifter and Vamp) from the operational-focused components (the Vamp Gateway Agents and workflows).

**Cluster and service configuration data is longer lived** than the clusters and services that they define. There are increasing **legal requirements to hold data within national data centres** and depending on the regulatory frameworks under which your organization operates your **audit data may need to be very long-lived**. [Vamp is designed with these requirements in mind](/documentation/how-vamp-works/).

#### Minimum Requirements

**Kubernetes**:

* Management cluster:
  * **Lifter and Vamp only**: 2 nodes with 2+ vCPUs and 7.5+ GB memory per node
  * **Lifter and Vamp plus Vault and Elasticsearch**: 3 nodes with 2+ vCPUs and 7.5+ GB memory per node. This could be also be 2 higher capacity nodes
* Each environment on each service cluster, requires:
  * **2 VGAs and workflow agent**: 3 nodes with 1.2+ vCPU and 2.2+ GB memory per node. This can be spare capacity on 3 existing nodes

**DC/OS**:

* Management cluster:
  * **Lifter and Vamp only**: 2 nodes with 2+ vCPUs and 7.5+ GB memory per node
  * **Lifter and Vamp plus Vault and Elasticsearch**: 2 nodes with 4+ vCPUs and 12+ GB memory per node
    The higher requirements reflect how Mesos managements resource requests.
* Each environment on each service cluster, requires:
  * **Workflow agent**: 1 node (private agent) with 0.5+ vCPU and 0.5+ GB memory
  * **2 VGAs**: 3 nodes (public agents) with 1+ vCPU and 2+ GB memory per node.
    This can be spare capacity on 3 existing public agent nodes, provided that no other services on those nodes are bound to port 80/443. 
  
### All-in-one cluster

This topology is suitable for smaller, lower volume development clusters where costs are more important than data security and durability.

**Minimum Requirements**:

* A Kubernetes cluster with at least 4 nodes with 2+ vCPUs and 7.5+ GB memory per node
* A DC/OS cluster with at least 5 nodes (2 public agents) with 4 vCPUs and 12+ GB memory per node.
  The higher requirements reflect how Mesos managements resource requests.

{{< note title="What next?" >}}
* Find out how to [install Vamp](/documentation/installation/v1.0.0/overview)
{{< /note >}}
