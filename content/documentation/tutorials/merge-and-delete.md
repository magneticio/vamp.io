---
date: 2016-09-13T09:00:00+00:00
title: Merge and delete
menu:
  main:
    parent: "Tutorials"
    weight: 50
---

In the [previous tutorial we "over-engineered" our service based solution a bit](/documentation/tutorials/split-a-monolith/) (on purpose of course). We don't really need two backends services, so in this tutorial we will introduce our newly engineered solution and transition to it using Vamp blueprints and canary releasing methods. In this tutorial we will:

* Get some background and theory on merging services
* Prepare our blueprint
* Transition from blueprints to deployments (and back)
* Delete parts of the deployment
* Answer the all important question _when would I use this?_

## Some background and theory

What we are going to do is create a new blueprint that is completely valid by itself and merge it
with our already running deployment. This might sound strange at first, but it makes sense. Why? Merging will enable us to slowly move from the previous solution to the next solution. Once moved over, we can
remove any parts we no longer need, i.e. the former "over-engineered" topology.

![](/images/services_atob.svg)

In the diagram above, this is visualized as follows:

1. We have a running deployment (the blue circle with the "1"). To this we introduce a new blueprint
which is merged with the running deployment (the pink circle with the "2").
2. At a point, both are active as we are transitioning from blue to pink.
3. Once we are fully on pink, we actively remove/decommission the blue part.

Is this the same as a blue/green release? Yes, but we like pink better ;o)

## Prepare our blueprint

The below blueprint describes our more reasonable service topology. Again, this blueprint is completely
valid by itself. You could just deploy it somewhere separately and not merge it with our over-engineered
topology. Notice the following:

- There is only one backend cluster with one service
- There is no gateway specified. This is because we will use the gateway already present and configured in the running deployment. It would be perfectly correct to specify the old gateway, just not necesary.

```
name: sava:1.3
clusters:
  sava: # cluster 1
    services:
      breed:
        name: sava-frontend:1.3.0
        deployable: magneticio/sava-frontend:1.3.0
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
  backend: # cluster 4 - it's the 2nd cluster in this blueprint, but will be the 4th after the merge
    services:
      breed:
        name: sava-backend:1.3.0
        deployable: magneticio/sava-backend:1.3.0
        ports:
          webport: 8080/http
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
```

We are going to merge this blueprint with our running sava:1.2 deployment in the same way we approached the merge in the [run a canary release tutorial](/documentation/tutorials/run-a-canary-release/).  
You can do this using either the Vamp UI or directly via the Vamp API.

### Merge using the UI

1. Go to the **Blueprints** page and click **Add** (top right)
* Paste in the above blueprint and click **Save**. Vamp will store the blueprint and make it available for deployment 
* Open the action menu on the **sava:1.3** blueprint and select **Merge to** 
  ![](/images/screens/v094/tut4_merge.png)
* You'll be prompted to select the deployment you wish to merge the blueprint with - select **sava:1.2**
* Click **Merge** to deploy the services sava:1.3 and sava-backend:1.3 to the running sava:1.2 deployment.  

### Merge using the API

You can complete the same merge action with the Vamp API - remember to set the `Content-Type: application/x-yaml` for your requests:

1. To create the blueprint, `POST` the above blueprint YAML to `/api/v1/blueprints`  
* To merge the blueprint, `PUT` the below YAML to `/api/v1/deployments/sava:1.2`  

  ```
  name: sava:1.3
  ```

Vamp will work out the differences and update the deployment accordingly.  

![](/images/screens/v094/tut4_merged_deployment.png)

Notice we now have:

* Three backend clusters: two old ones (backend1 and backend2) and one from the new merge.
* Two services in the sava cluster: the old sava-frontend:1.2 and the new sava-frontend:1.3.  
  If you open the sava cluster **webport** you will see that the sava-frontend:1.2.0 route has a weight of 100% and the new new sava-frontend:1.3.0 route has a weight of 0%. Whenever Vamp merges a new service to an existing cluster it applies the default weight of 0%. 
![](/images/screens/v094/tut4_route_weights.png)

So what happened here? Vamp has worked out what parts were already there and what parts should be added. This is done based on naming, i.e. the sava cluster already existed, so Vamp added a service to it with 0% route weight. A cluster named "backend" didn't exist yet, so it was created. Effectively, we have merged the running deployment with a new blueprint.

## Transition from blueprints to deployments and back

Moving from the old to the new topology is now just a question of "turning the weight dial". You could do this in one go, or slowly adjust it. The easiest and neatest way is to update the deployment as you go.

Vamp has a convenient option for this: you can export any deployment as a blueprint! 

* In the API, append `?as_blueprint=true` to any deployment URI, Vamp strips all runtime info and outputs a perfectly valid blueprint of that specific deployment. The default output will be in JSON format, but you can also get a YAML format. Just set the header `Accept: application/x-yaml` and Vamp will give you a YAML format blueprint of that deployment.
* In the UI, go to the **Deployments** page, open the action menu on a deployment and click **Export as a blueprint**, Vamp strips all runtime info and saves the output as a new blueprint resource.

![](/images/screens/v094/tut4_export_as_blueprint.png)

