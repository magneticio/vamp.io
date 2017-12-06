---
date: 2016-09-13T09:00:00+00:00
title: SLAs
menu:
  main:
    parent: "API"
    identifier: "api-reference-slas-093"
    weight: 200
---
SLAs (Service Level Aggreemets) can be used to define a pre-described set of boundaries to a service and the actions that should take place once the service crosses those boundaries. You can save and manage SLA templates through the API, these can then be referenced in a blueprint or deployment. Read about [using SLAs](/documentation/using-vamp/sla/).

## Actions

 * [List](/documentation/api/v0.9.3/api-slas/#list-slas) - return a list of all SLAs
 * [Get](/documentation/api/v0.9.3/api-slas/#get-sla) - get a single SLA
 * [Create](/documentation/api/v0.9.3/api-slas/#create-sla) - create a new SLA
 * [Update](/documentation/api/v0.9.3/api-slas/#update-sla) - update a SLA
 * [Delete](/documentation/api/v0.9.3/api-slas/#delete-sla) - delete a SLA

## SLA resource
You can define SLAs inline or store them separately under a unique name and reference them from a blueprintor deployment resource.
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.3/using-the-api) for details on how to set this.

### Minimum resource
The minimum fields required to successfully create a SLA.

```
name: sla_name
type: response_time_sliding_window
window:
 interval: 50
 cooldown: 50
threshold:
 upper: 100
 lower: 10
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

 Field name   | Options  |  Required   | description
 -----------------|----|----|---------
 `name` |   | Required  | Unique name, used to reference the SLA.
 `kind` | `sla`  | Optional  | The resource type. Required to [send multiple resources](/documentation/api/v0.9.3/api-reference/#send-multiple-resources-post-put-and-delete) to `/api/v1`.
 `type` | `response_time_sliding_window`  | Required  |
 `window` |   | Required  |
 `threshold` |   | Required  |
 `escalations` |   | Optional  |


-----------------

## List SLAs

Return a list of all stored SLA templates. For details on pagination see [common parameters](/documentation/api/v0.9.3/using-the-api).

### Request
 * `GET`
 * `/api/v1/slas`
 * The request body should be empty.

### Response
If successful, will return a list of all stored [SLA resources](/documentation/api/v0.9.3/api-slas/#sla-resource) in the specified `accept` format (default JSON).

-----------------

## Get single SLA

Return a the named SLA resource.

### Request
* `GET`
* `/api/v1/slas/{sla_name}`
* The request body should be empty.

### Response
If successful, will return the named [SLA resource](/documentation/api/v0.9.3/api-slas/#sla-resource) in the specified `accept` format (default JSON).

-----------------

## Create SLA

Store a new SLA template.

### Request
* `POST`
* `/api/v1/slas`
* The request body should include at least a mimnimum [SLA resource](/documentation/api/v0.9.3/api-slas/#sla-resource).
* Query string parameters:

| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `201 Created` if the SLA is valid.


### Response
A successful create operation has status code 201 `Created` and the response body will contain the created [SLA resource](/documentation/api/v0.9.3/api-slas/#sla-resource) in the specified `accept` format (default JSON).

-----------------

## Update SLA

Update a stored SLA template.

### Request
* `PUT`
* `/api/v1/slas/{sla_name}`
* The request body should include at least a mimnimum [SLA resource](/documentation/api/v0.9.3/api-slas/#sla-resource). The `name` field must match the `sla_name` specified in the request path.
* Query string parameters:

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `200 OK` if the SLA is valid.


### Response
A successful update operation has status code 200 `OK` or 202 `Accepted` and the response body will contain the updated [SLA resource](/documentation/api/v0.9.3/api-slas/#sla-resource) in the specified `accept` format (default JSON).

-----------------

## Delete SLA

Delete a stored SLA template. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
* `DELETE`
* `/api/v1/slas/{sla_name}`
* The request body should be empty.
* Query string parameters:

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the SLA.


### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

-----------------
