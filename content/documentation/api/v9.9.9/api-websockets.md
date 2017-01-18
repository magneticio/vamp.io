---
date: 2016-09-13T09:00:00+00:00
title: API - Websockets
menu:
  main:
    parent: "API"
    identifier: "api-reference-websockets"
    weight: 999
draft: true
---

Every request and response via WebSocket API is done by transmitting text messages. 
They all contains meta-information and payload. 
All REST requests and responses can be mapped 1-on-1 to WebSocket request and responses using the following properties.

1) Requests:

- `api` - API version, only `v1` is supported and allowed right now (corresponds to `api/v1`)
- `path` - full REST path (without api version) that could be used, e.g. `breeds` or `workflows/health`
- `action` - `Peek`, `Put` or `Remove` - REST: `GET`, `POST|PUT` or `DELETE`
- `accept` - `Json`, `Yaml`, `PlainText` or `Javascript` - expected response payload content type, REST: similar to `Accept` header; `PlainText` and `Javascript` will be retrieved "as is" without any data encoding.
- `content` - `Json`, `Yaml`, `PlainText` or `Javascript` - content type of the payload (data), REST: similar to `Content-Type` header
- `transaction` - arbitrary id (defined by client), server will set the same value in its response(s)
- `data` - payload, REST: body
- `parameters`- map of additional parameters, REST: query string, e.g. `validate_only=true`

Request can be sent either as JSON or YAML.

Example:
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

Using REST API this is equivalent to: `/api/v1/info?on=gateway_driver`

2) Responses:

- `api` - API version, only `v1` is supported right now
- `path` - path same as in corresponding request
- `action` - action value from the request
- `status` - response status: `Ok`, `Accepted`, `NoContent` or `Error`
- `content` - `Json`, `Yaml`, `PlainText` or `Javascript` - content type of the payload (data) - same as in corresponding request 
- `transaction` - request id
- `data` - payload, text encoded as specified in `content` parameter
- `parameters`- map of additional parameters and response headers (one that would be expected from equivalent REST response)

NOTE: all enum (symbolic) values like `Json`, `Peek` etc. are case-insensitive.