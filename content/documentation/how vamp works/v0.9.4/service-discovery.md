---
date: 2016-09-13T09:00:00+00:00
title: Service discovery
menu:
  main:
    identifier: "hvw-service-discovery-v094"
    parent: "How Vamp works"
    weight: 40
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/routing-and-loadbalancing/).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp uses a service discovery pattern called server-side service discovery, which allows for service discovery without the need to change your code or run any other daemon or agent ([microservices.io - server side discovery](http://microservices.io/patterns/server-side-discovery.html)). In addition to service discovery, Vamp also functions as a service registry ([microservices.io - service registry](http://microservices.io/patterns/service-registry.html)).

For Vamp, we recognise the following benefits of this pattern:

* No code injection needed.
* No extra libraries or agents needed.
* platform/language agnostic: it’s just HTTP.
* Easy integration using ENV variables.

{{< note title="What next?" >}}
* More about [service discovery](/documentation/using-vamp/v0.9.4/service-discovery)
* Read about how Vamp works with [routing and load balancing](/documentation/how-vamp-works/v0.9.4/routing-and-load-balancing)
{{< /note >}}
