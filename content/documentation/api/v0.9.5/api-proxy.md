---
date: 2016-09-13T09:00:00+00:00
title: Proxy
menu:
  main:
    parent: "API"
    identifier: "api-reference-proxy-v095"
    weight: 185
aliases:
    - /documentation/api/api-proxy
draft: true
---

Reverse proxy access is available through the Vamp API (HTTP & WebSocket) and through the Vamp UI.  
Note that the API endpoints for reverse proxy access are structured `<vamp uri>/proxy/...`

## Actions
 
 * [Host and port](/documentation/api/v0.9.5/api-proxy/#host-and-port) - access a specific host and port
 * [Gateway](/documentation/api/v0.9.5/api-proxy/#gateway) - access an internal or external gateway
 * [Deployment instance](/documentation/api/v0.9.5/api-proxy/#deployment-instance) - access a specific deployment instance 
 * [Workflow instance](/documentation/api/v0.9.5/api-proxy/#workflow-instance) - access a specific workflow instance

-----------------  
  
## Host and port
Access a specific host and port.

### Request

* `GET`
* `<vamp uri>/proxy/host/{host}/port/{port}/`

### Response
If successful, will return the response from the specified host and port.


--------------

## Gateway

Access an exposed gateway (internal or external).

### Request

* `GET`
* `<vamp uri>/proxy/gateways/{name}/`

### Response
If successful, will return the response from the specified gateway.

--------------

## Deployment instance

Access a specific deployment instance.

### Request

* `GET`
* `<vamp uri>/proxy/deployments/{name}/clusters/{name}/service/{name}/instances/{name}/ports/{name}`


### Response
If successful, will return the response from the specified deployment instance.

### Examples

Access a running instance of the Vamp sava service as deployed in the [deploy your first blueprint tutorial](/documentation/tutorials/deploy-your-first-blueprint/):  
```
http://localhost:8080/proxy/deployments/sava/clusters/sava/services/sava:1.0.0/instances/vamp_deployment-sava-service-f6688d352a6f996f10f41a736bf661babec6a45f.98b533a3-1523-11e7-8393-0242ac110002/ports/webport/
```

--------------

## Workflow instance

Access a specific workflow instance.

### Request
* `GET` 
* `<vamp uri>/proxy/workflows/{name}/instances/{name}/ports/{name}`


### Response
If successful, will return the response from the specified workflow instance.

--------------
