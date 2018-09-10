---
date: 2016-09-13T09:00:00+00:00
title: 4. Merge and delete
menu:
  main:
    parent: "Tutorials"
    weight: 50
---

In the [previous tutorial](/documentation/tutorials/split-a-monolith/) we "over-engineered" our service based solution a bit (on purpose of course). We don't really need two backends services, so in this tutorial we will introduce our newly engineered solution and transition to it using Vamp blueprints and canary releasing methods. In this tutorial we will:

* Get some background and theory on merging services
* Prepare our blueprint
* Merge the new topology with the running deployment
* Decommission parts of the deployment
* Answer the all important question _when would I use this?_

#### Requirements:
* A Kubernetes cluster with at least 4 nodes (8 vCPUs and 28GB memory); or
* A DC/OS cluster with at least 4 nodes (1 public agent, 16 vCPUs and 48GB memory)

{{< note title="Note!" >}} **Kubernetes only**: you will need **a cluster with 10 vCPUs** if you want to run this tutorial alongside the first two tutorials. {{< /note >}}

## Some background and theory

What we are going to do is create a new blueprint that is completely valid by itself and merge it
with our already running deployment. This might sound strange at first, but it makes sense. Why? Merging will enable us to slowly move from the previous solution to the next solution. Once moved over, we can
remove any parts we no longer need, i.e. the former "over-engineered" topology.

![](/images/screens/v094/services_atob.png)

In the diagram above, this is visualized as follows:

1. We initiate a running deployment by deploying Blueprint A
2. We introduce a new service to the deployment by merging Blueprint B with the running deployment.
3. At this point, both blueprints are active allowing for a smooth transition, for example, by canary release.
4. Once we are fully on running on Blueprint B, we can remove/decommission Blueprint A

## Prepare our blueprint

The below blueprint describes our more reasonable service topology. This blueprint is completely valid by itself - you could just deploy it somewhere separately and not merge it with the over-engineered sava:1.2 topology.

Notice the following:

* There is only one backend cluster, with one service
* No gateway is specified (we will use the existing external gateway in the running deployment)

```yaml
name: sava:1.3
clusters:
  sava: # cluster 1
    services:
      breed:
        name: sava-frontend:1.3.0
        deployable: vampio/sava-frontend:1.3.0
        ports:
          webport: 8080/http
        environment_variables:
          BACKEND: http://$backend.host:$backend.ports.webport/api/message
        dependencies:
          backend: sava-backend:1.3.0
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
      health_checks:
        initial_delay: 10s
        port: webport
        timeout: 5s
        interval: 10s
        failures: 10
  backend: # cluster 2
    services:
      breed:
        name: sava-backend:1.3.0
        deployable: vampio/sava-backend:1.3.0
        ports:
          webport: 8080/http
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
```

## Merge the topologies

We can now merge the blueprint describing our new topology with the running **sava-new** deployment. This is done in the same way we added a new service in the [run a canary release tutorial](/documentation/tutorials/run-a-canary-release/).  

Merging the blueprint will deploy the new sava:1.3 services alongside sava:1.2, without routing any traffic to them.

You can complete the merge using either the Vamp UI.

### Merge using the Vamp UI

1. In the Vamp UI, select the environment *environment* and go to the **Blueprints** page and click **Add** (top right)
2. Paste in the above blueprint and click **Save**. Vamp will store the blueprint and make it available for deployment 
3. Open the action menu on the **sava:1.3** blueprint and select **Merge to** 
  ![](/images/screens/v100/tut4/vampee-environment-blueprints-sava13-mergeto.png)
4. You'll be prompted to select the deployment you wish to merge the blueprint with - select **sava-new**
5. Click **Merge** to deploy the **sava-fontend:1.3** and **sava-backend:1.3** services to the running sava deployment.  
  Vamp will work out the differences and update the deployment accordingly.
  ![](/images/screens/v100/tut4/vampee-environment-deployments-savanew-5clusters.png)

So what happened here? Vamp worked out which parts of the blueprint were already in the deployment and which parts should be added. This is done based on naming. The sava cluster already existed, so Vamp simply added a service to it with 0% route weight. A cluster named "backend" didn't exist, so Vamp created it.

Notice we now have:

* Three backend clusters: the two original ones (backend1 and backend2) and one from the new merge.
* Two services in the sava cluster: the original sava-frontend:1.2 and the new sava-frontend:1.3.
  
  If you open the **sava-new/sava/webport** internal gateway, you will see that the sava-frontend:1.2.0 route has a weight of 100% and the new sava-frontend:1.3.0 route has a weight of 0%. Whenever Vamp merges a new service to an existing cluster, the default weight of 0% is applied. This means **no traffic will be routed to the sava:1.3 services yet**.

![](/images/screens/v100/tut4/vampee-environment-gateways-savanew-sava-internal-2routes.png)

Now both blueprints are deployed, moving from the old to the new topology is just a question of “turning the weight dial”. You could do this in one go, or slowly adjust it.

![](/images/screens/v100/tut4/vampee-environment-gateways-savanew-sava-internal-editweights.png)

## Decommission parts of the deployment

Once we are fully running on sava:1.3, we can decommission the old, over-engineered sava:1.2.  We do this by updating the deployment again, this time to remove the sava:1.2 blueprint, effectively deleting all deployed sava:1.2 services.

{{< note title="Note!" >}} Vamp prevents you from removing a service unless its weight is first set to 0%. {{< /note >}}

### Delete using the Vamp UI

1. In the Vamp UI, select the environment *environment* and go to the **Blueprints** page
2. Open the action menu on the **sava:1.2** blueprint and select **Remove from** 
3. You'll be prompted to select the deployment you wish to remove the blueprint from - select **sava-new**
5. Click **Remove** to delete the sava-frontend:1.2, sava-backend1:1.2 and sava-backend2:1.2 services from the running sava-new deployment
  ![](/images/screens/v100/tut4/vampee-environment-deployments-savanew-2clusters.png)

Vamp will update the running deployment, removing all elements described in the sava:1.2 blueprint. The result is that our running deployment **sava-new now contains no sava:1.2 services**.

## When would I use this?

Sounds cool, but when would I use this in practice? Well, basically anytime you release something new!

* A bugfix release for a mobile API that "didn't change anything significantly"? You could test this separately and describe it in its own blueprint. After testing, you would merge that same blueprint with your already running production version (the one without the bugfix) and slowly migrate traffic over to the new version.

* New major release of your customer facing app? You probably also have some new dependencies that come with that release. You create some containers and write up a blueprint that describes this new situation and test it. Later, you merge it into your production setup, running it in parallel before slowly migrating traffic from the current version to the new version, including dependencies.

