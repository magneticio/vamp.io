---
date: 2016-09-13T09:00:00+00:00
title: Deploy and merge services using the API
menu:
  main:
    parent: "Tutorials"
    name: "API: Deploy and merge services"
    weight: 90
draft: true
---

The Vamp UI interacts with the Vamp API to create, deploy and manage static artifacts and running services. You can easily configure another system to interact directly with the Vamp API and perform these same actions, for example using a CI tool to pass new service details to Vamp for deployment.


In this tutorial we will explain the Vamp API calls used to deploy services and update running deployments: 

1. [Deploy a service](/documentation/tutorials/merge-sevices-with-api/#deploy-a-service)
- [Create a template blueprint](/documentation/tutorials/merge-sevices-with-api/#create-a-template-blueprint)
- [Merge a new service](/documentation/tutorials/merge-sevices-with-api/#merge-a-new-service-version)

### Requirements
* A running version of Vamp 0.9.x (this tutorial has been tested on the Vamp 0.9.2 hello world setup)
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp) 

## Deploy a service
Vamp deployments are initiated and managed using the `/deployments` API endpoint. To deploy a service, we just need to `POST` a valid [blueprint resource](/documentation/api/v0.9.2/api-blueprints/#blueprint-resource).   

Use the below API request to initiate a new deployment named `sava`. 

* **Path:** `POST <vamp url>/api/v1/deployments`  
* **Headers:** `Content-Type=application/x-yaml`  
_The example below is formatted in YAML. To send JSON, specify `application/json`_  
* **Body:**  

```
name: my_sava                       # deployment name
gateways:
  9070: sava_cluster/webport
clusters:
  sava_cluster:                     # cluster to create
    services:
      -
        breed:
          name: sava:1.0.0          # service to deploy
          deployable: magneticio/sava:1.0.0
          ports:
            webport: 8080/http      # internal gateway to create
```

If all runs to plan, the API will return a (JSON) response with the `breed` and `deployment` resouces. As there is no existing deployment with the name `sava`, Vamp will create it and deploy the required clusters and services. Vamp Gateway Agent (VGA) will then update the HAProxy configuration to include the new gateways and routes.  The breed description included in the deployment will also be stored as a separate, static breed artifact - `sava:1.0.0`.  

The `sava` deployment is now up and running, you can see it at the exposed gateway `9070`.

![](http://vamp.io/images/screens/v091/canary_sava10.png)

### Track the deployment in Vamp 

You can track the deployed service in the Vamp UI or using the Vamp API: 

* The deployment will be listed on the DEPLOYMENTS page
* The new gateways will be listed under GATEWAYS
* The stored breed artifact will be listed under BREEDS
* Return details of the sava deployment:  
  `GET <vamp url>/api/v1/deployments/sava` 
* Return the stored sava:1.0.0 breed artifact:  
  `GET <vamp url>/api/v1/breeds/sava:1.0.0`


    
## Create a template blueprint    

We can use our deployed blueprint resource to create a template for future updates to the `sava` deployment. Template blueprints are great because they help us quickly describe and merge new services to a known deployment. To create the template, we will add placeholders to fields that will be unique for each service version and remove any unnecesary details.

### Template sava blueprint

The template sava blueprint below contains two fields to be entered for each new service (marked with `~` placeholders). The deployment, cluster and internal gateway details will remain the same for all updates to the sava service, so these are set to the existing deployment (`sava`), cluster (`sava/sava_cluster`) and internal gateway (`sava/sava_cluster/webport`). The external gateway details have been removed from the template as they are not required and would not be updated when a new service is added.

```
name: my_sava                       # existing deployment
clusters:
  sava_cluster:                     # existing cluster
    services:
      -
        breed:
          name: ~                   # new service to deploy (the breed name)
          deployable: ~             # new deployable
          ports:
            webport: 8080/http      # existing internal gateway
```


## Merge a new service version

When a new version of the sava service becomes available, we can add it to the running `sava` deployment without affecting the live service `sava:1.0.0` . To do this, we just need to fill in the placeholders from our template blueprint and `POST` it to the `/deployments` API endpoint. 

Use the below API request to add the service `sava:1.1.0` to the running `sava` deployment. 

* Path: `POST <vamp url>/api/v1/deployments`
* Headers: `Content-Type=application/x-yaml`  
_The example below is formatted in YAML. To send JSON, specify `application/json`_   
* Body:  

```
name: my_sava
clusters:
  sava_cluster: 
    services:
      -
        breed:
          name: sava:1.1.0                  # new service to deploy (breed name)
          deployable: magneticio/sava:1.1.0 # new deployable
          ports:
            webport: 8080/http      
```

The API will return a (JSON) response with the `breed` and `deployment` resouces. As the `sava` deployment, `sava_cluster` cluster and `sava_cluster/webport` internal gateway already exist, Vamp does not need to create them. The new service version will be deployed directly to the existing cluster and a route to the new service will be added to the existing internal gateway. As before, the breed description included in the deployment will be stored as a separate, static breed artifact `sava:1.1.0`.  

The running deployment has now been updated to include `sava:1.1.0`. You can go to the exposed `9070` gateway... and still see the beautiful `sava:1.0.0`. Behind the scenes Vamp has made all the required updates, but no traffic will be sent to the new `sava:1.1.0` service unless we change the weight distribution in the `sava/sava_cluster/webport` gateway. New services added to an existing gateway have a default weight of 0%, this gives you full control over the traffic routing within the deployment and helps avoid unexpected surprises.

![](http://vamp.io/images/screens/v091/canary_sava10.png)

### Track updates to the deployment in Vamp 

You can track the changes Vamp made to the deployment in the Vamp UI or using the Vamp API: 

* The deployment will still be listed on the DEPLOYMENTS page.  
  If you open the `sava` deployment you should see both service versions listed under the `sava_cluster` cluster
* The internal and external gateways will be listed on the GATEWAYS page.  
  If you open the `sava/sava_cluster/webport` internal gateway you should see routes to `sava:1.0.0` (weight 100%) and `sava:1.1.0` (weight 0%). No changes will have been made to the external gateway `9070`
* Return details of the sava deployment:  
  `GET <vamp url>/api/v1/deployments/sava` 
* Return the newly stored sava:1.1.0 breed artifact:  
  `GET <vamp url>/api/v1/breeds/sava:1.1.0`
* Return details of the updated gateway with  
  `GET <vamp url>/api/v1/gateways/sava/sava_cluster/webport`

## Summing up
And that's all there is to it. You can continue to add new services to the sava deployment by updating the template blueprint. With each merge, a new service will be added to the `sava/sava_cluster` cluster and a new route will be added to the `sava/sava_cluster/webport` gateway (with a default weight of 0%).

To sum up what we have covered:

* To deploy a blueprint, `POST` it to the API endpoint `/deployments`
* You can create a template blueprint and use it to quickly generate blueprints for new service versions
* To add (merge) a service to a running deployment, `POST` its blueprint to the API endpoint `/deployments` (the `name` field must match the deployment name you wish to update)
* The first service added to a gateway will be given a route weight of 100% (all traffic will be sent there)
* Subsequent services added (merged) to an existing gateway will be given a route weight of 0% (no traffic will be sent there)
* Adding a new service to a running deployment will not affect any running services in that deployment

## Looking for more of a challenge?
Just for fun, you could try these:

* 
* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

