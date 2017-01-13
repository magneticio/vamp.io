---
date: 2016-09-13T09:00:00+00:00
title: API - SLAs
draft: true
---
Read about [using SLAs](documentation/using-vamp/slas/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-slas/#list-slas) - return a list of all SLAs
 * [Get](/documentation/api/v9.9.9/api-slas/#get-sla) - get a single SLA
 * [Create](/documentation/api/v9.9.9/api-slas/#create-sla) - create a new SLA 
 * [Update](/documentation/api/v9.9.9/api-slas/#update-sla) - update a SLA
 * [Delete](/documentation/api/v9.9.9/api-slas/#delete-sla) - delete a SLA

## SLA resource
You can define SLAs inline or store them separately under a unique name and reference them from a blueprint, breed or gateway resorce.
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully create a SLA.

```

```

### API return resource
The fields returned by the API after a SLA has been created (also visible in the UI)

```
 
```

 Field name        | description          
 -----------------|-----------------
  |  
  |
  

## List SLAs

Returns a list of all stored SLAs. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request syntax
    GET /api/v1/slas

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