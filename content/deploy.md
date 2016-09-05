---
date: 2016-03-09T19:56:50+01:00
title: 1 - deploy your first blueprint
menu:
  main:
    parent: TRY VAMP
    identifier: deploy your first blueprint
    weight: 10
---

If everything went to plan, you should have your Vamp installation up and running __on your local machine__. If not, please check [the Vamp quick setup instructions](/quick-setup/)

Now we're ready to check out some of Vamp's features. 

### In this tutorial we will:  

* Deploy a monolith, with either the Vamp UI or the Vamp API
* Check out the deployed application
* Get some metrics on the running application

## Deploy a monolith

Imagine you or the company you work for still use monolithic applications. I know, it sounds far fetched...
This application is conveniently called *Sava monolith* and is at version 1.0.  

You've managed to wrap your monolith in a Docker container, which lives in the Docker hub under `magneticio/sava:1.0.0`. Your app normally runs on port `8080` but you want to expose it under port `9050` in this case. Let's deploy this through Vamp using the following simple blueprint. Don't worry too much about what means what: we'll get there.

```yaml
---
name: sava:1.0
gateways:
  9050: sava/port
clusters:
  sava:
    services:
      breed:
        name: sava:1.0.0
        deployable: magneticio/sava:1.0.0
        ports:
          port: 8080/http
      scale:
        cpu: 0.2       
        memory: 64MB
        instances: 1
```


### Deploy using the Vamp UI

1. In the Vamp UI, go to the **blueprints** tab, click the **Add new** button. Paste in the below blueprint and press **Save**   
  * Vamp will store the blueprint and make it available for deployment. 
  
2. Press the **Deploy button**.

![](/img/screenshots/tut1_deploy.gif)

### Deploy using the Vamp API

Alternatively, you can use your favorite tools like [Postman](https://www.getpostman.com/), [HTTPie](https://github.com/jakubroztocil/httpie) or Curl to post this blueprint directly to the `api/v1/deployments` endpoint of Vamp.

>**Note**: Take care to set the correct `Content-Type: application/x-yaml` header on the POST request. Vamp is kinda
strict with regard to content types, because we support JSON and YAML so we need to know what you are sending. 

* Using `curl`:

```
curl -v -X POST --data-binary @sava_1.0.yaml -H "Content-Type: application/x-yaml" http://localhost:8080/api/v1/deployments
```

* Using `httpie`:

```
http POST http://localhost:8080/api/v1/deployments Content-Type:application/x-yaml < sava_1.0.yaml
```

>**Note**: If you run on Docker machine, use `docker-machine ip default` instead of `localhost`, e.g.
```
http POST http://`docker-machine ip default`:8080/api/v1/deployments Content-Type:application/x-yaml < sava_1.0.yaml
```

After POST-ing, Vamp should respond with a `202 Accepted` message and return a JSON blob. This means Vamp is trying to deploy your container. You'll notice some parts are filled in for you, like a default scale, a default routing and of course a UUID as a name.

>**Note**: Using the RESTful API it is possible to create a deployment with a custom name - simple `PUT` request to `http://localhost:8080/api/v1/deployments/DEPLOYMENT_CUSTOM_NAME`

## Check out the deployed application 

You can follow the deployment process of our container by checking the `/api/v1/deployments` endpoint and checking when the `state` field changes from `ReadyForDeployment` to `Deployed`. You can also check Marathon's GUI.

When the application is fully deployed you can check it out at Vamp host address + the port that was assigned in the blueprint, e.g: `http://10.26.184.254:9050/`. It should report a refreshing [hipster lorem ipsum](http://hipsterjesus.com/) upon each reload.

![](/img/screenshots/monolith1.png)

## Get some metrics on the running application

Using a simple tool like [Apache Bench](https://httpd.apache.org/docs/2.2/programs/ab.html) we can put some load on our application and see some of the metrics flowing into the dashboard. Use the following command to send 10000 requests using 15 threads to our Sava app.

```bash
ab -k -c 15 -n 10000 http://localhost:9050/
```
or
```bash
ab -k -c 15 -n 10000 http://`docker-machine ip default`:9050/
```

You should see the metrics spike and some pretty charts being drawn:

![](/img/screenshots/tut1_metrics.png)

Ok, that's great! Now let's [run a canary release in the second part of this getting started tutorial →](/canary-release/)