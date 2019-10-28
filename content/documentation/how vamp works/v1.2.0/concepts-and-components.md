---
date: 2016-09-13T09:00:00+00:00
title: Concepts and components
menu:
  main:
    identifier: "concepts-and-components-v120"
    parent: "How Vamp works"
    weight: 10
---

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

### Release Policies

Release polices are predefined plans for how a new version of a microservice should be released.

A release policy consists of one or more steps. Each step must have one or more success conditions. A condition compares a named metric against a baseline value. Policies can use Vamp's out-of-the-box metrics or custom metrics based on any data accessible in Elasticsearch. A policy can also define success and failure hooks which are useful when integrating Vamp with CD pipelines.

## Vamp Components

### Dependencies

Vamp has four dependencies a secure key-value store, a SQL database, a secure data stream for events and Elasticsearch for aggregated metrics.

#### Hashicorp Vault

Vamp uses Hashicorp Vault as a secure key-value to store the namespaces configurations, workflow scripts and Vamp Gateway Agent (VGA) configuration.

#### NATS Streaming Server

Vamp uses NATS Streaming Server as a secure, durable data stream for events. This forms the core of Vamp's event-driven model and is principally used to communicate network topology changes within environments and to communicate release policy changes across environments.

#### MySQL

Vamp uses MySQL to store the definitions and current states of the services, gateways and workflows. The SQL database is also used to store the user role definitions and users. All data is securely stored.

#### Elasticsearch

Vamp uses Elasticsearch to store raw traffic logs and aggregated health and traffic metrics. Elasticsearch is also used by Vamp for audit logging.

### Vamp Lifter

Vamp Lifter provides an API and UI for creating, configuring and managing tenants. It also includes an installer which is useful for bootstrapping a minimal, all-in-one topology for non-production purposes.

### Vamp Forklift

Forkift provides a CLI tool for creating, configuring and managing tenants. It also provides tooling for creating and managing release policies.

### Vamp

Vamp is the main API endpoint, business logic and service coordinator. Vamp talks to the configured container scheduler (Kubernetes or DC/OS) and synchronizes it with Vamp Gateway Agent (VGA) via the secure key-value store.

Vamp is not a realtime application and only updates deployments and routing when asked to (reactive) and thus doesn't need to run with multiple instances in HA mode.

### Vamp UI

The Vamp UI is a graphical web interface for managing Vamp in a web browser. It is packaged with Vamp.

### Vamp CLI

The Vamp CLI is a command line interface for managing Vamp and providing integration with (shell) scripts.

### Vamp workflows

Vamp workflows are script s or small applications that automate and optimise the deployment and runtime of your application and services.

We have included a set of useful "Vamp native" workflows out of the box, such as health and traffic metrics, which are used by the Vamp UI to report system status and to enable autoscaling and self-healing. We also provide a Node.js library to simplify the job of writing your own.

### Vamp Gateway Agent (VGA)

The Vamp Gateway Agent (VGA) uses confd to read the Vamp-generated HAProxy configuration from a secure key-value store and update HAProxy. Logs from HAProxy are read by Filebeat and shipped to Elasticsearch.

The VGAs have short-term resilience. Running VGAs will continue to function if they lose their connection to the secure key-value store and will continue to handle service traffic as normal but new instances cannot be started without a key-value store connection. To reduce the risk of traffic loss, you must always have a minimum of two VGAs running, load-balanced and on different nodes.

### Vamp Release Agent

The Vamp Release Agent provides automated release management based on release policies. Each Vamp Gateway can have one or more policies associated with it.

{{< note title="What next?" >}}

- Choose a [deployment model](/documentation/how-vamp-works/v1.2.0/deployment-models)
- Read about the [requirements to run Vamp](/documentation/how-vamp-works/v1.2.0/requirements)
  {{< /note >}}
