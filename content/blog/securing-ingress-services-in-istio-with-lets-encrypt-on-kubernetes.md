---
date: 2018-07-18T09:00:00+00:00
title: "Securing Ingress Services in Istio with Let’s Encrypt on Kubernetes"
author: "Berk Gökden"
avatar: "berkg.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices", "Security"]
publishdate: 2018-08-15
featured_image: "https://cdn-images-1.medium.com/max/720/1*rclb9okYbeFN-jJmgbT3bw.jpeg"
---

![](https://cdn-images-1.medium.com/max/720/1*rclb9okYbeFN-jJmgbT3bw.jpeg)

This is the third post in our series describing our experiences in adopting Istio for traffic routing on Kubernetes. 
For more details on what we are trying to achieve with Vamp Lamia and why we choose Istio, please refer to our 
[first post](/blog/putting-istio-to-work/) and [second post](/blog/ab-testing-istio/).

<!--more-->


In Vamp.io, we are developing Vamp Lamia to help you connect your services to real world easily and that real world requires ssl/tls connection.

Recently many browsers and also other technologies started to enforce having an ssl connection.[ Google Chrome is warning users for http connections.](https://security.googleblog.com/2018/02/a-secure-web-is-here-to-stay.html) Android is also [expecting secure connections by defaul](https://android-developers.googleblog.com/2018/04/protecting-users-with-tls-by-default-in.html)t now.

In the past, it was hard and expensive process to get certificates from an authority. A general solution was needed. Let’s Encrypt offers a practical solution to the problem of getting SSL/TLS certificates when needed. Here is the official mission of Let’s Encrypt

> Let’s Encrypt is a free, automated, and open certificate authority (CA), run for the public’s benefit. It is a service provided by the [Internet Security Research Group (ISRG)](https://letsencrypt.org/isrg/).
> We give people the digital certificates they need in order to enable HTTPS (SSL/TLS) for websites, for free, in the most user-friendly way we can. We do this because we want to create a more secure and privacy-respecting Web.
> source: [https://letsencrypt.org/](https://letsencrypt.org/)

In Istio, it is possible to [secure an ingress service by adding certificates to a gateway ](https://istio.io/docs/tasks/traffic-management/secure-ingress/). But it is a multistep process and certificate authorisation is not documented. To make this process automated, we have added an integration for Let’s Encrypt to Vamp Lamia.

There are two approaches accepted by Let’s Encrypt for certificate authorisation; HTTP and DNS. We decided to implement the DNS method first since it can be used with other TCP protocols like gRPC and also allows wildcard domain certificates.

For DNS authorisation, you still need to have a managed dns service provider. Our development environment is mainly on Google Cloud Platform so we started with integrating Google Cloud DNS, but our system is modularised so it is easy to integrate with other DNS providers such as Amazon Route 53, CloudFlare, etc. As a side note, your DNS provider doesn’t need to be as the same provider as your kubernetes cluster provider. Your cluster can be on AWS and you can still use Google Cloud DNS. Reach out to us if you need some help setting this up.

We integrated Let’s Encrypt into Gateways creation by exposing a secure hostname parameter. With this hostname, we create both a DNS service entry and a certificate authorisation.

This is done in multiple steps, so first we will explain the prerequisites.

## **Prerequisites**

The first step is the Zone domain creation, this is needed for name server redirection. This is the initial step and it may need a manual step so I will try to explain it as much as possible.

Some name service providers have fixed name servers but Google Cloud DNS creates a set of 4 name servers per zone. You need to set these name servers as your name servers in your domain provider’s settings. This is a one time operation per domain.

We registered a domain **democluster.net** at [name.com](https://www.name.com/) . You can also create a domain at Google Domain but we already had a domain lying around for this blog post. This is an example name server configuration in name.com

![](https://cdn-images-1.medium.com/max/4676/1*Oc2pbqy5tQel5K8z3oHQ4w.png)

Check if your name server configuration is updated. It is cached over the internet and it may take up to 48 hours to actually update. In our case it took around 2 hours.

Note that Google DNS has multiple sets of nameservers so when a zone is created you should check the nameservers and update them.
You can go to Google DNS page and open your zone, there will be the list of name servers under the type NS.

![Example Zone Record in Google DNS](https://cdn-images-1.medium.com/max/4148/1*3a4nMn8og60_4v1pxTcupA.png)*Example Zone Record in Google DNS*

When a Gateway is created, Vamp Lamia will set up the zone record for you and subsequently list the name servers in the UI. Let’s Encrypt authentication requires the name servers to be updated.

Now we can continue with using Vamp Lamia.

**Setting up a gateway and service:**

To install Vamp Lamia, please follow instructions in our [github](https://github.com/magneticio/vamp2setup)

For this post, we will use vamp-shop as a deployment, it is included in our package under samples. Vamp Shop is an imaginary e-commerce website, where we test our canary releasing features. We have mentioned it in [our A/B testing blog post](https://medium.com/vamp-io/a-b-testing-on-kubernetes-with-istio-0-8-6323efa2b4e2), we are using nearly the same architecture in this post.
Please run [demo-setup.sh](https://github.com/magneticio/vamp2setup/blob/master/samples/experiment-demo/demo-setup.sh) to deploy Vamp Shop to your kubernetes cluster.

Vamp Lamia regularly checks the cluster and installs missing components of Istio and detects new deployments, it is recommended to wait on the “List Virtual Cluster” page until you see the “vamp-demo” namespace appear, when it is available you can edit it.

For this demo you need to add google_project_id and google_service_account as metadata. In order to do that you have to create service account and copy the contents of the json file to value area.

![](https://cdn-images-1.medium.com/max/6720/1*Ct237GU3VhYDNW4gaxaqXQ.png)

We are going to create:

* a service

* a destination rule

* a gateway

* a virtual service

Create a service as given below:

![](https://cdn-images-1.medium.com/max/6720/1*C56YXx3aVshqZE-7dLV8gg.png)

Create a destination rule as given below:

![](https://cdn-images-1.medium.com/max/6720/1*fkLMgugQdaFL3D-Z2Otw-A.png)

Create a gateway as seen below. Please note that you need to use another hostname from a domain that you own. The “Secured Host” will be used for registering to DNS and to Let’s Encrypt. There can be only one Secured Host per port due to TCP protocol limitations. The default port for HTTPS is 443.

![](https://cdn-images-1.medium.com/max/6720/1*-uEvOJ5PgWtiP_vzp62u3w.png)

Create a virtual service as given below, here the protocol is http, the SSL/TLS termination is happening at the edge of the cluster and internal services can continue using http.

![](https://cdn-images-1.medium.com/max/6720/1*uEcLnNlfbiu-2zcv7-qtgA.png)

You may need to wait to get a notification that the gateway has been updated in the UI. You can view the “Gateway Details” page to see the list of current name servers:

![](https://cdn-images-1.medium.com/max/6720/1*j6C-hKQrkkPi6ZL6Eh9Gwg.png)

if everything went well, you can check the website on your browser:

![Certificate is visible on a browser](https://cdn-images-1.medium.com/max/5148/1*bvRbHrMS1F0LUdJ40XRD-Q.png)*Certificate is visible on a browser*

**What happened?**

When a secure host is defined, Vamp Lamia first sets up a gateway and gets a public ip and then tries to communicate with your dns provider and sets up an A Record, so that your service is reachable by the ip address. Finally, Vamp Lamia is ready to set up certificates.

Vamp Lamia will generate certificates, authenticate with Let’s Encrypt using DNS Challenge and set it up using your DNS provider. The result of this process is also visible on Google DNS page as seen below:

![DNS Records after the Let’s Encrypt authorisation](https://cdn-images-1.medium.com/max/4240/1*EgV3LkBL14OzSi-86Q0lfQ.png)*DNS Records after the Let’s Encrypt authorisation*

When a client asks certificate registration, Let’s Encrypt asks to authorise for that domain. There are two possible ways, an HTTP challenge and a DNS Challenge. We are using DNS challenge since it is more flexible. Let’s Encrypt gave a digest hash and we inserted a TXT record under *_acme-challenge.shop.democluster.net.*

Finally, Vamp Lamia inserts the certificates into the Istio Gateway.

Please note that, Vamp Lamia makes some assumptions regarding hostnames, When you have a service hostname like service-name.domain-name.com. We assume that domain-name.com will be used as your zone name. We currently create a certificate per hostname, but we are planning to add domain-wise certificates in a later release.

With the current state of internet, it is crucial to have SSL/TLS certificates. As we mentioned, since Google and many other software providers are pushing for HTTPS as default in browsers, it is vital to have secure services. With this feature, in a Vamp Lamia managed cluster, it is very easy to set up a secure service and expose it to the real world.

See you in the next post and check our [github](https://github.com/magneticio/vamp2setup).
