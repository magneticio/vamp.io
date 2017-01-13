---
date: 2016-09-13T09:00:00+00:00
title: API - Escalations
draft: true
---
Read about [using escalations](documentation/using-vamp/escalations/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-escalations/#list-escalations) - return a list of all escalations
 * [Get](/documentation/api/v9.9.9/api-escalations/#get-single-escalation) - get a single escalation
 * [Create](/documentation/api/v9.9.9/api-escalations/#create-escalation) - create a new escalation 
 * [Update](/documentation/api/v9.9.9/api-escalations/#update-escalation) - update a escalation
 * [Delete](/documentation/api/v9.9.9/api-escalations/#delete-escalation) - delete a escalation

## Escalation resource

The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource
The minimum fields required to successfully create an escalation.

```

```

### API return resource
The fields returned by the API after an escalation has been created (also visible in the UI)

```
 
```

 Field name        | description          
 -----------------|-----------------
  |  
  |
  
-----------------

## List Escalations

Returns a list of all stored escalation templates. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request
* `GET` 
* `/api/v1/escalations`
* The request body should be empty.
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |


### Response
If successful, will return a list of [escalation resources](/documentation/api/v9.9.9/api-escalations/#escalation-resource) in the specified `accept` format (default JSON).  

### Errors
* ???

-----------------

## Get single escalation

Returns a the named escalation resource.

### Request
* `GET` 
* `/api/v1/escalations/{escalation_name}`
* The request body should be empty.
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |


### Response
If successful, will return the named [escalation resource](/documentation/api/v9.9.9/api-escalations/#escalation-resource) in the specified `accept` format (default JSON).  

### Errors
* ???

-----------------

## Create escalation

Stores a new escalation template. Note that create operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
* `POST` 
* `/api/v1/escalations`
* The request body should include at least a mimnimum [escalation resource](/documentation/api/v9.9.9/api-escalations/#escalation-resource).
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |


### Response
A successful create operation has status code 201 `Created` and the response body will contain the created [escalation resource](/documentation/api/v9.9.9/api-escalations/#escalation-resource) in the specified `accept` format (default JSON). 

### Errors
* ???

-----------------

## Update escalation

Update a stored escalation.

### Request
* `PUT` 
* `/api/v1/escalations/{escalation_name}`
* The request body should include at least a mimnimum [escalation resource](/documentation/api/v9.9.9/api-escalations/#escalation-resource).
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |


### Response
A successful update operation has status code 200 `OK` or 202 `Accepted` and the response body will contain the updated [escalation resource](/documentation/api/v9.9.9/api-escalations/#escalation-resource) in the specified `accept` format (default JSON).

### Errors
* ???

-----------------

## Delete escalation

Delete a stored escalation. Note that delete operations are idempotent: sending a second request with the same content will not result in an error response (4xx).

### Request
* `DELETE` 
* `/api/v1/escalations/{escalation_name}`
* The request body should be empty.
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |


### Response
A successful delete operation has status code 204 `No Content` or 202 `Accepted` with an empty response body.

### Errors
* ???

-----------------

## Examples

???