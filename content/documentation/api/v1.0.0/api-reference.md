---
date: 2016-09-13T09:00:00+00:00
title: Overview
menu:
  main:
    parent: "API"
    identifier: "api-overview-v100"
    weight: 10
aliases:
    - /documentation/api/api-reference/
---

Vamp has one REST API. For details on pagination, and request and response formats see [common parameters](/documentation/api/v1.0.0/using-the-api).
For details on formatting Websockets API requests see [Vamp API - websockets](/documentation/api/v1.0.0/api-websockets/).

## API endpoints and resource descriptions

* **Artifacts:** [blueprints](/documentation/api/v1.0.0/api-blueprints), [breeds](/documentation/api/v1.0.0/api-breeds), [conditions](/documentation/api/v1.0.0/api-conditions), [escalations](/documentation/api/v1.0.0/api-escalations), [scales](/documentation/api/v1.0.0/api-scales), [slas](/documentation/api/v1.0.0/api-slas/)
* **Runtime entities:** [deployments](/documentation/api/v1.0.0/api-deployments), [deployment scales](/documentation/api/v1.0.0/api-deployment-scales), [deployment SLAs](/documentation/api/v1.0.0/api-deployment-slas), [gateways](/documentation/api/v1.0.0/api-gateways), [workflows](/documentation/api/v1.0.0/api-workflows)
* **Data:** [events](/documentation/api/v1.0.0/api-events), [health](/documentation/api/v1.0.0/api-health), [metrics](/documentation/api/v1.0.0/api-metrics )
* **System:** [info](/documentation/api/v1.0.0/api-info), [config](/documentation/api/v1.0.0/api-config), [haproxy](/documentation/api/v1.0.0/api-haproxy)

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
