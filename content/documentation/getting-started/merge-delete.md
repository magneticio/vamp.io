---
title: 4. Merging and deleting services
type: documentation
weight: 50
draft: true
menu:
    main:
      parent: getting-started
    
---

# 4. Merging a changed topology

In the [previous part](/documentation/getting-started/splitting-services/) we over-engineered our
service based solution a bit: on purpose of course. We don't really need two backends services.
So in this part we will introduce our newly engineered solution and transition to it using Vamp's
blueprints and canary releasing methods.

## Step 1: Some background and theory

What we are going to do is create a new blueprint that is completely valid by itself and merge it
with the already running deployment. This might sound strange at first, but it makes sense. Why? Because
this will enable us to slowly move from the previous solution to the next solution. Once moved over, we can
remove parts we no longer need, i.e. the former over-engineerd topology.

![](/img/services_atob.svg)

In the diagram above, this is visualized as follows:

1. We have a running deployment (the blue circle with the "1"). To this we introduce a new blueprint
which is merged with the running deployment (the pink circle with the "2").
2. At a point, both are active as we are transitioning from blue to pink.
3. Once we are fully on pink, we actively remove/decomission the blue part.

Is this the same as a blue/green release? Yes, but we like pink better ;o)

## Step 2: Prepping our blueprint

The following blueprint describes our more reasonable service topology. Again, this blueprint is completely
valid by itself. You could just deploy it somewhere separately and not merge it with our over-engineered 
topology. Notice it only has one backend cluster with one service.

<pre class="prettyprint lang-yaml">
name: sava_fe_be_1_3

endpoints:
  sava.ports.port: 9050

clusters:

  sava:
    services:
      breed:
        name: sava_frontend_1_3
        deployable: magneticio/sava-1.3_frontend:0.7.0
        ports:
          name: port
          value: 80/http
          direction: OUT

        environment_variables:

          - name: backend.host
            direction: IN
            alias: BACKEND_HOST

          - name: backend.ports.port
            direction: IN
            alias: BACKEND_PORT

        dependencies:
          backend: sava_backend_1_3

  backend:
    services:
      breed:
        name: sava_backend_1_3
        # Reusing the same 1.2 image, even though name implies a newer release.
        deployable: magneticio/sava-1.2_backend:0.7.0
        ports:
          name: port
          value: 80/http
          direction: OUT
</pre>

A `PUT` to our deployment (e.g. `/api/v1/deployments/125fd95c-a756-4635-8e1a-361085037870`) that was based on [the blueprint from the previous part of the tutorial](/documentation/getting-started/splitting-services/) should yield a deployment JSON structure with the following properties (we left some irrelevant
parts out):

1. Two `services` in the sava `cluster`: the old one at 100% and the new one at 0% weight.
2. Three backends in the `cluster` list: two old ones and one new one.

<pre class="prettyprint lang-json"> 
{
  "name": "125fd95c-a756-4635-8e1a-361085037870",
  "endpoints": {
    "sava.ports.port": 9050
  },
  "clusters": {
    "sava": {
      "services": [
        {
          "breed": {
            "name": "sava_frontend_1_2",
            "deployable": "magneticio/sava-1.2_frontend:0.7.0"
          },
          "routing": {
            "weight": 100
          }
        },
        {
          "breed": {
            "name": "sava_frontend_1_3",
            "deployable": "magneticio/sava-1.3_frontend:0.7.0"
          },
          "routing": {
            "weight": 0
          }
        }
      ]
    },
    "backend": {
      "services": [
        {
          "breed": {
            "name": "sava_backend_1_3",
            "deployable": "magneticio/sava-1.2_backend:0.7.0"
          }
        }
      ]
    },
    "backend1": {
      "services": [
        {
          "breed": {
            "name": "sava_backend1_1_2",
            "deployable": "magneticio/sava-1.2_backend:0.7.0"
          }
        }
      ]
    },
    "backend2": {
      "services": [
        {
          "breed": {
            "name": "sava_backend2_1_2",
            "deployable": "magneticio/sava-1.2_backend:0.7.0"
          }
        }
      ]
    }
  }
}
</pre>  

So what happened here? Vamp has worked out what parts were already there and what parts should be merged or added. This is done based on naming, i.e. the save cluster already existed, so Vamp added a service to it at 0% weight. A cluster named "backend" didn't exist yet, so it was created. Effectively, we have merged
the running deployment with a new blueprint.

## Step 3: Transitioning from blueprints to deployments and back

Moving from the old to the new topology is now just a question of "turning the weight dial". You 
could do this in one go, or slowly adjust it. The easiest and neatest way is to just update the blueprint
as you go and `PUT` it to the deployment. 

Vamp has a convenient option for this: you can export any deployment as a blueprint! It will be in JSON format but is functionally 100% equivalent to the YAML version. By appending `?as_blueprint=true` to any deployment URI Vamp strips all runtime info like servers and start time and output a perfectly valid
blueprint of that specific deployment. You can then use that to update any values as you see fit and re-`PUT` it again for changes to take effect. 

![](/img/screencap_asblueprint.gif)

{{% alert info %}}
**Tip**: By appending `?as_blueprint=true` to any deployment URI Vamp spits out a perfectly valid
blueprint of that specific deployment. This way you can clone whole deployment in seconds. Pretty awesome.  
{{% /alert %}}

In this specific example, we could export the deployment as a blueprint and update the weight to a 95% to 
5% split. Then we could do this again, but with a 80% to 20% split and so on. See the abbreviated example
below:

<pre class="prettyprint lang-json">
 ... 
 "sava": {
      "services": [
        {
          "breed": {
            "name": "sava_frontend_1_2",
            "deployable": "magneticio/sava-1.2_frontend:0.7.0"
          },
          "routing": {
            "weight": 95
          }
        },
        {
          "breed": {
            "name": "sava_frontend_1_3",
            "deployable": "magneticio/sava-1.3_frontend:0.7.0"
          },
          "routing": {
            "weight": 5
          }
        }
      ]
    }
...
</pre>

## Step 4: Deleting parts of the deployment

Vamp helps you transition between states and avoid "hard" switches, so deleting parts of a deployment is somewhat different than you might expect. In essence, a delete is just another update of the deployment: you specify what you want to remove using a blueprint and send it to the deployment's URI using the `DELETE`HTTP verb: yes, it is HTTP Delete with a body, not just a URI and some id.

This means you can specifically target parts of your deployment to be removed instead of deleting the whole thing. For this tutorial we are going to delete the over-engineered "old" part of our deployment by grabbing the "old" blueprint, cleaning it up a bit (see below) and sending it in the body of the `DELETE` to the deployment resource, e.g. `/api/v1/deployments/125fd95c-a756-4635-8e1a-361085037870`

<pre class="prettyprint lang-yaml">
name: sava_fe_be_1_2
clusters:
  sava:
    services:
      breed:
        name: sava_frontend_1_2
  backend1:
    services:
      breed:
        name: sava_backend1_1_2
  backend2:
    services:
      breed:
        name: sava_backend2_1_2
</pre>

{{% alert info %}}
**Note**: We removed the `deployable`, `environment_variables`, `ports` and some other parts of the blueprint. These are actually not necessary for deletion. Besides that, this actually exactly the same blueprint we used to initially deploy
the "old" topology.
{{% /alert %}}

This is the end of this initial getting started tutorial. We haven't done anything with Vamp's SLA's yet, scaling or dictionary system, so there is much more to come!





