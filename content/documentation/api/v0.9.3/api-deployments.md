---
date: 2016-09-13T09:00:00+00:00
title: Deployments
menu:
  main:
    parent: "API"
    identifier: "api-reference-deployments-093"
    weight: 90
---

Deployments are dynamic runtime structures, so changes to them take time to execute and can possibly fail. Most API calls to the `/deployments` endpoint will, therefore, return a `202: Accepted` return code, indicating the asynchronous nature of the call. Deployments have a set of sub resources: [deployment SLAs](/documentation/api/v0.9.3/api-deployment-slas), [deployment scales](/documentation/api/v0.9.3/api-deployment-scales) and [gateways](/documentation/api/v0.9.3/api-gateways). These are instantiations of their static counterparts.
Read about [using deployments](/documentation/using-vamp/deployments/).

## Actions

 * [List](/documentation/api/v0.9.3/api-deployments/#list-deployments) - return details of all running deployments
 * [Get](/documentation/api/v0.9.3/api-deployments/#get-single-deployment) - get details of a single running deployment
 * [Create](/documentation/api/v0.9.3/api-deployments/#create-deployment) - initiate a new deployment
 * [Create named deployment](/documentation/api/v0.9.3/api-deployments/#create-named-deployment) - initiate a new deployment with a custom name (non UUID)
 * [Update](/documentation/api/v0.9.3/api-deployments/#update-deployment) - add to a running deployment (merge)
 * [Delete](/documentation/api/v0.9.3/api-deployments/#delete-deployment) - remove elements from a running deployment

## Deployment resource

The resource example below is in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.3/using-the-api) for details on how to set this.

```
name: sava
kind: deployment
lookup_name: b745761242ab5566a44b556e62764beed46fa8de
clusters:
  sava:
    services:
    - status:
        intention: Deployment
        since: '2017-01-05T14:53:18.428Z'
        phase:
          name: Done
          since: '2017-01-05T14:53:24.534Z'
      breed:
        name: sava:1.0.0
        kind: breed
        deployable:
          type: container/docker
          definition: magneticio/sava:1.0.0
        ports:
          webport: 8080/http
        environment_variables: {}
        constants: {}
        arguments: []
        dependencies: {}
      environment_variables: {}
      scale:
        cpu: 0.2
        memory: 64.00MB
        instances: 1
      instances:
      - name: sava_sava-1-0-0-6fd83b1fd01f7dd9eb7f.b1fc514f-d356-11e6-b975-02426d22113f
        host: 192.168.99.100
        ports:
          webport: 31107
        deployed: true
      arguments:
      - privileged: 'true'
      dependencies: {}
      dialects: {}
    gateways:
      webport:
        sticky: null
        virtual_hosts:
        - webport.sava.sava.vamp
        routes:
          sava:1.0.0:
            lookup_name: fef540f1c9e4eb21e045d935eac990d0d5d25825
            weight: 100%
            balance: default
            condition: null
            condition_strength: 0%
            rewrites: []
    dialects: {}
ports:
  sava.webport: '40001'
environment_variables: {}
hosts:
  sava: 192.168.99.100
```

 Field name        | description
 -----------------|-----------------
 name |
 kind |
 lookup_name |
 clusters |
  |
 ports |
 environment_variables |
 hosts |

-----------------

## List deployments

Return a list of all running deployments. For details on pagination see [common parameters](/documentation/api/v0.9.3/using-the-api).

### Request
* `GET`
* `/api/v1/deployments`
* The request body should be empty.
* Query string parameters:

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `as_blueprint` | true or false     | false            | Exports each deployment as a valid blueprint
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. It will be applied only if `?as_blueprint=true`.
| `only_references` | true or false     | false            | all breeds will be replaced with their references. It will be applied only if `?as_blueprint=true`.


### Response
If successful, will return a list of [deployment resources](/documentation/api/v0.9.3/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

--------------

## Get single deployment

Return details of a specific running deployment.

### Request
* `GET`
* `/api/v1/deployments/{deployment_name}`
* The request body should be empty.
* Query string parameters:

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `as_blueprint` | true or false     | false            | Exports each deployment as a valid blueprint
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. It will be applied only if `?as_blueprint=true`.
| `only_references` | true or false     | false            | all breeds will be replaced with their references. It will be applied only if `?as_blueprint=true`.

### Response
If successful, will return the specified [deployment resource](/documentation/api/v0.9.3/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

### Errors
* The requested resource could not be found.

--------------

## Create deployment

Initiate a deployment.

### Request
* `POST`
* `/api/v1/deployments`
* The request body should include at least the [minimum blueprint resource](/documentation/api/v0.9.3/api-blueprints/#blueprint-resource) in the specified `content-type` format (default JSON).
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `201 Created` if the blueprint is valid.

### Response
If successful, will return the created [deployment resource](/documentation/api/v0.9.3/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

### Examples

See [gateways - A/B TEST TWO DEPLOYMENTS USING ROUTE WEIGHT](/documentation/using-vamp/gateways/#example-a-b-test-two-deployments-using-route-weight)

--------------

## Create named deployment

Initiate a deployment with a custom name (non UUID).

### Request
* `PUT`
* `/api/v1/deployments/{deployment_name}`
* The request body should include at least the [minimum blueprint resource](/documentation/api/v0.9.3/api-blueprints/#blueprint-resource) in the specified `content-type` format (default JSON).
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `202 Accepted` if the blueprint is valid for deployment.

### Response
If successful, will return the created [deployment resource](/documentation/api/v0.9.3/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

------------

## Update deployment

Add to a running deployment (merge).

### Request
* `PUT`
* `/api/v1/deployments/{deployment_name}`
* The request body should include at least the [minimum blueprint resource](/documentation/api/v0.9.3/api-blueprints/#blueprint-resource) in the specified `content-type` format (default JSON). The `name` field must match the `deployment_name` specified in the request syntax.
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `202 Accepted`  if the deployment after the update would be still valid.

### Response
If successful, will return the updated [deployment resource](/documentation/api/v0.9.3/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

--------------

## Delete deployment

Delete all or parts of a deployment.

### Request

* `DELETE`
* `/api/v1/deployments/{deployment_name}`
* The request body should contain at least a [minimum blueprint resource](/documentation/api/v0.9.3/api-blueprints/#blueprint-resource) containing the services to be removed from the deployment. To delete a full deployment, include the complete blueprint or deployment resource. Note that `DELETE` on deployment with an empty request body will not delete anything.
* Query string parameters:

| Request parameters     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `202 Accepted` if the deployment after the (partial) deletion would be still valid. Actual delete is not performed.

### Response

### Example - Delete service

This is our (abbreviated) deployment in YAML format. We have two clusters. The first cluster 'frontend' has two services.
We have left out some keys like `scale` among others as they have no effect on this specific use case.

		GET /api/v1/deployments/3df5c37c-5137-4d2c-b1e1-1cb3d03ffcd?as_blueprint=true

```yaml
name: 3df5c37c-5137-4d2c-b1e1-1cb3d03ffcdd
endpoints:
  frontend.port: '9050'
clusters:
  frontend:
    services:
    - breed:
        name: monarch_front:0.1
        deployable: magneticio/monarch:0.1
        ports:
          port: 8080/http
        constants: {}
        dependencies:
          backend:
            ref: monarch_backend:0.3
    - breed:
        name: monarch_front:0.2
        deployable: magneticio/monarch:0.2
        ports:
          port: 8080/http
        dependencies:
          backend:
            ref: monarch_backend:0.3
  backend:
    services:
    - breed:
        name: monarch_backend:0.3
        deployable: magneticio/monarch:0.3
        ports:
          jdbc: 8080/http
        environment_variables: {}
```

If we want to delete the first service in the `frontend` cluster, we use the following blueprint as the request body in the `DELETE` action.

	DELETE /api/v1/deployments/3df5c37c-5137-4d2c-b1e1-1cb3d03ffcdd

```yaml
name: 3df5c37c-5137-4d2c-b1e1-1cb3d03ffcdd
clusters:
  frontend:
    services:
    - breed:
        ref: monarch_front:0.1
```

If we want to delete the whole deployment, we just specify all the clusters and services.

	DELETE /api/v1/deployments/3df5c37c-5137-4d2c-b1e1-1cb3d03ffcdd


```yaml
name: 3df5c37c-5137-4d2c-b1e1-1cb3d03ffcdd
clusters:
  frontend:
    services:
    - breed:
        ref: monarch_front:0.1
    - breed:
        ref: monarch_front:0.2
  backend:
    services:
    - breed:
        ref: monarch_backend:0.3
```


--------------
