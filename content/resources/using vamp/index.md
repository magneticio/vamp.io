---
date: 2016-09-13T09:00:00+00:00
title: Using Vamp
---

Vamp has few basic entities or artifacts you can work with:

-   **Breeds**: static artifacts that describe single services and their dependencies.  
-   **Blueprints**: blueprints are, well, blueprints! They describe how breeds work in runtime and what properties they should have.  
-   **Deployments**: running blueprints. You can have many of one blueprint and perform actions on them at runtime. Plus, you can turn any running deployment into a blueprint.  
-   **Gateways**: "stable" routing endpoint - defined by it's port (incoming) and routes (outgoing). 
-   **Workflows**: apps (services) deployed on cluster, used for dynamically changing runtime configuration (e.g. SLA, scaling, condition weight update).


> **Note**: Breeds and blueprints are static artifacts, deployments and gateways are not. This means any API actions on static artifacts are mostly synchronous. Actions on deployments are largely asychronous.

## Eventual consistency

Be aware that **Vamp does not check references before deployment time**. Vamp has a very specific reason for this. For example:

- You can reference a breed in a blueprint that does not exist yet. 
- You can reference an SLA that you don't know the contents of.
- You can reference a variable that someone else should fill in.

The reason for this is that in typical larger companies, where **multiple teams are working together on a large project** you don't get all information you need all at the same time.

Vamp allows you to set placeholders, communicate with teams using simple references and gradually build up a complicated deployment.



