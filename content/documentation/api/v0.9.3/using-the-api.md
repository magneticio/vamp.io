---
date: 2016-09-13T09:00:00+00:00
title: Common parameters
menu:
  main:
    parent: "API"
    identifier: "api-reference-common-parameters-093"
    weight: 20
---

The headers described below can be added to all API requests to [specify JSON or YAML](/documentation/api/v0.9.3/using-the-api/#request-and-response-format) for requests and responses, and [manage pagination](/documentation/api/v0.9.3/using-the-api/#pagination) for responses.

## Request and response format
Requests and responses can be formatted in JSON or YAML (default JSON). 

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `content-type`   | application/x-yaml or application/json   |      application/json       |  format of the request
| `accept`   | application/x-yaml or application/json   |      application/json            | format of the response


## Pagination

Vamp API endpoints support pagination. See Github's implementation for more info ([developer.github.com - traversing with pagination](https://developer.github.com/guides/traversing-with-pagination/)).

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
| `page`   | integer   |      1            | page to return. Starting from 1, not 0
| `per_page`   | integer   |      30            | results to return per page
| `X-Total-Count`   | integer   |                  |  the total amount of items (e.g. 349673)
| `Link`   |    |                  |  for easy traversing. For example, `X-Total-Count: 5522 Link: <http://vamp:8080/api/v1/events/get?page=1&per_page=5>; rel=first, <http://vamp:8080/api/v1/events/get?page=1&per_page=5>; rel=prev, <http://vamp:8080/api/v1/events/get?page=2&per_page=5>; rel=next, <http://vamp:8080/api/v1/events/get?page=19&per_page=5>; rel=last`

### Example request

```
GET http://vamp:8080/api/v1/breeds?page=5&per_page=20
```
