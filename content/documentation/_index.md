---
date: 2017-07-19T09:00:00+00:00
title: Documentation
menu:
  main:
    parent: "developers-top"
    weight: 5
---

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
* Vamp is an open source project, actively developed by [Magnetic.io](/about/about_us/about)


{{< note title="What next?" >}}
* [Learn how Vamp works](/documentation/how-vamp-works/architecture-and-components/)
* Get started with [installation](/documentation/installation/overview)
* Dive into one of our [tutorials](/documentation/tutorials/overview)
{{< /note >}}
