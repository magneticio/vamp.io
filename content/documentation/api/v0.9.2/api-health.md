---
date: 2016-09-13T09:00:00+00:00
title: Health
menu:
  main:
    parent: "API"
    identifier: "api-reference-health-092"
    weight: 160
---
Health is a specific type of Vamp event, calculated by a Vamp workflow and required for the Vamp UI. Health can be defined on gateways and deployment ports and retrieved via the API. Read about [using workflows](/documentation/using-vamp/workflows/).

Health is returned as a value between 1 and 0, where 1 is 100% healthy.

Health can be defined on gateways and deployment ports and retrieved.:


```
/api/v1/health/gateways/{gateway}
/api/v1/health/gateways/{gateway}/routes/$route

/api/v1/health/deployments/{deployment}
/api/v1/health/deployments/{deployment}/clusters/{cluster}
/api/v1/health/deployments/{deployment}/clusters/{cluster}/services/{service}
```
