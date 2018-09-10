---
date: 2018-09-07T21:00:00+00:00
title: Vamp and Kubernetes
aliases:
    - /documentation/how-vamp-works/vamp-and-kubernetes
menu:
  main:
    identifier: "vamp-and-kubernetes-v100"
    parent: "How Vamp works"
    weight: 40
---

There is a strong synergy between Vamp artifacts such as Environments, Deployments and Gateways, and the corresponding Kubernetes constructs but the terminology can be confusing.

### Vamp tenant environments

Vamp implements multi-tenancy using a two-level [namespace model](/documentation/how-vamp-works/v1.0.0/concepts-and-components/#namespaces). A tenant has exactly one organisation namespace plus one or more environment namespaces.

Kubernetes [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)s are a logical construct which can be use as a way to divide cluster resources between multiple users.

On Kubernetes, Vamp environment namespaces are implemented using Kubernetes Namespaces.

### Vamp deployments

Vamp has the concept of [blueprints](/documentation/using-vamp/v1.0.0/blueprints), which are execution plans that describe how microservices should be hooked up and what their topology should look like at runtime. **Blueprints are static resources that describe the *desired state***.

A Vamp [deployment](/documentation/using-vamp/v1.0.0/deployments) is a dynamic entity that describes a “running” blueprint with added runtime information such as the current state, resolved ports etc.

During the lifecycle of the deployment, Vamp monitors the state of each deployment and when differences arise **Vamp will adjust the state of that deployment so that it's *current state* matches the *desired state***.

A Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) uses a Deployment object to describe a *desired state*, and **a Deployment controller which is responsible for changing the *actual state* into the *desired state***.

On Kubernetes, Vamp deployments are realised using one or more Kubernetes Deployments.

### Vamp gateways

Vamp gateways provide a super set of Kubernetes [Service](https://kubernetes.io/docs/concepts/services-networking/service/) and [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller features.

TODO Kubernetes services are simple transparent proxies 

Single Service Ingress
Simple Fanout 
Name based virtual hosting
TLS
Load Balancing

Vamp Gateway Agents (VGAs) are not implemented as a Ingress controller on Kubernetes this is because the VGAs offer a much richer set of features than is supported by the Ingress controller API.

Service.Type=LoadBalancer
Service.Type=NodePort


{{< note title="What next?" >}}
* Find out how to [install Vamp](/documentation/installation/v1.0.0/overview)
{{< /note >}}
