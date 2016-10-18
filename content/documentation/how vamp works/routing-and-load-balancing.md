---
date: 2016-09-13T09:00:00+00:00
title: Routing and load balancing
---
Vamp uses the tried and tested [HAProxy](https://www.haproxy.com) reverse proxy software for its default routing/proxying and load balancing. HAProxy can run on one (although we don't advise this for production setups as this introduces a SPOF), multiple (f.e. three instances for failover and high-availability) or on all nodes of your cluster (the so-called ["SmartStack" pattern](http://nerds.airbnb.com/smartstack-service-discovery-cloud/)). HAProxy can be running as a container (using our [Vamp VGA container](https://hub.docker.com/r/magneticio/vamp-gateway-agent/) that includes Vamp Gateway Agent (VGA) and HAproxy with a specific logstash configuration to provide proxy logs to logstash for the Vamp UI) or as a standalone service.

You can also install HAProxy on separate machines outside of your container cluster and have Vamp connect with these instances. Vamp can add it's routing rules to your custom HAProxy configuration templates if needed.

The HAProxies are configured and updated through the Vamp Gateway Agent(s), and route incoming traffic to endpoints (external gateways, explicitly defined) or can do intra-service routing.

Note that Vamp is not a realtime system, and as long you have at least one HAProxy and one container-node running, your visitors will be able to reach the container, even with no Vamp or VGA running. The moment Vamp or VGA is restarted again, they will sync and update themselves. To make sure HAProxy configuration updates don't introduce dropped packages we support zero-downtime reloads by applying some iptables magic.

## Conditions

So how does Vamp exactly route traffic to the designated destinations? First we look for the [conditions](/documentation/using-vamp/conditions/) that might have been set for a route or gateway. This can be none, one or more conditions, and we do support boolean expressions (AND OR NOT) and grouping. There are also built-in short codes for common conditions, or you can use HAProxy ACL's directly.

If the condition is met, we evaluate the condition strength percentage. A 100% setting means everybody that meets the condition is sent to this route. A 5% setting means 5% of all visitors that meet the condition are sent to this route, the remaining 95% are returned into the "bucket" and are distributed using the general weight settings.

## Weight
The weight for each available route defines the distribution of all remaining traffic that wasn't matched by a condition and it's condition strength.

## Load balancing

Vamp load balancing is done transparently. Based on the scale setting of the running services Vamp will make sure all the instances are load balanced automatically. By default we use a round-robin algorithm but other HAProxy balancing mechanisms are also supported. We also support sticky routing. The cool thing is that weight and condition percentages settings are applied independently from the number of instances running. I.e. a 50/50 weight distribution over two service versions that run with a scale of four and eight instances respectively will still be distributed 50/50%. Changing the number of instances will have no effect on the distribution, as Vamp tries to achieve the configured weight and condition strength distributions as close as possible.

## Performance

We didn't test the performance overhead of Vamp's routing configurations explicitly, but HAProxy uses very little resources and is very efficient. In our experiments we see a sub-millisecond overhead, even with very complex and combined routing rules the total overhead stays in the microseconds range. A single HAProxy can also run on a very small VM (f.e. an AWS micro instance) and will be able to process enough network traffic for your network and applications to become the bottleneck first.

{{< note title="What next?" >}}
* Read about how Vamp works with [events and metrics](/documentation/how-vamp-works/events-and-metrics)
{{< /note >}}
