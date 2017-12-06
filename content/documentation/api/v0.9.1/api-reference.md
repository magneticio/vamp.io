---
date: 2016-09-13T09:00:00+00:00
title: API Reference
menu:
  sidenav:
    parent: "API"
    identifier: "api-reference-0.9.1"
    weight: 12
---

{{< note title="The information on this page is written for Vamp v0.9.1" >}}

* Switch to the [latest version of this page](/documentation/api/api-reference).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

This page gives full details of all available API calls. See [using the Vamp API](/documentation/api/v0.9.1/using-the-api) for details on pagination, JSON and YAML content types and effective use of the API.

* **Resource descriptions:** [blueprints](/documentation/api/v0.9.1/api-reference/#blueprints), [breeds](/documentation/api/v0.9.1/api-reference/#breeds), [conditions](/documentation/api/v0.9.1/api-reference/#conditions), [escalations](/documentation/api/v0.9.1/api-reference/#escalations), [scales](/documentation/api/v0.9.1/api-reference/#scales), [slas](/documentation/api/v0.9.1/api-reference/#slas)
* **Runtime entities:** [deployments](/documentation/api/v0.9.1/api-reference/#deployments), [deployment scales](/documentation/api/v0.9.1/api-reference/#deployment-scales), [deployment SLAs](/documentation/api/v0.9.1/api-reference/#deployment-slas), [gateways](/documentation/api/v0.9.1/api-reference/#gateways)
* **Data:** [events](/documentation/api/v0.9.1/api-reference/#events), [health](/documentation/api/v0.9.1/api-reference/#health), [metrics](/documentation/api/v0.9.1/api-reference/#metrics)
* **System:** [info, config, haproxy](/documentation/api/v0.9.1/api-reference/#system)
* **Debug:** [sync, sla, escalation](/documentation/api/v0.9.1/api-reference/#debug)

--------------

## Blueprints
Read about [using blueprints](/documentation/using-vamp/v0.9.1/blueprints/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List blueprints

Lists all blueprints without any pagination or filtering.

    GET /api/v1/blueprints

| parameter         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some breeds are not yet fully defined.
| `only_references`   | true or false     | false            | all breeds will be replaced with their references.

### Get a single blueprint

Lists all details for one specific blueprint.

    GET /api/v1/blueprints/{blueprint_name}

| parameter         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some breeds are not yet fully defined.
| `only_references`   | true or false     | false            | all breeds will be replaced with their references.

### Create blueprint

Creates a new blueprint. Accepts JSON or YAML formatted blueprints. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.


    POST /api/v1/blueprints


| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `201 Created` if the blueprint is valid.This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update a blueprint

Updates the content of a specific blueprint.

    PUT /api/v1/blueprints/{blueprint_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `200 OK` if the blueprint is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete a blueprint

Deletes a blueprint.

    DELETE /api/v1/blueprints/{blueprint_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the blueprint.

------------

## Breeds
Read about [using breeds](/documentation/using-vamp/v0.9.1/breeds/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List breeds

Lists all breeds without any pagination or filtering.

    GET /api/v1/breeds

| parameter         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed dependencies will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some dependencies are not yet fully defined.
| `only_references`   | true or false     | false            | all full breed dependencies will be replaced with their references.

### Get a single breed

Lists all details for one specific breed.

    GET /api/v1/breeds/{breed_name}

| parameter         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `expand_references` | true or false     | false            | all breed dependencies will be replaced (recursively) with full breed definitions. `400 Bad Request` in case some dependencies are not yet fully defined.
| `only_references`   | true or false     | false            | all full breed dependencies will be replaced with their references.

### Create breed

Creates a new breed. Accepts JSON or YAML formatted breeds. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.

    POST /api/v1/breeds

| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `201 Created` if the breed is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update a breed

Updates the content of a specific breed.

    PUT /api/v1/breeds/{breed_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the breed and returns a `200 OK` if the breed is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete a breed

Deletes a breed.

    DELETE /api/v1/breeds/{breed_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the breed.

---------

## Conditions
Read about [using conditions](/documentation/using-vamp/v0.9.1/conditions/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List conditions

Lists all conditions without any pagination or filtering.

    GET /api/v1/conditions

### Get a single condition

Lists all details for one specific condition.

    GET /api/v1/conditions/{condition_name}

### Create condition

Creates a new condition. Accepts JSON or YAML formatted conditions. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.

    POST /api/v1/conditions

| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `201 Created` if the escalation is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update a condition

Updates the content of a specific condition.

    PUT /api/v1/conditions/{condition_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `200 OK` if the escalation is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete a condition

Deletes a condition.

    DELETE /api/v1/conditions/{condition_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the escalation.

----------


## Escalations

Read about [using escalations](/documentation/using-vamp/v0.9.1/escalations/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List escalations

Lists all escalations without any pagination or filtering.

    GET /api/v1/escalations

### Get a single escalation

Lists all details for one specific escalation.

    GET /api/v1/escalations/{escalation_name}

### Create escalation

Creates a new escalation. Accepts JSON or YAML formatted escalations. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.

    POST /api/v1/escalations

| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `201 Created` if the escalation is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update an escalation

Updates the content of a specific escalation.

    PUT /api/v1/escalations/{escalation_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the escalation and returns a `200 OK` if the escalation is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete an escalation

Deletes an escalation.

    DELETE /api/v1/escalations/{escalation_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the escalation.

-----------

## Scales

Read about [using scales](/documentation/using-vamp/v0.9.1/blueprints/#scale).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List scales

Lists all scales without any pagination or filtering.

    GET /api/v1/scales

### Get a single scale

Lists all details for one specific scale.

    GET /api/v1/scales/{scale_name}

### Create scale

Creates a new scale. Accepts JSON or YAML formatted scales. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.

    POST /api/v1/scales

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the scale and returns a `201 Created` if the scale is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update a scale

Updates the content of a specific scale.

    PUT /api/v1/scales/{scale_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the scale and returns a `200 OK` if the scale is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete a scale

Deletes a scale.

    DELETE /api/v1/scales/{scale_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the scale.

-------------

## SLAs

Read about [using SLAs](/documentation/using-vamp/v0.9.1/sla/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List SLAs

Lists all slas without any pagination or filtering.

    GET /api/v1/slas

### Get a single SLA

Lists all details for one specific breed.

    GET /api/v1/slas/{sla_name}

### Create an SLA

Creates a new SLA

    POST /api/v1/slas

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the SLA and returns a `201 Created` if the SLA is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update an SLA

Updates the content of a specific SLA.

    PUT /api/v1/slas/{sla_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the SLA and returns a `200 OK` if the SLA is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete an SLA

Deletes an SLA.

    DELETE /api/v1/slas/{sla_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the SLA.


-------------

## Deployments

Deployments are non-static entities in the Vamp eco-system. They represent runtime structures so any changes to them will take time to execute and can possibly fail. Most API calls to the `/deployments` endpoint will therefore return a `202: Accepted` return code, indicating the asynchronous nature of the call.

Deployments have a set of sub resources: **SLAs**, **scales** and **gateways**. These are instantiations of their static counterparts.

Read more about [using deployments](/documentation/using-vamp/v0.9.1/deployments/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List deployments

	GET /api/v1/deployments

| parameter         | options           | default          | description      |
| ----------------- |:-----------------:|:----------------:| ----------------:|
| `as_blueprint`      | true or false     | false            | exports each deployment as a valid blueprint. This can be used together with the header `Accept: application/x-yaml` to export in YAML format instead of the default JSON. |
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. It will be applied only if `?as_blueprint=true`.
| `only_references`  | true or false     | false            | all breeds will be replaced with their references. It will be applied only if `?as_blueprint=true`.

### Get a single deployment

Lists all details for one specific deployment.

    GET /api/v1/deployments/{deployment_name}

| parameter         | options           | default          | description      |
| ----------------- |:-----------------:|:----------------:| ----------------:|
| `as_blueprint`     | true or false     | false            | exports the deployment as a valid blueprint. This can be used together with the header `Accept: application/x-yaml` to export in YAML format instead of the default JSON. |
| `expand_references` | true or false     | false            | all breed references will be replaced (recursively) with full breed definitions. It will be applied only if `?as_blueprint=true`.
| `only_references`   | true or false     | false            | all breeds will be replaced with their references. It will be applied only if `?as_blueprint=true`.

### Create deployment using a blueprint

Creates a new deployment

	POST /api/v1/deployments

Create a named (non UUID) deployment

	PUT /api/v1/deployments/{deployment_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `202 Accepted` if the blueprint is valid for deployment. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update a deployment using a blueprint

Updates the settings of a specific deployment.

    PUT /api/v1/deployments/{deployment_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `202 Accepted` if the deployment after the update would be still valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete a deployment using a blueprint

Deletes all or parts of a deployment.

    DELETE /api/v1/deployments/{deployment_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the blueprint and returns a `202 Accepted` if the deployment after the (partial) deletion would be still valid. Actual delete is not performed.

In contrast to most API's, doing a `DELETE` in Vamp takes a request body that designates what part of the deployment should be deleted. This allows you to remove specific services, clusters of the whole deployment.

{{< note title="Note!" >}}
`DELETE` on deployment with an empty request body will not delete anything.
{{< /note >}}

The most common way to specify what you want to delete is by exporting the target deployment as a blueprint using the `?as_blueprint=true` parameter. You then either programmatically or by hand edit the resulting blueprint and specify which of the services you want to delete. You can also use the blueprint as a whole in the `DELETE` request. The result is the removal of the full deployment.

#### example - delete service

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

-------------

## Deployment scales

Deployment scales are singular resources: you only have one scale per service. Deleting a scale is not a meaningful action.

### Get a deployment scale

Lists all details for a specific deployment scale that's part of a service inside a cluster.

	GET /api/v1/deployments/{deployment_name}/clusters/{cluster_name}/services/{service_name}/scale

### Set a deployment scale

Updates a deployment scale.

	POST|PUT /api/v1/deployments/{deployment_name}/clusters/{cluster_name}/services/{service_name}/scale

--------------

## Deployment SLAs

### Get a deployment SLA

Lists all details for a specific SLA that's part of a specific cluster.

	GET /api/v1/deployments/{deployment_name}/clusters/{cluster_name}/sla

### Set a deployment SLA

Creates or updates a specific deployment SLA.

	POST|PUT /api/v1/deployments/{deployment_name}/clusters/{cluster_name}/sla

### Delete a deployment SLA

Deletes as specific deployment SLA.

	DELETE /api/v1/deployments/{deployment_name}/clusters/{cluster_name}/sla

--------------

## Gateways
Read about [using gateways](/documentation/using-vamp/v0.9.1/gateways/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List gateways

    GET /api/v1/gateways

### Get a single gateway

    GET /api/v1/gateways/{gateway_name}

### Create gateway
Accepts JSON or YAML formatted gateways. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.

    POST /api/v1/gateways


| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| `validate_only` | true or false     | false            | validates the gateway and returns a `201 Created` if the gateway is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Update a gateway

    PUT /api/v1/gateways/{gateway_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | validates the gateway and returns a `200 OK` if the gateway is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON.

### Delete a gateway

    DELETE /api/v1/gateways/{gateway_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| `validate_only` | true or false     | false            | returns a `204 No Content` without actual delete of the gateway.

---------

## Events

For specific usage examples, see [using events](/documentation/using-vamp/v0.9.1/events/).
Details on pagination, JSON and YAML content types and effective use of the API can be found in [using the Vamp API](/documentation/api/v0.9.1/using-the-api).

### List events

Lists events (for example health and metrics). You can optionally filter the returned events by tag(s) or type.

    GET /api/v1/events

| parameter     | description      |
| ------------- |:----------------:|
| `tags`           | Filter returned events by tag(s), for example `GET /api/v1/events?tags=archiving&tag=breeds`
| `type`           | Filter returned events by type, for example `GET /api/v1/events?type=metrics`

{{< note title="Note!" >}}
search criteria can be set in request body, checkout [examples](/documentation/using-vamp/v0.9.1/events/#query-events-using-tags) for event stream.
{{< /note >}}

### Create events

    POST /api/v1/events

### Server-sent events (SSE)

    GET  /api/v1/events/stream

-----------
## Health

Health is a specific type of Vamp event, calculated by a Vamp workflow and required for the Vamp UI.
Health can be defined on gateways and deployment ports and retrieved:

```
/api/v1/health/gateways/{gateway}
/api/v1/health/gateways/{gateway}/routes/$route

/api/v1/health/deployments/{deployment}
/api/v1/health/deployments/{deployment}/clusters/{cluster}
/api/v1/health/deployments/{deployment}/clusters/{cluster}/services/{service}
```

Health is value between 1 (100% healthy) and 0.
{{< note title="Note!" >}}
Health is calculated using external services, e.g. Vamp workflows.
{{< /note >}}

-----------

## Metrics

Metrics can be defined on gateways and deployment ports and retrieved:

```
/api/v1/metrics/gateways/{gateway}/{metrics}
/api/v1/metrics/gateways/{gateway}/routes/$route/{metrics}

/api/v1/metrics/deployments/{deployment}/clusters/{cluster}/ports/{port}/{metrics}
/api/v1/metrics/deployments/{deployment}/clusters/{cluster}/services/{service}/ports/{port}/{metrics}
```

#### Example
    /api/v1/metrics/deployments/sava/clusters/frontend/ports/api/response-time

{{< note title="Note!" >}}
Metrics are calculated using external services, e.g. Vamp workflows.
{{< /note >}}



---------------

## System

Vamp provides a set of API endpoints that help with getting general health/configuration status.

### Get runtime info

Lists information about Vamp's JVM environment and runtime status.
Also lists info for configured persistence layer and container driver status.

	GET /api/v1/info

Sections are `jvm`, `persistence`, `key_value`, `pulse`, `gateway_driver`, `container_driver` and `workflow_driver`:

```yaml
{
    "message": "...",
    "version": "...",
    "uuid": "...",
    "running_since": "...",
    "jvm": {...},
    "persistence": {...},
    "key_value": {...},
    "pulse": {...},
    "gateway_driver": {...},
    "container_driver": {...},
    "workflow_driver": {...}
}
```

#### Example - explicitly request specific sections
Explicitly requesting `jvm` and `persistence` using parameter(s) `on`:

	GET /api/v1/info?on=jvm&on=persistence

### Get Vamp configuration

	GET /api/v1/config

### Get HAProxy configuration
You can retrieve the HAProxy configuration generated by Vamp. Details will only be returned for the HAProxy version specified in your Vamp configuration.

	GET /api/v1/haproxy/{version_number}

## Debug

### Force sync

Forces Vamp to perform a synchronization cycle, regardless of the configured default interval.

	GET /api/v1/sync

### Force SLA check

Forces Vamp to perform an SLA check, regardless of the configured default interval.

	GET /api/v1/sla

### Force escalation

Forces Vamp to perform an escalation check, regardless of the configured default interval.

	GET /api/v1/escalation

---------------
See [using the Vamp API](/documentation/api/v0.9.1/using-the-api) for details on pagination, JSON and YAML content types and effective use of the API
