---
date: 2016-09-13T09:00:00+00:00
title: Deployment SLAs
menu:
  main:
    parent: "API"
    identifier: "api-reference-deployment-slas-v095"
    weight: 110
aliases:
    - /documentation/api/api-deployment-slas
---
Deployment scales are singular resources: you only have one scale per service. Deleting a scale is not a meaningful action. Read about [using deployments](/documentation/using-vamp/deployments/) and [using scales](/documentation/using-vamp/blueprints/#scale).

## Actions

 * [Get](/documentation/api/v0.9.5/api-deployment-slas/#get-single-deployment-sla) - return details of a specific deployment SLA
 * [Create](/documentation/api/v0.9.5/api-deployment-slas/#create-deployment-sla) - create or update a specific deployment SLA
 * [Delete](/documentation/api/v0.9.5/api-deployment-slas/#delete-deployment-sla) - delete a deployment SLA

--------------

## Get single deployment SLA

Return details for a specific SLA that’s part of a specific cluster.

### Request
* `GET`
* `/api/v1/deployments/{deployment_name}/clusters/{cluster_name}/sla`
* The request body should be empty.

### Response
If successful, will return the specified [SLA resource](/documentation/api/v0.9.5/api-slas/#sla-resource) in the specified `accept` format (default JSON).

### Errors
* The requested resource could not be found.

--------------

## Create deployment SLA

Create or update a specific deployment SLA.

### Request
* `PUT`
* `/api/v1/deployments/{deployment_name}/clusters/{cluster_name}/sla`
* The request body should include at least the [minimum SLA resource](/documentation/api/v0.9.5/api-slas/#sla-resource) in the specified `content-type` format (default JSON).

### Response
If successful, will return the updated [deployment resource](/documentation/api/v0.9.5/api-deployments/#deployment-resource) in the specified `content-type` format (default JSON).

--------------

## Delete deployment SLA

Delete an SLA from a running deployment. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
* `DELETE`
* `/api/v1/deployments/{deployment_name}/clusters/{cluster_name}/services/{service_name}/scale`
* The request body should be empty.

### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

--------------
