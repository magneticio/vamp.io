---
date: 2016-09-13T09:00:00+00:00
title: API - Blueprints
menu:
  main:
    parent: "API"
    identifier: "api-reference-blueprints"
    weight: 30
draft: true
---
Blueprints are static artifacts. They describe how breeds work in runtime and what properties they should have. Read about [using blueprints](documentation/using-vamp/blueprints/).

## Actions
 
 * [List](/documentation/api/api-blueprints/#list-blueprints) - return a list of all blueprints
 * [Get](/documentation/api/api-blueprints/#get-blueprint) - get a single blueprint
 * [Create](/documentation/api/api-blueprints/#create-blueprint) - create a new blueprint 
 * [Update](/documentation/api/api-blueprints/#update-blueprint) - update an existing blueprint
 * [Delete](/documentation/api/api-blueprints/#delete-blueprint) - delete a blueprint

## Blueprint resource

The minimum and API return resource examples below are shown in YAML format. Vamp API requests and responses can be in JSON or YAML format (default JSON). See [common parameters](/documentation/api/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully create a blueprint.

```
name: sava_minimum
clusters:
  sava:
    services:
    - breed: sava:1.0
```

### API return resource
The fields returned by the API after a blueprint has been created (also visible in the UI)

```
name: sava_minimum
kind: blueprint
gateways: {}
clusters:
  sava:
    services:
    - breed:
        reference: sava:1.0
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
 kind | optional | Required to [send multiple resources](/documentation/api/api-overview/#send-multiple-resources-post-put-and-delete)
 gateways | optional |  Can be created separately and referenced from here or defined inline as part of the blueprint. See [gateway resource](/documentation/api/api-gateways)
 clusters | yes  |
 services | yes |
 breed |  yes |Can be created separately and referenced from here or defined inline as part of the blueprint. See [breed resource](/documentation/)
 environment variables | optional |
 scale | optional | Can be created separately and referenced from here or defined inline as part of the blueprint. If omitted, the default scale will be used (See [scale resource](/documentation/) and [reference.conf default scale](/documentation/installation/configuration-reference/#operation))

-----------

## List blueprints

Returns a list of all stored blueprint resources. For details on pagination see [common parameters](/documentation/api/api-common-parameters)

### Request syntax
    GET /api/v1/blueprints

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some breeds are not yet fully defined.
| `only_references`   | true or false     | false            | all breeds will be replaced with their references.

### Request body
The request body should be empty.

### Response syntax
If successful, will return a list of [blueprint resources](/documentation/api/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON).  

### Errors
* **400 bad request** `expand_references` set to true and some breeds are not yet fully defined.

-----------

## Get blueprint

Returns details of a single, specified blueprint.

### Request syntax

    GET /api/v1/blueprints/{blueprint_name}

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some breeds are not yet fully defined.
| `only_references`   | true or false     | false            | all breeds will be replaced with their references.

### Request body
The request body should be empty.

### Response syntax
If successful, will return a single [blueprint resource](/documentation/api/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON).

### Errors
* **400 bad request** `expand_references` set to true and some breeds are not yet fully defined.

-----------

## Create blueprint

Creates a new blueprint. Create operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request syntax

    POST /api/v1/blueprints


| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `201 Created` if the blueprint is valid.  

### Request body
Should contain a [blueprint resource](/documentation/api/api-blueprints/#blueprint-resource) in the specified `content-type` format (default JSON).

### Response syntax
A successful create operation has status code 201 `Created` and the response body will contain the created [blueprint resource](/documentation/api/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON). 

### Errors

* ???

-----------

## Update blueprint

Updates the content of a specific blueprint.

### Request syntax

    PUT /api/v1/blueprints/{blueprint_name}

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `200 OK` if the blueprint is valid.  

### Request body
Should contain a [blueprint resource](/documentation/api/api-blueprints/#blueprint-resource) in the specified `content-type` (default JSON).

### Response syntax
A successful update operation has status code 200 `OK` or 202 `Accepted` and the response body will contain the updated [blueprint resource](/documentation/api/api-blueprints/#blueprint-resource) in the specified `accept` format (default JSON).

### Errors

* **4xx** - an update will fail if a resource does not exist

-----------

## Delete blueprint

Deletes a blueprint. Delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request syntax

    DELETE /api/v1/blueprints/{blueprint_name}

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the blueprint.

### Request body

???

### Response syntax

A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

### Errors

* ???