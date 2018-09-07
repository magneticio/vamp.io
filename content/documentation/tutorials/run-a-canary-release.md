---
date: 2016-09-13T09:00:00+00:00
title: 2. Run a canary release
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

#### Requirements:
* A Kubernetes cluster with at least 4 nodes (8 vCPUs and 28GB memory); or
* A DC/OS cluster with at least 4 nodes (1 public agent, 16 vCPUs and 48GB memory)

## Prepare our blueprint

Vamp allows you to canary release application updates by merging new blueprints to a running deployment.

Take a look at the YAML blueprint example below. It is almost identical to the blueprint we initially used to deploy the sava 1.0.0 application, with two differences - this time the blueprint does not include an external gateway, and the breed describes the sava:1.1.0 service.

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
  ![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-editweights5050.png)
3. Click **Save** and Vamp will adjust the route weights accordingly
4. Click the **HOST - PORT/TYPE** to open the gateway.  
  Each time you do this the application will switch between a version 1.0 page (light background) and a version 1.1 page (dark background).
  ![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-mono-canary.png)

You can also use send traffic to the different versions of the application using [ApacheBench](https://httpd.apache.org/docs/2.4/programs/ab.html):

```
ab -c 7 -n 10000 -l -H "Host: 9050.sava.vamp" http://<vga-external-ip>/
```

![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-2routes.png)

## Use conditions to target specific groups

Using percentages to divide traffic between versions is already quite powerful, but also very simplistic.
What if, for instance, you want to specifically target a group of users? Or channel specific requests
from an internal service?

Let's start simple: We can use the Vamp UI to allow only Chrome users to access v1.1.0 of our application.

We do this by adding a condition (`User-Agent = Chrome`) to the **sava/sava/sava:1.1.0/webport** route.

Since we want only requests from Chrome users to use the sava/sava/sava:1.1.0/webport route, **we also need to set the weight on that route to 0%**. That might sound confusing, but route weights are used for distributing traffic that don't match a condition - and **we want 0% of all non-Chrome users to be sent to the sava/sava/sava:1.1.0/webport route**.

[Read more about route weight and condition strength](/documentation/using-vamp/gateways/#route-weight-and-condition-strength)

1. In the Vamp UI, select the environment *environment* and go to the **Gateways** page and open the **sava/sava/webport** gateway
* Click the edit condition icon for the **sava/sava/sava:1.1.0/webport** route and enter the condition `User-Agent = Chrome` 
  ![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-editcondition.png)
  Now we need to set a strength for the condition.  
  As we want all Chrome users to be sent to this route, we will set the condition strength to 100%.
* Click the edit condition strength icon for the **sava/sava/sava:1.1.0/webport** route and move the slider to 100%.
  ![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-editconditionweight.png)
  Finally, we need to account for routing of traffic that does not match the condition (that is, all non-Chrome users). We do this using the route weight.
* Click the edit icon next to **WEIGHT**
* Adjust the weight slider to **0%** for the **sava/sava/sava:1.1.0/webport** route
  ![](/images/screens/v100/tut2/vampee-environment-gateways-sava-internal-editweights1000.png)
* Click **Save**

As we are not actually deploying anything, just reconfiguring routes, the update should be almost instantaneous.

To test the condition is working, login to the Vamp UI, go to **environment → Gateways → sava/9050** and click the **HOST - PORT/TYPE** link.

Do this using Chrome and you'll see only the sava:1.1.0 version. Do it again using Firefox or Safari and you'll see only the sava:1.0.0 version. A hard refresh might be necessary to bypass your browser's cache.

## A bit more about conditions

Our browser example is easily testable on a laptop, but of course is a bit contrived. 

Under the hood, Vamp uses Haproxy's ACLs ([HAProxy version 1.8 - ACL basics](http://cbonte.github.io/haproxy-dconv/1.8/configuration.html#7.1)). So **checking headers, cookies and hosts are all possible** and you can create much more powerful conditions quite easily.

### Vamp short codes

HAProxy's ACLs can be somewhat opaque and cryptic. So Vamp provides a set of convenient "short codes"
to address common use cases.

Currently, we support the following:
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
Multiple conditions can be included using boolean expressions.

For example, the following condition would first check whether the string "Chrome" exists in the User-Agent header of a request and then it would check whether the request has the header "X-VAMP-TUTORIAL". So only requests matching both conditions would go to this service.

```
User-Agent = Chrome AND Has Header X-VAMP-TUTORIAL
```

You can easily test this using `curl`:

```
curl -H "Host: 9050.sava.vamp" -H "User-Agent: Chrome" -H "X-VAMP-TUTORIAL: 2" http://<vga-external-ip>/
```

{{< note title="What next?" >}}
* Cool stuff. But we are dealing here with single, monolithic applications. Where are the microservices?  We will [chop up this monolith into services and deploy them with Vamp](/documentation/tutorials/split-a-monolith/) in the third part of our tutorial →
{{< /note >}}
