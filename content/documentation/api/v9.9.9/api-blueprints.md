---
date: 2016-09-13T09:00:00+00:00
title: API - Blueprints
menu:
  main:
    parent: "API"
    identifier: "api-reference-blueprints"
    weight: 10
draft: true
---
Blueprints are static artifacts. They describe how breeds work in runtime and what properties they should have. Read about [using blueprints](documentation/using-vamp/blueprints/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-blueprints/#list-blueprints) - return a list of all stored blueprints
 * [Get](/documentation/api/v9.9.9/api-blueprints/#get-blueprint) - get a single stored blueprint
 * [Create](/documentation/api/v9.9.9/api-blueprints/#create-blueprint) - create a new blueprint 
 * [Update](/documentation/api/v9.9.9/api-blueprints/#update-blueprint) - update an existing blueprint
 * [Delete](/documentation/api/v9.9.9/api-blueprints/#delete-blueprint) - delete a stored blueprint

## Blueprint resource

The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully store a blueprint.

```
name: sava
clusters:
  sava:
    services:
    - breed: sava:1.0.0
```

### API return resource
The fields returned by the API for stored blueprints.

```
name: sava
kind: blueprint
gateways: {}
clusters:
  sava:
    services:
    - breed:
        reference: sava:1.0.0
      environment_variables: {}
      arguments: []
      dialects: {}
    gateways: {}
    dialects: {}
environment_variables: {}
```

 Field name    |  Required  | description          
 --------------|---|-----------------
 name | yes |
 kind | optional | The resource type. Required to [send multiple resources](/documentation/api/v9.9.9/api-overview/#send-multiple-resources) to `/api/v1`
 gateways | optional |  Can be created separately and referenced from here or defined inline as part of the blueprint. See [gateway resource](/documentation/api/v9.9.9/api-gateways)
 clusters | yes  |
 services | yes |
 breed |  yes |Can be created separately and referenced from here or defined inline as part of the blueprint. See [breed resource](/documentation/api/v9.9.9/api-breeds)
 environment variables | optional |
 scale | optional | Can be created separately and referenced from here or defined inline as part of the blueprint. If omitted, the default scale will be used (See [scale resource](/documentation/) and [reference.conf default scale](/documentation/installation/configuration-reference/#operation))

-----------

## List blueprints

Returns a list of all stored blueprint resources. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request

* `GET` 
* `/api/v1/blueprints`
* The request body should be empty.
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some breeds are not yet fully defined.
| `only_references`   | true or false     | false            | all breeds will be replaced with their references.



### Response
If successful, will return a list of [blueprint resources](/documentation/api/v9.9.9/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON).  

### Errors
* **400 bad request** - `expand_references` set to true and some breeds are not yet fully defined.

-----------

## Get single blueprint

Returns details of a single, specified blueprint.

### Request 

* `GET` 
* `/api/v1/blueprints/{blueprint_name}`
* The request body should be empty.
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some breeds are not yet fully defined.
| `only_references`   | true or false     | false            | all breeds will be replaced with their references.

### Response 
If successful, will return the named [blueprint resource](/documentation/api/v9.9.9/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON).

### Errors
* **400 bad request** - `expand_references` set to true and some breeds are not yet fully defined.

-----------

## Create blueprint

Stores a new blueprint. Note that create operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request

* `POST`
* `/api/v1/blueprints`
* The request body should contain at least a [minimum blueprint resource](/documentation/api/v9.9.9/api-blueprints/#blueprint-resource) in the specified `content-type` format (default JSON).
* Optional headers:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `201 Created` if the blueprint is valid.  

### Response
A successful create operation has status code 201 `Created` and the response body will contain the created [blueprint resource](/documentation/api/v9.9.9/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON). 

### Errors

* ???

-----------

## Update blueprint

Updates the content of a specific blueprint.

### Request

* `PUT`
* `/api/v1/blueprints/{blueprint_name}`
* The request body should contain at least a [minimum blueprint resource](/documentation/api/v9.9.9/api-blueprints/#blueprint-resource) in the specified `content-type` (default JSON). The name field must match the `blueprint_name` specified in the request path.
* Optional headers:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `200 OK` if the blueprint is valid.  

### Response
A successful update operation has status code 200 `OK` or 202 `Accepted` and the response body will contain the updated [blueprint resource](/documentation/api/v9.9.9/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON).

### Errors

* **4xx** - an update will fail if a resource does not exist
* **Inconsistent name** - the `scale_name` in the request path does not match the `name` field in the request body.

-----------

## Delete blueprint

Deletes a blueprint. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request

* `DELETE` 
* `/api/v1/blueprints/{blueprint_name}`
* The request body should be empty.
* Optional headers:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the blueprint.

### Response

A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

### Errors

* ???

--------------