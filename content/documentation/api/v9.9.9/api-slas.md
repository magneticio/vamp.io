---
date: 2016-09-13T09:00:00+00:00
title: API - SLAs
menu:
  main:
    parent: "API"
    identifier: "api-reference-slas"
    weight: 37
draft: true
---
SLAs (Service Level Aggreemets) can be used to define a pre-described set of boundaries to a service and the actions that should take place once the service crosses those boundaries. You can save and manage SLA templates through the API, these can then be referenced in a blueprint or deployment. Read about [using SLAs](documentation/using-vamp/slas/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-slas/#list-slas) - return a list of all SLAs
 * [Get](/documentation/api/v9.9.9/api-slas/#get-sla) - get a single SLA
 * [Create](/documentation/api/v9.9.9/api-slas/#create-sla) - create a new SLA 
 * [Update](/documentation/api/v9.9.9/api-slas/#update-sla) - update a SLA
 * [Delete](/documentation/api/v9.9.9/api-slas/#delete-sla) - delete a SLA

## SLA resource
You can define SLAs inline or store them separately under a unique name and reference them from a blueprintor deployment resource.
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully create a SLA.

```
name: sla_name
type: response_time_sliding_window
threshold:
 upper: 100
 lower: 10
window:
 interval: 50
 cooldown: 50
```

### API return resource
The fields returned by the API after a SLA has been created (also visible in the UI)

```
 - name: sla_name
   kind: sla
   type: response_time_sliding_window
   window:
     interval: 50
     cooldown: 50
   threshold:
     upper: 100
     lower: 10
   escalations: []
```

 Field name   | Ooptions  |  Required   | description          
 -----------------|-----------------
  |  
  |
  

-----------------

## List SLAs

Returns a list of all stored SLAs. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request
 * `GET` 
 * `/api/v1/slas`
 * The request body should be empty.

### Response 

-----------------