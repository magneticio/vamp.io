---
date: 2016-09-13T09:00:00+00:00
title: API - Overview
menu:
  main:
    parent: "API"
    identifier: "api-overview"
    weight: 25
draft: true
---

Vamp has one REST API. For details on pagination, and request and response formats see [common parameters](/documentation/api/api-common-parameters).

## Endpoints and resources

* **Resource descriptions:** [blueprints](documentation/api/api-blueprints), [breeds](), [conditions](), [escalations](), [scales](), [slas]()
* **Runtime entities:** [deployments](documentation/api/api-deployments), [deployment scales](), [deployment SLAs](), [gateways](documentation/api/api-gateways)  
* **Data:** [events](), [health](), [metrics]()
* **System:** [info, config, haproxy]()
* **Debug:** [sync, sla, escalation]()

## Send multiple resources - `POST`, `PUT` and `DELETE`

It is possible to send YAML document containing more than 1 artifact definition. Supported methods are `POST`, `PUT` and `DELETE`. Example:

```yaml
---
name: ...
kind: breed
# breed definition ...
---
name: ...
kind: blueprint
# blueprint definition ...
```

Additional `kind` field is required and it always correspond (singular form) to type of the artifact.
For instance if specific endpoint would be `/api/v1/deloyments` then the same deployment request can be sent to `api/v1` with additional `kind: deployment`.
If specific endpoints are used (e.g. `/api/v1/blueprints`) then `kind` needs to be ommited.