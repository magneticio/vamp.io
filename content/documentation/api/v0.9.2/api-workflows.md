---
date: 2016-09-13T09:00:00+00:00
title: Workflows
menu:
  main:
    parent: "API"
    identifier: "api-reference-workflows-092"
    weight: 210
---
Read about [using workflows](/documentation/using-vamp/workflows/).

## Actions

 * [List](/documentation/api/v0.9.2/api-workflows/#list-workflows) - return a list of all workflows
 * [Get](/documentation/api/v0.9.2/api-workflows/#get-single-workflow) - get a single workflow
 * [Create](/documentation/api/v0.9.2/api-workflows/#create-workflow) - create a new workflow
 * [Update](/documentation/api/v0.9.2/api-workflows/#update-workflow) - update a workflow
 * [Delete](/documentation/api/v0.9.2/api-workflows/#delete-workflow) - delete a workflow

## Workflow resource
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.2/using-the-api) for details on how to set this.

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


Field name  |  Options  |  Required |  Description
------------|-------|--------|--------
name  | - |   Required |
kind |  -  | Optional | The resource type. Required to [send multiple resources](/documentation/api/v0.9.2/api-reference/#send-multiple-resources) to `/api/v1`
breed  | - |   Required |  either a reference or inline definition, similar to blueprints. Best practice would be to store the breed separately and reference it from the workflow
status  |  running, stopping, suspending, starting, restarting |   Optional |  `restarting` will first suspend and then start the workflow (applying any changes since last start). `suspending` will stop a workflow from running without deleting it. `stopping` a workflow will delete it (not reversible).
schedule  | daemon, event, time |   Required |  The workflow schedule. See [using workflows - schedules](/documentation/using-vamp/v0.9.2/workflows/#schedules).
environment_variables (or env) | - |   Optional |  Overrides breed environment variables. You can provide your own variabes here. The following variables are required when using Vamp workflow agent, if not specified here, the configured defaults will be applied: `VAMP_WORKFLOW_EXECUTION_TIMEOUT`, `VAMP_KEY_VALUE_STORE_CONNECTION`, `VAMP_KEY_VALUE_STORE_PATH`,  `VAMP_WORKFLOW_EXECUTION_PERIOD`, `VAMP_KEY_VALUE_STORE_TYPE`, `VAMP_URL`. For a workflow that will run forever, also set VAMP_API_CACHE=false (by default this is set to true).
scale  | - |   Optional |  when not specified, the default scale will be applied.
 network |   |  Optional |
 arguments |    | Optional |


------------

## List workflows

Return a list of all stored workflows. For details on pagination see [common parameters](/documentation/api/v0.9.2/using-the-api)

### Request
* `GET`
* `/api/v1/workflows`
* The request body should be empty.

### Response
If successful, will return a list of [workflow resources](/documentation/api/v0.9.2/api-workflows/#workflow-resource) in the specified `accept` format (default JSON).

--------------

## Get single workflow

Return details of a specific workflow.

### Request
* `GET`
* `/api/v1/worflows/{workflow_name}`
* The request body should be empty.

### Response
If successful, will return the specified [workflow resource](/documentation/api/v0.9.2/api-workflows/#workflow-resource) in the specified `accept` format (default JSON).

### Errors
* **The requested resource could not be found** - there is no stored workflow with the specified `workflow_name`.

--------------

## Create workflow

Initiate a workflow.

### Request
* `POST`
* `/api/v1/workflows`
* The request body should include at least the [minimum workflow resource](/documentation/api/v0.9.2/api-workflows/#workflow-resource) in the specified `content-type` format (default JSON).

### Response
If successful, will return the created [workflow resource](/documentation/api/v0.9.2/api-workflows/#workflow-resource) in the specified `accept` format (default JSON).

--------------

## Update workflow

Update a stored workflow.

### Request
* `PUT`
* `/api/v1/workflows/{workflow_name}`
* The request body should include at least the [minimum workflow resource](/documentation/api/v0.9.2/api-workflows/#workflow-resource) in the specified `content-type` format (default JSON). The `name` field must match the `workflow_name` specified in the request syntax.

### Response
If successful, will return the updated [deployment resource](/documentation/api/v0.9.2/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

### Example - restart a running workflow
Request:

* `PUT`
* `/api/v1/workflows/{workflow_name}`
* The request body should include the current workflow resource (`GET <vamp url>/api/v1/workflows/{workflow_name}`) with the status adjusted to `status: restarting`

Response:
Will return the updated [workflow resource](/documentation/api/v0.9.2/api-workflows/#workflow-resource).

--------------

## Delete workflow

Delete a stored workflow.

### Request

* `DELETE`
* `/api/v1/workflows/{workflow_name}`
* The request body should be empty.

### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

--------------
