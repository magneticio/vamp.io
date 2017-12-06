---
date: 2016-09-13T09:00:00+00:00
title: Gateways
menu:
  main:
    parent: "API"
    identifier: "api-reference-gateways-094"
    weight: 140
---
Read about [using gateways](/documentation/using-vamp/gateways/).

## Methods

 * [List](/documentation/api/v0.9.4/api-gateways/#list-gateways) - return a list of all gateways
 * [Get](/documentation/api/v0.9.4/api-gateways/#get-single-gateway) - get a single gateway
 * [Create](/documentation/api/v0.9.4/api-gateways/#create-gateway) - create a new gateway
 * [Update](/documentation/api/v0.9.4/api-gateways/#update-gateway) - update a gateway
 * [Delete](/documentation/api/v0.9.4/api-gateways/#delete-gateway) - delete a gateway

## Gateway resource
You can define gateways inline as part of a blueprint, breed or deployment, or create them separately and reference them by name. The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.4/using-the-api) for details on how to set this.

### Minimum resource

```
- name: sava_gateway
  port: 12345
```

### API return resource

```
name: sava_gateway
kind: gateway
lookup_name: ebcec0d294fc399c5ee972c43a854e3b643d5ece
internal: false
service:
  host: 192.168.99.100
  port: 12345/http
deployed: true
port: '12345'
sticky: null
virtual_hosts:
- sava-gateway.vamp
routes: {}
```

 Field name        |  Required | Description
 -----------------|--------|---------
 name |  yes  | Unique name used to reference the gateway from a breed, blueprint or deployment.
 kind |  optional  | The resource type. Required to [send multiple resources](/documentation/api/v0.9.4/api-reference/#send-multiple-resources) to `/api/v1`
 lookup_name |  -  |
 internal  |  -  |
 service  |  -  |
 deployed  |  -  |
 port  |  yes  | `port_number/port_type`.  Port type can be `http` (default) or `tcp`.
 sticky |  optional  |
 virtual_hosts  |  -  |
 routes  |  optional  |

-----------

## List gateways

Return a list of all gateways. For details on pagination see [common parameters](/documentation/api/v0.9.4/using-the-api)

### Request
* `GET`
* `/api/v1/gateways`
* The request body should be empty.

### Response
If successful, will return a list of all [gateway resources](/documentation/api/v0.9.4/api-gateways/#gateway-resource) in the specified `accept` format (default JSON).

### Examples

See [gateways - A/B TEST TWO DEPLOYMENTS USING ROUTE WEIGHT](/documentation/using-vamp/gateways/#example-a-b-test-two-deployments-using-route-weight)

-----------

## Get single gateway

Get details of a single gateway.

### Request
* `GET`
* `/api/v1/gateways/{gateway_name}`
* The request body should be empty.

### Response
If successful, will return the named [gateway resource](/documentation/using-vamp/v0.9.4/gateways/#example-a-b-test-two-deployments-using-route-weight) in the specified `accept` format (default JSON).

### Errors
* **The requested resource could not be found.** - the named gateway does not exist.

-----------

## Create gateway

Create a new gateway.

### Request
* `POST`
* `/api/v1/gateways`
* The request body should include at least a [minimum gateway resource](/documentation/api/v0.9.4/api-gateways/#gateway-resource) in the specified `Content-Type` format (default JSON).
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `201 Created` if the gateway is valid

### Response
If successful, will return the newly stored [gateway resource](/documentation/api/v0.9.4/api-gateways/#gateway-resource) in the specified `accept` format (default JSON).

### Errors
* **Gateway port '...' is/was in use by deployment: '...'** - Port already in use. Remove gateway or select another port.

-----------

## Update gateway

Update a stored gateway.

### Request
* `PUT`
* `/api/v1/gateways/{gateway_name}`
* The request body should include at least a [minimum gateway resource](/documentation/api/v0.9.4/api-gateways/#gateway-resource) in the specified `Content-Type` format (default JSON).  The `name` field must match the `gateway_name` specified in the request path.
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `200 OK` if the gateway is valid

### Response
If successful, will return the newly stored [gateway resource](/documentation/api/v0.9.4/api-gateways/#gateway-resource) in the specified `accept` format (default JSON).

### Errors
* **Inconsistent name** - the `gateway_name` in the request path does not match the `name` field in the request body.

-----------

## Delete gateway

Delete a gateway. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
* `DELETE`
* `/api/v1/gateways/{gateway_name}`
* The request body should be empty.
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `204 No Content` if the gateway is valid, without actual delete of the breed.

### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

-----------
