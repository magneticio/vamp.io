---
title: Metrics & Health
weight: 110
menu:
  main:
    parent: api-reference
---

## Metrics

Metrics can be defined on gateways and deployment ports and retrieved:

```
/api/v1/metrics/gateways/{gateway}/{metrics}
/api/v1/metrics/gateways/{gateway}/routes/$route/{metrics}

/api/v1/metrics/deployments/{deployment}/clusters/{cluster}/ports/{port}/{metrics}
/api/v1/metrics/deployments/{deployment}/clusters/{cluster}/services/{service}/ports/{port}/{metrics}
```

Example: `/api/v1/metrics/deployments/sava/clusters/frontend/ports/api/response-time`

## Health

Health can be defined on gateways and deployment ports and retrieved:

```
/api/v1/health/gateways/{gateway}
/api/v1/health/gateways/{gateway}/routes/$route

/api/v1/health/deployments/{deployment}
/api/v1/health/deployments/{deployment}/clusters/{cluster}
/api/v1/health/deployments/{deployment}/clusters/{cluster}/services/{service}
```

Health is value between 1 (100% healthy) and 0.

> Note: metrics and health are calculated using external services, e.g. Vamp workflows.
