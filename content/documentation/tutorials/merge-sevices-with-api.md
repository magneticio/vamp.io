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

1. [Deploy a service](/documentation/tutorials/merge-sevices-with-api/#deploy-a-service) - use the API to deploy the service sava:1.0.0
- [Create a template blueprint](/documentation/tutorials/merge-sevices-with-api/#create-a-template-blueprint) - create a template blueprint to allow easy updates to the deployment
- [Merge a new service](/documentation/tutorials/merge-sevices-with-api/#merge-a-new-service-version) - use the API and the template blueprint to add the new service sava:1.1.0 to the running deployment

### Requirements
* A running version of Vamp 0.9.x (this tutorial has been tested on the Vamp 0.9.2 hello world setup)
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp) 

## Deploy a service
Vamp deployments are initiated and managed using the `/deployments` API endpoint. To deploy a service, we just need to `POST` a valid [blueprint resource](/documentation/api/v0.9.2/api-blueprints/#blueprint-resource).   

Use the below API request to initiate a new deployment named my_sava. 

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

If all runs to plan, the API will return a (JSON) response with the breed and deployment resouces. As there is no existing deployment with the name my_sava, Vamp will create it and deploy the required clusters and services. Vamp Gateway Agent (VGA) will then update the HAProxy configuration to include the new gateways and routes.  The breed description included in the deployment will also be stored as a separate, static breed artifact - sava:1.0.0.  

The my_sava deployment is now up and running, you can see it at the exposed gateway 9070.

![](http://vamp.io/images/screens/v091/canary_sava10.png)

### Track the deployment in Vamp 

You can track the deployed service in the Vamp UI or using the Vamp API.

In the Vamp UI, the **my_sava** deployment will be listed on the DEPLOYMENTS page.  
If you open it, you will see the sava:1.0.0 service running inside the sava_cluster cluster.

![](http://vamp.io/images/screens/v092/my_sava_deployments_1.png)

The newly deployed gateways will be listed on the GATEWAYS page.  
If you open the **my_sava/sava_cluster/webport** gateway, you will see one route pointing to the sava:1.0.0 service.

![](http://vamp.io/images/screens/v092/my_sava_gateway_1.png)

Using the Vamp API, we can also check the status of the deployment:

* Retrieve details of the deployment **my_sava**   
  `GET <vamp url>/api/v1/deployments/my_sava` 
* Retrieve the stored breed artifact **sava:1.0.0**   
  `GET <vamp url>/api/v1/breeds/sava:1.0.0`
* Retrieve details of the gateway **my_sava/sava_cluster/webport**   
  `GET <vamp url>/api/v1/gateways/my_sava/sava_cluster/webport`
    
## Create a template blueprint    

Template blueprints can be used to quickly describe and merge new services to known deployments. To turn a blueprint into a template, placeholders are added to the fields that will be unique for each service version and unnecesary details are removed.

### Template my_sava blueprint

We have used our my_sava blueprint resource to make a template for deploying future updates to the sava:1.0.0 service.  The template below contains two fields to be entered for each new service (marked with `~` placeholders). The deployment, cluster and internal gateway details will remain the same for all updates to the sava service. The external gateway details have been removed from the template as they are not required and will not be updated when a new service is added.

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

When a new version of the sava service becomes available, we can add it to the running my_sava deployment without affecting the live service sava:1.0.0 . To do this, we just need to complete the two placeholders in our template blueprint and `POST` it to the `/deployments` API endpoint. 

Use the below API request to add the service sava:1.1.0 to the running my_sava deployment. 

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

The API will return a (JSON) response with the breed and deployment resouces. As the deployment **my_sava**, cluster **sava_cluster** and gateway **sava_cluster/webport** already exist, Vamp does not need to create them. The new service version will be deployed directly to the existing cluster and a route to the new service will be added to the existing gateway. As before, the breed description included in the deployment will be stored as a separate, static breed artifact sava:1.1.0.  

The running deployment has now been updated to include the new service version sava:1.1.0. You can go to the exposed 9070 gateway... and still see the beautiful sava:1.0.0. Behind the scenes Vamp has made all the required changes, but no traffic will be sent to the new sava:1.1.0 service unless we change the weight distribution in the **my_sava/sava_cluster/webport** gateway. New services added to an existing gateway have a default weight of 0%, this gives you full control over the traffic routing within the deployment and helps avoid unexpected surprises.

![](http://vamp.io/images/screens/v091/canary_sava10.png)

### Track updates to the deployment in Vamp 

You can track the changes Vamp made to the deployment in the Vamp UI or using the Vamp API.

In the **my_sava** deployment, the sava:1.0.0 and sava:1.1.0 services are now running inside the cluster **sava_cluster**.

![](http://vamp.io/images/screens/v092/my_sava_deployments_2.png)
 
In the gateway **my_sava/sava_cluster/webport** there are now routes to sava:1.0.0 (weight 100%) and sava:1.1.0 (weight 0%). Note that no changes will have been made to the external gateway 9070. 

![](http://vamp.io/images/screens/v092/my_sava_gateway_2.png)

Using the Vamp API, we can also check the status of the deployment:

* Retrieve details of the deployment **my_sava**:  
  `GET <vamp url>/api/v1/deployments/my_sava` 
* Retrieve the newly stored breed artifact **sava:1.1.0**:  
  `GET <vamp url>/api/v1/breeds/sava:1.1.0`
* Retrieve details of the updated gateway **my_sava/sava_cluster/webport**:  
  `GET <vamp url>/api/v1/gateways/my_sava/sava_cluster/webport`

## Summing up
You can continue to add new services to the my_sava deployment by updating the template blueprint. With each merge, a new service will be added to the cluster **my_sava/sava_cluster** and a new route will be added to the gateway **my_sava/sava_cluster/webport** with a default weight of 0%.

To recap what we have covered:

* To deploy a blueprint, `POST` it to the API endpoint `/deployments`.
* You can create a template blueprint and use it to quickly generate blueprints for new service versions.
* To add (merge) a service to a running deployment, `POST` its blueprint to the API endpoint `/deployments` (the `name` field must match the deployment name you wish to update).
* The first service added to a gateway will be given a route weight of 100% (all traffic will be sent there).
* Subsequent services added (merged) to an existing gateway will be given a route weight of 0% (no traffic will be sent there).
* Adding a new service to a running deployment will not affect any running services in that deployment.

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

