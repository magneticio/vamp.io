---
date: 2016-09-13T09:00:00+00:00
title: Websockets
menu:
  main:
    parent: "API"
    identifier: "api-reference-websockets-093"
    weight: 30
---

WebSocket API requests and responses are transmitted as text messages containing both meta-information and a payload.  

* [WebSocket API requests](/documentation/api/v0.9.3/api-websockets/#websocket-api-requests)
* [Websocket API responses](/documentation/api/v0.9.3/api-websockets/#websocket-api-responses)

## WebSocket API requests
REST API requests can be mapped 1-on-1 to WebSocket API requests using the properties described below. Note that all enum (symbolic) values like `Json`, `Peek` etc. are case-insensitive. The Vamp API accepts requests in JSON or YAML. 

### Example - excplicitly request gateway driver info

* REST API request:
  `GET /api/v1/info?on=gateway_driver`
* WebSocket API request:

    ```
    {
      api: 'v1',
      path: 'info',
      action: 'peek`,
      accept: 'JSON',
      content: 'JSON',
      transaction: `123`,
      data: '',
      parameters: 'on=gateway_driver'
    }
    ```

### WebSocket API request properties

Property | Options | Description
------|------|------
 `api`   |  `v1`  |    API version, only `v1` is supported right now (corresponds to `api/v1`).
 `path`   |    |    The full REST path (without API version) for example `breeds` or `workflows/health`.
 `action`   |  `Peek`, `Put` or `Remove`  |    Corresponding to the REST methods: `Peek` =  `GET`, `Put` = `POST` or `PUT`, `Remove` = `DELETE`.
 `accept`   |   `Json`, `Yaml`, `PlainText`, `Javascript`  |  Expected response payload content type. REST: similar to the `Accept` header. `PlainText` and `Javascript` will be retrieved "as is" without any data encoding.      
 `content`   |  `Json`, `Yaml`, `PlainText`, `Javascript`   |  Content type of the payload (data), REST: similar to `Content-Type` header.       
 `transaction`   |    |   Arbitrary ID (defined by client), server will set the same value in its response(s).     
 `data`   |    |    Payload, REST: body.
 `parameters`   |    |   Map of additional parameters, REST: query string, e.g. `validate_only=true`.     
    

## WebSocket API responses
REST API responses can be mapped 1-on-1 to WebSocket API responses using the properties described below. Note that all enum (symbolic) values like `Json`, `Peek` etc. are case-insensitive. Vamp API responses can be formatted in JSON or YAML. 

Property | Options | Description
------|------|------
 `api`   |  `v1`  |    API version, only `v1` is supported right now (corresponds to `api/v1`).
 `path`   |    |    The same path as in the corresponding request.
 `action`   |  `Peek`, `Put` or `Remove`  |    Action value from the request.
 `status`   |   `Ok`, `Accepted`, `NoContent` or `Error`  |  Response status.      
 `content`   |  `Json`, `Yaml`, `PlainText`, `Javascript`   |  Content type of the payload (data) - same as in the corresponding request.     
 `transaction`   |    |   Request ID.
 `data`   |    |    Payload, text encoded as specified in `content` parameter.
 `parameters`   |    |   Map of additional parameters and response headers (as would be expected from equivalent REST response)
