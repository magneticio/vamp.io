---
date: 2016-09-30T12:00:00+00:00
title: Google Cloud Kubernetes Engine
platforms: ["Google", "Kubernetes"]
menu:
  main:
    identifier: "google-cloud-kubernetes-engine-v100"
    parent: "Installation"
    weight: 40
aliases:
    - /documentation/installation/google-cloud-kubernetes
---

## Google Container Engine

The installation will run Vamp together with etcd and Elasticsearch on Google container engine and kubernetes. Before you begin, it is advisable to try out the official Quickstart for Google Container Engine tutorial first ([google.com - container engine quickstart](https://cloud.google.com/container-engine/docs/quickstart)).

{{< note title="Note!" >}}
Kubernetes support is still in Alpha.
{{< /note >}}

**Tested against**
This guide has been tested on Kubernetes and kubectl 1.4.x, 1.5.x and 1.6.0. Minikube 0.13.x or higher can also be used. ([github.com - minikube](https://github.com/kubernetes/minikube))

**Requirements**

* Google Container Engine cluster or Minikube (0.13.1 or later)
* Key-value store (like ZooKeeper, Consul or etcd)
* Elasticsearch
* Enough (CPU and memory) resources on your K8s cluster to deploy the Vamp dependencies AND the containers at the scale you define. NB take a look into the available resources when a deployment keeps "hanging" to see if you actually have enough resources available.
* Vamp currently only supports the 'default' namespace, so this should be available.

### Create a new GKE cluster

The simple way to create a new GKE cluster:

1. open Google Cloud Shell
2. set a zone, e.g. `gcloud config set compute/zone europe-west1-b`
3. create a cluster `vamp` using default parameters: `gcloud container clusters create vamp`

After the (new) Kubernetes cluster is setup, we are going to continue with the installation using the Kubernetes CLI `kubectl`.
You can use `kubectl` directly from the Google Cloud Shell, e.g. to check the Kubernetes client and server version:

```
kubectl version
```
