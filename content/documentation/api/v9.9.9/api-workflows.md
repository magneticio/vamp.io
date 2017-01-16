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
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully create a workflow.

```
name: workflow_name
schedule: daemon
breed: workflow_breed
```

### API return resource
The fields returned by the API after a workflow has been created (also visible in the Vamp UI workflow editor)

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

 Field name       | Required  | description          
 -------------|----|-----------------
 name |  yes  |
 kind |    |
 breed |  yes  |
 status |    |
 schedule |  yes  | 
 environment_variables |    |
 scale |   |   
 network |   |   
 arguments |    |  
    
    
------------ 

## List workflows

Return a list of all stored workflows. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request
* `GET`
* `/api/v1/workflows`
* The request body should be empty.

### Response
If successful, will return a list of [workflow resources](/documentation/api/v9.9.9/api-workflows/#workflow-resource) in the specified `accept` format (default JSON).

### Errors
* ???

--------------

## Get single workflow

Return details of a specific workflow.

### Request
* `GET`
* `/api/v1/worflows/{workflow_name}`
* The request body should be empty.

### Response
If successful, will return the specified [workflow resource](/documentation/api/v9.9.9/api-workflows/#workflow-resource) in the specified `accept` format (default JSON).

### Errors
* The requested resource could not be found.

--------------

## Create workflow

Initiate a workflow.

### Request
* `POST` 
* `/api/v1/workflows`
* The request body should include at least the [minimum workflow resource](/documentation/api/v9.9.9/api-workflows/#workflow-resource) in the specified `content-type` format (default JSON). 

### Response
If successful, will return the created [workflow resource](/documentation/api/v9.9.9/api-workflows/#workflow-resource) in the specified `accept` format (default JSON).

### Errors
* ???

### Examples
???

--------------

## Update workflow

Add to a running workflow.

### Request
* `PUT`
* `/api/v1/workflows/{workflow_name}`
* The request body should include at least the [minimum workflow resource](/documentation/api/v9.9.9/api-workflows/#workflow-resource) in the specified `content-type` format (default JSON). The `name` field must match the `workflow_name` specified in the request syntax.

### Response
If successful, will return the updated [deployment resource](/documentation/api/v9.9.9/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

### Errors
* ???

### Example - restart a running workflow
Request:

* `PUT`
* `/api/v1/workflows/{workflow_name}`
* The request body should include the current workflow resource (`GET <vamp url>/api/v1/workflows/{workflow_name}`) with the status adjusted to `status: restarting`

Response:  

* If successful, will return the updated [workflow resource](/documentation/api/v9.9.9/api-workflows/#workflow-resource).

--------------

## Delete workflow

Delete a running workflow.

### Request

* `DELETE`
* `/api/v1/workflows/{workflow_name}`
* 

### Response
???

### Errors
* ???

--------------