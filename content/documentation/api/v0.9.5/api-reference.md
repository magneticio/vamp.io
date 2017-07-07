---
date: 2016-09-13T09:00:00+00:00
title: Overview
menu:
  main:
    parent: "API"
    identifier: "api-overview-v095"
    weight: 10
aliases:
    - /documentation/api/api-reference/
---

Vamp has one REST API. For details on pagination, and request and response formats see [common parameters](/documentation/api/v0.9.5/using-the-api).  
For details on formatting Websockets API requests see [Vamp API - websockets](/documentation/api/v0.9.5/api-websockets/).

## API endpoints and resource descriptions

* **Artifacts:** [blueprints](/documentation/api/v0.9.5/api-blueprints), [breeds](/documentation/api/v0.9.5/api-breeds), [conditions](/documentation/api/v0.9.5/api-conditions), [escalations](/documentation/api/v0.9.5/api-escalations), [scales](/documentation/api/v0.9.5/api-scales), [slas](/documentation/api/v0.9.5/api-slas/)
* **Runtime entities:** [deployments](/documentation/api/v0.9.5/api-deployments), [deployment scales](/documentation/api/v0.9.5/api-deployment-scales), [deployment SLAs](/documentation/api/v0.9.5/api-deployment-slas), [gateways](/documentation/api/v0.9.5/api-gateways), [workflows](/documentation/api/v0.9.5/api-workflows)  
* **Data:** [events](/documentation/api/v0.9.5/api-events), [health](/documentation/api/v0.9.5/api-health), [metrics](/documentation/api/v0.9.5/api-metrics )
* **System:** [info](/documentation/api/v0.9.5/api-info), [config](/documentation/api/v0.9.5/api-config), [haproxy](/documentation/api/v0.9.5/api-haproxy)

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
