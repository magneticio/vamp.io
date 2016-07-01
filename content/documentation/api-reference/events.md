---
title: Events
weight: 100
menu:
  main:
    parent: api-reference
---

# Events

Please check the notes on using [pagination](/documentation/api-reference/#pagination) and [json and yaml content types](/documentation/api-reference/#content-types) on how to effectively use the REST api.

## List events

Lists metrics and/or events without any pagination or filtering.

    GET /api/v1/events/get

| parameter     | description      |
| ------------- |:----------------:|
| tags          | Event tags, e.g. `GET /api/v1/events?tags=archiving&tags=breeds`
<br>

> Note: search criteria can be set in request body, checkout [examples](http://vamp.io/documentation/using-vamp/metrics-and-events/#query-metrics-events-using-tags) for event stream.

## Create events

    POST /api/v1/events    
    
## Server-sent events (SSE)

    GET  /api/v1/events/stream
    
    POST /api/v1/events/stream
