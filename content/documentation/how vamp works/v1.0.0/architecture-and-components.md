---
date: 2016-09-13T09:00:00+00:00
title: Architecture and components
aliases:
    - /documentation/how-vamp-works/
    - /documentation/using-vamp/artifacts/
    - /documentation/how-vamp-works/architecture-and-components/
menu:
  main:
    identifier: "architecture-and-components-v100"
    parent: "How Vamp works"
    weight: 10
---

## Architecture
Vamp's architecture consists of several components that work together to deliver canary releasing, microscaling and other valueable release and runtime optimisation and automation workflows. The main components of Vamp are Vamp "core" (the brains), Vamp Gateway Agent (creating an ingress and intra-service mesh based on reverse proxies) and Vamp Workflow Agent (running automation scripts injected in containers managed by Vamp).

Vamp and the Vamp Gateway Agent require specific components in your architecture to handle orchestration (like a database for persistence data, a key-value store for proxy configurations, and elasticsearch for aggregated metrics). There is no set architecture required for running Vamp and every use case or specific combination of tools and platforms can have its own set up.

### Example topology
The below diagram should be used more as an overview than required architecture. For example, in this diagram the Mesos/Marathon stack and Elasticsearch are included even though these are not a hard dependency and can be replaced by f.e. Kubernetes as a container-scheduler and cluster-manager and in-memory for aggregated metrics. Vamp can be configured to run with other container schedulers, log-aggregators, key-value and event-stores.

![architecture](/images/diagram/v100/architecture_and_components.png)

## Concepts

### Multi-Tenancy
Vamp supports multiple tenants. Tenants can be different teams within a business division, different business divisions inside the same organization, or entirely different organizations. Each tenant's data is isolated and remains invisible to other tenants.

### Namespaces
Vamp implements multi-tenancy using a two-level namespace model. A tenant has exactly one organisation namespace plus one or more environment namespaces.

#### Organizations
The organization namespace holds configuration that is common to all environments such as password salts, users and roles. The configuration for the persistent storage are also normally defined at the organization level.

#### Environments
An environment namespace typically represents part of a DTAP-pipeline (Development > Testing > Acceptance > Production). The container scheduler (Kubernetes or Marathon) is defined at the environment level. When using Kubernetes, there is a one-to-one mapping between a Vamp namespace and a Kubernetes namespace. When a high degree of isolation is required, the dedicated persistent storage can be defined at the environment level.

### Role-Based Access Control
A tenant can be thought of as a group of users who share access to a specific set of resources. Role-Based Access Control (RBAC) enables fine-grained access management for Vamp. Using RBAC, you can segregate duties within your team and grant only the amount of access to users that they need to perform their jobs.

### Workflows
Vamp Workflows are event-driven scripts or small applications that can be used to automate cloud-native deployment strategies, integrate with third-party service discovery registries or send notifications to interested parties, for example. Workflows can be run standalone or arranged into multi-stage pipelines.

### Gateways
Vamp Gateways fulfill two essential roles in a microservice architecture: service discovery and exposing services at the cluster edge. Vamp Gateways provide a service mesh that allows services to discover the location of upstream services and then directly connect to them safely and reliably. Vamp Gateways are also function as API gateways, providing ingress with vhost support, request routing and API composition for microservices-based applications. 

## Vamp Components

### Dependencies
Vamp has three dependencies a secure key-value store, a SQL database, and Elasticsearch for aggregated metrics.

#### Hashicorp Vault
Vamp uses Hashicorp Vault as a secure key-value to store the namespaces configurations, workflow scripts and Vamp Gateway Agent (VGA) configuration.

#### MySQL
Vamp uses MySQL to store the definitions and current states of the services, gateways and workflows. The SQL database is also used to store the user role definitions and users. All data is securely stored.

#### Elasticsearch
Vamp uses Elasticsearch to store raw traffic logs and aggregated health and traffic metrics. Elasticsearch is also used by Vamp for audit logging. 

### Vamp
Vamp is the main API endpoint, business logic and service coordinator. Vamp talks to the configured container manager (Docker, Marathon, Kubernetes etc.) and synchronizes it with Vamp Gateway Agent (VGA)  via ZooKeeper, etcd or Consul (distributed key-value stores). Vamp can use a SQL database or Elasticsearch for artifact persistence and Elasticsearch to store events (e.g. changes in deployments). Typically, there should be one Vamp instance and one or more VGA instances (we conform to the AirBnB Smartstack pattern). Vamp is not a realtime application and only updates deployments and routing when asked to (reactive) and thus doesn't need to run with multiple instances in HA mode. If this is a hard requirement of your project please contact us for the [Vamp Enterprise Edition](/product/enterprise-edition/).

### Vamp Lifter

### Vamp UI
The Vamp UI is a graphical web interface for managing Vamp in a web browser. It is packaged with Vamp.

### Vamp CLI
The Vamp CLI is a command line interface for managing Vamp and providing integration with (shell) scripts. It's currently not very well maintained but still can be useful if our REST API cannot be used for your integration requirements.

### Vamp workflows
Vamp workflows are small applications or scripts (for example using (Node.js) JavaScript or your own containers that access the Vamp API) that automate and optimise the deployment and runtime of your system that consists of applications and services running inside containers. We have included a set of useful workflows out of the box, such as health and metrics, which are used by the Vamp UI to report system status and to enable autoscaling and self-healing. Our [Vamp Runner project](https://github.com/magneticio/vamp-runner/) provides more advanced workflow recipes as an example.

### Vamp Gateway Agent (VGA)
Vamp Gateway Agent (VGA) uses confd to read the Vamp-generated HAProxy configuration from ZooKeeper, etcd or Consul and reloads HAProxy on each configuration change with as close to zero client request interruptions as possible. Typically, there is one Vamp instance and one VGA instances on every cluster-node.
Logs from HAProxy are read by Filebeat and shipped to Elasticsearch. VGA will handle and recover from ZooKeeper, etcd and Consul outages without interrupting the HAProxy process and client requests.

{{< note title="What next?" >}}
* Read about the [requirements to run Vamp](/documentation/how-vamp-works/v0.9.5/requirements)
{{< /note >}}
