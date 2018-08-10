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
* Canary release the new application
* Use conditions to target specific groups
* Learn a bit more about conditions

## Prepare our blueprint

Vamp allows you to canary release application updates by merging new blueprints to a running deployment.

Take a look at the YAML blueprint example below. It is almost identical to the blueprint we initially used to deploy the sava 1.0.0 application, with two differences - this time the blueprint does not include a gateway, and the breed describes the sava:1.1.0 service.

```yaml
name: sava:1.1
clusters:
  sava:
    services:
      breed:
        name: sava:1.1.0
        deployable: vampio/sava:1.1.0
        ports:
          webport: 8080/http
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
```

## Deploy the new version of our application next to the old one

Let's introduce sava:1.1.0 to the running sava deployment.  

We can merge our new blueprint with the blueprint we deployed in the previous tutorial, this will deploy the new sava:1.1.0 version of the application alongside the existing sava:1.0.0 version.

The merge adds a new route to the existing internal (`sava/sava/webport`) gateway. This is why the new blueprint does not define a gateway. Merging the blueprints will not affect the running application and initially no traffic will be routed to the new version.

### Merge using the UI

1. In the Vamp UI, select the environment *environment* and go to the **Blueprints** page and click **Add** (top right)
2. Paste in the above blueprint and click **Save**. Vamp will store the blueprint and make it available for deployment 
3. Open the action menu on the **sava:1.1** blueprint and select **Merge to** 
  ![](/images/screens/v100/tut2/vampee-environment-blueprints-sava11-mergeto.png)
4. You'll be prompted to select the deployment you wish to merge the blueprint with - select **sava**
5. Click **Merge** to deploy the sava:1.1.0 service to the running sava deployment.  
  Vamp will work out the differences and update the deployment accordingly.
  ![](/images/screens/v100/tut2/vampee-environment-deployments-sava.png)

## Canary release

When the new version of the application is fully deployed, open the **sava/sava/webport** internal gateway page.

You will see two routes - one for the sava:1.0.0 version and one for the new sava:1.1.0 version. The weight of our newly merged version is set to 0%, this means that no traffic is currently being routed there. Whenever Vamp merges a new version of a service, it applies the default weight of 0%.

Let's adjust the weight and start to send traffic to our new sava:1.1.0 application

1. Click the edit icon next to **WEIGHT**
2. Adjust the weight slider to distribute traffic 50% / 50% between the two versions
  ![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-editweights.png)
3. Click **Save** and Vamp will adjust the route weights accordingly
4. Click the **HOST - PORT/TYPE** to open the gateway.  
  Each time you do this the application will switch between a version 1.0 page (light background) and a version 1.1 page (dark background).

You can also use send traffic to the different versions of the application using [ApacheBench](https://httpd.apache.org/docs/2.4/programs/ab.html):

```
ab -c 7 -n 10000 -l -H "Host: 9050.sava.vamp" http://<vga-external-ip>/
```

![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-2routes.png)

## Use conditions to target specific groups

Using percentages to divide traffic between versions is already quite powerful, but also very simplistic.
What if, for instance, you want to specifically target a group of users? Or channel specific requests
from an internal service? Vamp allows you to do this right from the blueprint DSL.

Let's start simple: We can use the Vamp UI to allow only Chrome users to access v1.1.0 of our application.

1. Go to the **Gateways** page and open the **sava/sava/webport** gateway
* Click the edit condition icon for the **sava/sava/sava:1.1.0/webport** route and enter the condition `User-Agent = Chrome`
![](/images/screens/v094/tut2_edit_condition.png)
  Now we need to set a strength for the condition.  
  As we want all Chrome users to be sent to this route, we will set the condition strength to 100%.
* Click the edit condition strength icon for the **sava/sava/sava:1.1.0/webport** route and move the slider to 100%.
![](/images/screens/v094/tut2_edit_condition_strength.png)
  Finally, we need to account for routing of traffic that does not match the condition (that is, all non-Chrome users). We do this using the route weight.  
  As we want only Chrome users to be sent to the sava/sava/sava:1.1.0/webport route, we need to set its route weight to 0%. That might sound confusing, but remember that the route weight is used for distributing traffic that didn't match the applied condition - and we want 0% of all non-Chrome users to be sent to the sava/sava/sava:1.1.0/webport route  
  [Read more about route weight and condition strength](/documentation/using-vamp/gateways/#route-weight-and-condition-strength)
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
