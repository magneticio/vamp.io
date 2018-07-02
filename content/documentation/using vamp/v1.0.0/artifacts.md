---
date: 2016-09-13T09:00:00+00:00
title: Artifacts
menu:
  main:
    identifier: "artifacts-v100"
    parent: "Using Vamp"
    weight: 10
aliases:
    - /using-vamp/
    - /documentation/using-vamp/artifacts/
---

Vamp has a few basic entities or artifacts you can work with, these can be classed as static resource descriptions and dynamic runtime entities. Note that API actions on static resource descriptions are mostly synchronous, while API actions on dynamic runtime entities are largely asychronous.

### Dynamic runtime entities

-   **Deployments** are running blueprints. You can have many deployments from one blueprint and perform actions on each at runtime. Plus, you can turn any running deployment into a blueprint.  [Read more...](/documentation/using-vamp/v1.0.0/deployments/)
-   **Gateways** are the "stable" routing endpoint - defined by a port (incoming) and routes (outgoing).  [Read more...](/documentation/using-vamp/v1.0.0/gateways/)
-   **Workflows** are apps (services) deployed on cluster, used for dynamically changing the runtime configuration (e.g. SLA, scaling, condition weight update).  [Read more...](/documentation/using-vamp/v1.0.0/workflows/)

### Static resource descriptions

-   **Blueprints** are, well, blueprints! They describe how breeds work in runtime and what properties they should have.  [Read more...](/documentation/using-vamp/v1.0.0/blueprints/)
-   **Breeds** describe single services and their dependencies.  [Read more...](/documentation/using-vamp/v1.0.0/breeds/)
-   **Scales** define the size of a deployed service [Read more...](/documentation/using-vamp/v1.0.0/blueprints/#scale)
-   **Conditions** define filters for incoming traffic [Read more...](/documentation/using-vamp/v1.0.0/conditions)

## Working across multiple teams

In larger companies with multiple teams working together on a large project, all required information is often not available at the same time. To facilitate this style of working, Vamp allows you to set placeholders. Placeholders let you communicate with other teams using simple references and gradually build up a complicated deployment. Vamp will only check references at deployment time, this means:

- Breeds can be referenced in blueprints before they exist
- You do not need to know the contents of an SLA when you reference it.
- You can reference a variable that someone else should fill in.

Read more about [referencing artifacts](/documentation/using-vamp/v1.0.0/references/) and [environment variables](/documentation/using-vamp/v1.0.0/environment-variables/).

{{< note title="What next?" >}}
* Read about [Vamp deployments](/documentation/using-vamp/v1.0.0/deployments/)
* Check the [API documentation](/documentation/api/v1.0.0/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
