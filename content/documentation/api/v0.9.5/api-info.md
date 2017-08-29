---
date: 2016-09-13T09:00:00+00:00
title: Info
menu:
  main:
    parent: "API"
    identifier: "api-reference-info-v095"
    weight: 170
aliases:
    - /documentation/api/api-info
---

Details of Vamp's JVM environment and runtime status, the configured persistence layer and container driver status can be retrieved from the `/info` APi endpoint. 
	
## Actions
 
 * [List](/documentation/api/v0.9.5/api-info/#list-info) - returns a full list of all info parameters.
 * [Get](/documentation/api/v0.9.5/api-info/#get-specific-info-section) - explicitly request a specific info section.

## Info parameters
The example below is in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.5/using-the-api) for details on how to set this. 

```
message: {...}
version: {...}
uuid: {...}
running_since: {...}
jvm: {...}
persistence: {...}
key_value: {...}
pulse: {...}
gateway_driver: {...}
container_driver: {...}
workflow_driver: {...}
```
 Parameter name        | optional | description          
 -----------------|-----------------|---
 message |  Always returned | The Vamp welcome message `vamp.info.message`
 version | Always returned | The running Vamp version
 uuid |   Always returned | 
 running_since | Always returned | 
 jvm | optional | operating_system, runtime, memory, non-heap, threads
 persistence | optional | database, archiving
 key_value | optional |  type and details
 pulse | optional | type and details
 gateway_driver | optional |  
 container_driver | optional |
 workflow_driver | optional | type(s) and url


------------------

## List info

Return details of Vamp's JVM environment and runtime status, the configured persistence layer and the container driver status. 

### Request

* `GET`
* `/api/v1/info`
* The request body should be empty.

### Response
If successful, will return a list of [all info parameters](/documentation/api/v0.9.5/api-info/#info-parameters).

### Errors
* **500** - one of the `/info` response sections retured an error.

------------------

## Get specific info section

Return a specific info section, see [info parameters](/documentation/api/v0.9.5/api-info/#info-parameters). 

### Request

* `GET` 
* `/api/v1/info?on={paramater_name}`
* The request body should be empty.

### Response
If successful, will return a list with only the standard and specified [info parameters](/documentation/api/v0.9.5/api-info/#info-parameters). 

### Errors
* **500** - one of the `/info` response sections retured an error.


#### Example - explicitly request `jvm` and `persistence` info
Request:

	GET <vamp url>/api/v1/info?on=jvm&on=persistence
	
Response:

```
{
    "message": "...",
    "version": "...",
    "uuid": "...",
    "running_since": "...",
    "jvm": {...},
    "persistence": {...}
}
```

------------------
