---
date: 2016-08-15T09:00:00+00:00
title: "Vamp's Gateway Agent"
author: "Jason Griffin"
avatar: "jasong.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices", "DevOps"]
publishdate: 2018-05-04
---
![](https://cdn-images-1.medium.com/max/720/1*hHVBnftiViKepR6EMbG5RA.png)

This post is the start of a series of posts about Vamp’s Gateway Agent component and our experiences of adopting Istio for east-west traffic on Kubernetes. Join us as we discuss the architecture, implementation and evolution of this key component of Vamp.

<!--more-->


At it’s core, the **Vamp Gateway Agent** is a reverse proxy. In the context of software defined networking, a **reverse proxy** is a service that forwards requests from multiple clients to servers. The most common use of reverse proxy is to provide load balancing for web applications.

With increased adoption of micro-service architectures, the trend has been for companies that manage significant volumes of traffic within their private clouds to build their own reverse proxy solutions. Despite this trend, for most companies, developing their own proxy solutions represents a significant, ongoing and largely unnecessary investment.

Whilst proprietary solutions make sense for companies that have particular use-cases, typically these are driven by internal infrastructure needs. There are many reverse proxy implementations available and the vast majority companies have the same needs, and therefore require a tailored solution rather than a fully bespoke one. They need:

* load-balancing;

* service discovery, so that dependent services can find each other;

* ingress, often with vhost support; and

* SSL termination.

The Vamp Gateway Agent is provides:

* a rich set of load-balancing methods with support for sticky sessions (Layer 7) and IP source affinity (Layer 4)

* dynamic service discovery;

* ingress with vhost support;

* TLS termination;

* weighted traffic management;

* conditional routing;

* custom health checks;

* logical isolation of endpoints running on the same or different hosts;

* dynamic reconfiguration without a restart; and

* rich per route stats.

The gateway agents form a **service mesh**, a dedicated infrastructure layer for making service-to-service communication safe, fast, and reliable. We use HAProxy to mediate inbound and outbound traffic for all the services in the service mesh.

The Vamp service mesh is logically split into a **data plane** and a **control plane**.

The **data plane** is composed of a network of intelligent proxies that mediate and control all the network communication between microservices. The data plane is further divided into a **service plane** and an **ingress plane**. The **service plane** is responsible for communication between microservices within a private cloud. The **ingress plane** is responsible for exposing services at the cloud edge.

The **control plane** is responsible for configuring and managing the proxies, managing traffic control policies and providing a visualisation of the dependencies and flow of traffic between services.

## Weighted Traffic Management

This is the simple but essential feature that enables intelligent routing. Canary releases, gradual rollouts and A/B testing all rely on dynamically routing a percentage of traffic to a particular version of a service.

Couple weighted traffic management with static routing rules, custom health checks, real-time quantitive analytics (A/B testing, for example) and AI-based anomaly detection and you have one of the cornerstones of Vamp’s real-time, policy-based **BizDevOps** tools.

That’s all for this post! In the future, look out for further posts on Kubernetes, analytics-driven DevOps and our Istio journey.