In our specific example, we could export the deployment as a blueprint and update the weight to a 50% to 50% split. Then we could do this again, but with a 80% to 20% split and so on. See the abbreviated example below where we set the weight keys to 50% for both routes.


```
name: eb2d505e-f5cf-4aed-b4ae-326a8ca54577
clusters:
  sava:
    services:
    - breed:
        name: sava-frontend:1.2.0
        deployable: magneticio/sava-frontend:1.2.0
        ports:
          webport: 8080/http
        environment_variables:
          BACKEND_1: http://$backend1.host:$backend1.ports.webport/api/message
          BACKEND_2: http://$backend2.host:$backend2.ports.webport/api/message
        constants: {}
        dependencies:
          backend1: sava-backend1:1.2.0
          backend2: sava-backend2:1.2.0
      environment_variables: {}
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
      dialects: {}
    - breed:
        name: sava-frontend:1.3.0
        deployable: magneticio/sava-frontend:1.3.0
        ports:
          webport: 8080/http
        environment_variables:
          BACKEND: http://$backend.host:$backend.ports.webport/api/message
        constants: {}
        dependencies:
          backend: sava-backend:1.3.0
      environment_variables: {}
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
      dialects: {}
    gateways:  # update the route weight here
      port:
        sticky: none
        routes:
          sava-frontend:1.2.0:
            weight: 50%  
          sava-frontend:1.3.0:
            weight: 50%  
```

## Delete parts of the deployment

Vamp helps you transition between states and avoid "hard" switches, so deleting parts of a deployment is somewhat different than you might expect.

In essence, a delete is just another update of the deployment: you specify what you want to remove using a blueprint and send it to the deployment's URI using the `DELETE`HTTP verb: yes, it is HTTP Delete with a body, not just a URI and some id.

This means you can specifically target parts of your deployment to be removed instead of deleting the whole thing. For this tutorial we are going to delete the "over-engineered" old part of our deployment.

Currently, deleting works in two steps:
- Set all routings to `weight: 0%` of the services you want to delete with a simple update.
- Execute the delete.


{{< note title="Note!" >}}
You need to explicitly set the routing weight of the service you want to deploy to zero before deleting. Here is why: When you have, for example, four active services divided in a 25/25/20/30 split and you delete the one with 30%, Vamp doesn't know how you want to redistribute the "left over" 30% of traffic. For this reason the user should first explicitly divide this and then perform the delete.
{{< /note >}}

**Setting to zero**

When you grab the YAML version of the deployment, just like above, you can set all the `weight` entries for the Sava 1.2.0 versions to `0` and update the deployment as usual. See the cleaned up example and make sure to adjust the name to your specific situation.


```yaml
---
name: 125fd95c-a756-4635-8e1a-361085037870
clusters:
  backend1:
    services:
    - breed:
        ref: sava-backend1:1.2.0
    gateways:
      routes:
        sava-backend1:1.2.0:
          weight: 0%
  backend2:
    services:
    - breed:
        ref: sava-backend2:1.2.0
    gateways:
      routes:
        sava-backend2:1.2.0:
          weight: 0%
  sava:
    services:
    - breed:
        ref: sava-frontend:1.3.0

    - breed:
        ref: sava-frontend:1.2.0
    gateways:
      routes:
        sava-frontend:1.3.0:
          weight: 100%
        sava-frontend:1.2.0:
          weight: 0%
```



**Doing the delete**

Now, you can take the exact same YAML blueprint or use one that's a bit cleaned up for clarity and send it in the body of the `DELETE` to the deployment resource, e.g. `/api/v1/deployments/sava`.


Using the Vamp UI you can delete parts of your deployment by using the **REMOVE FROM** function under the **BLUEPRINTS** tab.



```yaml
---
name: sava:1.2
clusters:
  sava:
    services:
      breed:
        ref: sava-frontend:1.2.0
  backend1:
    services:
      breed:
        ref: sava-backend1:1.2.0
  backend2:
    services:
      breed:
        ref: sava-backend2:1.2.0
```


We removed the `deployable`, `environment_variables`, `ports` and some other parts of the blueprint. These are actually not necessary for updating or deletion. Besides that, this is actually exactly the same blueprint we used to initially deploy the "old" topology.

You can check the result in the UI: you should be left with just one backend and one frontend:

![](/images/screens/v091/tut4_after_delete.png)

## When would I use this?

Sounds cool, but when would I use this in practice? Well, basically anytime you release something new!
For example a bugfix release for a mobile API that "didn't change anything significantly"? You could test
this separately and describe it in its own blueprint. After testing, you would merge that exact same blueprint
with your already running production version (the one without the bugfix) and slowly move over to new version.

New major release of your customer facing app? You probably also have some new dependencies that come with that
release. You create some containers and write up a blueprint that describes this new situation, run it in acceptance and test and what have you. Later, you merge it into your production setup, effectively putting it next to it and then slowly move from the old situation to the new situation, including dependencies.

{{< note title="What next?" >}}
* This is the end of this initial getting started tutorial. We haven't done anything with Vamp's SLA's yet, scaling or dictionary system, so there is much more to come!
* [Vamp use cases](/why-use-vamp/use-cases/use-cases/)
* Find out how to [install a production-grade set up of Vamp](/documentation/installation/overview/)
{{< /note >}}




