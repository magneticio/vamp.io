---
date: 2016-09-13T09:00:00+00:00
title: API - Deployments
menu:
  main:
    parent: "API"
    identifier: "api-reference-deployments"
    weight: 35
draft: true
---
intro text. Read about [using deployments](documentation/using-vamp/deployments/).

## Actions
 
 * [List](/documentation/api/v9.9.9/api-deployments/#list-deployments) - return a list of all deployments
 * [Get](/documentation/api/v9.9.9/api-deployments/#get-deployment) - get a single deployment
 * [Create](/documentation/api/v9.9.9/api-deployments/#create-deployment) - create a new deployment 
 * [Update](/documentation/api/v9.9.9/api-deployments/#update-deployment) - update a running deployment
 * [Delete](/documentation/api/v9.9.9/api-deployments/#delete-deployment) - delete a deployment

## Deployment resource

The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v9.9.9/api-common-parameters) for details on how to set this. 

### Minimum resource

```

```


### API return resource

```
name: sava
kind: deployment
lookup_name: b745761242ab5566a44b556e62764beed46fa8de
clusters:
  sava:
    services:
    - status:
        intention: Deployment
        since: '2017-01-05T14:53:18.428Z'
        phase:
          name: Done
          since: '2017-01-05T14:53:24.534Z'
      breed:
        name: sava:1.0.0
        kind: breed
        deployable:
          type: container/docker
          definition: magneticio/sava:1.0.0
        ports:
          webport: 8080/http
        environment_variables: {}
        constants: {}
        arguments: []
        dependencies: {}
      environment_variables: {}
      scale:
        cpu: 0.2
        memory: 64.00MB
        instances: 1
      instances:
      - name: sava_sava-1-0-0-6fd83b1fd01f7dd9eb7f.b1fc514f-d356-11e6-b975-02426d22113f
        host: 192.168.99.100
        ports:
          webport: 31107
        deployed: true
      arguments:
      - privileged: 'true'
      dependencies: {}
      dialects: {}
    gateways:
      webport:
        sticky: null
        virtual_hosts:
        - webport.sava.sava.vamp
        routes:
          sava:1.0.0:
            lookup_name: fef540f1c9e4eb21e045d935eac990d0d5d25825
            weight: 100%
            balance: default
            condition: null
            condition_strength: 0%
            rewrites: []
    dialects: {}
ports:
  sava.webport: '40001'
environment_variables: {}
hosts:
  sava: 192.168.99.100
```

 Field name        | description          
 -----------------|-----------------
  |  
  |

-----------------  
  
## List deployments

Returns a list of all running deployments. For details on pagination see [common parameters](/documentation/api/v9.9.9/api-common-parameters)

### Request
* `GET`
* `/api/v1/deployments`
* The request body should be empty.

### Response
If successful, will return a list of [deployment resources](/documentation/api/v9.9.9/api-deployments/#deployment-resource) in the specified `accept` format (default JSON).

### Errors
* ???

-----------------

## Examples

See [gateways - A/B TEST TWO DEPLOYMENTS USING ROUTE WEIGHT](/documentation/using-vamp/gateways/#example-a-b-test-two-deployments-using-route-weight)