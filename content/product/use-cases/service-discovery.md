---
date: 2016-09-13T09:00:00+00:00
title: Service discovery
menu:
    main: 
        parent: "Use cases"
        identifier: "use-cases-service-disc"
        weight: 70
---

Vamp uses a service discovery pattern called server-side service discovery. This pattern allows service discovery without the need to change your code or run any other service-discovery daemon or agent. In addition to service discovery, Vamp also functions as a service registry. We recognise the following benefits of this pattern:

* No code injection needed
* No extra libraries or agents needed
* Platform/language agnostic: it’s just HTTP
* Easy integration using ENV variables

Vamp doesn't need point-to-point wiring. Vamp uses environment variables that resolve to service endpoints Vamp automatically sets up and exposes. Even though Vamp provides this type of service discovery, it does not put any constraint on other possible solutions. For instance services can use their own approach specific approach using service registry, self-registration etc. Vamp can also integrate with common service discovery solutions like Consul and read from these to setup the required routing automatically.

## SmartStack
Vamp can automatically deploy a VampGatewayAgent(VGA)+HAProxy on every node of your container cluster. This creates a so-called _Layer 7 intra service network mesh_ which enables you to create a "SmartStack", an automated service discovery and registration framework originally coined and developed by AirBnB. More on the history and advantages of the SmartStack approach can be read here ([nerds.airbnb.com - SmartStack: Service Discovery in the Cloud](http://nerds.airbnb.com/smartstack-service-discovery-cloud/)).


{{< note title="What next?" >}}
* See [how Vamp measures up](/product/vamp-compared-to/proxies-and-load-balancers/) to common platforms, tools and frameworks
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}
