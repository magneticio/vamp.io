---
date: 2016-09-13T09:00:00+00:00
title: Why use Vamp?
---

We recognise the pain and risk involved with delivering microservice applications.  We've been there too - facing downtime and unexpected issues while transitioning from one release to the next. 
In microservice architectures, these concerns can quickly multiply. It's all too easy to get stuck dealing with the added complexities and miss out on the potential benefits. 

## Deploy online services, seamlessly

Vamp is an open source, self-hosted platform for managing (micro)service oriented architectures that rely on container technology. The Vamp DSL allows you to describe your services, their dependencies and the required runtime environments in blueprints.  Vamp provides a runtime/execution engine to deploy these blueprints (similar to AWS Cloudformation) and a choice of interface for complete control - graphical UI, command line or RESTful API.

Combined, this allows you to run complex, multi-step actions - like canary releases - from one intuitive graphical interface. Vamp will take care of all the heavy lifting - route updates, metrics collection and service discovery - to orchestrate complex deployment patterns, such as architecture level A/B testing. 

After deployment, Vamp keeps working to ensure that your running services are given the resources they need when they need them. Vamp will respond to any unexpected outages and can autoscale individual services. 

### Find out more
* [Use cases: Vamp solutions to practical problems](use-cases/)
* [What Vamp offers compared to other tools and services](vamp-compared-to/)
* [How Vamp works](/resources/how-vamp-works/)

## The Vamp feature list

Vamp 0.9.0 (Beta release) includes: 

* container-scheduler agnostic API
* percentage and condition based programmable routing
* YAML based configuration blueprints with support for dependencies, clusters and environment variables
* graphical UI and dashboard
* integrated javascript-based workflow system 
* metric-driven autoscaling, canary releasing and other optimisation and automation patterns
* automatic loadbalancing for autoscaled services
* API gateway routing features like conditional rewrites
* CLI for integration with common CI/CD pipelines
* open source (Apache 2.0)
* event API and server-side events (SSE) stream
* multi-level metric aggregation
* port-based, virtual host names or external service (consul etc) based service discovery support
* lightweight design to run in high-available mission-critical architectures
* integrates with ELK stack (Elastic Search, Logstash, Kibana) for custom Kibana dashboards
* Vamp Runner provides automated integration and workflows testing 

## Did you know?

* Vamp is platform agnostic
* Vamp is functionality agnostic, but functions well in an API centric, event driven and stateless environment. 
* Vamp is not a strict container platform, but uses the power of container platforms under the hood.
* Vamp is written in Scala, Go and ReactJS 
* Vamp includes clear SLA management and service level enforcement out of the box
* Vamp is an open source project, actively developed by [Magnetic.io](/about/)

## What next?

* [Try Vamp](/try-vamp/)

### Find out more
* [Use cases: Vamp solutions to practical problems](use-cases/)
* [What Vamp offers compared to other tools and services](vamp-compared-to/)
* [How Vamp works](/resources/how-vamp-works/)