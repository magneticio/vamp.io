---
date: 2016-09-13T09:00:00+00:00
title: API - Metrics
draft: true
---
Metrics can be defined on gateways and deployment ports and retrieved via the API. Metrics are calculated using external services such as workflows. Read about [using workflows](documentation/using-vamp/workflows/).

## Actions
 
 * [Gateway metrics](/documentation/api/v9.9.9/api-metrics/#gateway-metrics) - return a list of all events
 * [Route metrics](/documentation/api/v9.9.9/api-metrics/#route-metrics) - get a single event
 * [Cluster port metrics](/documentation/api/v9.9.9/api-metrics/#cluster-port-metrics) - get a single event
 * [Service port metrics](/documentation/api/v9.9.9/api-metrics/#service-port-metrics) - create a new event 

## Response
???

## Gateway metrics

Returns the specified metrics for the specified gateway.

### Request syntax
    GET /api/v1/metrics/gateways/{gateway_name}/{metrics}

 Field name        | description          
 -----------------|-----------------
{gateway_name}  |  
{metrics}  |

### Request body
The request body should be empty.

### Response syntax
???

### Errors
* ???

## Examples

???