---
date: 2016-09-13T09:00:00+00:00
title: Events
menu:
  main:
    parent: "API"
    identifier: "api-reference-events-094"
    weight: 130
---
Read about [using events](/documentation/using-vamp/events/) and [the Vamp events system](/documentation/tutorials/create-a-workflow/#the-vamp-events-system).

## Actions

 * [List](/documentation/api/v0.9.4/api-events/#list-events) - return a list of all events (can be filtered)
 * [Create](/documentation/api/v0.9.4/api-events/#create-event) - create a new event
 * [stream](/documentation/api/v0.9.4/api-events/#stream-events) - open SSE events stream

## Event resource
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.4/using-the-api) for details on how to set this.

### Minimum resource
The minimum fields required to successfully store a event.

```
- tags:
  - custom_tag
```

### API return resource
The fields returned by the API for stored events.

```
- tags:
  - scales
  - scales:large
  - archive
  - archive:delete
  value: ''
  timestamp: '2017-01-10T15:33:49.766Z'
  type: archive
```

 Field name    |  required?  | description
 --------------|---|-----------------
 tags |  Required  | An event must contain at least one tag. Combined tags (tag1:tag2) will be stored as tag1 and tag1:tag2.
 value |  Optional  | If not included, will be blank.
 timestamp |  Optional  | If not included the current timestamp will be added.
 type |  Optional  | If not included, will be set to the default type `event`.

---------------

## List events

Return a list of all stored events.  You can optionally filter the events list by type or tag(s).
For details on pagination see [common parameters](/documentation/api/v0.9.4/using-the-api).

### Request
* `GET`
* `/api/v1/events`
  You can optionally filter returned events by tag(s) or type, for example:
  `GET /api/v1/events?tag=archiving&tag=breeds` or
  `GET /api/v1/events?type=metrics`
* The request body should be empty or specify an event `type:` to filter the results by type.

### Response
Will return a (filtered) list of [event resources](/documentation/api/v0.9.4/api-events/#event-resource)].

---------------

## Create event

Create a new event.

### Request
* `POST`
* `/api/v1/events`
* The request body should include at least a [minimum event resource](/documentation/api/v0.9.4/api-events/#event-resource).

### Response
Will return the created [event resource](/documentation/api/v0.9.4/api-events/#event-resource) in the specified `accept` format (default JSON).

---------------

## Stream events

Open a Server-sent events (SSE) connection to receive updates to the Vamp events stream, for example in Google Chrome.

### Request
* `<vamp url>/api/v1/events/stream`
  You can optionally filter returned events by tag(s), for example:
  `GET /api/v1/events/stream?tag=archiving&tag=breeds`

### Response
Transmits (filtered) updates to the Vamp events stream.


---------------
