---
date: 2016-12-05T09:00:00+00:00
title: Automate a canary release with rollback
menu:
  main:
    parent: "Tutorials"
    name: "Automate a canary release with rollback"
    weight: 70
---

One of the most powerful features of Vamp are workflows. Vamp workflows are containers with injected Node.js scripts that access the Vamp API for all kinds of automation and optimisation tasks. Vamp manages workflows just like any other container inside your cluster, making them robust, scalable and dynamic. With very little effort you can use workflows to create valuable and powerful automation playbooks for testing and deployments. 

This tutorial will show how workflows can be used to run an automated canary release, gradually introducing an updated service and initiating a rollback to the old version in case 500 errors are measured on the new service. We will use our nifty little demo and automation tool Vamp Runner to demonstrate this, but you could just as easily perform all the described actions manually in the Vamp UI or using the API.  

In this tutorial we will:

1. [Run Vamp with Docker Toolbox](/documentation/tutorials/automate-a-canary-release/#run-vamp-with-docker-toolbox)
* [Spin up Vamp Runner](/documentation/tutorials/automate-a-canary-release/#spin-up-vamp-runner)  
* [Create a Blueprint and deploy some services](/documentation/tutorials/automate-a-canary-release/#create-a-blueprint-and-deploy-some-services) 
* [Create automation workflows](/documentation/tutorials/automate-a-canary-release/#create-automation-workflows)
  * Generate traffic requests
  * Automate a canary release
* [Force a rollback](/documentation/tutorials/automate-a-canary-release/#force-a-rollback)
* [Autoscale services](/documentation/tutorials/automate-a-canary-release/#autoscale-the-services)
* [Reset all actions](/documentation/tutorials/automate-a-canary-release/#clear-up-and-move-along)

## Run Vamp with Docker Toolbox

{{< note title="Tested with Docker Toolbox" >}}
This tutorial has been tested on Vamp hello world v0.9.4 running on Docker Toolbox. 
{{< /note >}}

If you are running Vamp hello world v0.9.4 together with Docker for Mac, you will need to install Docker Toolbox and run Vamp from the Docker Quickstart Terminal instead ([docker.com - install Docker Toolbox](https://www.docker.com/products/docker-toolbox)).   
A typical run command on Mac OS X with Docker Toolbox would be:

   ```
   docker run --net=host \
              -v /var/run/docker.sock:/var/run/docker.sock \
              -v `docker-machine ssh default "which docker"`:/bin/docker \
              -v "/sys/fs/cgroup:/sys/fs/cgroup" \
              -e "DOCKER_HOST_IP=$(docker-machine ip default)" \
              magneticio/vamp-docker:0.9.4
   ```
  
## Spin up Vamp Runner
Vamp Runner is the tool we use to demonstrate how individual Vamp features can be combined to fit real world use cases. This unlocks the real power of Vamp. We developed Vamp Runner as an automated integration testing tool to make sure important patterns of Vamp worked as expected against all supported container scheduling stacks when building new versions of Vamp. After we realised how powerful the concept of recipes was, we added a graphical UI on top for demonstration purposes. Vamp Runner can still be used in CLI mode though for your automated integration testing purposes. All actions triggered by Vamp Runner can also be triggered by your CI or automation tool of choice, check out the recipes folder in the Github project ([github.com/magneticio - Vamp Runner recipes](https://github.com/magneticio/vamp-runner/tree/master/recipes)).

Once Vamp is up and running, you can deploy Vamp Runner alongside it (if you don’t already have a running version of Vamp, check the [Vamp hello world set up](documentation/installation/hello-world) ). Vamp Runner connects to the Vamp API endpoint, specified as `VAMP_RUNNER_API_URL` in the below docker run command. Note that the IP of your Vamp API location might be different, change this accordingly.
```
docker run --net=host \
        -e VAMP_RUNNER_API_URL=http://192.168.99.100:8080/api/v1 \
        magneticio/vamp-runner:0.9.4   
```

You can access the Vamp Runner UI at port 8088. 

![](/images/screens/v094/runner_recipes_canary.png)

* The available RECIPES (demos) are listed on the left  
  Each recipe contains a number of steps that you can click through one by one. We are going to work through the recipe **Canary Release - Introducing New Service Version**
* The RESET button allows you to quickly clear up all artifacts created by a recipe, we'll use that later on.                                                   

## Create a blueprint and deploy some services
Vamp Runner will quickly create and deploy all the artifacts required for our canary release demo. If you prefer, you could create each artifact manually - click the INFO button to show the YAML used for each step or check the GitHub repo ([github.com/magneticio - Vamp Runner recipes](https://github.com/magneticio/vamp-runner/tree/master/recipes)).

1. Select **Canary Release - Introducing New Service Version** from the RECIPES list.
  
2. Click **RUN** next to the first recipe step **Create blueprint**
  * Each recipe step must be performed in sequence
  * The INFO button next to each step shows you the exact YAML being posted to the VAMP API, in this case it shows us the blueprint that will be created
  * Once a step has completed successfully, the circle next to it will change from blue to green. If for whatever reason the desired state cannot be reached the circle will colour red. (NB check the recipe JSON definition file for each recipe the GitHub project recipes folder to examine the states that are defined to check if a step has been executed successfully.)

3. Wait for the Create blueprint step to complete and the circle to turn green, then work through the next four steps in turn:
  * **Create breed and scale** - creates the artifacts needed to deploy the service sava:1.0 (these are referenced in our placeholder blueprint)
  * **Deploy blueprint** - deploys the sava:1.0 service with a routing weight of 100% (all traffic)
  * **Create gateway** - exposes the external gateway 9050 mapped to our Sava deployment
  * **Introduce new service version** - merges the updated sava:1.1 with the running sava deployment. The new service variant is added to the existing Sava cluster with a route weight of 0% (no traffic)

 You can watch the created artifacts and deployments appear in the Vamp UI (or via the API) and, once deployed, you can access the sava service at the external gateway Vamp Runner created (9050).

![](/images/screens/v094/canary_deployments.png)

![](/images/screens/v091/canary_sava10.png)

## Create automation workflows
With two versions of our service ready to go, we can get started with some automation. Conveniently, Vamp Runner can set all this up for us. This recipe automates a canary release using two workflows:

* a workflow to generate traffic requests (so we can see metrics and introduce 500 errors) 
* a workflow to adjust traffic distribution (for canary release and rollback). 

First, breeds are created with a Node.js script for each workflow. Next, workflows are created that reference the breeds. Vamp injects the JavaScript from the referenced breeds into workflow agent containers ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)) and these are deployed to run at the defined workflow schedule (continuously, triggered by Vamp events or at a set time). 

Inside the deployed workflow containers, the Vamp Node.js client library enables JavaScript to easily speak with the Vamp API. See the gitHub project for details ([github.com/magneticio - Vamp Node.js Client](https://github.com/magneticio/vamp-node-client)) or [read more about workflows](/documentation/using-vamp/workflows)

### Workflow 1: Generate traffic requests
The next step is to get some traffic requests flowing into the deployed services.    

1. Click RUN next to Generate traffic requests  
  Vamp will create a breed and workflow named **traffic**. You can see the exact YAML posted to the Vamp API to complete this by clicking INFO.
  
The created traffic workflow will send generated traffic requests to our services at the defined port (9050). The workflow is scheduled to run as a daemon, so it will begin generating traffic requests as soon as it is created. You can watch them arrive at the gateway in the Vamp UI.

![](/images/screens/v094/canary_traffic_gateways.png)

The routing weights are currenctly set to **sava:1.0 - 100%** and **sava:1.1 - 0%**. This means that all incoming traffic will routed to sava:1.0. 


### Workflow 2: Automate a canary release
Now it's time to introduce sava:1.1 to the world by canary release. 

1. Click **Run** next to **Automated canary release**  
  Vamp will create a breed and a workflow named **canary**. Go ahead and click INFO to see the YAML.
  
  ![](/images/screens/v094/canary_yaml.png)

Once created, the canary workflow will begin to gradually rebalance traffic routing, introducing sava:1.1 while phasing out sava:1.0. You can see the weight distribution on the internal gateway updating in the Vamp UI.

![](/images/screens/v094/canary_gateways.png)

You can also use the WEIGHT slider in the Vamp UI to adjust the weight manually, the canary workflow will kick back in and take over from your setting.

## Force a rollback
As there are generated traffic requests flowing in to the sava service, the canary workflow can track the health of the deployed services and initiate a rollback in case errors are detected. We can demonstrate this by maliciously destroying the sava:1.1 deployment from the Marathon UI, effectively forcing a full rollback to sava:1.0. The error limit in the canary workflow is set to 500, so this is what we need to generate to force a rollback.

1. Go the Marathon UI (on port 9090) and find the sava:1.1 container running inside the sava group.
* Select **destroy** to kill the container, this will cause the required 500 errors to appear

![](/images/screens/v091/canary_marathon_destroy.png)

You will see the following happen:

* The canary workflow will pick up on the errors for traffic routed to sava:1.1 and rebalance the routing weight to send 100% of traffic to sava:1.0. 
* Vamp's default health workflow will also pick up on the errors and show a drop in health to 0%
* Marathon will redeploy the sava:1.1 service as soon as possible 
* Vamp will update its routing rules to respect the new location(s) of the Sava 1.1 container in the cluster
* After 30 seconds of no errors, service health will return to 100% and the canary workflow will start the canary release process over again.

![](/images/screens/v094/canary_force_rollback_1.png)


## Autoscale the services
The final step in this Vamp Runner recipe deploys a workflow to automatically scale the services as their weights are rebalanced. Go ahead and run this step too - we will explain more about how Vamp manages autoscaling in a future tutorial.

## Clear up and move along
You can set Vamp back to its initial (clean) state at any step in a recipe. Click **RESET** to remove all deployments, gateways, workflows and static artifacts that have been created by the selected recipe. After clean up, the status of each recipe step will be reset, so you can start from the beginning again.

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

