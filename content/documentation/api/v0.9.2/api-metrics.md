---
date: 2016-09-13T09:00:00+00:00
title: Metrics
menu:
  main:
    parent: "API"
    identifier: "api-reference-metrics-092"
    weight: 180
---
Metrics can be defined on gateways and deployment ports and retrieved via the API. Metrics are calculated using external services such as workflows. Read about [using workflows](/documentation/using-vamp/workflows/).

```
/api/v1/metrics/gateways/{gateway}/{metrics}
/api/v1/metrics/gateways/{gateway}/routes/$route/{metrics}

/api/v1/metrics/deployments/{deployment}/clusters/{cluster}/ports/{port}/{metrics}
/api/v1/metrics/deployments/{deployment}/clusters/{cluster}/services/{service}/ports/{port}/{metrics}
```

### Example
    GET /api/v1/metrics/deployments/sava/clusters/frontend/ports/api/response-time

