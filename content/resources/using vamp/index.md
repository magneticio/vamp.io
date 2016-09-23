---
date: 2016-09-13T09:00:00+00:00
title: Using Vamp
---

## Basic Vamp artifacts
Vamp has a few basic entities or artifacts you can work with, these can be classed as static resource descriptions and dynamic runtime entities:

### Static resource descriptions
API actions on static resource descriptions are mostly synchronous.

-   **Breeds**: Breeds describe single services and their dependencies.  
-   **Blueprints**: Blueprints are, well, blueprints! They describe how breeds work in runtime and what properties they should have.  

### Dynamic runtime entities
API actions on dynamic runtime entities are largely asychronous.

-   **Deployments**: Deployments are running blueprints. You can have many deployments from one blueprint and perform actions on each at runtime. Plus, you can turn any running deployment into a blueprint.  
-   **Gateways**: Gateways are the "stable" routing endpoint - defined by a port (incoming) and routes (outgoing). 
-   **Workflows**: Workflows are apps (services) deployed on cluster, used for dynamically changing the runtime configuration (e.g. SLA, scaling, condition weight update).


## Working across multiple teams

In larger companies with multiple teams working together on a large project, all required information is often not available at the same time. To facilitate this style of working, Vamp allows you to set placeholders. Placeholders let you communicate with other teams using simple references and gradually build up a complicated deployment. Vamp will only check references at deployment time, this means:

- Breeds can be referenced in blueprints before they exist 
- You do not need to know the contents of an SLA when you reference it.
- You can reference a variable that someone else should fill in.

Read more about [referencing artifacts](/resources/using-vamp/references/) and [environment variables](/resources/using-vamp/environment-variables/).

## Where next?

* Read about [Vamp breeds](/resources/using-vamp/breeds/)
* check the [API documentation](/resources/api-documentation/)
* [Try Vamp](/try-vamp)

