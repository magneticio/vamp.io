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
This application is conveniently called *Sava monolith* and is at version 1.0.  

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


#### Deploy using the Vamp UI

1. In the Vamp UI, go to the **Blueprints** page and click **Add** (top right)
* Paste in the above blueprint and click **Save**. Vamp will store the blueprint and make it available for deployment 
* Open the action menu on the **sava:1.0** blueprint and select **Deploy as** 
  ![](/images/screens/v100/tut1/vampee-environment-blueprints-sava10-deployas.png)
* You'll be prompted to give your deployment a name, let's call it **sava**
* Click **Deploy** to start the deployment
  ![](/images/screens/v100/tut1/vampee-environment-deployments-sava)
  

#### Deploy using the Vamp API

You could also use your favourite tools like Postman ([getpostman.com](https://www.getpostman.com/)), HTTPie ([github.com/jakubroztocil - httpie](https://github.com/jakubroztocil/httpie)) or Curl to post this blueprint directly to the `api/v1/deployments` endpoint of Vamp. Take care to set the correct `Content-Type: application/x-yaml` header on the POST request. Vamp is kinda strict with regard to content types, because we support JSON and YAML so we need to know what you are sending.   

**curl:**
```
curl -v -X POST --data-binary @sava_1.0.yaml -H "Content-Type: application/x-yaml" http://localhost:8080/api/v1/deployments
```

**httpie:**
```
http POST http://localhost:8080/api/v1/deployments Content-Type:application/x-yaml < sava_1.0.yaml
```

After POST-ing, Vamp should respond with a `202 Accepted` message and return a JSON blob. This means Vamp is trying to deploy your container. You'll notice some parts are filled in for you, like a default scale, a default routing and of course a UUID as a name.
You can also use the RESTful API to create a deployment with a custom name - simple `PUT` request to `http://localhost:8080/api/v1/deployments/DEPLOYMENT_CUSTOM_NAME`

## Check out the deployed application 

You can follow the deployment process of our container by checking the `/api/v1/deployments` endpoint and checking when the `state` field changes from `ReadyForDeployment` to `Deployed`. You can also check Marathon's GUI (see the [full list of all services exposed](/documentation/installation/hello-world/#check-vamp-is-up-and-running) in the hello world setup).

When the application is fully deployed, you can check it out through the Vamp UI. It should report a refreshing hipster lorem ipsum upon each reload ([HipsterJesus.com](http://hipsterjesus.com/)):

* **From the Deployments page:**  
  Click on **sava** to open the deployment detail screen, then click on **sava:1.0.0** to see all running instances of the sava service (we only have one instance running right now). Click an instance name to open it.

![](/images/screens/v100/tut1/vampee-environment-deployments-sava-instance-mono10.png)

* **From the Gateways page:**  
  Open the internal gateway (`sava/sava/webport`) or the external gateway (`sava/9050`) and click the **HOST - PORT/TYPE**

![](/images/screens/v100/tut1/vampee-environment-gateways-sava-internal-mono10.png)

* **By reverse proxy:**  
  You can also use Vamp as a reverse proxy to access the application through the exposed sava gateways:

  * `http://localhost:8080/proxy/gateways/sava%2Fsava%2Fwebport/`
  * `http://localhost:8080/proxy/gateways/sava%2F9050/`

## Get some metrics on the running application

Open the application in a new tab and hit refresh a few times in your browser. You should see the metrics spike and some pretty charts being drawn on the **sava/9050** gateway page:

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

