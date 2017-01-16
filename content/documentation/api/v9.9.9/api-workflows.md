---
date: 2016-09-13T09:00:00+00:00
title: API - Workflows
menu:
  main:
    parent: "API"
    identifier: "api-reference-workflows"
    weight: 70
draft: true
---
Read about [using workflows](documentation/using-vamp/workflows/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-workflows/#list-workflows) - return a list of all workflows
 * [Get](/documentation/api/v9.9.9/api-workflows/#get-single-workflow) - get a single workflow
 * [Create](/documentation/api/v9.9.9/api-workflows/#create-workflow) - create a new workflow 
 * [Update](/documentation/api/v9.9.9/api-workflows/#update-workflow) - update a workflow
 * [Delete](/documentation/api/v9.9.9/api-workflows/#delete-workflow) - delete a workflow

## Workflow resource
You can define SLAs inline or store them separately under a unique name and reference them from a blueprint, breed or gateway resorce.
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully create a workflow.

```

```

### API return resource
The fields returned by the API after a workflow has been created (also visible in the UI)

```
- name: health
  kind: workflow
  breed:
    reference: health
  status: running
  schedule: daemon
  environment_variables:
    VAMP_WORKFLOW_EXECUTION_TIMEOUT: '7'
    VAMP_KEY_VALUE_STORE_CONNECTION: 192.168.99.100:2181
    VAMP_KEY_VALUE_STORE_PATH: /vamp/workflows/health
    VAMP_WORKFLOW_EXECUTION_PERIOD: '5'
    VAMP_KEY_VALUE_STORE_TYPE: zookeeper
    VAMP_URL: http://192.168.99.100:8080
  scale:
    cpu: 0.1
    memory: 128.00MB
    instances: 1
  network: HOST
  arguments: [] 
```

 Field name       |   | description          
 -------------|----|-----------------
 name |    |
 kind |    |
 breed |    |
 status |    |
 schedule |   | 
 environment_variables |    |
 scale |   |   
 network |   |   
 arguments |    |  
    
    
------------ 

## List workflows

Returns a list of all stored workflows. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request
* `GET`
* `/api/v1/workflows`
* The request body should be empty.

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |

### Response


### Errors
* ???
