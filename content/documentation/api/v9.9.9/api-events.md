---
date: 2016-09-13T09:00:00+00:00
title: API - Events
menu:
  main:
    parent: "API"
    identifier: "api-reference-events"
    weight: 80
draft: true
---
Read about [using events](documentation/using-vamp/events/) and [the Vamp events system](/documentation/tutorials/create-a-workflow/#the-vamp-events-system).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-events/#list-events) - return a list of all events (can be filtered)
 * [Create](/documentation/api/v9.9.9/api-events/#create-event) - create a new event 

## Event resource
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this.

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
 tags |  yes  | An event must contain at least one tag. Combined tags (tag1:tag2) will be stored as tag1 and tag1:tag2. 
 value |  optional  | If not included, will be blank.
 timestamp |  optional  | If not included the current timestamp will be added.
 type |  optional  | If not included, will be set to the default type `event`.
  
---------------

## List events

Returns a list of all stored events.  You can optionally filter the events list by type or tag(s).  
For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters).

### Request
* `GET`
* `/api/v1/events`
* The request body should be empty.
* Optional headers:

| Request parameters         | description       |
| ----------------- |:-----------------:|
| `tag` | Filter returned events by tag(s), for example `GET /api/v1/events?tag=archiving&tag=breeds` |  
| `type` | Filter returned events by type, for example `GET /api/v1/events?type=metrics` | 

### Response


### Errors
* ???

---------------

## Create event

Creates a new events. 

### Request
* `POST`
* `/api/v1/events`
* The request body should include at least a minimum event resource
* Optional headers:

| Request parameters         | options           | default          | description       |
| ----------------- |:-----------------:|:----------------:| -----------------:|
|  |  |  |  |

### Response


### Errors
* ???
