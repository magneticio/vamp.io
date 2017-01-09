---
date: 2016-09-13T09:00:00+00:00
title: API - Scales
menu:
  main:
    parent: "API"
    identifier: "api-reference-scales"
    weight: 35
draft: true
---
intro text. Read about [using scales](/documentation/using-vamp/blueprints/#scale).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-scales/#list-scales) - return a list of all scales
 * [Get](/documentation/api/v9.9.9/api-scales/#get-scale) - get a single scale
 * [Create](/documentation/api/v9.9.9/api-scales/#create-scale) - create a new scale 
 * [Update](/documentation/api/v9.9.9/api-scales/#update-scale) - update a scale
 * [Delete](/documentation/api/v9.9.9/api-scales/#delete-scale) - delete a scale

## Scale resource

The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully store a scale.

```
- name: demo2
  cpu: 0.2
  memory: 380.00MB
```

### API return resource
The fields returned by the API for stored scales.

```
 - name: demo
   kind: scale
   cpu: 0.2
   memory: 380.00MB
   instances: 1
```

 Field name        | description          
 -----------------|-----------------
  |  
  |
  

## List conditions

Returns a list of all stored conditions. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

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