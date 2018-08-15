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

Whilst Vamp can be deployed in a number of different configurations, there are some key architectural considerations that should be followed:

1. The lifecycle of the configuration data is longer than the lifecycle of the core components
  * The data held in both Vault and MySQL is needed to "recover" Vamp to it's previous state after a cluster restart
  * This data must be stored outside cluster on which Vamp is running
2. The lifecycle of the audit data is longer than the lifecycle of the core components
  * The data held in Elasticsearch provides a detailed and precise history of the actions carried out using Vamp, when each action happened and who ultimately initiated each action
  * This data should be stored outside cluster on which Vamp is running, for reasons of security
3. **Only the Vamp Gateway Agents are mission critical** 
  * You must deploy multiple, load balanced VGAs - 

### Quickstart topology

![architecture](/images/diagram/v100/vampee-arch-quickstart.png)

### Separate management and service clusters

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc.png)

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-alldeps.png)

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-mysql-vault.png)

![architecture](/images/diagram/v100/vampee-arch-mgnt-svc-ext-alldeps.png)
