---
date: 2016-09-13T09:00:00+00:00
title: Run a canary release
menu:
  main:
    parent: "Tutorials"
    weight: 30
aliases:
    - /documentation/guides/getting-started-tutorial/2-canary-release/
---

In the [previous tutorial we deployed our app sava 1.0](/documentation/tutorials/deploy-your-first-blueprint/). If you haven't walked through that part already, please do so before continuing.

Now let's say we have a new version of this great application that we want to canary release into production. We have it containerised as `magneticio/sava:1.1.0` and are ready to go. In this tutorial we will:

* Prepare our blueprint
* Deploy the new version of our application next to the old one
* Use conditions to target specific groups
* Learn a bit more about conditions

## Prepare our blueprint

Vamp allows you to do canary releases across a cluster by merging new services. Take a look at the YAML blueprint example below. It is quite similar to the blueprint we initially used to deploy sava 1.0.0, with one difference - this time the breed describes the sava:1.1.0 service.

``` 
name: sava:1.1
clusters:
  sava:
    services:
      breed:
        name: sava:1.1.0
        deployable: magneticio/sava:1.1.0
        ports:
          webport: 8080/http
      scale:
        cpu: 0.2       
        memory: 64MB
        instances: 1
```

## Deploy the new version of our application next to the old one

Let's introduce sava:1.1.0 to the running deployment.  
We will use the above blueprint to merge our new service with the running deployment - this will deploy sava:1.1.0 alongside the running sava:1.0.0 service. The merge will not affect the running sava:1.0.0 service and no traffic will be routed to sava:1.1.0 yet.

### Merge using the UI

1. Go to the **Blueprints** page and click **Add** (top right)
* Paste in the above blueprint and click **Save**. Vamp will store the blueprint and make it available for deployment 
* Open the action menu on the **sava:1.1** blueprint and select **Merge to** 
  ![](/images/screens/v094/tut2_merge.png)
* You'll be prompted to select the deployment you wish to merge the blueprint with - select **sava**
* Click **Merge** to deploy the sava:1.1.0 service to the running deployment.  
  Vamp will work out the differences and update the deployment accordingly.
  ![](/images/screens/v094/tut2_merged_deployment.png)

### Merge using the API

You can complete the same merge with the Vamp API - take care to set the `Content-Type: application/x-yaml`:

