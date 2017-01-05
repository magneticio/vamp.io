---
date: 2016-09-13T09:00:00+00:00
title: API - Deployments
menu:
  main:
    parent: "API"
    identifier: "api-reference-deployments"
    weight: 35
draft: true
---
intro text. Read about [using deployments](documentation/using-vamp/deployments/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-deployments/#list-deployments) - return a list of all deployments
 * [Get](/documentation/api/v9.9.9/api-deployments/#get-deployment) - get a single deployment
 * [Create](/documentation/api/v9.9.9/api-deployments/#create-deployment) - create a new deployment 
 * [Update](/documentation/api/v9.9.9/api-deployments/#update-deployment) - update a running deployment
 * [Delete](/documentation/api/v9.9.9/api-deployments/#delete-deployment) - delete a deployment

## Deployment resource

The minimum and API return resource examples below are shown in YAML format. Vamp API requests and responses can be in JSON or YAML format (default JSON). See [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this.

### Minimum resource

```

```


### API return resource

```

```

 Field name        | description          
 -----------------|-----------------
  |  
  |
  
## List deployments

Returns a list of all running deployments. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request syntax
    GET /api/v1/deployments

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |

### Request body
The request body should be empty.

### Response syntax


### Errors
* ???

## Examples

See [gateways - A/B TEST TWO DEPLOYMENTS USING ROUTE WEIGHT](/documentation/using-vamp/gateways/#example-a-b-test-two-deployments-using-route-weight)