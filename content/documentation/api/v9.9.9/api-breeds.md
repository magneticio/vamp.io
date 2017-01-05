---
date: 2016-09-13T09:00:00+00:00
title: API - Breeds
menu:
  main:
    parent: "API"
    identifier: "api-reference-breeds"
    weight: 35
draft: true
---
intro text. Read about [using breeds](documentation/using-vamp/breeds/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-breeds/#list-breeds) - return a list of all breeds
 * [Get](/documentation/api/v9.9.9/api-breeds/#get-breed) - get a single breed
 * [Create](/documentation/api/v9.9.9/api-breeds/#create-breed) - create a new breed 
 * [Update](/documentation/api/v9.9.9/api-breeds/#update-breed) - update a stored breed
 * [Delete](/documentation/api/v9.9.9/api-breeds/#delete-breed) - delete a breed

## Breed resource

The minimum and API return resource examples below are shown in JSON format. Vamp API requests and responses can be in JSON or YAML format (default JSON). See [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this.

### Minimum resource
The minimum fields required to successfully create a breed.

```
{
  "name": "sava:1.0",
  "deployable": "sava",
}

```

### API return resource
The fields returned by the API after a breed has been created (also visible in the UI)

```
  {
    "name": "sava:1.0",
    "kind": "breed",
    "deployable": {
      "type": "container/docker",
      "definition": "sava"
    },
    "ports": {},
    "environment_variables": {},
    "constants": {},
    "arguments": [],
    "dependencies": {}
  }
```

 Field name        | Required | description          
 -----------------|--------|---------
name  |  yes  | a unique name to reference the breed
kind  |  optional  | Required to [send multiple resources](/documentation/api/v9.9.9/api-overview/#send-multiple-resources-post-put-and-delete) to `/api/v1`
deployable  |  yes  |  the default deployable type is `container/docker`
ports  |  optional  |  
environtment_variables  |  optional  |
constants  |  optional  |
arguments  |  optional  |
dependencies  |  optional  |  

--------------  
  
## List breeds

Returns a list of all stored breeds. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters).

### Request syntax
    GET /api/v1/breeds

### Request body
The request body should be empty.

### Response syntax
If successful, will return a list of [breed resources](/documentation/api/v9.9.9/api-breeds/#breed-resource) in the specified `accept` format (default JSON). For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters).

### Errors
* ???

--------------

## Get specific breed

Returns a specific stored breed.

### Request syntax
    GET /api/v1/breeds/{breed_name}

### Request body
The request body should be empty.

### Response syntax
If successful, will return the specified [breed resource](/documentation/api/v9.9.9/api-breeds/#breed-resource) in the specified `accept` format (default JSON)

### Errors
* The requested resource could not be found.

--------------

## Create breed

Creates a breed with the specified fields.

### Request syntax
    POST /api/v1/breeds

### Request body
The request body should include at least the [minimum breed resource](/documentation/api/v9.9.9/api-breeds/#breed-resource) in the specified `content-type` format (default JSON). 

### Response syntax
If successful, will return the created [breed resources](/documentation/api/v9.9.9/api-breeds/#breed-resource) in the specified `accept` format (default JSON).

### Errors
* ???

--------------


## Update breed

Updates the specified field(s) of a stored breed.

### Request syntax
    PUT /api/v1/breeds/{breed_name}

### Request body
The request body should include at least the [minimum breed resource](/documentation/api/v9.9.9/api-breeds/#breed-resource) in the specified `content-type` format (default JSON). The `name` field must match the `breed_name` specified in the request syntax.

### Response syntax
If successful, will return the updated [breed resources](/documentation/api/v9.9.9/api-breeds/#breed-resource) in the specified `accept` format (default JSON).
### Errors
* ???

--------------

## Delete breed

Deletes the specified breed. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request syntax
    DELETE /api/v1/breeds/{breed_name}

### Request body
The request body should be empty.

### Response syntax
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

### Errors
* ???

--------------

## Examples

???