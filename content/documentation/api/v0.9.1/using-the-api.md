---
date: 2016-10-19T09:00:00+00:00
title: Using the Vamp API
menu:
  main:
    parent: "API"
    identifier: "using-vamp-api-0.9.1"
    weight: 22
---

{{< note title="The information on this page is written for Vamp v0.9.1" >}}

* Switch to the [latest version of this page](/documentation/api/using-the-api).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

{{< note title="New in Vamp 0.9.1" >}}
We've now added support for Websockets to our HTTP API. More information will follow soon.
{{< /note >}}

Vamp has one REST API. This page explains how to specify pagination, and json and yaml content types, and how to effectively use the Vamp REST API.

#### See also
* [Full details of all available API calls](/documentation/api/v0.9.1/api-reference/)

## Content types

* Vamp requests can be in YAML format or JSON format. Set the `Content-Type` request header to `application/x-yaml` or `application/json` accordingly.
* Vamp responses can be in YAML format or JSON format. Set the `Accept` request header to `application/x-yaml` or `application/json` accordingly.

## Pagination

Vamp API endpoints support pagination with the following scheme:

* Request parameters `page` (starting from 1, not 0) and `per_page` (by default 30) e.g:

```
GET http://vamp:8080/api/v1/breeds?page=5&per_page=20
```

* Response headers `X-Total-Count` giving the total amount of items (e.g. 349673) and a `Link` header for easy traversing, e.g.
```
X-Total-Count: 5522
Link:
  <http://vamp:8080/api/v1/events/get?page=1&per_page=5>; rel=first,
  <http://vamp:8080/api/v1/events/get?page=1&per_page=5>; rel=prev,
  <http://vamp:8080/api/v1/events/get?page=2&per_page=5>; rel=next,
  <http://vamp:8080/api/v1/events/get?page=19&per_page=5>; rel=last
```

See [Github's implementation](https://developer.github.com/guides/traversing-with-pagination/) for more info.

## Return codes

* Create & Delete operations are idempotent: sending the second request with the same content will not result to an error response (4xx).
* An update will fail (4xx) if a resource does not exist.
* A successful create operation has status code 201 `Created` and the response body contains the created resource.
* A successful update operation has status code 200 `OK` or 202 `Accepted` and the response body contains the updated resource.
* A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

## Sending multiple artifacts (documents) - `POST`, `PUT` and `DELETE`

It is possible to send YAML document containing more than 1 artifact definition:

```
GET /api/v1
```

Supported methods are `POST`, `PUT` and `DELETE`. Example:

```yaml
---
name: ...
kind: breed
# breed definition ...
---
name: ...
kind: blueprint
# blueprint definition ...
```

Additional `kind` field is required and it always correspond (singular form) to type of the artifact.
For instance if specific endpoint would be `/api/v1/deloyments` then the same deployment request can be sent to `api/v1` with additional `kind: deployment`.
If specific endpoints are used (e.g. `/api/v1/blueprints`) then `kind` needs to be ommited.

-------------

#### See also
* [Full details of all available API calls](/documentation/api/v0.9.1/api-reference/)
