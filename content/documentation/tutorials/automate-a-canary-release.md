
---
date: 2016-09-13T09:00:00+00:00
title: Automate a canary release using workflows
draft: true
---
This tutorial will show how a Vamp workflow can be used to automate the introduction of service updates. We'll demonstrate this by deploying two versions of our sava service, then use workflows to mock some incoming traffic and gradually direct this to the new version as the old version is phased out. We can avoid a lot of copy/pasting by using Vamp runner (our nifty little demo tool), but you could just as easily perform all the described actions manually in the Vamp UI or using the API.  

In this tutorial we will:

1. [Spin up Vamp runner](documentation/tutorials/automate-a-canary-release/#spin-up-vamp-runner)  
2. [Create a Blueprint and deploy some services](documentation/tutorials/automate-a-canary-release/#create-a-blueprint-and-deploy-some-services) 
  * Create blueprint
  * Create breed and scale
  * Deploy blueprint
  * Create gateway
  * Introduce new service version
4. [Play around with workflows](documentation/tutorials/automate-a-canary-release/#play-around-with-workflows)
  * Mock some metrics
  * Automate a canary release
  * Autoscale the services

### Requirements

* A running version of Vamp (this tutorial has been tested on the [Vamp hello world set up](documentation/installation/hello-world))
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp)
  
## Spin up Vamp runner
Vamp runner is the tool we use to demonstrate how the individual features of Vamp can be combined to fit real world use cases. Once Vamp is up and running, you can deploy Vamp runner alongside it (check the [Vamp hello world set up](documentation/installation/hello-world) if you don't already have a running version of Vamp).

Open a Docker Quickstrat Terminal and run:

```
docker run --net=host \
    -e VAMP_RUNNER_API_URL=http://${DOCKER_HOST_IP}:8080/api/v1/ \
    magneticio/vamp-runner:0.9.1
```
You will be able to access Vamp runner at port 8088 go ahead and click through the left menu:
                                                     
* **Vamp** shows details of the Vamp setup Vamp runner is working with
* **Recipes** lets you walk through the available demos - we're going to use _Canary Release - Introducing New Service Version_
* **Runner** shows the configuration and log for Vamp runner

![](images/screens/v091/runner_recipes_canary.png)

## Create a blueprint and deploy some services
We can use Vamp runner to quickly create and deploy all the artifacts required for our demo. If you prefer a manual approach, you could create each of these yourself using either the Vamp UI or API. The required YAMLs for all the listed recipes are available in the Vamp runner github repo ([github.com/magneticio - Vamp runner recipes](https://github.com/magneticio/vamp-runner/tree/master/recipes)).

1. Go to **Recipes** and select **Canary Release - Introducing New Service Version** from the RECIPES list.
  * The steps required to complete the selected recipe are listed in the central box
  * The clean up steps are listed on the right (we'll use Vamp runner to clean up for us at the end)
  * The Vamp events stream is displayed at the bottom of the page. We can use this to track our canary release as it happens
  
2. Click **Run** next to the first recipe step **Create blueprint** (in the central box)
  * Each recipe step must be performed in sequence
  * The info button next to each step tells you about the action to be completed, in this case it shows us the blueprint that will be created.
  * Once a step has completed successfully, the circle next to it will be coloured green

3. Wait for the **Create blueprint** step to complete, then work through the next four steps in turn:
  * Create breed and scale
  * Deploy blueprint
  * Create gateway
  * Introduce new service version
  
## Play around with workflows
### Mock some metrics
### Automate a canary release
### Autoscale the services

## Clean up after yourself
When you're finished completing a recipe it's easy to set Vamp back to its initial state. Click the **Clean up** button on the right and Vamp runner will undeploy and remove all deployments, gateways, workflows and artifacts. 

## Summing up

Now you've got to grips with Vamp runner and the power of workflows there's surely no stopping you. You can try out the other Vamp runner recipes (remember to clean up when you're done). You can also use the workflows included in the Vamp runner recipes to manage your own infrastructure or enhance a CI pipeline.

## Looking for more of a challenge?
Just for fun, you could try these:

* How might you integrate workflow automated canary releasing into a CI pipeline?
* Could you apply the mock metrics and/or canary workflows used in this recipe to another project?
* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
{{< /note >}}

