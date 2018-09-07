---
date: 2015-08-15T09:00:00+00:00
title: "How to extend Marathon-LB with Canary releasing features using Vamp"
author: "Tim Nolet"
avatar: "tnolet.jpg"
tags: ["DCOS", "Microsevices", "Devops", "Docker"]
publishdate: 2017-10-12
---

![](https://cdn-images-1.medium.com/max/720/1*Me6dc8wpHKcNf07XJsbpMw.png)

At the Vamp HQ in Amsterdam we get to talk to a lot of Docker, DC/OS and Kubernetes users. For us, as a startup in this corner of the tech space, talking to the engineers and architects behind some pretty serious container based cloud environments is of course worth the proverbial gold. It’s also a lot of fun to just help people out.

<!--more-->

Over the last months, listening to the DC/OS user group a specific pattern emerged:

1. They have a Mesosphere DC/OS environment up and running.

1. They have a CI/CD pipeline to deliver and deploy application builds.

1. They are using the pre-packaged [Marathon-LB](https://github.com/mesosphere/marathon-lb) to handle routing and load balancing.

From this, the question emerges how to **add canary releasing and blue/green deployments to a Marathon-LB based DC/OS environment**. You have roughly two options here, outside of building something yourself:

**Option 1:** **Use Marathon-LB’s [Zero-downtime deployment Python script](https://github.com/mesosphere/marathon-lb#zero-downtime-deployments)**. This gives you a very basic, command line driven, tool to orchestrate blue/green deployments. However, as mentioned by the authors themselves, this tool is ***not production grade and is purely for demo purposes***

**Option 2: Use** **Vamp’s [gateway functionality](https://vamp.io/documentation/using-vamp/gateways/) in isolation**, augmenting and leveraging your current Marathon-LB setup. This allows you to use Vamp’s powerful weight and condition based routing with minimal changes in your current environment. Under the hood, Marathon-LB and Vamp gateways both use HAproxy for routing.

## Prepare your DC/OS environment

To get up and running, let’s take the following architecture diagram as a starting point.

![](https://cdn-images-1.medium.com/max/2000/1*z66OmxM6vtrUnk5KQJADwg.png)

In the diagram we can see:

* An edge load balancer routing traffic to Marathon-LB where Marathon-LB is installed on a public slave in a DC/OS cluster.

* Marathon-LB fronting one version of one app.

* When deploying, a new version of the app replaces the old version:

In this scenario, you would deploy an application to Marathon using either the UI in DC/OS, or by simply posting a JSON file to Marathon using the DC/OS command line interface , i.e: dcos marathon app add my-app.json Where the my-app.json looks similar to the JSON below

    {
      "id": "/simple-service-1.0.0",
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "magneticio/simpleservice:1.0.0",
          "network": "BRIDGE",
          "portMappings": [
            {
              "containerPort": 3000,
              "labels": {
                "VIP_0": "/simple-service-1.0.0:3000"
              }
            }
          ],
        }
      },
      "labels": {
        "HAPROXY_0_MODE": "http",
        "HAPROXY_0_VHOST": "simpleservice100.mycompany.com",
        "HAPROXY_GROUP": "external"
      }
    }

Crucial to notice here is how we expose this application. Also, this is where things might get confusing…

* By setting the VIP_0 to /simple-service-1.0.0:3000. , we are creating a “load balanced service address” in DC/OS. This address is used by DC/OS’s built in **Minuteman** layer 4 load balancer. This is a completely separate routing solution from Marathon-LB that comes out of the box with every DC/OS setup.
If you are configuring this using the DC/OS UI, you just flick the switch shown in the screenshot below. After this, you can pretty much forget about Minuteman, just take a note of the address that is created for you, in this example: simple-service-1.0.0.marathon.l4lb.thisdcos.directory:3000

![](https://cdn-images-1.medium.com/max/2000/1*iL4qMVXZypkC3HnxZ76BEw.png)

* By setting the HAPROXY_0_VHOST in the labels, we are ALSO binding this app to port 80 under the VHOST name simpleservice100.mycompany.com . This means — if our edge load balancer and possible intermediary firewalls are configured to allow this traffic — we could add a CNAME record to our public DNS with that VHOST name and point it to the public IP address of our edge load balancer to expose the app on the public internet.
Strictly speaking, we don’t need this for our scenario, but it can be very convenient to be able to access a specific version of our app using a descriptive name: you could also choose to use something like service.blue.mycompany.com and service.green.mycompany.com in two app deployments that respectively are two version of the same service. This way, you always have a lot of control on what version you are accessing for debugging purposes.

## Install Vamp and setup Vamp Gateways

To leverage Vamp’s Gateways and start using smart routing patterns, we are going to add two Vamp components to this architecture:

1. **Vamp** itself, installable as a DC/OS Universe package. Make sure to also install the required Elastic Search dependency. This allows Vamp to collect routing and health status metrics. [Checkout our installation docs →](https://vamp.io/documentation/installation/dcos/)

1. One or more **Vamp Gateway Agents** (VGA’s), also living on the public slave(s). Vamp can install this automatically on boot, but if you want to take control yourself, you can easily use [this marathon json file](https://gist.github.com/tnolet/6fc47165dd46b6d70d81e9fbe6758f29) as a starting point and deploy it yourself.

The resulting architecture will be as follows.

![](https://cdn-images-1.medium.com/max/2000/1*ZqukAu2aFYr2pOOpn-IU8Q.png)

Notice, that we now use the Vamp managed **Vamp Gateway Agent as the ingress point for our edge load balancer** and let the VGA route traffic to our apps. This means the VGA now hosts your **public** **service endpoint **regardless of the version of the service you are running. Clients using this service or app should use the address and port as configured in the VGA.

Having said that, we didn’t change anything to how Marathon-LB exposes endpoints. Next to the new VGA →Apps routing scheme, you can just keep using any existing routing directly into Marathon-LB.

However, from now on you will have to **deploy any new version of your service as a separate and distinct deployment** and not as a replacement / rolling-deploy of an existing older version. Each deploy then gets a load balanced address based on the version number or some other naming scheme you come up with to distinguish which version is which. You could easily have your CI pipeline generate names based on GIT hashes or semantic version numbers as shown below in the abbreviated example.

    #
    # marathon JSON of version 1.0.0
    #

    {
      "id": "/simple-service-1.0.0",
          "portMappings": [
            {
              "containerPort": 3000,
              "labels": {
                "VIP_0": "/simple-service-1.0.0:3000"
              }
    ...
    }

    #
    # marathon JSON of version 1.1.0
    #

    {
      "id": "/simple-service-1.1.0",
          "portMappings": [
            {
              "containerPort": 3000,
              "labels": {
                "VIP_0": "/simple-service-1.1.0:3000"
              }
    ...
    }

To get this setup running, we simply create a new gateway that listens, for instance, on port 8080 in Vamp. We add two routes to this gateway, each pointing to one specific service port managed by Marathon-LB. The traffic then flows as follows:

![](https://cdn-images-1.medium.com/max/2000/1*Opkdvw5ajuBW2-8sbk8XFg.png)

The Vamp artefact to create this is just this seven line piece of YAML where we have already split the traffic using the weights option. We post this YAML either to the Vamp API or just copy & paste it in the UI. You can see we just redirect traffic to the layer 4 addresses.

    name: simpleservice
    port: 8080/http
    routes:
      "[simple-service-1.0.0.marathon.l4lb.thisdcos.directory:3000]":
        weight: 50%
      "[simple-service-1.1.0.marathon.l4lb.thisdcos.directory:3000]":
        weight: 50%

If you fire up the Vamp UI you can start manipulating traffic and executing canary release and blue/green release patterns using all of the functionality available in full Vamp installations. Alternatively, you can [use the Vamp CLI](https://vamp.io/documentation/cli/cli-reference/#update-gateway) to directly integrate these patterns into bash scripts or CI pipelines.

![Vamp UI showing a gateway routing traffic to Marathon-LB](https://cdn-images-1.medium.com/max/3048/1*QAIc0pmXDVy8Dj7tPNiJ0g.png)*Vamp UI showing a gateway routing traffic to Marathon-LB*

This scenario does come with a couple of **caveats** and **gotchas** which you should be aware of:

* We are effectively running two HAproxy instances on the same node. To **avoid port conflicts** we should establish a regime where, for instance, we assign the port range 8000–9999 to VGA and 10000–11000 to Marathon-LB. Moreover, if you want to expose any virtual hosts on ports 80 and/or 443 you will have to decide which routing solution (Marathon-LB or VGA) will “get to own” these ports. If you decide that Vamp’s VGA should own these ports, make sure to unselect the **bind-http-https **option when installing Marathon-LB

![](https://cdn-images-1.medium.com/max/2000/1*VVmqUJyOuTUdUny4gMt6IA.png)

* Because we are still **deploying to Marathon outside of the Vamp orchestrator**, the VGA does not “know” when a service is 100% deployed, booted and ready for traffic. This means we should be careful about sending traffic to new services directly after deploy: the might need some time to actually start answering requests.

## Wrap up

Congratulations! You’ve just added powerful routing to your DC/OS cluster. Vamp comes with a lot of other goodies, but this first step is an easy way to get to know Vamp.

* Read more on [how Vamp tackles routing and load balancing →](https://vamp.io/documentation/routing-and-loadbalancing/)

* [Get started with condition based routing →](https://vamp.io/documentation/using-vamp/conditions/)

* Questions or troubles, head over to [http://vamp.io/support/](http://vamp.io/support/)
