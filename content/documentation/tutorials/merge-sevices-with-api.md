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
Vamp deployments are initiated and managed using the `/deployments` API endpoint. To deploy a service with a custom name, we need to `PUT` a valid [blueprint resource](/documentation/api/v0.9.2/api-blueprints/#blueprint-resource) to the API endpoint `/deployments/{custom_deployment_name}`. The `custom_deployment_name` can be anything you choose - it doesn't need to be related to the blueprint resource you're sending or the service you're deploying, so feel free to come up with something inventive (or perhaps informative).   

Use the below API request to initiate a new deployment with the custom name `sava`. 

-----------------

### API request

* Path: `PUT <vamp url>/api/v1/deployments/sava`
* Headers:  
_Our examples are formatted in YAML. To send/receive JSON, specify `application/json`_
  * `Content-Type=application/x-yaml`
  * `Accept=application/x-yaml`  
* Body:  

```
---
name: sava:1.0                      # blueprint name (required, but not used for deployment)
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
            webport: 8080/http      # internal gateway to create
```


### API response
The API will return a response with the created `breed` and `deployment` resouces in the `Accept` format we specified.

```
- - name: sava:1.0.0
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
- - name: sava
    kind: deployment
    lookup_name: b745761242ab5566a44b556e62764beed46fa8de
    clusters:
      sava_cluster:
        services:
        - status:
            intention: Deployment
            since: '2017-01-24T13:35:37.665Z'
            phase:
              name: Initiated
              since: '2017-01-24T13:35:37.665Z'
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
            memory: 256.00MB
            instances: 1
          instances: []
          arguments:
          - privileged: 'true'
          dependencies: {}
          dialects: {}
        gateways:
          webport:
            sticky: null
            virtual_hosts:
            - webport.sava-cluster.sava.vamp
            routes:
              sava:1.0.0:
                lookup_name: a8edebeaad41ca61b19b250120b7fbc6b54b21ff
                weight: 100%
                balance: default
                condition: null
                condition_strength: 0%
                rewrites: []
        dialects: {}
    ports: {}
    environment_variables: {}
    hosts:
      sava_cluster: 192.168.99.100
```

-----------------

As there is no existing deployment with the name `sava`, Vamp will create it and deploy the required clusters and services. Vamp Gateway Agent (VGA) will then update the HAProxy configuration to include the new gateways and routes.  The breed description included in the deployment will also be stored as a separate, static `sava:1.0.0` breed artifact.  
The `sava` deployment is now up and running - you can check it out in three places: 

* **Vamp UI:** The deployment will be listed on the DEPLOYMENTS page
* **Vamp API:** `GET <vamp url>/api/v1/deployments/sava`
* **The deployment endpoint:** You can go to the exposed `9050` gateway and see the beautiful `sava:1.0.0` for yourself. 

![](http://vamp.io/images/screens/v091/canary_sava10.png)
    
## Create a template blueprint    

We can use our deployed blueprint to create a template for future updates to the `sava` deployment. Whenever a new service version becomes available, we can create its blueprint by simply updating the three fields marked `~` in the blueprint template below. The cluster and internal gateway details remain the same, these point to the existing cluster (`sava/sava_cluster`) and internal gateway (`sava/sava_cluster/webport`), which will be updated when the new service is deployed.

### Template sava blueprint

```
name: ~                             # blueprint name (required, but not used for deployment)
clusters:
  sava_cluster:                     # existing cluster to update
    services:
      -
        breed:
          name: ~                   # name of the service to be deployed
          deployable: ~             # new deployable
          ports:
            webport: 8080/http      # existing internal gateway to update
```


## Merge a new service version

We can add new services to the running `sava` deployment at any time without affecting the live `sava:1.0.0` service. To do this, we just need to update the three `~` fields in our template blueprint (above) with the new service details, then `PUT` the blueprint to the same API endpoint `/deployments/sava`. 

Use the below API request to add the service `sava:1.1.0` to the running `sava` deployment. 

-----------------

### API request

* Path: `PUT <vamp url>/api/v1/deployments/sava`
* Headers:   
_Our examples are formatted in YAML. To send/receive JSON, specify `application/json`_  
  * `Content-Type=application/x-yaml`
  * `Accept=application/x-yaml`
* Body:  

```
name: sava:1.1                        # new blueprint name (required, but not used for deployment)
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
    
### API response
The API will return a response with the created `breed` and `deployment` resouces in the `Accept` format we specified.
```
- - name: sava:1.1.0
    kind: breed
    deployable:
      type: container/docker
      definition: magneticio/sava:1.1.0
    ports:
      webport: 8080/http
    environment_variables: {}
    constants: {}
    arguments: []
    dependencies: {}
- - name: sava
    kind: deployment
    lookup_name: b745761242ab5566a44b556e62764beed46fa8de
    clusters:
      sava_cluster:
        services:
        - status:
            intention: Deployment
            since: '2017-01-24T13:35:37.68Z'
            phase:
              name: Done
              since: '2017-01-24T13:35:45.304Z'
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
            memory: 256.00MB
            instances: 1
          instances:
          - name: sava_sava-1-0-0-6fd83b1fd01f7dd9eb7f.fe9268c4-e239-11e6-9c98-024224e28f52
            host: 192.168.99.100
            ports:
              webport: 31486
            deployed: true
          arguments:
          - privileged: 'true'
          dependencies: {}
          dialects: {}
        - status:
            intention: Deployment
            since: '2017-01-24T15:05:38.719Z'
            phase:
              name: Initiated
              since: '2017-01-24T15:05:38.719Z'
          breed:
            name: sava:1.1.0
            kind: breed
            deployable:
              type: container/docker
              definition: magneticio/sava:1.1.0
            ports:
              webport: 8080/http
            environment_variables: {}
            constants: {}
            arguments: []
            dependencies: {}
          environment_variables: {}
          scale:
            cpu: 0.2
            memory: 256.00MB
            instances: 1
          instances: []
          arguments:
          - privileged: 'true'
          dependencies: {}
          dialects: {}
        gateways:
          webport:
            sticky: null
            virtual_hosts:
            - webport.sava-cluster.sava.vamp
            routes:
              sava:1.1.0:
                lookup_name: 6b906858cd25aa6ef9cf45f47ae73b687d1eb8e2
                weight: 0%
                balance: default
                condition: null
                condition_strength: 0%
                rewrites: []
              sava:1.0.0:
                lookup_name: a8edebeaad41ca61b19b250120b7fbc6b54b21ff
                weight: 100%
                balance: default
                condition: null
                condition_strength: 0%
                rewrites: []
        dialects: {}
    ports:
      sava_cluster.webport: '40007'
    environment_variables: {}
    hosts:
      sava_cluster: 192.168.99.100
```
-----------------

As the `sava` deployment, `sava_cluster` cluster and `sava_cluster/webport` internal gateway already exist, Vamp will deploy the new service there and update the internal gateway to include the new route.V amp Gateway Agent (VGA) will then update the HAProxy configuration to include the new gateways and routes.  The breed description included in the deployment will also be stored as a separate, static `sava:1.1.0` breed artifact.  

Note that the new service will be added to the gateway with a a `weight` of 0% (no traffic will be routed there).
The `sava` deployment is now up and running - you can check it out in three places: 

* **Vamp UI:** The deployment will be listed on the DEPLOYMENTS page. If you open the `sava` deployment you should see both service versions listed under the `sava_cluster` cluster
* **Vamp API:** `GET <vamp url>/api/v1/deployments/sava`
* **The deployment endpoint:** You can go to the exposed `9050` gateway... and still see the beautiful `sava:1.0.0` - no traffic will be sent to the new `sava:1.1.0` service

![](http://vamp.io/images/screens/v091/canary_sava10.png)

## Summing up

* To deploy a blueprint with a custom name, `PUT` it to the API endpoint `/deployments/{custom_deployment_name}`
* You can create a template blueprint and use it to quickly generate blueprints for new service versions
* To add (merge) a service to a running deployment, `PUT` its blueprint to the API endpoint `/deployments/{custom_deployment_name}`
* The first service added to a gateway will be given a route weight of 100% (all traffic will be sent there)
* Subsequent services added (merged) to an existing gateway will be given a route weight of 0% (no traffic will be sent there)
* Adding a new service to an running deployment will not affect any running services in that deployment

## Looking for more of a challenge?
Just for fun, you could try these:

* 
* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

