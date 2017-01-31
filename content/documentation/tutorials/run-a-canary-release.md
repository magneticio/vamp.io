---
date: 2016-09-13T09:00:00+00:00
title: Run a canary release
menu:
  main:
    parent: "Tutorials"
    weight: 30
---

In the [previous tutorial we deployed our app sava 1.0](/documentation/tutorials/deploy-your-first-blueprint/). If you haven't walked through that part already, please do so before continuing.

Now let's say we have a new version of this great application that we want to canary release into production. We have it containerised as `magneticio/sava:1.1.0` and are ready to go. In this tutorial we will:

1. Prepare our blueprint
2. Deploy the new version of our application next to the old one
3. Use conditions to target specific groups
4. Learn a bit more about conditions

## Prepare our blueprint

Vamp allows you to do canary releases using blueprints. Take a look at the YAML example below. It is quite similar to the blueprint we initially used to deploy sava 1.0.0. However, there are two big differences.

* The `services` key holds a list of breeds: one for v1.0.0 and one for v1.1.0 of our app. [Breeds](/documentation/using-vamp/breeds/) are Vamp's way of describing static artifacts that can be used in blueprints.
* We've added the `routes` key which holds the weight of each service as a percentage of all requests. Notice we assigned 50% to our current version 1.0.0 and 50% to the new version 1.1.0 We could also start with a 100% to 0% split, a 99% to 1% split or whatever combination you want **as long as all percentages add up to 100% in total**. There is nothing stopping you from deploying three or more versions and distributing the weight among them. Just make sure that when doing a straight three-way split you give one service 34% as 33%+33%+33%=99%.

```yaml
---
name: sava:1.0
gateways:
  9050: sava/webport
clusters:
  sava:
    gateways:
      routes:
        sava:1.0.0:
          weight: 50%  # weight in percentage
        sava:1.1.0:
          weight: 50%
    services: # services is now a list of breeds
      -
        breed:
          name: sava:1.0.0
          deployable: magneticio/sava:1.0.0
          ports:
            webport: 8080/http
        scale:
          cpu: 0.2
          memory: 64MB
          instances: 1
      -
        breed:
          name: sava:1.1.0 # a new version of our service
          deployable: magneticio/sava:1.1.0
          ports:
            webport: 8080/http
        scale:
          cpu: 0.2
          memory: 64MB
          instances: 1
```
You could also just leave out the whole `routes` section and use the UI to change the weights after we've done the deployment.

![](/images/screens/v091/tut2_sliders.jpg)

## Deploy the new version of our application next to the old one

It is our goal to update the already running deployment with the new blueprint. Vamp will figure out that v1.0.0
is already there and just add v1.1.0 while setting the correct routing between these services. You could also create a second blueprint with the new service, and merge this new service to the Sava-cluster so it becomes available for routing traffic to it.

### Deploy using the UI

Go to the **DEPLOYMENTS** tab, open the running deployment and click the **EDIT** button (top right). Copy the blueprint above and paste it over the the deployment that is there then click **SAVE**. Vamp will start working out the differences and update the deployment accordingly.

![](/images/screens/v091/tut2_canary.jpg)

### Deploy using the API

Get the running deployment's name (the UUID) from `/api/v1/deployments` (or use the explicit name that you used for the deployment) and `PUT` the blueprint to that resource, e.g: `/api/v1/deployments/sava`

## Check the deployment and routing
When Vamp has finished deploying, you can start refreshing your browser at the correct endpoint, e.g. `http://192.168.99.100:9050/`. The application should switch between responding with a 1.0 page and a 1.1 page. Note that this works best with the "Incognito" or "Anonymous" mode of your browser because of the caching of static assets.

![](/images/screens/monolith_canary1.png)

## Use conditions to target specific groups

Using percentages to divide traffic between versions is already quite powerful, but also very simplistic.
What if, for instance, you want to specifically target a group of users? Or a specific channel of requests
from an internal service? Vamp allows you to do this right from the blueprint DSL.

Let's start simple: We will allow only Chrome users to access v1.1.0 of our application by inserting this routing scheme:

```yaml
---
routes:
  sava:1.1.0:
    weight: 0%
    condition_strength: 100%
    condition: User-Agent = Chrome    
```

Notice three things:

* We inserted a list of conditions (with only one condition for now).
* We set the condition strength to 100% (it would be also by default set to 100%). This is important because we want all Chrome users to access the new service - we could also say `condition_strength: 50%` to give access just to half of them (the other 50% would be redirected to weight rules and routed accordingly).
* We set the weight to 0% because we don't want any other users to access `sava:1.1.0`

The first service where the condition matches the request will be used to handle the request.
[More information about using conditions, weights, sticky sessions etc.](/documentation/using-vamp/gateways/).  

Our full blueprint now looks as follows:

```yaml
---
name: sava:1.0
gateways:
  9050: sava/webport
clusters:
  sava:
    gateways:
      routes:
        sava:1.0.0:
          weight: 100%
        sava:1.1.0:
          weight: 0%
          condition_strength: 100%
          condition: User-Agent = Chrome
    services: # services is now a list of breeds
      -
        breed:
          name: sava:1.0.0
          deployable: magneticio/sava:1.0.0
          ports:
            webport: 8080/http
        scale:
          cpu: 0.2
          memory: 64MB
          instances: 1
      -
        breed:
          name: sava:1.1.0 # a new version of our service
          deployable: magneticio/sava:1.1.0
          ports:
            webport: 8080/http
        scale:
          cpu: 0.2
          memory: 64MB
          instances: 1
```

Using the UI, you can either use the **EDIT** button from the deployment details screen again and completely paste in this blueprint or just
find the right place in the blueprint and edit it by hand. The result should be the same as using our UI to insert a condition:

![](/images/screens/v091/tut2_canary-condition.jpg)

As we are not actually deploying anything but just reconfiguring routes, the update should be almost instantaneous. You can fire up a Chrome browser and a Safari browser and check the results. A hard refresh might be necessary because of your browser's caching routine.

![](/images/screens/screencap_canary1.gif)

## A bit more about conditions

Our browser example is easily testable on a laptop, but of course a bit contrived. Luckily you can
create much more powerful conditions quite easily. Checking Headers, Cookies, Hosts etc. is all possible.
Under the hood, Vamp uses Haproxy's ACL's ([cbonte.github.io/haproxy-dconv/configuration-1.5 - ACL basics](http://cbonte.github.io/haproxy-dconv/configuration-1.5.html#7.1)) and you can use the exact ACL definition right in the blueprint in the 'condition` field.

#### Vamp short codes

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

#### Add multiple conditions
Multiple conditions can be included using boolean expressions. For example, the following condition would first check whether the string "Chrome" exists in the User-Agent header of a
request and then it would check whether the request has the header "X-VAMP-TUTORIAL". So any request matching both conditions would go to this service.

```yaml
---
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
