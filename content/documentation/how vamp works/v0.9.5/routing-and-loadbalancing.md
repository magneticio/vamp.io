---
date: 2016-09-13T09:00:00+00:00
title: Routing and load balancing
menu:
  main:
    identifier: "routing-v095"
    parent: "How Vamp works"
    weight: 70
---
Routing, load balancing and also service discovery are big topics for container platforms and so it is for Vamp. We've
split the topic into the following parts, but if anything is missing our your setup is different please don't hesitate
to reach out using one of the support channels.

[1. Components](#components)
[2. Example topologies](#topologies)
[3. Load balancing](#load-balancing)
[4. Routing](#routing)
[5. Service discovery](#service-discovery)
[6. Virtual hosting](#virtual-hosting)
[7. Performance](#performance)

## Components

A typical Vamp installation on for example DC/OS or Kubernetes consists of the following routing related components:

- **HAproxy**
    HAProxy reverse proxy software for routing/proxying and load balancing, see [haproxy.com](https://www.haproxy.com) for
    more details.
- **Vamp Gateway Agent (VGA)**
    The Vamp Gateway agent manages the HAProxy configuration and HAProxy routes incoming traffic to endpoints (explicitly
    defined external gateways) or handles intra-service routing. By applying some iptables magic, Vamp makes sure that HAProxy
    configuration updates won't introduce dropped packages., that means zero-downtime reloads.
- **Edge Load Balancer**
    An AWS Elastic Load Balancer, F5 or Juniper or whatever brand of load balancer you use to expose your infrastructure
    to the public internet or corporate intranet. This component is not provided by Vamp.
- **Firewall, API Gateway**
    Many times, any extra firewall is involved (AWS Security Groups, Juniper, iptables etc.) or an extra API gateway. These
    are also not provided by Vamp, although Vamp can certainly function as your API Gateway.

{{< note >}}
In most cases, you run a **Vamp Gateway Agent** and **HAproxy** instance together in the dedicated
[VGA Docker image](https://hub.docker.com/r/magneticio/vamp-gateway-agent/) available from our Docker hub. This image
is also automatically deployed during Vamp's installation.
{{< /note >}}


## Topologies

Vamp's routing components can be deployed in many different topologies. However, in most cases these topologies
derive from the following reference architecture:

![](/images/diagram/vamp_ref_architecture_routing.svg)

In this reference architecture we can see the following:

1. VGA and Haproxy are installed on one (or more) public facing nodes.
2. An edge load balancer routes traffic to the public nodes.
3. Applications are deployed within the cluster.

Variations on this could be:

* HAProxy on one node of a cluster - not advised for production setups as it introduces a single point of failure
* HAProxy on multiple nodes of a cluster - for example, three instances for failover and high-availability
* HAProxy on all nodes of a cluster - the so-called SmartStack pattern ([nerds.airbnb.com - smartstack service discovery cloud](http://nerds.airbnb.com/smartstack-service-discovery-cloud/))
* HAProxy on separate machines outside of your container cluster - Vamp can connect to these instances and can add its routing rules to your custom HAProxy configuration templates if needed.

## Load balancing

Vamp load balancing is done transparently. Based on the scale setting of the running services, Vamp will make sure all
instances are load balanced automatically. By default we use a **round-robin algorithm**, but other HAProxy balancing
algorithm like **source** and **leastconn** are also supported. You can set any of the available HAproxy algorithms with
the `balance` option in a gateway route definition.

The example below exposes a service on port 8080 and load balances between three instances using the alternative `leastconn`
algorithm.

```yaml
name: simpleservice
gateways:
  8080:
    routes:
      simpleservice/web:
        balance: leastconn
clusters:
  simpleservice:
    services:
      breed:
        name: simpleservice:1.0.0
        deployable: magneticio/simpleservice:1.0.0
        ports:
          web: 3000/http
      scale:
        instances: 3
```


## Routing

So how does Vamp exactly route traffic to the designated destinations? Each request goes through the following steps to
determine where it should be routed:

1. First we look if any [conditions](/documentation/using-vamp/conditions/) are set for a route or gateway. This
can be none, one or more conditions. see [boolean expression in conditions](/documentation/using-vamp/conditions/#boolean-expression-in-conditions).


2. If the condition is met, we evaluate the condition strength percentage. A 100% setting means everybody that meets the
condition is sent to this route. A 5% setting means 5% of all visitors that meet the condition are sent to this route,
the remaining 95% are returned into the "bucket" and distributed using the general weight settings.

3. A weight setting for each available route defines the distribution of all remaining traffic not matching a condition
or not targeted by condition strength.

We also support **sticky sessions** allowing traffic to either be routed to permanent routes or instances during one session.
Jump to our [dedicated page on sticky sessions](/documentation/using-vamp/sticky-sessions) to learn more.

## Service Discovery

Vamp uses a service discovery pattern called server-side service discovery, which allows for service discovery without
the need to change your code or run any other daemon or agent ([microservices.io - server side discovery](http://microservices.io/patterns/server-side-discovery.html)).
In addition to service discovery, Vamp also functions as a service registry ([microservices.io - service registry](http://microservices.io/patterns/service-registry.html)).

For Vamp, we recognise the following benefits of this pattern:

* No code injection needed.
* No extra libraries or agents needed.
* platform/language agnostic: it’s just HTTP.
* Easy integration using ENV variables.

This means the logical routing of every request in Vamp is as follows:

![](/images/diagram/vamp-service-discovery.svg)
Jump to our [dedicated page on service discovery](/documentation/using-vamp/service-discovery) to learn more.

## Virtual hosting

When exposing services to the **public internet** directly from Vamp, it is good to know that Vamp fully and automatically
supports virtual hosting. This allows you to host multiple services on port 80 and port 443, leveraging **DNS CNAME's** to
route traffic to you Vamp hosted services.

Jump to our [dedicated page on virtual hosts](/documentation/using-vamp/virtual-hosts) to learn more.

## Performance
Performance-wise, HAProxy is very efficient and uses few resources. In our experiments we have seen a sub-millisecond
overhead. Even with very complex and combined routing rules, the total overhead stays in the microseconds range.

**None of Vamp's proprietary components are in the critical request path:** As long as at least one HAProxy and one
container-node are running your visitors will be able to reach the container - even with no Vamp or VGA running.
On restart, Vamp and VGA will automatically sync and update themselves.

{{< note title="What next?" >}}
* Read about how Vamp works with [events and metrics](/documentation/how-vamp-works/events-and-metrics)
* Find out more about using Vamp [conditions](/documentation/using-vamp/conditions) and [gateways](/documentation/using-vamp/gateways)
{{< /note >}}
