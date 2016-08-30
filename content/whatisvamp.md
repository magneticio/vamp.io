---
date: 2016-08-01T12:53:48+02:00
title: what is Vamp?
weight: 10
---

Vamp is an open source and self-hosted platform for managing (micro)service oriented architectures that rely on container technology. Vamp takes care of complex, multi-step actions like canary releases, route updates, metrics collection and service discovery.

Vamp is functionality agnostic, but functions well in an API centric, event driven and stateless environment. Vamp is not a strict container platform, but uses the power of container platforms under the hood.

Vamp is written in Scala, Go and ReactJS and comes with a server installation, a command line interface, a graphical UI and a RESTful API.

## Deploy online services, seamlessly

The purpose of Vamp is to:

* Provide a model for describing microservices and their dependencies in blueprints.
* Provide a runtime/execution engine for deploying these blueprints, similar to AWS Cloudformation
* Allow full A/B testing and canary releasing on all microservices.
* Allow “Big Data” type analysis- and prediction patterns on service behavior, performance and life-cycle.
* Provide clear SLA management and service level enforcement on services.

## More benefit, less risk

Vamp manages deployments and running systems to bring you more of the benefits and less of the pain associated with microservice architectures.

### Microservice bennefits and risks

#### Benefits

* (/) Faster development and deployment
* (/) Clear separation of concerns
* (/) Scalability and resiliency

#### Risks

* (x) Increased dependencies, each of which will inevitably fail at some point
* (x) Deployments and upgrades need coordination and orchestration
* (x) Security concerns multiply
* (x) Data feeds and monitoring/logs need to be aggregated and zipped together

## Feature list

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

* [try Vamp](/tryvamp/)
* [download Vamp](/downloads/)
* [find out more](/support/)