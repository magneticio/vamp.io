---
date: 2016-08-15T09:00:00+00:00
title: "Putting Istio to work"
author: "Jason Griffin"
avatar: "jasong.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices", "DevOps"]
publishdate: 2018-05-04
---

![](https://cdn-images-1.medium.com/max/720/1*hHVBnftiViKepR6EMbG5RA.png)

This is part of an ongoing series of posts describing [Vamp’s Gateway Agent](https://medium.com/vamp-io/vamps-gateway-agent-9508ad5a5177) component and our experiences of adopting Istio for east-west traffic on Kubernetes. In this post we want to introduce ***Lamia*** and give you a first glimpse of the working code.

<!--more-->

In a [previous post](https://medium.com/vamp-io/taming-istio-76fab339f685) we discussed some of the challenges we faced whilst implementing the basic **gradual roll-out**, **automatic rollback** and **conditional routing** functionality. We code named the implementation *Lamia* — depending on your heritage, *Lamia* is either something shiny or a child eating monster.

*Lamia* is a single Docker container that provides a REST API and React-based UI that you can use to:

* gradually roll-out a new version of a service;

* automatically rollback to the original version, in the case of errors; and

* apply routing conditions.

You can find the installer and a detailed readme on **[GitHub](https://github.com/magneticio/vamp2setup)**.

Obviously *Lamia* is not nearly as fully-featured as our current production gateway agents but it is real working code and there is nothing to stop you from using it to do an **automated canary release** of your favourite microservice. Though, we certainly don’t recommend that you use it to manage productions services that you care about.

## Prerequisites

This version of *Lamia* is **alpha code** built on top of Istio’s **[route rules alpha 1](https://istio.io/docs/reference/config/istio.routing.v1alpha1.html)** and is **only intended for developers and DevOps engineers** who already have some K8s experience.

To get started you will need:

* A cluster with Kubernetes version 1.9 or above installed

* **kubectl** installed on you local computer and authorized to access the cluster

* A **Slack** account, if you want *Lamia* to send notifications

*Lamia* should work on any K8s 1.9 cluster but we’ve only tested it on Google Cloud.

The installer deploys **Prometheus** and **Istio 0.7.1** on to the cluster, if they are not already deployed.

**Note:** that if you have existing deployments, after the installation has been completed you will need to restart them or trigger a rolling update in order for the **Istio Sidecar** to be injected.

## Terminology

We describe the functioning of *Lamia* using the following terms. These are different to the [Vamp terminology](https://vamp.io/documentation/using-vamp/v0.9.5/artifacts/) and whilst most of the terms overlap completely with K8s entities, some don’t:

* **Project**: a project is a grouping of clusters. This will automatically be created by *Lamia*, so you need not worry about it for this tutorial.

* **Cluster**: a cluster corresponds to a specific Kubernetes cluster. Just like the **Project**, this will automatically be created by *Lamia*.

* **Virtual Cluster**: a virtual cluster is a partition of a **Cluster** and is represented by a **Namespace** in Kubernetes.

* **Application**: a grouping of related deployments

* **Deployment**: a Kubernetes deployment which represents a specific version of an **Application**

* **Service**: a Kubernetes service associated with all **Deployments** of a given **Application**

* **Ingress**: a Kubernetes **ingress** exposing an Application Service

* **Gateway**: a **software defined networking** component regulating access to a the different versions of an **Application** through a configured **Service**. In Kubernetes it corresponds to one or more Istio **Route Rules**.

* **Policy**: an automated process that periodically performs actions over an entity. Currently only supported for **Gateways**

## Configuring Lamia

The readme on GitHub has detailed instructions for how to:

* setup a **virtual cluster**,

* deploy 2 versions of an **application**, and

* expose the application publicly as a **service** through a **gateway**.

You can use the **vamp-tutorial-app**, or your favourite microservice. If you are using your own application, you need to ensure that all deployments have the following 3 labels set:

* **app**: identifies the application to which the deployment belongs

* **deployment**: identifies the deployment itself

* **version**: the version of the application to which the deployment belongs, this is used by Istio to dispatch traffic

## Manual Canary Release

Once you’ve created a gateway for your application, you can manually set the **weight** (or percentage of traffic) for each version of the application.

![](https://cdn-images-1.medium.com/max/5760/1*4nI3TuU-b-SJeiaHYRIVcA.png)

You can then experiment by changing the weights in the UI.

## Policy-Based, Gradual Roll-Outs

**Policies** are automated processes that alter the gateway configuration over a period of time. *Lamia* has 4 predefined policies, each of which can be configured.

The simplest policy is the **TimeCanaryReleasingPolicy**. This policy gradually shifts the weights so that the **target** (new) version of the microservice receives an increasing share of the traffic. The default is to change the weights by 10% every 10 seconds.

![](https://cdn-images-1.medium.com/max/5760/1*J6c3QdxjR6hYrX6LS9sRgg.png)

This is, of course, a pretty limited example. Typically, you would want to ensure that a version only receives traffic if it is healthy. The **HealthBasedGatewayCanaryReleasingPolicy** performs the gradually shift of traffic to the **target** version but it will only update the weights if the target version is healthy.

The default metric is:

    external_upstream_rq_2xx / upstream_rq_total

If the percentage of errors exceeds 20%, the policy will shift traffic away from the target and back to the original version.

The **MetricBasedGatewayCanaryReleasingPolicy** allows you to define your own health metric based on the data that Envoy stores in Prometheus. The available metrics include:

* **external_upstream_rq_200**

* **external_upstream_rq_2xx**

* **external_upstream_rq_500**

* **external_upstream_rq_503**

* **external_upstream_rq_5xx**

* **upstream_rq_total**

For example, the following metric is the ratio of successful HTTP requests (2xx + 3xxx status codes) vs the total number of requests excluding “expected” errors (4xx status codes).

    (external_upstream_rq_2xx + upstream_rq_3xx) / (upstream_rq_total - external_upstream_rq_4xx)

The **MetricBasedGatewayCanaryReleasingPolicy** has a single, fixed expression: “select the version with the best metric”. The **CustomGatewayCanaryReleasingPolicy** allows you to define complex, custom expressions.

For example, this expression describes the behaviour of the **HealthBasedGatewayCanaryReleasingPolicy**.

    if ( ( metric "version1" "external_upstream_rq_2xx" / metric "version1" "upstream_rq_total" ) > ( metric "version2" "external_upstream_rq_2xx" / metric "version2" "upstream_rq_total" ) ) { result = version1; } else if ( ( metric "version1" "external_upstream_rq_2xx" / metric "version1" "upstream_rq_total" ) < ( metric "version2" "external_upstream_rq_2xx" / metric "version2" "upstream_rq_total" ) ) { result = version2; } else { result = nil; } result

## Conditional Routing

You can also control the traffic that is accepted by a service. As an example, you might want to split all requests with User-Agent containing “Chrome” or “Nexus 6P” equally between the original and new versions, while sending all other requests to the original version.

The “Chrome” or “Nexus 6P” condition can be expressed as:

    header "User-Agent" regex "^.*(Chrome).*$"  or header "User-Agent" regex "^.*(Nexus 6P).*$"

Though as highlighted in an [earlier post,](https://medium.com/vamp-io/taming-istio-76fab339f685) Istio does not support creating OR conditions using a single route rule, so this condition will result in *Lamia* creating 2 route rules.

![](https://cdn-images-1.medium.com/max/5760/1*ash_Nzvg4HfluVQ7kujyjQ.png)

We hope you enjoy experimenting with *[Lamia](https://github.com/magneticio/vamp2setup)*. We’re really rather proud of it and would love to get your feedback. You can comment below or on [GitHub](https://github.com/magneticio/vamp2setup/issues).

That’s all for this post! In the future, look out for further posts and join us on our Istio journey.
