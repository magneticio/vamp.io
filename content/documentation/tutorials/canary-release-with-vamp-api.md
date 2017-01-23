---
date: 2016-09-13T09:00:00+00:00
title: Canary release merged services with the Vamp API
menu:
  main:
    parent: "Tutorials"
    name: "Canary release merged services with the Vamp API"
    weight: 100
draft: true
---

The Vamp UI interacts with the Vamp API, allowing you to easily create, deploy and manage artifacts and running services. It is perfectly possible to configure another system to interact directly with the Vamp API and perform these actions. This tutorial will walk you through running a standard canary release in API commands. 

1. [Adjust traffic distribution between service versions](/documentation/tutorials/canary-release-with-vamp-api/#adjust-traffic-distribution-between-service-versions)
- [Remove the old service version from the deployment](/documentation/tutorials/canary-release-with-vamp-api/#remove-the-old-service-version-from-the-deployment)
- [Track updates to the the deployment in the Vamp events stream](/documentation/tutorials/canary-release-with-vamp-api/#track-updates-to-the-the-deployment-in-the-vamp-events-stream)

### Requirements
* A running version of Vamp 0.9.x (this tutorial has been tested on the Vamp hello world set up using Vamp 0.9.2)
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp) 

## Adjust traffic distribution between service versions
We will control the traffic distribution manually to make it clear what is happening, but you could also automate this step using a Vamp workflow, see [automate a canary release with rollback](/documentation/tutorials/automate-a-canary-release/). 

`PUT /api/v1/gateways/sava/sava/webport` 

    name: sava/sava/webport
    routes:
      sava/sava/sava:1.0.0/webport:
        weight: 90%          
      sava/sava/sava:1.1.0/webport:
        weight: 10%


* Set a weight for the routes `sava/sava/sava:1.0.0/port` and `sava/sava/sava:1.1.0/port` to distribute traffic between the services.

## Remove the old service version from the deployment
 
First, set the route weight on the `sava:1.0.0` service to 0%.

`DELETE /api/v1/deployments/sava`

    ---
    name: sava:1.0
    clusters:
      sava:
        services:
          - breed: sava:1.0.0
    
* Remove the service `sava:1.0.0` from the `sava` cluster of the `sava` deployment
* Remove the route `sava/sava/sava:1.0.0/webport` from the gateway `sava/sava/webport`

## Track updates to the the deployment in the Vamp events stream

## Summing up


## Looking for more of a challenge?
Just for fun, you could try these:

* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

