
---
date: 2016-09-13T09:00:00+00:00
title: Use workflows to automate a canary release
draft: true
---
Ths tutorial will show how Vamp workflows can be used to automate the complex canary deployment pattern. We'll do this by deploying a couple of versions of our service and then mocking the traffic metrics. We are going to use Vamp runner (a nifty little tool to demonstrate some of Vamp's powerful features) and the Vamp UI, but - as ever - you could just as easily perform all the described actions using the Vamp API.  

In this tutorial we will:

1. [Spin up Vamp runner](documentation/tutorials/automate-a-canary-release/#spin-up-vamp-runner)  
2. [Create a Blueprint and deploy it](documentation/tutorials/automate-a-canary-release/#create-a-blueprint-and-deploy-it) 
  * Create blueprint
  * Create breed and scale
  * Deploy the blueprint
  * Set up a gateway
  * Add a new service to the deployment
4. [Play around with workflows](documentation/tutorials/automate-a-canary-release/#play-around-with-workflows)
  * Mock some metrics
  * Automate a canary release
  * Autoscale the services

### Requirements

* A running version of Vamp (this tutorial has been tested on the [Vamp hello world set up](documentation/installation/hello-world))
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp)
  
## Spin up Vamp runner
## Create a blueprint and deploy it
### Create blueprint
### Create breed and scale
### Deploy the blueprint
### Set up a gateway
### Add a new service to the deployment
## Play around with workflows
### Mock some metrics
### Automate a canary release
### Autoscale the services


## Summing up

## Looking for more of a challenge?
Just for fun, you could try these:

* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
{{< /note >}}

