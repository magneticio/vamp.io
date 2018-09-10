---
date: 2018-07-18T09:00:00+00:00
title: "Advanced Networking with Istio on Kubernetes"
author: "Alessandro Valcepina"
avatar: "alessandrov.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices"]
publishdate: 2018-07-18
---

![](https://cdn-images-1.medium.com/max/720/1*F05sDjQWQ0-YiDZ22RMSsQ.jpeg)

Welcome to the third post in the ongoing series describing our experiences in adopting [Istio](https://istio.io) and the
 development of Vamp Lamia. For more details on what we are trying to achieve with Vamp and why we choose Istio, please refer 
 to our [first](/blog/putting-istio-to-work/) and [second](/blog/ab-testing-istio/) posts.

<!--more-->


Up till now we focused mostly on presenting specific features of Vamp Lamia by relying on examples that were far simpler than most real world scenarios.

In this post we will present a more complex example, based on a test setup that we used internally to verify the extent of Istio’s capabilities. To that end we will create multiple Services, Virtual Services and Gateways and we will present Vamp Lamia solutions to the problems that might arise when managing such an environment.

While reading through this post, keep in mind that a more complete guideline to reproduce this setup on your own cluster is available our [github repository](https://github.com/magneticio/vamp2setup/tree/feature/advanced-networking-example#advanced-networking).

A typical scenario that would benefit from the described topology with multiple Virtual Clusters and multiple Gateways, would be the following one:

Multiple independent teams working on their own services with a “[you build it, you run it](https://queue.acm.org/detail.cfm?id=1142065)” approach, where the sizing and budgets of the infrastructure are not clear yet, and thus running multiple Virtual Clusters on a single “real” Cluster makes more sense at this moment. The teams develop, iterate and deploy their services themselves and independently from each other, the services sometimes need to connect to each other or to other external services.

Let’s say team 1 is managing an old Service svc-1, which has gone through many iterations and versions, is EOL, but cannot be decommissioned yet. Additionally Service svc-1 is exposed on two different hostnames that correspond to different versions of the same Service.

Team 2 is developing a Service svc-2 that has the same endpoints as the old Service svc-1, but also needs new features and other changes that extend its functionalities. Because other services also make use of service svc-1, it is decided to not change its interface at this moment. Team 2 then has to route traffic between svc-1 and svc-2 based on the endpoint that is being invoked.

Team 3 makes use of this new Service svc-2 interface, but also needs to make use of caching or SSL features. This means that traffic needs to go outside of the cluster in order to connect to the Service.

This rather complex scenario is outlined in the image below.

![](https://cdn-images-1.medium.com/max/3258/1*SRRQKjtceX_u39bIyrMvzA.jpeg)

As you can see, for each team we have a different Virtual Cluster (corresponding to a namespace in [Kubernetes](https://kubernetes.io)) with its own Deployments. When the namespaces and Deployments are first created in Kubernetes, Vamp takes care of importing them automatically into its internal representation, leaving us with the task of setting up the Networking Infrastructure made up by Services, Virtual Services and Gateways.

The first problem we have to face is how to manage Gateways. Gateways are Istio resources that allow to expose Services outside the Cluster. The standard approach with Istio is to have a single Gateway mapping all required hostnames, however, while this is certainly an acceptable solution in a lot of cases, it doesn’t fit our scenario. We don’t want the separate teams to have to worry about a shared resource that contains all hostnames, we want instead to have a separate Gateway for each team.

Achieving this can be a rather difficult task in Istio, but with Vamp Lamia’s support it is as easy as filling in a form, like shown below.

![First gateway setup](https://cdn-images-1.medium.com/max/5760/1*-dMWuBYX3M1lk5G0FNF77w.png)*First gateway setup*

When the form is submitted Vamp Lamia will create a Load Balanced Service and the corresponding Deployment to allow the new Gateway to have its own IP address and thus avoid conflicts with other Gateways.

Now that we decided how to expose the Services, we need to take care of the routing: we will do that by employing Virtual Services.

In the first Virtual Cluster (vamp-test1) we want to have one service and dispatch requests to its different Subsets based on the hostname.
To do that we first need to create the Service and its Destination Rule, mapping each version to a different Subset. After that is taken care of, we can create two Virtual Services with the following configurations.

![First Virtual Service](https://cdn-images-1.medium.com/max/5760/1*fUoVNnQsl3-oQW6QDhs34g.png)*First Virtual Service*

![Second Virtual Service](https://cdn-images-1.medium.com/max/5760/1*LtgFfCxrQzYrfVFz3utK8Q.png)*Second Virtual Service*

In the hosts field we have specified different hostnames, the same we specified also in the Gateway definition. This will prompt the Virtual Services to filter requests based on the hostname and only handle those matching the specified value. Mind the fact that hostnames are not automatically assigned to the Gateway ip. but you can easily do that by using [Google DNS](https://developers.google.com/speed/public-dns/) or other online services like, for example, [name.com](https://www.name.com/) or [DNSDynamic](https://www.dnsdynamic.org/).

It’s now time to move to Virtual Cluster vamp-test2. In this Virtual Cluster we want to route request to Services svc-2 or svc-1 based on their URI. First of all let’s create a second Gateway with a single hostname.

![Second Gateway](https://cdn-images-1.medium.com/max/5760/1*SsVvxIXaouqDP2ItsMrGlw.png)*Second Gateway*

Now we can achieve our goal by creating a new Virtual Service, where we set up two conditional rules, filtering requests based on the URI prefix.

![Third Virtual Service](https://cdn-images-1.medium.com/max/5760/1*SpSdCwvsMGsPbBC4fVfEaw.png)*Third Virtual Service*

With this configuration URIs matching the specified pattern will be forwarded to the appropriate service and the URI itself will be rewritten to “/”. Mind the fact that since svc-2 resides in another Virtual Cluster we have to use its fully qualified name in order to reach it.

Finally let’s say our third imaginary team of developers needs to reach for the Virtual Service we just defined from outside the Cluster. This would be more logical if we had a second Cluster on which the third team would be working, but, for the sake of simplicity, we will just use another Virtual Cluster (vamp-test3).

External services are normally not reachable from pods belonging to the Istio Mesh, hence we have to somehow make the host defined on Gateway gw-2 accessible. Service Entries are an Istio resource that can do just that.
We are thus going to create one of them with this configuration.

![Service Entry](https://cdn-images-1.medium.com/max/5760/1*0_SplKo6sSKYC9h8NF-jhQ.png)*Service Entry*

This will allow us to make calls towards the Service (for example by logging into the single pod in vamp-test3 and running CURL commands). Additionally we can now also add a Virtual Service on top of the Service Entry to take advantage of some features like retries or timeouts. In this case the Virtual Service configuration is quite simple, because there is no need to specify subsets or ports.

![Fourth Virtual Service](https://cdn-images-1.medium.com/max/5760/1*6NiWJAHTawe-Flgn1pzgYw.png)*Fourth Virtual Service*

With this final step we have achieved our initial goal. We managed to provide all three teams with their own independent working environments, to expose their services according to different needs and to consume them as if they were external service.

In doing that we learned how to properly set up Gateways and the different roles that Virtual Services can play in handling the networking layer of a Cluster. Moving forward, we plan to support more advanced configuration options for all the resources used in the example and to make setting them up through Vamp Lamia even simpler.

This concludes our example, but don’t forget that if you want to delve deeper or experiment with a setup of your own, you can refer to our [github repository](https://github.com/magneticio/vamp2setup), where you will find the complete tutorial for this example as well as many other guides.

Check back soon for more updates on our experiences with Istio and the Vamp Lamia’s new features.
