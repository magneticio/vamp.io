---
title: Gateways
weight: 45
menu:
  main:
    parent: api-reference
---

## List gateways

    GET /api/v1/gateways

## Get a single gateway

    GET /api/v1/gateways/:name

## Create gateway

    POST /api/v1/gateways

Accepts JSON or YAML formatted gateways. Set the `Content-Type` request header to `application/json` or `application/x-yaml` accordingly.    

| parameter     | options           | default          | description       |
| ------------- |:-----------------:|:----------------:| -----------------:|
| validate_only | true or false     | false            | validates the gateway and returns a `201 Created` if the gateway is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON. 

## Update a gateway

    PUT /api/v1/gateways/:name

| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| validate_only | true or false     | false            | validates the gateway and returns a `200 OK` if the gateway is valid. This can be used together with the header `Accept: application/x-yaml` to return the result in YAML format instead of the default JSON. 

## Delete a gateway     

    DELETE /api/v1/gateways/:name
    
| parameter     | options           | default          | description      |
| ------------- |:-----------------:|:----------------:| ----------------:|
| validate_only | true or false     | false            | returns a `204 No Content` without actual delete of the gateway.
