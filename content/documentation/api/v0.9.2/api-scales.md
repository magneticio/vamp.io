---
date: 2016-09-13T09:00:00+00:00
title: Scales
menu:
  main:
    parent: "API"
    identifier: "api-reference-scales-092"
    weight: 190
---
Read about [using scales](/documentation/using-vamp/blueprints/#scale).

## Actions
 
 * [List](/documentation/api/v0.9.2/api-scales/#list-scales) - return a list of all stored scales
 * [Get](/documentation/api/v0.9.2/api-scales/#get-single-scale) - get a single stored scale
 * [Create](/documentation/api/v0.9.2/api-scales/#create-scale) - create a new scale 
 * [Update](/documentation/api/v0.9.2/api-scales/#update-scale) - update a stored scale
 * [Delete](/documentation/api/v0.9.2/api-scales/#delete-scale) - delete a stored scale

## Scale resource

The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.2/using-the-api) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully store a scale.

```
name: sava_scale
cpu: 0.2 
memory: 64MB
```

### API return resource
The fields returned by the API for stored scales.

```
- name: sava_scale
  kind: scale
  cpu: 0.2
  memory: 64.00MB
  instances: 1
```

 Field name      | Required  | description          
 -----------------|----------|-------
 name | yes  | Unique name used to reference the scale from a breed, blueprint, deployment or workflow.
 kind |  optional  |   The resource type. Required to [send multiple resources](/documentation/api/v0.9.2/api-reference/#send-multiple-resources) to `/api/v1`
 cpu |  yes |   
 memory | yes  |  
 instances | optional  |  

------------------

## List scales

Returns a list of all stored scales. For details on pagination see [common parameters](/documentation/api/v0.9.2/using-the-api)

### Request
 * `GET`
 * `/api/v1/scales`
 * The request body should be empty.

### Response
If successful, will return a list of all stored [scale resources](/documentation/api/v0.9.2/api-scales/#scale-resource) in the specified `accept` format (default JSON).  

------------------

## Get single scale

Returns a single stored scale.

### Request
 * `GET`
 * `/api/v1/scales/{scale_name}`
 * The request body should be empty.

### Response
If successful, will return the named [scale resource](/documentation/api/v0.9.2/api-scales/#scale-resource) in the specified `accept` format (default JSON).  

------------------

## Create scale

Create a new scale. Scales can be stored individually and then referenced from a breed, blueprint, deployment or workflow.

### Request
 * `POST`
 * `/api/v1/scales`
 * The request body should inclde at least a minimum [scale resource](/documentation/api/v0.9.2/api-scales/#scale-resource) in the specified `Content-Type` format (default JSON).
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `201 Created` if the condition is valid

### Response
If successful, will return the newly stored [scale resource](/documentation/api/v0.9.2/api-scales/#scale-resource) in the specified `accept` format (default JSON).  


------------------

## Update scale

Update a stored scale.

### Request
 * `PUT`
 * `/api/v1/scales/{scale_name}`
 * The request body should inclde at least a minimum [scale resource](/documentation/api/v0.9.2/api-scales/#scale-resource) in the specified `Content-Type` format (default JSON). The `name` field must match the `scale_name` specified in the request path.
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `200 OK` if the scale is valid

### Response
If successful, will return the newly stored [scale resource](/documentation/api/v0.9.2/api-scales/#scale-resource) in the specified `accept` format (default JSON).  

### Errors
* **Inconsistent name** - the `scale_name` in the request path does not match the `name` field in the request body.

------------------

## Delete scale

Delete a stored scale. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
 * `DELETE`
 * `/api/v1/scales/{scale_name}`
 * The request body should be empty.
* Query string parameters:

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` if the escalation is valid, without actual delete of the scale.

### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

------------------
