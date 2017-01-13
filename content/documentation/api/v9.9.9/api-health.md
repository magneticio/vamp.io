---
date: 2016-09-13T09:00:00+00:00
title: API - Health
draft: true
---
Health is a specific type of Vamp event, calculated by a Vamp workflow and required for the Vamp UI. Health can be defined on gateways and deployment ports and retrieved via the API. Read about [using workflows](documentation/using-vamp/workflows/).

## Actions
 
 * [Gateway health](/documentation/api/v9.9.9/api-health/#gateway-health) - return a list of all events
 * [Route health](/documentation/api/v9.9.9/api-health/#route-health) - get a single event
 * [Deployment health](/documentation/api/v9.9.9/api-health/#list-events) - return a list of all events
 * [Cluster health](/documentation/api/v9.9.9/api-health/#get-event) - get a single event
 * [Service health](/documentation/api/v9.9.9/api-health/#create-event) - create a new event 

## Response
Health is returned as a value between 1 and 0, where 1 is 100% healthy.


## Gateway health

Returns the health for the specified gateway.

### Request syntax
    GET /api/v1/health/gateways/{gateway_name}

### Request body
The request body should be empty.

### Response syntax
Health is value between 1 and 0, where 1 is 100% healthy.

### Errors
* ???

## Examples

???