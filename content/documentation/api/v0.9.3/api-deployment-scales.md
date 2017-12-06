---
date: 2016-09-13T09:00:00+00:00
title: Deployment scales
menu:
  main:
    parent: "API"
    identifier: "api-reference-deployment-scales-093"
    weight: 100
---
Deployment scales are singular resources: you only have one scale per service. Deleting a scale is not a meaningful action. Read about [using deployments](/documentation/using-vamp/deployments/) and [using scales](/documentation/using-vamp/blueprints/#scale).

## Actions

 * [Get](/documentation/api/v0.9.3/api-deployment-scales/#get-single-deployment-scale) - return details of a specific deployment scale
 * [Update](/documentation/api/v0.9.3/api-deployment-scales/#update-deployment-scale) - update a deployment scale

--------------

## Get single deployment scale

Return details of a specific deployment scale that’s part of a service inside a cluster.

### Request
* `GET`
* `/api/v1/deployments/{deployment_name}/clusters/{cluster_name}/services/{service_name}/scale`
* The request body should be empty.

### Response
If successful, will return the specified [scale resource](/documentation/api/v0.9.3/api-scales/#scale-resource) in the specified `accept` format (default JSON).

### Errors
* The requested resource could not be found.

--------------

## Update deployment scale

Update the scale of a running deployment.

### Request
* `PUT`
* `/api/v1/deployments/{deployment_name}/clusters/{cluster_name}/services/{service_name}/scale`
* The request body should include at least the [minimum scale resource](/documentation/api/v0.9.3/api-scales/#scale-resource) in the specified `content-type` format (default JSON).

### Response
If successful, will return an empty response.

--------------
