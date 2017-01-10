---
date: 2016-09-13T09:00:00+00:00
title: API - Conditions
menu:
  main:
    parent: "API"
    identifier: "api-reference-conditions"
    weight: 35
draft: true
---
Conditions templates are static artifacts. You can save and manage condition templates through the API, these can then be referenced and applied to gateways. Read about [using conditions](documentation/using-vamp/conditions/).


## Actions
 
 * [List](/documentation/api/v9.9.9/api-conditions/#list-conditions) - return a list of all stored condition templates
 * [Get](/documentation/api/v9.9.9/api-conditions/#get-condition) - get a single stored condition template
 * [Create](/documentation/api/v9.9.9/api-conditions/#create-condition) - create a new condition template
 * [Update](/documentation/api/v9.9.9/api-conditions/#update-condition) - update a condition template
 * [Delete](/documentation/api/v9.9.9/api-conditions/#delete-condition) - delete a stored condition template

## Condition resource
You can define conditions inline or store them separately as templates under a unique name and reference them from a blueprint, breed or gateway resource.
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully store a condition.

```
name: sava
condition: User-Agent = Chrome
```

### API return resource
The fields returned by the API for stored conditions.

```
name: sava
kind: condition
condition: User-Agent = Chrome 
```

 Field name    |  Required  | description          
 --------------|---|-----------------
 name | yes |  Unique name used to reference the condition from a gateway
 kind | optional | The resource type. Required to [send multiple resources](/documentation/api/v9.9.9/api-overview/#send-multiple-resources) to `/api/v1`
 condition | yes | Boolean condition statement. See [using conditions](/documentation/using-vamp/conditions/) for details on how to create a condition.
  
-----------

## List conditions

Returns a list of all stored conditions. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters).

### Request
* `GET` 
* `/api/v1/conditions`
* The request body should be empty.

### Response
If successful, will return a list of all stored [condition resources](/documentation/api/v9.9.9/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

### Errors
* ???

-----------

## Get condition

Return a specific stored condition.

### Request 
* `GET`
* `/api/v1/conditions/{condition_name}`
* The request body should be empty.

### Response 
If successful, will return the named [condition resource](/documentation/api/v9.9.9/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

### Errors
* ???

-----------

## Create condition

Create a condition template.

### Request
* `POST`
* `/api/v1/conditions/`
* The request body should include at least a [minimum condition resource](/documentation/api/v9.9.9/api-conditions/#condition-resource) in the specified `Content-Type` format (default JSON).

### Response
If successful, will return the stored [condition resource](/documentation/api/v9.9.9/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

### Errors
* ???

-----------

## Update condition

Update a stored condition template.

### Request 
* `PUT` 
* `/api/v1/conditions/{condition_name}`
* The request body should include at least a [minimum condition resource](/documentation/api/v9.9.9/api-conditions/#condition-resource) in the specified `Content-Type` format (default JSON). The `name` field must match the `{condition_name}` used in the request path.

### Response
If successful, will return the updated [condition resource](/documentation/api/v9.9.9/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

### Errors
* ???

-----------

## Delete condition

Delete a stored condition template. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request 
* `DELETE` 
* `/api/v1/conditions/{condition_name}`
* The request body should be empty.

### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

### Errors
* ???

-----------
