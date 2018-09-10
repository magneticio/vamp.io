---
date: 2016-08-15T09:00:00+00:00
title: "Taming Istio"
author: "Jason Griffin"
avatar: "jasong.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices", "DevOps"]
publishdate: 2018-05-01
---

![](https://cdn-images-1.medium.com/max/720/1*hHVBnftiViKepR6EMbG5RA.png)

This is part of an ongoing series of posts describing [Vamp’s Gateway Agent](https://medium.com/vamp-io/vamps-gateway-agent-9508ad5a5177) component and our experiences of adopting Istio for east-west traffic on Kubernetes. Join us as we continue discussing the architecture, implementation and evolution of this key component of Vamp.

<!--more-->


Our current **[HAProxy](https://www.haproxy.com/)** based **Vamp Gateway Agent** grew out of our original **[vamp-router](https://github.com/magneticio/vamp-router)** project and is a few years old now. The gateway agents provide **north-south** (ingress) and **east-west** (service-to-service) traffic management for the Vamp service mesh on both **DC/OS** (mesos/marathon) and **Kubernetes** stacks.

Our architectural philosophy is to keep Vamp’s footprint lean and clean, embracing the features and components of the underlying platforms and layering in new functionality where they don’t exist. On newer versions of K8s we use **kube-proxy** as the service load balancer not HAProxy, for example.

HAProxy has a very rich feature set and we’re very happy with our current gateway agents but we’re also never satisfied, so we were curious to see how **[Istio](https://istio.io/)** measured up as a potential alternative for east-west traffic on K8s.

## Istio

Conceptually, Istio is similar to our existing gateway architecture. Both consist of a **service mesh**, a dedicated infrastructure layer for making service-to-service communication safe, fast, and reliable. Istio uses intelligent proxies (based on Envoy) as the service mesh and controls how requests are routed within a service mesh using **route rules**.

The Vamp service mesh supports a broad range of deployment policies (we call them workflows) from simple manual **canary release** and time-based **gradual roll-outs** to metrics-driven, multi-step regional roll-outs with automated rollbacks.

Our journey starts with Istio 0.7 and **[route rules alpha 1](https://istio.io/docs/reference/config/istio.routing.v1alpha1.html)**.

Creating the route rules for percentage-based** weighted traffic management** was straightforward and the resulting simple canary release functionality worked well. We were impressed. The only gotcha was that when you specify weights that don’t sum to 100, the route rule is not applied.

Next we tried adding an automated rollback policy. During a time-based gradual roll-out, if the **health** of the new version of a service falls below a predefined level then the roll-out is suspended and traffic reverts back to the original version.

This was more complicated. Envoy writes basic traffic metrics to **Prometheus** but these are much less rich than the metrics we get from HAProxy. Additionally, we discovered that if we used **TLS** then the K8s **health checks** and **readiness checks** don’t work.

The health metric we use with our current gateways use is a user-definable composite of:

* K8s health/readiness;

* current average response time vs nominal response; and the

* ratio of 5xx errors vs 2xx responses (for HTTP traffic)

We were able to find a workaround to allow us to health/readiness checks whether or not TLS was enabled but extracting the response times proved too difficult. In the end we opted for using just the ratio of 5xx errors to 2xx responses.

When configuring the route rules for the rollbacks, we also noticed that the **mixer** doesn’t raise errors when a rule is misconfigured. Instead it continues to use the previous (working) configuration. This makes experimentation difficult.

Once we had the basic gradual roll-out and rollback working, the next step was to add **conditional routing**.

In our examples we most often create conditions based on browsers’ user agent as they are quick and easy to demonstrate. Real world example typically involve quite complex tests for the value of and/or absence of specific HTTP headers. This could be to differentiate requests from mobile applications (public Internet) from requests originating from IoT devices (VPN) or for handling requests from a long tail of older software versions.

Implementing these kinds of conditions using route rules was surprisingly difficult and exposed the critical issue that faces anyone trying to use Istio in it’s current form. The documentation cannot be trusted, it’s hard to know if you looking at the correct document and in many cases only the simple examples in the documentation work.

Our first question was how should we apply a simple condition to a request originating outside the cluster? This is the most common requirement. There are two options, either use **[ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)** or use a **[load balanced](https://kubernetes.io/docs/concepts/services-networking/service/#type-loadbalancer) service**. It turned that load balanced services and route rules don’t mix, the rules are simply ignored. Ingress with route rules is buggy but we were able to make it work.

Once we’d answered that question, applying a single condition was straightforward, as were AND conditions but we quickly realised that route rules do not support OR conditions. Testing for the absence of a HTTP header is also not supported. So to build even moderately complex conditions you have to use multiple route rules with a mix of positive and negative conditions.

Since this rapidly becomes complex, we decided to use **regex based conditions** as an alternative. Only to find that regex based URI conditions do no work, only prefixes is supported.

With their rivalry with the HAProxy team at stake, the team working on Istio weren’t about to quit. After a good deal of trial and error and a lot of scribbling on whiteboards they were able to find enough workarounds to satisfy our most common requirements.

Applying route rules to ingress requires applying a condition to each and every rule. If multiple route rules are defined and one of them has a condition, then all of them must have a condition. Otherwise, the condition-less rules are not applied. You also need to have a catch-all route. For HTTP, the workaround is to create a URI condition that matches all URLs.

Our solution is to have a **pre-mixer** that translate complex conditions into an ordered set of route rules.

## Our Feedback

These are alpha features but we feel the path to adopting Istio doesn’t need to be quite so perilous. Our chief criticism is that the project currently lacks the discipline present in Kubernetes.

Istio would benefit from having the clarity of clear design documentation that K8s has. Our experience is that it feels like the contributors are figuring out the design by trial and error, and documenting it afterwards. Something as basic as change logs would make a big difference. Currently when a documented feature doesn’t work it’s often unclear if the change is a bug or by design.

It would have significantly eased our pain if Istio resources followed the K8s approach to error handling instead of silently failing. When the lack of accurate documentation forces you down the route of empirical research, it’s confusing and time consuming that configuration errors are rejected without any feedback.

Overall, our enthusiasm for Istio is undiminished. We really like Istio’s potential and we’ve already started contributing. We see some huge potential improvements in **[route rules alpha 3](https://istio.io/docs/reference/config/istio.networking.v1alpha3.html)** and we are eagerly awaiting the next stable API version.

That’s all for this post! In the future, look out for further posts on our Istio journey.
