---
date: 2016-03-09T19:56:50+01:00
title: Vamp concepts
---

[back to resources page](/resources/)

## Breeds: Service description

Vamp breeds are static descriptions of applications and services available for deployment. Each breed is described by the DSL in YAML notation or JSON, whatever you like. This description includes name, version, available parameters, dependencies etc. To a certain degree, you could compare a breed to a Maven artifact or a Ruby Gem description.

## Blueprints: Runtime configuration description
Vamp blueprints are static execution plans - they describe how services should be hooked up and what their topology should look like at runtime. This means you reference your breeds (or define them inline) and add runtime configuration to them in a blueprint.

## Environment variables

## Deployments

Vamp deployments are running blueprints. You can run many deployments based on one blueprint and perform separate actions on each at runtime. You can turn any running deployment into a new blueprint, allowing you to consistantly reproduce identical runtime environment. 

## Gateways

## Routing and filters

## Workflows: Automated runtime actions

Vamp workflows are apps (services) deployed on a Vamp service cluster, used for dynamically changing runtime configuration (e.g. SLA, scaling, condition weight update).

## Metrics and events aggregation

Vamp collects metrics and logs events on all running deployments. Interaction with the API also creates events, like updating blueprints or deleting a deployment. Vamp also allows third party applications to create events and trigger Vamp actions.


[back to resources page](/resources/)