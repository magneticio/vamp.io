---
date: 2016-09-13T09:00:00+00:00
title: Merge services using the API
menu:
  main:
    parent: "Tutorials"
    name: "API: Merge services"
    weight: 90
draft: true
---

The Vamp UI interacts with the Vamp API, allowing you to easily create, deploy and manage artifacts and running services. It is perfectly possible to configure another system to interact directly with the Vamp API and perform these actions. This tutorial will explain the API calls to deploy and merge services: 

1. [Create an initial deployment](/documentation/tutorials/merge-sevices-with-api/#create-an-initial-deployment)
- [Merge a new service](/documentation/tutorials/merge-sevices-with-api/#merge-a-new-service)

### Requirements
* A running version of Vamp 0.9.x (this tutorial has been tested on the Vamp hello world set up using Vamp 0.9.2)
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp) 

## Create an initial deployment
To deploy our first service, we will `PUT` a valid [blueprint resource](/documentation/api/v0.9.2/api-blueprints/#blueprint-resource) to the API endpoint `/deployments/{deployment_name}`. 
When you send a blueprint directly to the `/deployments` endpoint, it won't be stored as a separate, static artifact (although you may optionally choose to do this).

-----------------

### API request

`PUT <vamp url>/api/v1/deployments/sava_deployment`

    ---
    name: sava:1.0                      # blueprint name (required, but not used)
    gateways:
      9050/http: sava_cluster/webport   # stable endpoint   
    clusters:
      sava_cluster:                     # cluster name
        services:
          -
            breed:
              name: sava:1.0.0          # service name
              deployable: magneticio/sava:1.0.0
              ports:
                webport: 8080/http      # internal gateway

### API response


-----------------


### Action
As a deployment with the name `sava_deployment` does not already exist, Vamp will create it and deploy the included clusters and services. Vamp Gateway Agent (VGA) will update the HAProxy configuration to include the new gateways and routes. 

This deployment will:

* Create a deployment named `sava_deployment`, with a cluster `sava_cluster` containing the service `sava:1.0.0`
* Create an internal gateway `sava_deployment/sava_cluster/webport`, containing the route `sava_deployment/sava_cluster/sava:1.0.0/webport`
* Create a stable endpoint at port 9050 mapped to the internal gateway `sava_deployment/sava_cluster/webport` 


    
## Merge a new service
Now our deployment is up and running - you can check this on the Vamp UI DEPLOYMENTS page, with a `GET /api/v1/deployments` request, or go to the exposed 9050 gateway and see the beautiful `sava:1.0.0` for yourself. 

When a new version of our service becomes available, we can add it to the running `sava_deployment` without affecting the live `sava:1.0.0` service. To do this, we will `PUT` a blueprint describing the updated service `sava:1.1.0` to the same API endpoint `/deployments/sava_deployment`. 

-----------------

### API request

`PUT /api/v1/deployments/sava_deployment`

    ---
    name: sava:1.1                      # blueprint name (required, but not used)
    clusters:
      sava_cluster:                     # cluster name
        services:
          -
            breed:
              name: sava:1.1.0          # service name
              deployable: magneticio/sava:1.1.0
              ports:
                webport: 8080/http      # internal gateway
    
### API response

-----------------



### Action
The new service will be added as a route to the existing internal gateway, with a default `weight` of 0%. This means no traffic will be routed there.

* Add the service `sava:1.1.0` to the deployment `sava_deployment` inside the cluster `sava_cluster`.  
* Add the route `sava_deployment/sava_cluster/sava:1.1.0/webport` to the internal gateway `sava_deployment/sava_cluster/webport`


## Summing up


## Looking for more of a challenge?
Just for fun, you could try these:

* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

