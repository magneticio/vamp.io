---
date: 2016-09-13T09:00:00+00:00
title: Escalations
menu:
  main:
    parent: "API"
    identifier: "api-reference-escalations-092"
    weight: 120
---
Escalation templates are static artifacts. You can save and manage escalation templates through the API, these can then be referenced in an sla and applied to each cluster in a blueprint. Read about [using escalations](/documentation/using-vamp/escalations/) and [using slas](/documentation/using-vamp/sla/).

## Actions

 * [List](/documentation/api/v0.9.2/api-escalations/#list-escalations) - return a list of all escalations
 * [Get](/documentation/api/v0.9.2/api-escalations/#get-single-escalation) - get a single escalation
 * [Create](/documentation/api/v0.9.2/api-escalations/#create-escalation) - create a new escalation
 * [Update](/documentation/api/v0.9.2/api-escalations/#update-escalation) - update a escalation
 * [Delete](/documentation/api/v0.9.2/api-escalations/#delete-escalation) - delete a escalation

## Escalation resource

The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.2/using-the-api) for details on how to set this.

### Minimum resource
The minimum fields required to successfully create an escalation.

```
- name: unique_name
  type: scale_instances
  minimum: 1
  maximum: 3
  scale_by: 1
```

### API return resource
The fields returned by the API after an escalation has been created (also visible in the UI)

```
- name: unique_name
  kind: escalation
  type: scale_instances
  target: cluster_name
  minimum: 1
  maximum: 3
  scale_by: 1

```

 Field name    | Options | Required?  | description
 -----------------|-----|------|------
 name |  -  |  Required  | A unique name to reference the escalation
 kind |  `escalation`  |  Optional  | The resource type. Required to [send multiple resources](/documentation/api/v0.9.2/api-reference/#send-multiple-resources-post-put-and-delete) to `/api/v1`
 type |  `scale_instances`, `scale_cpu`, `scale_memory`  |  Required  |  Escalation handler. Specifies what is to be scaled.
 target |    | Optional   | The target cluster to scale up/down. If not included, will default to the cluster where escalations are specified.
 minimum |    | Required  | Minimum setting.
 maximum |    | Required   |  Maximum setting.
 scale_by |    |  Required   | Increment to scale up/down by.

-----------------

## List Escalations

Return a list of all stored escalation templates. For details on pagination see [common parameters](/documentation/api/v0.9.2/using-the-api)

### Request
* `GET`
* `/api/v1/escalations`
* The request body should be empty.

### Response
If successful, will return a list of [escalation resources](/documentation/api/v0.9.2/api-escalations/#escalation-resource) in the specified `accept` format (default JSON).

-----------------

## Get single escalation

Return a the named escalation resource.

### Request
* `GET`
* `/api/v1/escalations/{escalation_name}`
* The request body should be empty.

### Response
If successful, will return the named [escalation resource](/documentation/api/v0.9.2/api-escalations/#escalation-resource) in the specified `accept` format (default JSON).

-----------------

## Create escalation

Stores a new escalation template.

### Request
* `POST`
* `/api/v1/escalations`
* The request body should include at least a mimnimum [escalation resource](/documentation/api/v0.9.2/api-escalations/#escalation-resource).
* Query string parameters:

| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `201 Created` if the escalation is valid.


### Response
A successful create operation has status code 201 `Created` and the response body will contain the created [escalation resource](/documentation/api/v0.9.2/api-escalations/#escalation-resource) in the specified `accept` format (default JSON).

-----------------

## Update escalation

Update a stored escalation.

### Request
* `PUT`
* `/api/v1/escalations/{escalation_name}`
* The request body should include at least a mimnimum [escalation resource](/documentation/api/v0.9.2/api-escalations/#escalation-resource). The `name` field must match the `escalation_name` specified in the request path.
* Query string parameters:

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `200 OK` if the escalation is valid.


### Response
A successful update operation has status code 200 `OK` or 202 `Accepted` and the response body will contain the updated [escalation resource](/documentation/api/v0.9.2/api-escalations/#escalation-resource) in the specified `accept` format (default JSON).

-----------------

## Delete escalation

Delete a stored escalation. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
* `DELETE`
* `/api/v1/escalations/{escalation_name}`
* The request body should be empty.
* Query string parameters:

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` if the escalation is valid, without actual delete of the escalation.


### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

-----------------
