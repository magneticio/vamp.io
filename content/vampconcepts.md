---
date: 2016-03-09T19:56:50+01:00
title: Vamp concepts and continuous improvement
---

[back to resources page](/resources/)

Vamp provides an interface for describing and managing services and their runtime configurations. Once a service is deployed, filters can be applied to incoming traffic and programmable routing will send users to the defined Vamp deployment of a service. By adding in workflow automation and metrics aggregation, Vamp closes the continuous improvement feedback loop.

1. Service description
2. Runtime configuration description
3. Deployment
4. Routing and filters
4. Automated runtime actions
5. Metrics and events aggregation


## Service description

Vamp breeds are static descriptions of applications and services available for deployment. Each breed is described by the DSL in YAML notation or JSON, whatever you like. This description includes name, version, available parameters, dependencies etc. To a certain degree, you could compare a breed to a Maven artifact or a Ruby Gem description.

## Runtime configuration description
Vamp blueprints are static execution plans - they describe how services should be hooked up and what their topology should look like at runtime. This means you reference your breeds (or define them inline) and add runtime configuration to them.

* gateways?
* routings?
* filters?

## Deployment

Vamp deployments are running blueprints. You can run many deployments based on one blueprint and perform separate actions on each at runtime. You can also turn any running deployment into a new blueprint, allowing you __to consistantly reproduce identical runtime environments__. 

## Routing and filters
A __routing__ defines a set of rules for routing traffic between different services within the same __Vamp service cluster__.

## Automated runtime actions

Vamp workflows are apps (services) deployed on a Vamp service cluster, used for dynamically changing runtime configuration (e.g. SLA, scaling, condition weight update).

* escalations?
* how are workflows stored?
* routings?
* filters?

## Metrics and events aggregation

Vamp collects metrics and __logs__ events on all running __deployments__. Interaction with the API also creates events, like updating blueprints or deleting a deployment. Vamp also allows third party applications to create events and trigger Vamp actions.


[back to resources page](/resources/)