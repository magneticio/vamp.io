
---
date: 2016-09-13T09:00:00+00:00
title: Automate a canary release with rollback using workflows
draft: true
---
Vamp workflows are dynamic runtime artifacts built from (Node.js javascript) scripts that can access Vamp’s API and events/metrics system. Vamp manages workflows just like any other container inside your cluster, making them robust, scalable and dynamic. With very little effort you can use workflows to create valuable and powerful automation playbooks for testing and deployments. 

This tutorial will show how workflows can be used to run an automated canary release, gradually introducing an updated service and initiating a rollback to the old version in case 500 errors are measured on the new service. We will use our nifty little demo and automation tool Vamp Runner to demonstrate this, but you could just as easily perform all the described actions manually in the Vamp UI or using the API.  

In this tutorial we will:

1. [Spin up Vamp Runner](documentation/tutorials/automate-a-canary-release/#spin-up-vamp-runner)  
2. [Create a Blueprint and deploy some services](documentation/tutorials/automate-a-canary-release/#create-a-blueprint-and-deploy-some-services) 
3. [Create workflows](documentation/tutorials/automate-a-canary-release/#create-workflows)
  * Generate the traffic requests
  * Automate a canary release
  * Autoscale the services
  * Force a rollback

### Requirements

* A running version of Vamp 0.9.x (this tutorial has been tested on the [Vamp hello world set up](documentation/installation/hello-world) using Vamp 0.9.1)
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp)
  
## Spin up Vamp Runner
Vamp Runner is the tool we use to demonstrate how individual features of Vamp can be combined to fit real world use cases and unlock the real power of Vamp. We developed Vamp Runner as an automated integration testing tool to make sure important patterns of Vamp worked as expected against all supported container scheduling stacks when building new versions of Vamp. After we realised how powerful the concept of recipes was, we added a graphical UI on top for demonstration purposes. Vamp Runner can still be used in CLI mode though for your automated integration testing purposes. All actions triggered by Vamp Runner can also be triggered by your CI or automation tool of choice, check out the recipes folder in the Github project ([github.com/magneticio - Vamp Runner recipes](https://github.com/magneticio/vamp-runner/tree/master/recipes)).

Once Vamp is up and running, you can deploy Vamp Runner alongside it (if you don’t already have a running version of Vamp, check the [Vamp hello world set up](documentation/installation/hello-world) ). Vamp Runner connects to the Vamp API endpoint, specified as `VAMP_RUNNER_API_URL` in the below docker run command. 
```
docker run --net=host -e VAMP_RUNNER_API_URL=http://192.168.99.100:8080/api/v1 magneticio/vamp-runner:0.9.1   
```

You can access the Vamp Runner UI at port 8088. Go ahead and click through the left menu:

* **Vamp** shows details of the Vamp API Vamp Runner is talking to
* **Recipes** lets you walk through the available demos - we're going to use _Canary Release - Introducing New Service Version_
* **Runner** shows the configuration and log for Vamp Runner

![](images/screens/v091/runner_recipes_canary.png)
                                                   

## Create a blueprint and deploy some services
We can use Vamp Runner to quickly create and deploy all the artifacts required for our demo. If you prefer a manual approach, you could always create each of these yourself - the required YAMLs for all the recipes are available in the github repo ([github.com/magneticio - Vamp Runner recipes](https://github.com/magneticio/vamp-runner/tree/master/recipes)).

1. Go to **Recipes** and select **Canary Release - Introducing New Service Version** from the RECIPES list.
  * The steps required to complete the selected recipe are listed in the middle box
  * The clean up steps are listed on the right (we'll use Vamp Runner to clean up for us at the end)
  * The Vamp events stream is displayed at the bottom of the page. We can use this to track our canary release as it happens
  
2. Click **Run** next to the first recipe step **Create blueprint** (in the middle box)
  * Each recipe step must be performed in sequence
  * The info button next to each step shows you the exact YAML being posted to the VAMP API, in this case it shows us the blueprint that will be created
  * Once a step has completed successfully, the circle next to it will be coloured green. If for whatever reason the desired state cannot be reached the circle will colour red. (NB check the recipe JSON definition file for each recipe the GitHub project recipes folder to examine the states that are defined to check if a step has been executed successfully.) You can try cleaning the entire recipe by clicking the “Cleanup” button in the right column, or check the events at the bottom of the Vamp Runner UI and find out if there are any specific errors happening.

3. Wait for the **Create blueprint** step to complete and the circle to turn green, then work through the next four steps in turn:
  * Create breed and scale
  * Deploy blueprint
  * Create gateway
  * Introduce new service version

 The EVENTS stream in Vamp Runner will show the process of each step until our services are deployed. The created artifacts and deployments are visible in the Vamp UI (or via the API) and, if everything worked as expected, the deployed service can be accessed at the external gateway Vamp Runner created (9050).

## Create workflows
With all our services ready to go, we can get started with some automation. We will use three workflows, one to generate traffic requests, one to automate the canary release and rollback, and one to autoscale our services as the traffic routing is rebalanced. For each of our workflows, Vamp Runner will first create a breed with `type: application/javascript` containing the JavaScript to run and then create a workflow that references the breed.

When the workflow is created, Vamp will deploy a workflow agent container and inject the JavaScript from the referenced breed ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)). The JavaScript will then run at the schedule defined in the workflow (as a daemon, triggered by specific Vamp events or following a set time schedule). The Vamp node.js client library enables JavaScript workflows to speak directly to the Vamp API, see the gitHub project for details ([github.com/magneticio - Vamp node client](https://github.com/magneticio/vamp-node-client)).  
[Read more about workflows](/documentation/using-vamp/workflows)

### Generate traffic requests
The next step in our Vamp Runner recipe is to generate some traffic requests and get these flowing into our deployed service. We're going to do this using a workflow.

Click **Run** next to **Generate traffic requests** and Vamp will create a breed and workflow named `traffic`. 

The traffic workflow will send generated traffic requests to our service at the external gateway port 9050.  You can see the exact YAML posted to the Vamp API to complete this by clicking on the **info** button. The workflow is set to run as a daemon, so it will begin generating traffic requests as soon as it is created. You will see these show up in the EVENTS stream at the bottom of the Vamp Runner UI, or you can watch them arrive at the gateway in the Vamp UI.

![](images/screens/v091/runner_generate_traffic_requests.png)

![](images/screens/v091/runner_vamp_ui_gateway.png)

### Automate a canary release
Our services were initially deployed with 100% traffic being routed to sava:1.0 and 0% to sava:1.1
Now we have some generated traffic requests coming in, we can automate a canary release to gradually rebalance rollback will be initiated in case this hits the defined 500.

Click **Run** next to **Automated canary release** and Vamp will create a breed and workflow named `canary`. 

You can also adjust the weight manually in the Vamp UI.


### Autoscale the services
As trafic routing is rebalanced between the services we can automatically scale the services up or down.

The **Auto scaling** step will create a breed and workflow named `auto-scaling`.

You can also scale the services manually in the Vamp UI.

### Force a rollback


## Clean up and move along
You can set Vamp back to its initial (clean) state at any step in a recipe. Click the **Clean up** button on the right of the **Recipes** screen to remove all deployments, gateways, workflows and artifacts that have been created by the selected recipe.  The status of each step will also be reset and you can start from the beginning again.

## Summing up

Now you’ve got to grips with Vamp Runner and the power of workflows there’s surely no stopping you. You can try out the other Vamp Runner recipes (remember to clean up when you’re done) like autoscaling and mocking metrics. 

## Looking for more of a challenge?
Just for fun, you could try these:

* How might you integrate workflow automated canary releasing into a CI pipeline?
* Could you apply the mock metrics and/or canary workflows used in this recipe to another project?
* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
{{< /note >}}

