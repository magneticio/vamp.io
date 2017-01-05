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
intro text. Read about [using conditions](documentation/using-vamp/conditions/).

## Actions
 
 * [List](/documentation/api/api-conditions/#list-conditions) - return a list of all conditions
 * [Get](/documentation/api/api-conditions/#get-condition) - get a single condition
 * [Create](/documentation/api/api-conditions/#create-condition) - create a new condition 
 * [Update](/documentation/api/api-conditions/#update-condition) - update a condition
 * [Delete](/documentation/api/api-conditions/#delete-condition) - delete a condition

## Condition resource
You can define conditions inline or store them separately under a unique name and reference them from a blueprint, breed or gateway resorce.
The minimum and API return resource examples below are shown in YAML format. Vamp API requests and responses can be in JSON or YAML format (default JSON). See [common parameters](/documentation/api/api-common-parameters) for details on how to set this.

### Minimum resource
The minimum fields required to successfully create a condition.

```

```

### API return resource
The fields returned by the API after a condition has been created (also visible in the UI)

```
 
```

 Field name        | description          
 -----------------|-----------------
  |  
  |
  

## List conditions

Returns a list of all stored conditions. For details on pagination see [common parameters](/documentation/api/api-common-parameters)

### Request syntax
    GET /api/v1/conditions

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