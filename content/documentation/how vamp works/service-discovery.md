---
date: 2016-09-13T09:00:00+00:00
title: Service discovery
menu:
  main:
    parent: "How Vamp works"
    weight: 40
---

Vamp uses a service discovery pattern called server-side service discovery, which allows for service discovery without the need to change your code or run any other daemon or agent ([microservices.io - server side discovery](http://microservices.io/patterns/server-side-discovery.html)). In addition to service discovery, Vamp also functions as a service registry ([microservices.io - service registry](http://microservices.io/patterns/service-registry.html)).

For Vamp, we recognise the following benefits of this pattern:

* No code injection needed.
* No extra libraries or agents needed.
* platform/language agnostic: it’s just HTTP.
* Easy integration using ENV variables.

{{< note title="What next?" >}}
* More about [service discovery](/documentation/using-vamp/service-discovery)
* Read about how Vamp works with [routing and load balancing](/documentation/how-vamp-works/routing-and-load-balancing)
{{< /note >}}