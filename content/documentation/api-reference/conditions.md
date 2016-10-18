---
title: Conditions
weight: 70
menu:
  main:
    parent: api-reference
---

# Conditions

Please check the notes on using [pagination](/documentation/api-reference/#pagination) and [json and yaml content types](/documentation/api-reference/#content-types) on how to effectively use the REST api.

## List conditions

Lists all conditions without any pagination or filtering.

    GET /api/v1/conditions

## Get a single condition

Lists all details for one specific condition.

    GET /api/v1/conditions/{condition_name}

## Create condition

Creates a new condition.

    POST /api/v1/conditions

Accepts JSON or YAML formatted conditions. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.

| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| validate_only | true or false     | false            | validates the escalation and returns a `201 Created` if the escalation is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON. 

## Update a condition

Updates the content of a specific condition.

    PUT /api/v1/conditions/{condition_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| validate_only | true or false     | false            | validates the escalation and returns a `200 OK` if the escalation is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON. 

## Delete a condition

Deletes a condition.

    DELETE /api/v1/conditions/{condition_name}

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| validate_only | true or false     | false            | returns a `204 No Content` without actual delete of the escalation.
