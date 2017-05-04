---
date: 2016-09-13T09:00:00+00:00
title: Add canary releasing to your Continuous Integration pipeline
menu:
  main:
    parent: "Tutorials"
    name: "Add canary releasing to your CI pipeline"
    weight: 90
draft: true
---

If you have visited some of the popular conferences or meetups about devops, continuous delivery, containers or microservices over the last two years the changes are rather high that you’ve heard some of the “big boys” talk about how they are using “Canary testing and releasing” to great success. You might even have seen a nice demo or some screenshots from their super-cool canary-dashboards. But if you want to apply this magical canary-thing to your own CI or CD pipeline, it becomes quiet vague and surrounded with a lot of smoke and mirrors on how to actually achieve this, and with what tools.

Luckily, with Vamp it’s now fast and easy to extend your CI/CD system with powerful canary functionalities. This enables you to avoid downtime and performance issues when testing, upgrading and scaling your applications and (micro)services. All you need is a CI tool that can talk JSON to our REST API, and the Vamp system running inside your favorite container-scheduler (like DC/OS or Kubernetes). And of course your application or microservice that you want to canary release, packaged inside a Docker container. 

So let’s get started!

In this tutorial we will show how to extend  your CI system to deploy a Docker container and then canary release to an upgraded container using the Vamp API:

