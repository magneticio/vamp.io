---
date: 2018-07-04T09:00:00+00:00
title: "A/B testing on Kubernetes with Istio 0.8"
author: "Alessandro Valcepina"
avatar: "alessandrov.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices", "AB Testing"]
publishdate: 2018-07-04
---

![](https://cdn-images-1.medium.com/max/720/1*SEDs0n1m8vhTPlxOhrudJA.png)

This is the second post in our ongoing series describing our experiences in adopting Istio for traffic routing on Kubernetes. For more details on what we are trying to achieve with Vamp and why we choose Istio, please refer to our [first post](https://medium.com/vamp-io/putting-istio-to-work-8513f5218c51).

<!--more-->

The last months have been rather exciting for the Istio community. With the release of version 0.8 the platform has become more stable and is now benefitting from a more consistent, albeit still rough, design. These improvements come however at the price of a greater complexity in the configuration of routes.

Our goal with this new version of Vamp Lamia has been both to migrate to Istio 0.8 from 0.7.1 and to make it’s usage far more simple. At the same time we wanted to provide a new feature that would help with a specific real life scenario.
Nowadays, many product managers want to test the value of new features on a page by means of A/B testing. Unfortunately this is often far from easy.
Usually people end up with complex systems, feature switches or logging systems with offline processing. More often than not, all of this relies on manual intervention, making it a slow, error prone process, that also doesn’t integrate well with CI/CD pipelines.

As we set out to work, we asked ourselves: how much of this can be done automatically, without any coding at all?

Enter Vamp Lamia 0.2.0 .

Central to our approach to solve this problem is the concept of an Experiment.
Experiments are an easy way to setup cookie based A/B testing on services managed by Vamp Lamia. They only require a very basic configuration and no coding at all.
For the sake of simplicity, let’s assume you have an e-commerce website and you’ve heard that customers buy more if the background of the page is blue while your current background is red. You want to test this hypothesis and move to the blue background if this proves true in a canary releasing manner.

In order to do this you will have to deploy the two versions you want to test and tag them, for example, as “version1” and “version2”. Vamp will pick up these two deployments and allow you to create a Service, as well as a Destination Rule and a Gateway bound to it.
A detailed explanation of the role played by these entities is beyond the scope of this post and you can find more information in the [Istio documentation](https://istio.io/docs/).
For now, it suffices to say that a Gateway is the Istio equivalent of a Kubernetes Ingress and thus allows for the service to be exposed externally, while the Destination Rule maps labels on your deployments to subsets, providing an abstraction that can be used to better group different versions of your service.
As you can see in the screenshots below, setting up these resources is straightforward with just a few, easy to understand parameters.

![Service setup](https://cdn-images-1.medium.com/max/5760/1*PP5sAruEiaScSLOAfPB5ag.png)*Service setup*

![Gateway setup](https://cdn-images-1.medium.com/max/5760/1*9WAKB46rHvN-9qDtFvNOtQ.png)*Gateway setup*

![Destination Rule setup](https://cdn-images-1.medium.com/max/5760/1*LkGPB6j0HmOYTS5Mpk4MAA.png)*Destination Rule setup*

Once this is done you can start setting up the Experiment itself, for example using the configuration shown below.

![Experiment setup](https://cdn-images-1.medium.com/max/5760/1*SlV79_8kbprKbbutXp7Spg.png)*Experiment setup*

Most of the fields are self-explanatory, but, for the sake of clarity, let’s got through them anyway:

* **Service Name** is the name of the Service on which you want to run the A/B testing.

* **Service Port** is the Service port to use.

* **Gateway Name** is the Gateway through which the Service will be exposed.

* **Period in minutes** is the time interval in minutes after which periodic updates to the configuration will happen.

* **Step** is the amount by which the weights will shift at each update.

* **Tags** is a descriptive value associated with the specific version of the service.

* **Subset** is the subset of the Service.

* **Target** is the URL that should be checked to assess the success rate of a specific Subset.

The Experiment will test the performances of a feature by checking the number of users who opened the target page after reaching the landing page.
To track this, Vamp Lamia sets a cookie for every user who visits a landing page and later checks whether the same user visited the target page.
All this can be achieved thanks to the fact that, once an Experiment is created Vamp Lamia takes care of setting up a new Virtual Service bound to the provided Service and Gateway.

A Virtual Service is the Istio 0.8 replacement for Route Rules and is used to define traffic routing for the specified Service.
You can check out its configuration in the following screenshot.

![Virtual Service configuration](https://cdn-images-1.medium.com/max/5760/1*2VxrlhZT4_ReuZBzaasNVg.png)*Virtual Service configuration*

We realise this configuration can feel rather obscure, so let’s walk through it together.

The Virtual Service defines three routes. The first two are easy to understand: they each lead to one of the deployed versions. The third one is evenly load balancing between two versions of a Cookie Server.
The purpose of this configuration is to direct new visitors towards the Cookie Server which will then set cookies identifying them as a specific user and assigning them to one of the configured subsets.
Once this is done, the Cookie Server redirects the user back to the original URL and, thus, back through the Virtual Services. This time, however, having a Subset Cookie, one of the conditions set on the first two routes applies and the user is forwarded to a specific version of the landing page. This is done using a standard HTTP redirect, so the overhead is low and users don’t experience any interruption.
Also, thanks to our reliance on cookies, we are able to provide users with a consistent experience while continuing our test, meaning that subsequent requests coming from the same user in a short period of time will always go to the same version.


Depending on the test results, the policy defined on the Virtual Service will then move more users to the more successful version, i.e. versions with a better ratio of users that reached the target over the total number of users that reached the landing page.
Let’s assume, for example, that the blue page is better for most customers. While initially customers will be split evenly among the two versions, as time goes by and results come in, the traffic will be shifted. More customers will be assigned cookies leading to the blue page and, since cookies are time limited, also customers that had been previously assigned to the red page, will gradually move towards the better performing version.


Let’s assume, for example, that the blue page is better for most customers. While initially customers will be split evenly among the two versions, as time goes by and results come in, the traffic will be shifted. More customers will be assigned cookies leading to the blue page and, since cookies are time limited, also customers that had been previously assigned to the red page, will gradually move towards the better performing version.

This behaviour can be monitored through the metrics page as shown below.

![Virtual Service metrics](https://cdn-images-1.medium.com/max/5760/1*VbWOYP-7vpSoyjsYmVZ8aQ.png)*Virtual Service metrics*

The  scenario presented here is of course still oversimplified. In the coming weeks we will move away from the concept of subset and version in order to focus more on features that the user wants to test and we will switch to [Welch’s t-test](https://en.wikipedia.org/wiki/Welch%27s_t-test) algorithm to identify the best performing versions. At the same time we plan to automate also the creation of Gateways and Destination Rules, so that all that complexity can be hidden if the user has no need for specific configurations.

That’s all for this time! Please feel free to give us your feedback on this new feature and the direction in which Vamp Lamia is evolving and don’t forget that, if you want to have a more in — depth description of Vamp Lamia features you can take a look at our repo on [github](https://github.com/magneticio/vamp2setup).


