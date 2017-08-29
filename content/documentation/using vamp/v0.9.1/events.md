---
date: 2016-09-13T09:00:00+00:00
title: Events
menu:
  main:
    parent: "Using Vamp"
    weight: 80
---

{{< note title="The information on this page is written for Vamp v0.9.1" >}} 

* Switch to the [latest version of this page](/documentation/using-vamp/events).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp collects events on all running services. Interaction with the API also creates events, like updating blueprints or deleting a deployment. Furthermore, Vamp allows third party applications to create events and trigger Vamp actions.

All events are stored and retrieved using the Event API that is part of Vamp.

#### Example - JSON "deployment create" event

```JSON
{
  "tags": [
    "deployments",
    "deployments:6ce79a33-5dca-4eb2-b072-d5f65e4eef8a",
    "archiving",
    "archiving:create"
  ],
  "value": "name: sava",
  "timestamp": "2015-04-21T09:15:42Z"
}
```

## Basic event rules

All events stick to some basic rules:


* All data in Vamp are events. 
* Values can be any JSON object or it can be empty.
* Timestamps are in ISO8601/RFC3339.
* Timestamps are optional. If not provided, Vamp will insert the current time.
* Timestamps are inclusive for querying.
* Events can be tagged with metadata. A simple tag is just single string.
* Querying data by tag assumes "AND" behaviour when multiple tags are supplied, i.e. ["one", "two"] would only fetch records that are tagged with both.
* Supported event aggregations are: `average`, `min`, `max` and `count`.

## How tags are organised

In all of Vamp's components we follow a REST (resource oriented) schema, for instance:
```
/deployments/{deployment_name} 
/deployments/{deployment_name}/clusters/{cluster_name}/services/{service_name}
```
Tagging is done using a very similar schema: "{resource_group}", "{resource_group}:{name}". For example:

```
[
    "deployments", 
    "deployments:{deployment_name}", 
    "clusters", 
    "clusters:{cluster_name}", 
    "services", 
    "services:{service_name}"
]
```

This schema allows querying per group and per specific name. Getting all events related to all deployments is done by using tag "deployments". Getting events for specific deployment "deployments:{deployment_name}".

## Query events using tags

Using the tags schema and timestamps, you can do some powerful queries. Either use an exact timestamp or use special range query operators, described on the elastic.co site ([elastic.co - Range query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html)).

{{< note title="Note!" >}}
the default page size for a set of returned events is 30.
{{< /note >}}


### Example queries

* [Get all events](/documentation/using-vamp/v0.9.1/events/#example-1)
* [Response time for a cluster](/documentation/using-vamp/v0.9.1/events/#example-2)
* [Current sessions for a service](/documentation/using-vamp/v0.9.1/events/#example-3)
* [ll known events for a service](/documentation/using-vamp/v0.9.1/events/#example-4)
 
#### Example 1
**Get all events**

The below query gets ALL metrics events up till now, taking into regard the pagination.

{{< note title="Note!" >}}
GET request with body - similar to approach used by Elasticsearch.
{{< /note >}}


`GET /api/v1/events`

```json
{
  "tags": ["metrics"],
    "timestamp" : {
      "lte" : "now"
    }
}
```

#### Example 2 
**Response time for a cluster**

The below query gets the most recent response time events for the "frontend" cluster in the "d9b42796-d8f6-431b-9230-9d316defaf6d" deployment.

**Notice** the "gateways:<UUID>", "metrics:responseTime" and "gateways" tags. This means "give me the response time of this specific gateway at the gateway level". The response will echo back the events in the time range with the original set of tags associated with the events. 

`GET /api/v1/events`

```json
{
  "tags": ["routes:d9b42796-d8f6-431b-9230-9d316defaf6d_frontend_8080","metrics:rtime","route"],
    "timestamp" : {
      "lte" : "now"
    }
}
```


```json
[
    {
        "tags": [
            "gateways",
            "gateways:d9b42796-d8f6-431b-9230-9d316defaf6d_frontend_8080",
            "metrics:rate",
            "metrics",
            "gateway"
        ],
        "value": 0,
        "timestamp": "2015-06-08T10:28:35.001Z",
        "type": "gateway-metric"
    },
    {
        "tags": [
            "gateways",
            "gateways:d9b42796-d8f6-431b-9230-9d316defaf6d_frontend_8080",
            "metrics:rate",
            "metrics",
            "gateway"
        ],
        "value": 0,
        "timestamp": "2015-06-08T10:28:32.001Z",
        "type": "gateway-metric"
    }
]    
```

#### Example 3
**Current sessions for a service**

Another example is getting the current sessions for a specific service, in this case the `monarch_front:0.2` service that is part of the `214615ec-d5e4-473e-a98e-8aa4998b16f4` deployment and lives in the `frontend` cluster.

**Notice** we made the search more specific by specifying the "services" and then "service:<SERVICE NAME>" tag.
Also, we are using relative timestamps: anything later or equal (lte) than "now".

`GET /api/v1/events`

```json
{
  "tags": ["routes:214615ec-d5e4-473e-a98e-8aa4998b16f4_frontend_8080","metrics:scur","services:monarch_front:0.2","service"],
    "timestamp" : {
      "lte" : "now"
    }
}
```

#### Example 4
**All known events for a service**

This below query gives you all the events we have for a specific service, in this case the same service as in example 2. In this way you can get a quick "health snapshot" of service, server, cluster or deployment.

**Notice** we made the search less specific by just providing the "metrics" tag and not telling the API which specific one we want.

`GET /api/v1/events`

```json
{
  "tags": ["routes:214615ec-d5e4-473e-a98e-8aa4998b16f4_frontend_8080","metrics","services:monarch_front:0.2","service"],
    "timestamp" : {
      "lte" : "now"
    }
}
```

## Server-sent events (SSE)

Events can be streamed back directly from Vamp.

`GET /api/v1/events/stream`

In order to narrow down (filter) events, list of tags could be provided in the request body.

```json
{
  "tags": ["routes:214615ec-d5e4-473e-a98e-8aa4998b16f4_frontend_8080","metrics"]
}
```

GET method can be also used with `tag` parameter (may be more convenient):

`GET /api/v1/events/stream?tag=archiving&tag=breeds`

## Archiving

All changes in artifacts (creation, update or deletion) triggered by REST API calls are archived. We store the type of event and the original representation of the artifact. It's a bit like a Git log. 

Here is an example event:

```json
{
  "tags": [
    "deployments",
    "deployments:6ce79a33-5dca-4eb2-b072-d5f65e4eef8a",
    "archiving",
    "archiving:delete"
  ],
  "value": "",
  "timestamp": "2015-04-21T09:17:31Z",
  "type": ""
}
```

Searching through the archive is 100% the same as searching for events. The same tagging scheme applies.
The following query gives back the last set of delete actions executed in the Vamp API, regardless of the artifact type.

`GET /api/v1/events`


```json
{
  "tags": ["archiving","archiving:delete"],
    "timestamp" : {
      "lte" : "now"
    }
}
```


{{< note title="What next?" >}}
* Read about [Vamp SLA (Service Level Agreement)](/documentation/using-vamp/v0.9.1/sla/)
* Check the [API documentation](/documentation/api/v0.9.1/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
