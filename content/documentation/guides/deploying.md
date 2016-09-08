---
title: 1. Deploying a blueprint
type: documentation
slug: /getting-started-tutorial/1-deploying/
weight: 20
menu:
  main:
    parent: guides
---

# 1. Deploying your first blueprint

If everything went to plan, you should have your Vamp installation up & running. If not, please check [how to install
Vamp](/getting-started/). We advise to start with the self-contained Vamp [quickstart container](/quick-start/)

## Step 1: Deploying a monolith

Imagine you or the company you work for still use monolithic applications. I know, it sounds far fetched...
This application is conveniently called *Sava monolith* and is at version 1.0.  

You've managed to wrap your monolith in a Docker container, which lives in the Docker hub under `magneticio/sava:1.0.0`. Your app normally runs on port `8080` but you want to expose it under port `9050` in this case. Let's deploy this to Vamp using the following simple blueprint. Don't worry too much about what means what: we'll get there.

{{% copyable %}}
```yaml
---
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
```
{{% /copyable %}}


In the Vamp UI, go to the **blueprints** tab, click the **Add new** button. Paste in the above blueprint and press **Save**. Vamp will store the blueprint and make it available for deployment. Now go to the **deployments** tab, select the blueprint you just saved, press the **Deploy button** and give it a nice name, for example 'Sava'. Note that we don't use a version-number for this deployment, as Vamp supports immutable infrastructure principles and want to keep the deployment up and running all the time by adding, changing or removing parts of it at runtime. 

![](/img/screenshots/tut1_deploy-v090.gif)

Alternatively, you can use your favorite tools like [Postman](https://www.getpostman.com/), [HTTPie](https://github.com/jakubroztocil/httpie) or Curl to post this blueprint directly to the `api/v1/deployments` endpoint of Vamp.

>**Note**: Take care to set the correct `Content-Type: application/x-yaml` header on the POST request. Vamp is kinda
strict with regard to content types, because we support JSON and YAML so we need to know what you are sending. 

Using `curl`:

```
curl -v -X POST --data-binary @sava_1.0.yaml -H "Content-Type: application/x-yaml" http://localhost:8080/api/v1/deployments
```

Using `httpie`:

```
http POST http://localhost:8080/api/v1/deployments Content-Type:application/x-yaml < sava_1.0.yaml
```

>**Note**: If you run on Docker machine, use `docker-machine ip default` instead of `localhost`, e.g.
```
http POST http://`docker-machine ip default`:8080/api/v1/deployments Content-Type:application/x-yaml < sava_1.0.yaml
```

After POST-ing, Vamp should respond with a `202 Accepted` message and return a JSON blob. This means Vamp is trying to deploy your container. You'll notice some parts are filled in for you, like a default scale, a default gateways.

>**Note**: Using RESTful API it is possible to created deployment with a custom name - simple `PUT` request to `http://localhost:8080/api/v1/deployments/DEPLOYMENT_CUSTOM_NAME`

## Step 2: Checking out our application

You can follow the deployment process of our container by checking the `/api/v1/deployments` endpoint and checking when the `state` field changes from `ReadyForDeployment` to `Deployed`. You can also check Marathon's GUI.

When the application is fully deployed you can check it out at Vamp host address + the port that was assigned in the blueprint, e.g: `http://10.26.184.254:9050/`. It should report a refreshing [hipster lorem ipsum](http://hipsterjesus.com/) upon each reload.

![](/img/screenshots/monolith1.png)

## Step 3: Getting some metrics

Using a simple tool like [Apache Bench](https://httpd.apache.org/docs/2.2/programs/ab.html) we can put some load on our application and see some of the metrics flowing into the dashboard. Using the following command send 10000 requests using 15 threads to our Sava app.

```
ab -k -c 15 -n 10000 http://10.26.184.254:9050/
```
or
```
ab -k -c 15 -n 10000 http://`docker-machine ip default`:9050/
```

You should see the metrics spike and some pretty charts being drawn. A succesful deployment almost always consists of the containers being deployed, and the connected gateway that automatically load-balances the cluster and exposes it to the outside world. Metrics can be found both under the **deployment** tab and under the **gateways** tab. From the deployments tab there is a link to the related gateway. 

![](/img/screenshots/tut1_metrics-v090.gif)

## Step 4: Change scale and load-balancing

Vamp will automatically load-balance services. Let's change the scale of the service by selecting "3" in the *instances** field. Now Vamp will automatically scale up the number of running instances (of course permitting underlying resources) and load-balance these to the outside world using the gateway feature.

![](/img/screenshots/tut1_scale-v090.gif)

## Step 5: Chaos monkey

Now try and do something fun. Let's go to the Marathon UI (on port 9090) and find the Sava container running. Now select destroy to kill the container. Watch Vamp detecting that issue and making sure that the defined number of instances is spun up again as soon as possible, while making sure the loadbalancing routing rules are also updated to reflect the changed IP's and ports of the instances.

Ok, that's great! Now let's do a canary release in [the second part of this getting started tutorial →](/documentation/guides/getting-started-tutorial/2-canary-release/)


