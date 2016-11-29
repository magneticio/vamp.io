
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
  * Force a rollback
  * Autoscale the services


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
We can use Vamp Runner to quickly create and deploy all the artifacts required for our demo. If you prefer, you could always create each of these manually yourself - the required YAMLs for all the recipes are available in the github repo ([github.com/magneticio - Vamp Runner recipes](https://github.com/magneticio/vamp-runner/tree/master/recipes)).

1. Go to **Recipes** and select **Canary Release - Introducing New Service Version** from the RECIPES list.
  * The steps required to complete the selected recipe are listed in the middle box
  * The clean up steps are listed on the right (we'll use Vamp Runner to clean up for us at the end)
  * The Vamp events stream is displayed at the bottom of the page. We can use this to track our canary release as it happens
  
2. Click **Run** next to the first recipe step **Create blueprint** (in the middle box)
  * Each recipe step must be performed in sequence
  * The info button next to each step shows you the exact YAML being posted to the VAMP API, in this case it shows us the blueprint that will be created
  * Once a step has completed successfully, the circle next to it will be coloured green. If for whatever reason the desired state cannot be reached the circle will colour red. (NB check the recipe JSON definition file for each recipe the GitHub project recipes folder to examine the states that are defined to check if a step has been executed successfully.) You can try cleaning the entire recipe by clicking the “Cleanup” button in the right column, or check the events at the bottom of the Vamp Runner UI and find out if there are any specific errors happening.

3. Wait for the **Create blueprint** step to complete and the circle to turn green, then work through the next four steps in turn:
  * Create breed and scale - these are the artifacts needed to deploy the service `sava:1.0` and referenced in our placeholder blueprint
  * Deploy blueprint - deploys the application `sava:1.0` with a routing weight of 100% (all traffic)
  * Create gateway - exposes the external gateway 9050 mapped to our Sava deployment
  * Introduce new service version - merges an updated version of our service `sava:1.1` with the running deployment. The routing weight of the new version is set to 0% (no traffic)

 The EVENTS stream in Vamp Runner will show the process of each step until our services are deployed. The created artifacts and deployments are visible in the Vamp UI (or via the API) and, if everything worked as expected, the deployed service can be accessed at the external gateway Vamp Runner created (9050).

![](images/screens/v091/canary_deployments.png)

![](images/screens/v091/canary_sava10.png)

## Create workflows
With two versions of our service ready to go, we can get started with some automation. We are going to use three workflows; one to generate traffic requests, one to automate a canary release and rollback, and one to autoscale our services as the traffic routing is rebalanced. For each of our workflows, Vamp Runner will first create a breed of `type: application/javascript` containing the JavaScript to run, and then create a workflow referencing the breed.

When a workflow is created, Vamp will deploy a workflow agent container and inject the provided JavaScript into it ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)). The JavaScript will then run according to the schedule defined in the workflow (as a daemon, triggered by specific Vamp events or following a set time schedule). The Vamp node.js client library enables JavaScript workflows to speak directly to the Vamp API, see the gitHub project for details ([github.com/magneticio - Vamp node client](https://github.com/magneticio/vamp-node-client)).  
[Read more about workflows](/documentation/using-vamp/workflows)

### Generate traffic requests
The next step in our Vamp Runner recipe is to get some traffic requests flowing into our deployed service. We can generate these using a workflow.

Click **Run** next to **Generate traffic requests** and Vamp will create a breed and workflow named `traffic`. 

The traffic workflow will send generated traffic requests to our service at the defined port (9050).  You can see the exact YAML posted to the Vamp API to complete this by clicking on the **info** button. The traffic workflow is set to run as a daemon, so it will begin generating traffic requests as soon as it is created. You will see these show up in the EVENTS stream at the bottom of the Vamp Runner UI, or you can watch them arrive at the gateway in the Vamp UI.

![](images/screens/v091/canary_traffic_gateways.png)

### Automate a canary release
Our services have been deployed with the routing weights `sava:1.0` - 100% and `sava:1.1` - 0%, this means all incoming traffic is currently being routed to `sava:1.0`. The next step in our Vamp Runer recipe is to initiate an automated canary release and introduce `sava:1.1` to the world. 

Click **Run** next to **Automated canary release** and Vamp will create a breed and workflow named `canary`. 

Once created, the canary workflow will begin to gradually rebalance traffic routing, introducing `sava:1.1` while phasing out `sava:1.0`. Click the **info** button in Vamp Runner to check the exact YAML used for this. You can track progress of the canary release in the EVENTS stream at the bottom of the Vamp Runner UI and you will also see the weight distribution on the internal gateway updating in the Vamp UI.
 
![](images/screens/v091/canary_canary_events.png)

![](images/screens/v091/canary_canary_gateways.png)

You can also use the WEIGHT slider in the Vamp UI to adjust the weight manually, the canary workflow will kick back in and take over from your setting.

### Force a rollback
As our Sava service has traffic requests flowing in to the 9050 gateway (generated by the traffic workflow), the canary workflow can measure these and initiate a rollback in case a defined limit of errors is detected on the new service (we have set this to 500). We can demonstrate this by maliciously destroying the `sava:1.1` deployment from the Marathon UI and forcing a rollback to `sava:1.0`.

1. Go the Marathon UI (on port 9090) and find the `sava:1.1` container running
* Select **destroy** to kill the container

![](images/screens/v091/canary_marathon_destroy.png)

You will see the following happen. First of all, the canary workflow will pick up on the errors for traffic routed to `sava:1.1` and rebalance the routing to send 100% of traffic to `sava:1.0`. 

![](images/screens/v091/canary_force_rollback_1.png)

Vamp will detect the issue and spin up the `sava:1.1` service again as soon as possible. Once `sava:1.1` is available, the canary workflow will start the canary release process over again.

![](images/screens/v091/canary_force_rollback_2.png)

### Autoscale the services
As the canary workflow rebalances traffic routing between the deployed services, the demands placed on each will change. The final step in our Vamp Runner recipe is to account for this by automatically scaling the services up and down.

Click **Run** next to **Auto scaling** and Vamp will create a breed and workflow named `auto-scaling`.

As with the routing weight distribution, you can scale the services manually in the DEPLOYMENTS section of the Vamp UI.


## Clean up and move along
You can set Vamp back to its initial (clean) state at any step in a recipe. Click the **Clean up** button on the right of the **Recipes** screen to remove all deployments, gateways, workflows and artifacts that have been created by the selected recipe.  The status of each step will also be reset and you can start from the beginning again.

## Summing up

Now you’ve got to grips with Vamp Runner and the power of workflows there’s surely no stopping you. You can try out the other Vamp Runner recipes (remember to clean up when you’re done) like autoscaling and mocking metrics. 

## Looking for more of a challenge?
Just for fun, you could try these:

* How might you integrate workflow automated canary releasing into a CI pipeline?
* Could you apply the mock metrics and/or canary workflows used in this recipe to another project?
* Can you adapt the canary workflow so it is triggered by a new deployment of the Sava service?

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
{{< /note >}}

