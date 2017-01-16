---
date: 2016-09-13T09:00:00+00:00
title: API - Overview
menu:
  main:
    parent: "API"
    identifier: "api-overview"
    weight: 05
aliases:
    - /documentation/api/new
draft: true
---

Vamp has one REST API. For details on pagination, and request and response formats see [common parameters](/documentation/api/v9.9.9/api-common-parameters).

## API endpoints and resource descriptions

* **Artifacts:** [blueprints](/documentation/api/v9.9.9/api-blueprints), [breeds](/documentation/api/v9.9.9/api-breeds), [conditions](/documentation/api/v9.9.9/api-conditions), [escalations](), [scales](/documentation/api/v9.9.9/api-scales), [slas]()
* **Runtime entities:** [deployments](/documentation/api/v9.9.9/api-deployments), [deployment scales](), [deployment SLAs](), [gateways](/documentation/api/v9.9.9/api-gateways), [workflows](/documentation/api/v9.9.9/api-workflows)  
* **Data:** [events](/documentation/api/v9.9.9/api-events), [health](), [metrics]()
* **System:** [info](/documentation/api/v9.9.9/api-info), [config](/documentation/api/v9.9.9/api-config), haproxy
* **Debug:** [sync, sla, escalation]()

## Send multiple resources

It is possible to `POST`, `PUT` or `DELETE` YAML or JSON documents containing more than one artifact definition.

Similar artifacts can be sent to a specific endpoint, such as `/api/v1/breeds`. Different artifact types can also be sent together by using the general endpoint `api/v1` and including a `kind` field in each artifact definition. The artifact kind corresponds to the singular form of the artifact type (for example `blueprint`, `breed`, `condition`).

### Example (YAML) - post multiple artifacts to a specific endpoint 

`POST /api/v1/breeds`

```yaml
---
name: ...
# breed 1 definition ...
---
name: ...
# breed 2 definition ....
---
name: ...
# breed 3 definition ....
```

### Example (YAML) - post multiple artifact types to /api/v1
When using the general `api/v1` endpoint, each artifact description  must include a `kind` field.

`POST /api/v1`

```yaml
---
name: ...
kind: blueprint
# blueprint definition ...
---
name: ...
kind: breed
# breed definition ...
---
name: ...
kind: condition
# condition definition ...
```