1. [Deploy a service](/documentation/tutorials/add-canary-releases-to-ci-pipeline/#deploy-a-service) - use the API to deploy the service sava:1.0.0
- [Create a template blueprint](/documentation/tutorials/add-canary-releases-to-ci-pipeline/#create-a-template-blueprint) - create a template blueprint to allow easy updates to the deployment
- [Merge a new service](/documentation/tutorials/add-canary-releases-to-ci-pipeline/#merge-a-new-service-version) - use the API and the template blueprint to add the new service sava:1.1.0 to the running deployment
- [Changing the traffic distribution](/documentation/tutorials/add-canary-releases-to-ci-pipeline/#changing-the-traffic-distribution) - adjust traffic distribution manually (using the Vamp UI or API) or automatically (using a workflow)

### Requirements
* A running version of Vamp 0.9.x (this tutorial has been tested on the Vamp 0.9.2 hello world setup)
* Access to a Docker container repository, like for example the Docker hub
* A Continuous Integration application (like Jenkins, Travis, CircleCI, Wercker etc.) that can send JSON requests to a REST API.

## Deploy a service
Vamp deployments are initiated and managed using the `/deployments` API endpoint. To deploy a service, your CI tool just needs to POST a valid [blueprint resource](/documentation/api/v0.9.2/api-blueprints/#blueprint-resource) with a reference to the Docker container you want to deploy, and the port on which you want to expose your container to the outside world (typically using an edge load-balancer or DNS to connect to our external Vamp gateway which is an HAProxy based reverse-proxy).   

Use the below API request to initiate a new deployment named sava. 

* **Path:** `POST <vamp url>/api/v1/deployments`  
* **Headers:** `Content-Type=application/x-yaml`  
_The example below is formatted in YAML. To send JSON, specify `application/json`_  
* **Body:**  

```
name: sava                          # deployment name
gateways:
  9050: sava_cluster/webport
clusters:
  sava_cluster:                     # cluster to create
    services:
      -
        breed:
          name: sava:1.0.0          # service to deploy
          deployable: magneticio/sava:1.0.0
          ports:
            webport: 8080/http      # internal route to connect to container port
```

If all runs to plan, the Vamp API will return a (JSON) response with the fully parsed deployment document. As there is no existing deployment with the name sava, Vamp will create it and add the required clusters (one or more containers that belong together, like for example a Kubernetes pod) and services, effectively deploying and running the specified container on your container-scheduler. Vamp will then update the HAProxies to include the new gateways and routes. 
You would typically replace the deployment name (“sava”) with a descriptive name of your service or service-cluster, the cluster name with the same name but with “_cluster” added, the breed name with the name and unique identifier (for example, a version number or hash) and the deployable with the location of the newly built Docker container. The sava deployment is now up and running, you can see it at the exposed gateway 9050.

![](/images/screens/v091/canary_sava10.png)

### Track the deployment in Vamp 

You can track the deployed service in the Vamp UI or using the Vamp API.

In the Vamp UI, the **sava** deployment will be listed on the DEPLOYMENTS page.  
If you open it, you will see the sava:1.0.0 service running inside the sava_cluster cluster.

![](/images/screens/v092/sava_deployments_1.png)

The newly deployed gateways will be listed on the GATEWAYS page.  
If you open the **sava/sava_cluster/webport** gateway, you will see one route pointing to the sava:1.0.0 service.

![](/images/screens/v092/sava_gateway_1.png)

Using the Vamp API, we can also check the status of the deployment:

* Retrieve details of the deployment **sava**   
  `GET <vamp url>/api/v1/deployments/sava` 
* Retrieve the stored breed artifact **sava:1.0.0**   
  `GET <vamp url>/api/v1/breeds/sava:1.0.0`
* Retrieve details of the gateway **sava/sava_cluster/webport**   
  `GET <vamp url>/api/v1/gateways/sava/sava_cluster/webport`
    
## Create a template blueprint    

We can now  create a template for future updates to the sava deployment. Template blueprints are great because they help us quickly describe and merge new services to a known deployment, effectively canary releasing. To create the template, we will add placeholders to fields that will be unique for each service version and remove any unnecessary details. This blueprint can be stored in your version control system like, for example, Github or inside your CI tool as a template with replaceable placeholders.

### Template sava blueprint

The template sava blueprint below contains two fields to be entered for each canary release of the updated service  (marked with ~ placeholders). The deployment, cluster and internal gateway details will remain the same for all updates to the sava service, so these are set to the existing deployment (sava), the existing cluster (sava/sava_cluster) and the existing internal gateway for the cluster (sava/sava_cluster/webport). The external gateway details have been removed from the template as they are not required because the new updated service will simply be added to the already running cluster with an additional route that we can modify to re-balance traffic distribution.

```
name: sava        # existing deployment
clusters:
  sava_cluster:   # existing cluster
    services:
      -
        breed:
          name: ~   # new service to deploy (the breed name with specific unique version)
          deployable: ~    # new deployable
          ports:
            webport: 8080/http    # internal route to container port
```


## Merge a new service version

When a new version of the sava service is built and packaged into a Docker container, we can do a canary release and gradually move traffic from the current to the new version by adding it to the running sava deployment  . To do this, we just need to fill in the placeholders from our template blueprint with the names of the new breed and container and have the CI tool POST it to the /deployments API endpoint.

Use the below API request to add the service sava:1.1.0 to the running sava deployment.

* Path: `POST <vamp url>/api/v1/deployments`
* Headers: `Content-Type=application/x-yaml`  
_The example below is formatted in YAML. To send JSON, specify `application/json`_   
* Body:  

```
name: sava
clusters:
  sava_cluster: 
    services:
      -
        breed:
          name: sava:1.1.0    # new service to deploy (breed name and specific unique version)
          deployable: magneticio/sava:1.1.0    # new deployable Docker container
          ports:
            webport: 8080/http      
```

The API will return a (JSON) response with the fully parsed and updated deployment when succesful. As the sava deployment, sava_cluster cluster and sava_cluster/webport internal gateway already exist, Vamp does not need to create them. The new service version will be deployed directly into the existing cluster and a new route to the new service will be added to the existing internal gateway so traffic can be re-balanced from the current to the new container. The running deployment has now been updated to include sava:1.1.0. You can go to the exposed external 9050 gatewayand see the current sava:1.0.0. Behind the scenes Vamp has made all the required updates, but no traffic will be sent to the new sava:1.1.0 service unless we change the weight distribution in the sava/sava_cluster/webport gateway. New services added to an existing gateway have a default weight of 0%, (unless explicitly defined) this gives you full control over the traffic routing within the deployment and helps avoid unexpected surprises.

![](/images/screens/v091/canary_sava10.png)

### Track updates to the deployment in Vamp 

You can track the changes Vamp made to the deployment in the Vamp UI or using the Vamp API.

In the **sava** deployment, the sava:1.0.0 and sava:1.1.0 services are now running inside the cluster **sava_cluster**.

![](/images/screens/v092/sava_deployments_2.png)
 
In the gateway **sava/sava_cluster/webport** there are now routes to sava:1.0.0 (weight 100%) and sava:1.1.0 (weight 0%). Note that no changes have been made to the external gateway 9050. 

![](/images/screens/v092/sava_gateway_2.png)

Using the Vamp API, we can also check the status of the deployment:

* Retrieve details of the deployment **sava**:  
  `GET <vamp url>/api/v1/deployments/sava` 
* Retrieve the newly stored breed artifact **sava:1.1.0**:  
  `GET <vamp url>/api/v1/breeds/sava:1.1.0`
* Retrieve details of the updated gateway **sava/sava_cluster/webport**:  
  `GET <vamp url>/api/v1/gateways/sava/sava_cluster/webport`

## Changing the traffic distribution

You can canary release the new version by changing the traffic distribution between the deployed services at the sava/sava_cluster/webport internal gateway. These changes can be done manually in the Vamp UI or API, or automated using a workflow.

### Using the Vamp UI
In the Gateways screen, open the **sava/sava_cluster/webport** internal gateway. You will see routes to the webports for the two deployed services. Click to edit the WEIGHT and adjust the slider. When you click SAVE, Vamp will adjust the route weights accordingly.

![](/images/screens/v092/sava_gateway_2_slider.png)

### Using the Vamp API
You can also adjust the route weights of a gateway directly with the API. For example, we can update the **sava/sava_cluster/webport** gateway to start sending traffic to the sava:1.1.0 service:

`PUT <vamp url>/api/v1/gateways/sava/sava_cluster/webport` 

    name: sava/sava_cluster/webport
    port: 8080
    routes:
      sava/sava_cluster/sava:1.0.0/webport:
        weight: 90%          
      sava/sava_cluster/sava:1.1.0/webport:
        weight: 10%


Note that the total weight of all routes in a gateway must add up to 0% or 100%. 


### Automating traffic distribution with workflows
Vamp workflows are containers with injected Node.js scripts that access the Vamp API to monitor and automoate Vamp deployments. You can automate canary releasing by using a workflow to monitor deployed services and re-distribute traffic in accordance with defined SLAs. Read more about this in our tutorial [automate a canary release with rollback](/documentation/tutorials/automate-a-canary-release).


## Summing up
You can continue to add new services to the sava deployment by updating the template blueprint and POST-ing it to the `/deployments` API endpoint. With each merge, a new service will be added to the cluster **sava/sava_cluster** and a new route will be added to the gateway **sava/sava_cluster/webport** with a default weight of 0%.

To recap what we have covered:

* To deploy a blueprint, `POST` it to the API endpoint `/deployments`.
* You can create a template blueprint and use it to quickly generate blueprints for new service versions.
* To add (merge) a service to a running deployment, `POST` its blueprint to the API endpoint `/deployments` (the `name` field must match the deployment name you wish to update).
* The first service added to a gateway will be given a route weight of 100% (all traffic will be sent there).
* Subsequent services added (merged) to an existing gateway will be given a route weight of 0% (no traffic will be sent there).
* Adding a new service to a running deployment will not affect any running services in that deployment.
* You can adjust traffic distribution within a gateway manually (using the Vamp UI or API) or automatically (using workflows).

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

