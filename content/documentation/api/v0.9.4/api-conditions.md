---
date: 2016-09-13T09:00:00+00:00
title: Conditions
menu:
  main:
    parent: "API"
    identifier: "api-reference-conditions-094"
    weight: 60
---
Condition templates are static artifacts. You can save and manage condition templates through the API, these can then be referenced and applied to gateways. Read about [using conditions](/documentation/using-vamp/conditions/) and [using gateways](/documentation/using-vamp/gateways/).


## Actions

 * [List](/documentation/api/v0.9.4/api-conditions/#list-conditions) - return a list of all stored condition templates
 * [Get](/documentation/api/v0.9.4/api-conditions/#get-condition) - get a single stored condition template
 * [Create](/documentation/api/v0.9.4/api-conditions/#create-condition) - create a new condition template
 * [Update](/documentation/api/v0.9.4/api-conditions/#update-condition) - update a condition template
 * [Delete](/documentation/api/v0.9.4/api-conditions/#delete-condition) - delete a stored condition template

## Condition resource
You can define conditions inline or store them separately as templates under a unique name and reference them from a blueprint, breed or gateway resource.
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.4/using-the-api) for details on how to set this.

### Minimum resource
The minimum fields required to successfully store a condition.

```
name: sava
condition: User-Agent = Chrome
```

### API return resource
The fields returned by the API for stored conditions.

```
name: sava
kind: condition
condition: User-Agent = Chrome
```

 Field name    |  Required  | description
 --------------|---|-----------------
 name | yes |  Unique name used to reference the condition from a gateway
 kind | optional | The resource type. Required to [send multiple resources](/documentation/api/v0.9.4/api-reference/#send-multiple-resources) to `/api/v1`
 condition | yes | Boolean condition statement. See [using conditions](/documentation/using-vamp/conditions/) for details on how to create a condition.

-----------

## List conditions

Returns a list of all stored conditions. For details on pagination see [common parameters](/documentation/api/v0.9.4/using-the-api).

### Request
* `GET`
* `/api/v1/conditions`
* The request body should be empty.

### Response
If successful, will return a list of all stored [condition resources](/documentation/api/v0.9.4/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

-----------

## Get condition

Return a specific stored condition.

### Request
* `GET`
* `/api/v1/conditions/{condition_name}`
* The request body should be empty.

### Response
If successful, will return the named [condition resource](/documentation/api/v0.9.4/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

-----------

## Create condition

Create a condition template.

### Request
* `POST`
* `/api/v1/conditions/`
* The request body should include at least a [minimum condition resource](/documentation/api/v0.9.4/api-conditions/#condition-resource) in the specified `Content-Type` format (default JSON).
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `201 Created` if the condition is valid

### Response
If successful, will return the stored [condition resource](/documentation/api/v0.9.4/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

-----------

## Update condition

Update a stored condition template.

### Request
* `PUT`
* `/api/v1/conditions/{condition_name}`
* The request body should include at least a [minimum condition resource](/documentation/api/v0.9.4/api-conditions/#condition-resource) in the specified `Content-Type` format (default JSON). The `name` field must match the `{condition_name}` used in the request path.
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `200 OK` if the condition is valid

### Response
If successful, will return the updated [condition resource](/documentation/api/v0.9.4/api-conditions/#condition-resource) in the specified `accept` format (default JSON).

### Errors
* **Inconsistent name** - the `condition_name` in the request path does not match the `name` field in the request body.

-----------

## Delete condition

Delete a stored condition template. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
* `DELETE`
* `/api/v1/conditions/{condition_name}`
* The request body should be empty.
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `204 No Content` if the condition is valid, without actual delete of the breed.

### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

-----------
