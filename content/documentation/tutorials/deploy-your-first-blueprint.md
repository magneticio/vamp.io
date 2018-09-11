---
date: 2016-09-13T09:00:00+00:00
title: 1. Deploy your first blueprint
menu:
  main:
    parent: "Tutorials"
    weight: 20
---
Before you start this tutorial you should have your Vamp installation up and running. If not, please follow the [Vamp Quickstart](/documentation/installation/v1.0.0/overview/#vamp-quickstart-installation) guide.

#### Requirements:
* A Kubernetes cluster with at least 4 nodes (8 vCPUs and 28GB memory); or
* A DC/OS cluster with at least 4 nodes (1 public agent, 16 vCPUs and 48GB memory)

In this tutorial we will check out some of Vamp's features:  

* Deploy a monolith, using the Vamp UI
* Check out the deployed application  
* Get some metrics on the running application  
* Change the scale   

## Deploy a monolith

Imagine the company you work for still uses monolithic applications. I know, it sounds far fetched but..

One such application is conveniently called *sava Monolith* and is at version 1.0. This version serves plain old lorem ipsum on a light background.

You've managed to wrap your monolith in a Docker container, which lives in the Docker hub under `magneticio/sava:1.0.0`. Your app normally runs on port `8080` but you want to expose it under port `9050` in this case.

Let's deploy this through Vamp using the following simple blueprint. Don't worry too much about what it all means: we'll get there. 

```yaml
name: sava:1.0
gateways:
  9050: sava/webport
clusters:
  sava:
    services:
      breed:
        name: sava:1.0.0
        deployable: vampio/sava:1.0.0
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

### Deploy using the Vamp UI

1. In the Vamp UI, select the environment *environment* and go to the **Blueprints** page and click **Add** (top right)
2. Paste in the above blueprint and click **Save**. Vamp will store the blueprint and make it available for deployment 
3. Open the action menu on the **sava:1.0** blueprint and select **Deploy as** 
  ![](/images/screens/v100/tut1/vampee-environment-blueprints-sava10-deployas.png)
4. You'll be prompted to give your deployment a name, let's call it **sava**
5. Click **Deploy** to start the deployment
  ![](/images/screens/v100/tut1/vampee-environment-deployments-sava.png)
  
## Check out the deployed application 

You can follow the deployment process of the **Deployments** page. When the application is deployed, the **status** will change from **deploying** to **deployed**.

You can also watch the Vamp event stream by clicking **Events** (bottom left)
![](/images/screens/v100/tut1/vampee-environment-deployments-sava-deployed-events.png)

When the application is fully deployed, you can check it out through the Vamp UI.

### From the Deployments page
Click on **sava** to open the deployment detail page, then click on **sava:1.0.0** to see all running instances of the sava application.

Click an instance name to open it and then click the **webport** tab.

![](/images/screens/v100/tut1/vampee-environment-deployments-sava-instance-mono10.png)

### From the Gateways page
Open the internal gateway (`sava/sava/webport`) or the external gateway (`sava/9050`) and click the **HOST - PORT/TYPE**

![](/images/screens/v100/tut1/vampee-environment-gateways-sava-internal-mono10.png)

### Via the Vamp Gateway Agent
You can also use the Vamp Gateway Agent (VGA) to access the application using the virtual host name **9050.sava.vamp**.

If you are using Kubernetes, you can find the external IP address of the VGA using `kubectl`:

```
kubectl --namespace vampio-organization-environment get service vamp-gateway-agent
```

If you are using DC/OS, you will need the external IP address of the public agent load balancer.
  
Once you have the external IP address for the VGA, you can access the application using `curl`:

```
curl -H "Host: 9050.sava.vamp" http://<vga-external-ip>/
```

## Get some metrics on the running application

Open the **sava/9050** external gateway page.

If you checked out the deployed application, then you should see a small metrics spike after a few seconds.

You can send additional traffic to the application using [ApacheBench](https://httpd.apache.org/docs/2.4/programs/ab.html):

```
ab -c 7 -n 10000 -l -H "Host: 9050.sava.vamp" http://<vga-external-ip>/
```

![](/images/screens/v100/tut1/vampee-environment-gateways-sava-external.png)

## Change scale

Vamp will automatically load balance traffic across application instances as they scale. Let's change the scale of the sava application and see what happens. 

1. Go to the **Deployments** page 
2. Click on **sava** to open the deployment detail page
3. Now click on **sava:1.0.0** to see all running instances of the sava application (we only have one instance running right now)
4. Click **Scale service** (top right) and set the **INSTANCES** to **3**
  ![](/images/screens/v100/tut1/vampee-environment-deployments-sava-instances-scale.png)
5. Click **Save** 

Vamp will automatically scale up the number of running instances (assuming your cluster has enough resources) and add the additional resources to the internal gateway.

Refresh the **sava:1.0.0** service detail page to see all three running instances.

![](/images/screens/v100/tut1/vampee-environment-deployments-sava-instances-3.png)

{{< note title="What next?" >}}
* Let's [run a canary release in the second part of this getting started tutorial →](/documentation/tutorials/run-a-canary-release/)
{{< /note >}}

