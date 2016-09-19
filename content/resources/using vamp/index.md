---
date: 2016-09-13T09:00:00+00:00
title: Using Vamp
---

Vamp has few basic entities or artifacts you can work with, these can be classed as     either static resource descriptions or dynamic runtime entities:

### Static resource descriptions
API actions on static resource descriptions are mostly synchronous.

-   **Breeds**: Breeds describe single services and their dependencies.  
-   **Blueprints**: Blueprints are, well, blueprints! They describe how breeds work in runtime and what properties they should have.  

### Dynamic runtime entities
API actions on dynamic runtime entities are largely asychronous.

-   **Deployments**: Deployments are running blueprints. You can have many deployments from one blueprint and perform actions on each at runtime. Plus, you can turn any running deployment into a blueprint.  
-   **Gateways**: Gateways are the "stable" routing endpoint - defined by a port (incoming) and routes (outgoing). 
-   **Workflows**: Workflows are apps (services) deployed on cluster, used for dynamically changing the runtime configuration (e.g. SLA, scaling, condition weight update).


## Eventual consistency

Be aware that **Vamp does not check references before deployment time**. Vamp has a very specific reason for this. For example:

- You can reference a breed in a blueprint that does not exist yet. 
- You can reference an SLA that you don't know the contents of.
- You can reference a variable that someone else should fill in.

The reason for this is that in typical larger companies, where **multiple teams are working together on a large project** you don't get all information you need all at the same time.

Vamp allows you to set placeholders, communicate with teams using simple references and gradually build up a complicated deployment.

## Where next?

* Read about [Breeds](/resources/using-vamp/breeds/)
* check the [API documentation](/resources/api-documentation/)
* [Try Vamp](/try-vamp)

