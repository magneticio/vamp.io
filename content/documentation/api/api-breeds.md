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
 
 * [List](/documentation/api/api-breeds/#list-breeds) - return a list of all breeds
 * [Get](/documentation/api/api-breeds/#get-breed) - get a single breed
 * [Create](/documentation/api/api-breeds/#create-breed) - create a new breed 
 * [Update](/documentation/api/api-breeds/#update-breed) - update a stored breed
 * [Delete](/documentation/api/api-breeds/#delete-breed) - delete a breed

## Breed resource

The minimum and API return resource examples below are shown in YAML format. Vamp API requests and responses can be in JSON or YAML format (default JSON). See [common parameters](/documentation/api/api-common-parameters) for details on how to set this.

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

 Field name        | description          
 -----------------|-----------------
  |  
  |
  

## List Breeds

Returns a list of all stored breeds. For details on pagination see [common parameters](/documentation/api/api-common-parameters)

### Request syntax
    GET /api/v1/breeds

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |

### Request body
The request body should be empty.

### Response syntax


### Errors
* ???

## Examples

???