1. To create the blueprint, `POST` the above [blueprint YAML](/documentation/tutorials/run-a-canary-release/#prepare-our-blueprint) to `/api/v1/blueprints`  
* To merge the blueprint, `PUT` the below YAML to `/api/v1/deployments/sava`  

  ```
  name: sava:1.1
  ```

## Canary release
When Vamp has finished deploying, you can open the **sava/sava/webport** gateway.  You will see two routes listed - one for the sava:1.0.0 service and one for the new sava:1.1.0 service. The weight of our newly merged service is set to 0% - this means that no traffic is currently being routed here. Whenever Vamp merges a new service to an existing cluster it applies the default weight of 0%. Let's adjust the weight and start to send traffic to our new sava:1.1.0

1. Click the edit icon next to *WEIGHT*
* Adjust the weight slider to distribute traffic 50% / 50% between the two services
  ![](/images/screens/v094/tut2_sliders_canary.png)
* Click **Save** and Vamp will update the load balancing rules accordingly
* Click the **HOST - PORT/TYPE** to open the gateway. Each time you do this the application will switch between a 1.0 page and a 1.1 page. You can also use the Vamp reverse proxy URL to access the gateway (note that this works best with the "Incognito" or "Anonymous" mode of your browser because of the caching of static assets) `http://localhost:8080/proxy/gateways/sava%2Fsava%2Fwebport/`

![](/images/screens/v094/monolith_canary1.png)

## Use conditions to target specific groups

Using percentages to divide traffic between versions is already quite powerful, but also very simplistic.
What if, for instance, you want to specifically target a group of users? Or channel specific requests
from an internal service? Vamp allows you to do this right from the blueprint DSL.

Let's start simple: We can use the Vamp UI to allow only Chrome users to access v1.1.0 of our application.

1. Go to the **Gateways** page and open the **sava/sava/webport** gateway
* Click the edit condition icon for the **sava/sava/sava:1.1.0/webport** route and enter the condition `User-Agent = Chrome`
![](/images/screens/v094/tut2_edit_condition.png)
  Now we need to set a strength for the condition.  
  As we want all Chrome users to be sent to this route, we will set the condition strength to 100%
* Click the edit condition strength icon for the **sava/sava/sava:1.1.0/webport** route and move the slider to 100%
![](/images/screens/v094/tut2_edit_condition_strength.png)
  Finally, we need to account for routing of traffic that does not match the condition (that is, all non-Chrome users). We do this using the route weight.
  As we want only Chrome users to be sent to the sava/sava/sava:1.1.0/webport route, we will set the route weight to 0%. That might sound confusing, but remember that the route weight is used for distributing traffic that didn't match the applied condition - and we want 0% of all non-Chrome users to be sent to the sava/sava/sava:1.1.0/webport route
* Click the edit icon next to **WEIGHT**
* Adjust the weight slider to **0%** for the **sava/sava/sava:1.1.0/webport** route
    ![](/images/screens/v094/tut2_sliders_canary_2.png)
* Click **Save**

As we are not actually deploying anything, just reconfiguring routes, the update should be almost instantaneous. You can fire up a Chrome browser and a Safari browser and go to `http://localhost:8080/proxy/gateways/sava%2Fsava%2Fwebport/` to check the results. A hard refresh might be necessary because of your browser's caching routine.

![](/images/screens/screencap_canary1.gif)

## A bit more about conditions

Our browser example is easily testable on a laptop, but of course a bit contrived. Luckily you can
create much more powerful conditions quite easily. Checking Headers, Cookies, Hosts etc. is all possible.
Under the hood, Vamp uses Haproxy's ACL's ([cbonte.github.io/haproxy-dconv/configuration-1.5 - ACL basics](http://cbonte.github.io/haproxy-dconv/configuration-1.5.html#7.1)) and you can use the exact ACL definition right in the blueprint in the 'condition` field.

### Vamp short codes

ACLs can be somewhat opaque and cryptic. That's why Vamp has a set of convenient "short codes"
to address common use cases. Currently, we support the following, but we will be expanding on this in the future:

```
User-Agent = *string*
Host = *string*
Cookie *cookie name* Contains *string*
Has Cookie *cookie name*
Misses Cookie *cookie name*
Header *header name* Contains *string*
Has Header *header name*
Misses Header *header name*
```

Vamp is also quite flexible when it comes to the exact syntax. This means the following are all equivalent:

```
hdr_sub(user-agent) Android   # straight ACL
user-agent=Android            # lower case, no white space
User-Agent=Android            # upper case, no white space
user-agent = Android          # lower case, white space
```

### Add multiple conditions
Multiple conditions can be included using boolean expressions. For example, the following condition would first check whether the string "Chrome" exists in the User-Agent header of a
request and then it would check whether the request has the header "X-VAMP-TUTORIAL". So any request matching both conditions would go to this service.

```
gateways:
  weight: 100%
  condition: "User-Agent = Chrome AND Has Header X-VAMP-TUTORIAL"
```

Using a tool like httpie ([github.com/jkbrzt/httpie](https://github.com/jakubroztocil/httpie)) makes testing this a breeze.

    http GET http://10.26.184.254:9050/ X-VAMP-TUTORIAL:stuff

![](/images/screens/screencap_canary2.gif)

{{< note title="What next?" >}}
* Cool stuff. But we are dealing here with single, monolithic applications. Where are the microservices?  We will [chop up this monolith into services and deploy them with Vamp](/documentation/tutorials/split-a-monolith/) in the third part of our tutorial →
{{< /note >}}
