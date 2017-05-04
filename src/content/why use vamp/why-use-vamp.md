---
date: 2016-09-13T09:00:00+00:00
title: Why use Vamp?
aliases:
    - /why-use-vamp/
menu:
  main:
    parent: "why-use-vamp-top"
    identifier: "why-use-vamp-page"
    weight: 5
---

We recognise the pain and risk involved with delivering microservice applications.  We've been there too - facing downtime and unexpected issues while transitioning from one release to the next. 
In microservice architectures, these concerns can quickly multiply. It's all too easy to get stuck dealing with the added complexities and miss out on the potential benefits. 

![](/images/typical-systems-vs-vamp.png)

## What is Vamp?

Vamp is an open source, self-hosted platform for managing (micro)service oriented architectures that rely on container technology. Vamp provides a DSL to describe services, their dependencies and required runtime environments in blueprints and a runtime/execution engine to deploy these blueprints (similar to AWS Cloudformation). Planned deployments and running services can be managed from your choice of Vamp interface - graphical UI, command line interface or RESTful API. 

Vamp takes care of route updates, metrics collection and service discovery, so you can easily orchestrate complex deployment patterns, such as architecture level A/B testing and canary releases.
After deployment, Vamp workflows monitor running applications and can act automatically based on defined SLAs.  

### Vamp facts

* Vamp is platform agnostic
* Vamp is functionality agnostic, but functions well in an API centric, event driven and stateless environment. 
* Vamp is not a strict container platform, but uses the power of container platforms under the hood.
* Vamp is written in Scala, Go and ReactJS 
* Vamp includes clear SLA management and service level enforcement out of the box
* Vamp is an open source project, actively developed by [Magnetic.io](/about/)


{{< note title="What next?" >}}
* [Try Vamp](/documentation/installation/hello-world)
* Read the full [Vamp feature list](/why-use-vamp/feature-list/)
* [What Vamp offers compared to other tools and services](/why-use-vamp/vamp-compared-to/proxies-and-load-balancers/)
* [How Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}


