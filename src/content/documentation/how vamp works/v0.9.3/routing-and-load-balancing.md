---
date: 2016-09-13T09:00:00+00:00
title: Routing and load balancing
menu:
  main:
    identifier: "routing-and-load-balancing-v093"
    parent: "How Vamp works"
    weight: 50
---

{{< note title="The information on this page is written for Vamp v0.9.3" >}}

* Switch to the [latest version of this page](/documentation/how-vamp-works/routing-and-load-balancing).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp uses the tried and tested HAProxy reverse proxy software for routing/proxying and load balancing ([haproxy.com](https://www.haproxy.com)). Vamp Gateway Agent (VGA) manages the HAProxy configuration and HAProxy routes incoming traffic to endpoints (explicitly defined external gateways) or handles intra-service routing. By applying some iptables magic, Vamp makes sure that HAProxy configuration updates won't introduce dropped packages., that means zero-downtime reloads.  

## Routing

So how does Vamp exactly route traffic to the designated destinations? First we look for the [conditions](/documentation/using-vamp/v0.9.3/conditions/) that might have been set for a route or gateway. This can be none, one or more conditions (see [boolean expression in conditions](/documentation/using-vamp/v0.9.3/conditions/#boolean-expression-in-conditions)). There are built-in short codes for common conditions, or you can use HAProxy ACLs directly.

If the condition is met, we evaluate the condition strength percentage. A 100% setting means everybody that meets the condition is sent to this route. A 5% setting means 5% of all visitors that meet the condition are sent to this route, the remaining 95% are returned into the "bucket" and distributed using the general weight settings. A weight setting for each available route defines the distribution of all remaining traffic not matching a condition or not targetted by condition strength.

## Load balancing

Vamp load balancing is done transparently. Based on the scale setting of the running services, Vamp will make sure all instances are load balanced automatically. By default we use a round-robin algorithm, but other HAProxy balancing mechanisms are also supported. We also support sticky routing. The cool thing is that weight and condition percentage settings are applied independently from the number of instances running. I.e. a 50 / 50 weight distribution over two service versions that run with a scale of four and eight instances respectively will still be distributed 50% / 50%. Changing the number of instances will have no effect on the distribution, as Vamp tries to achieve the configured weight and condition strength distributions as closely as possible.


## Topology and performance

HAProxy can run as a container or as a standalone service. A Vamp Gateway Agent (VGA) Docker image can be pulled from the Docker hub ([hub.docker.com - magneticio Vamp Gateway Agent](https://hub.docker.com/r/magneticio/vamp-gateway-agent/)).

HAProxy can run inside your cluster or on separate machines outside of your container cluster:

* HAProxy on one node of a cluster - not advised for production setups as it introduces a single point of failure
* HAProxy on multiple nodes of a cluster - for example, three instances for failover and high-availability 
* HAProxy on all nodes of a cluster - the so-called SmartStack pattern ([nerds.airbnb.com - smartstack service discovery cloud](http://nerds.airbnb.com/smartstack-service-discovery-cloud/)) 
* HAProxy on separate machines outside of your container cluster - Vamp can connect to these instances and can add its routing rules to your custom HAProxy configuration templates if needed.

Performance-wise, HAProxy is very efficient and uses few resources. In our experiments we have seen a sub-millisecond overhead. Even with very complex and combined routing rules, the total overhead stays in the microseconds range. This means a single HAProxy running on a small VM (for example, an AWS micro instance) would process enough network traffic that you would notice a bottleneck from your network and applications first.

Vamp is not a realtime system. As long as at least one HAProxy and one container-node are running your visitors will be able to reach the container - even with no Vamp or VGA running. On restart, Vamp and VGA will automatically sync and update themselves. 

{{< note title="What next?" >}}
* Read about how Vamp works with [events and metrics](/documentation/how-vamp-works/v0.9.3/events-and-metrics)
* Find out more about using Vamp [conditions](/documentation/using-vamp/v0.9.3/conditions) and [gateways](/documentation/using-vamp/v0.9.3/gateways)
{{< /note >}}
