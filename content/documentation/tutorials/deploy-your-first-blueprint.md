---
date: 2016-09-13T09:00:00+00:00
title: Deploy your first blueprint
menu:
  main:
    parent: "Tutorials"
    weight: 20
---
If everything went to plan, you should have your Vamp installation up and running. If not, please follow the [Vamp hello world](/documentation/installation/hello-world) quick setup steps. Now we're ready to check out some of Vamp's features. In this tutorial we will:  

* Deploy a monolith, using either the Vamp UI or the Vamp API
* Check out the deployed application  
* Get some metrics on the running application  
* Change the scale and load-balancing
* Chaos monkey!    

**Requirements:** Docker machine should have access to **at least 3GB memory**

## Deploy a monolith

Imagine you or the company you work for still use monolithic applications. I know, it sounds far fetched...
This application is conveniently called *Sava monolith* and is at version 1.0. This version serves plain old lorem ipsum on a light background.

You've managed to wrap your monolith in a Docker container, which lives in the Docker hub under `magneticio/sava:1.0.0`. 
Your app normally runs on port `8080` but you want to expose it under port `9050` in this case.
 Let's deploy this through Vamp using the following simple blueprint. Don't worry too much about what means what: we'll get there. 
 You can choose to deploy this blueprint either using the Vamp UI or using the Vamp API.

```yaml
name: sava:1.0
gateways:
  9050: sava/webport
clusters:
  sava:
    services:
      breed:
        name: sava:1.0.0
        deployable: magneticio/sava:1.0.0
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
In the Vamp UI, select the environment "environment" and 

1. In the Vamp UI, select the environment *environment* and go to the **Blueprints** page and click **Add** (top right)
* Paste in the above blueprint and click **Save**. Vamp will store the blueprint and make it available for deployment 
* Open the action menu on the **sava:1.0** blueprint and select **Deploy as** 
  ![](/images/screens/v100/tut1/vampee-environment-blueprints-sava10-deployas.png)
* You'll be prompted to give your deployment a name, let's call it **sava**
* Click **Deploy** to start the deployment
  ![](/images/screens/v100/tut1/vampee-environment-deployments-sava.png)
  
## Check out the deployed service 

You can follow the deployment process of the **Deployments** page. When the service is deployed, the **status** will change from **deploying** to **deployed**.

You can also watch the Vamp event stream by clicking **Events** (bottom left)
![](/images/screens/v100/tut1/vampee-environment-deployments-sava-deployed-events.png)

When the service is fully deployed, you can check it out through the Vamp UI.

* **From the Deployments page:**  
  Click on **sava** to open the deployment detail screen, then click on **sava:1.0.0** to see all running instances of the sava service (we only have one instance running right now).
  
  Click an instance name to open it and then click the **webport** tab.

![](/images/screens/v100/tut1/vampee-environment-deployments-sava-instance-mono10.png)

* **From the Gateways page:**  
  Open the internal gateway (`sava/sava/webport`) or the external gateway (`sava/9050`) and click the **HOST - PORT/TYPE**

![](/images/screens/v100/tut1/vampee-environment-gateways-sava-internal-mono10.png)

* **Via the Vamp Gateway Agent:**  
  You can also use the Vamp Gateway Agent (VGA) to access the service using the virtual host name **9050.sava.vamp**.
  
  If you are using Kubernetes, you can find the external IP address of the VGA using `kubectl`:
  ```
  $ kubectl --namespace vampio-organization-environment get service vamp-gateway-agent
  
  NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP       PORT(S)        AGE
  vamp-gateway-agent   LoadBalancer   10.55.243.115   930.811.777.628   80:31041/TCP   8d
  ```
  
  If you are using DC/OS, you will need external IP address of one of the public agents or preferably the public agent load balancer.
  
  Once you have the external IP address for the VGA, you can access the service using `curl`:
  
  ```
  curl -H "Host: 9050.sava.vamp" http://930.811.777.628/
  ```

## Get some metrics on the running application

Open the **sava/9050** external gateway page.

If you checked out the deployed service, then you should see a small metrics spike after a few seconds.

![](/images/screens/v100/tut1/vampee-environment-gateways-sava-external.png)

## Change scale and load balancing

Vamp will automatically load balance traffic across service instances as they scale. Let's change the scale of the sava service and see what happens. 

1. Go back to the **Deployments** page 
* Open the **sava** deployment and click the **sava:1.0.0** service
* Click **Scale service** (top right) and set the **INSTANCES** to **3** 
* Click **Save** 

Vamp will automatically scale up the number of running instances (of course permitting underlying resources) and load balance these to the outside world using the gateway feature. Refresh the **sava:1.0.0** service detail page to see all three running instances.

![](/images/screens/v100/tut1/vampee-environment-deployments-sava-instances-3.png)

## Chaos monkey

Now let's try something fun. Go to the Marathon UI (on port 9090) and find the Sava container running. Now select destroy to kill the container. Watch Vamp detecting that issue and making sure that the defined number of instances is spun up again as soon as possible, while making sure the load balancing routing rules are also updated to reflect the changed IPs and ports of the instances.

{{< note title="What next?" >}}
* Let's [run a canary release in the second part of this getting started tutorial →](/documentation/tutorials/run-a-canary-release/)
{{< /note >}}

