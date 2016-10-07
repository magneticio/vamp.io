+++
title = "Canaries and Containers - DC/OS and VAMP" 
tags = ["blog", "vamp", "news"]
category = ["news"]
date = "2016-04-18"
type = "blog"
author = "Olaf Molenveld"
draft = false
description = "With the advent of container-technology innovative ways of deploying, running and (auto)scaling software like microservices become possible for everybody. But with great power also comes great responsibility and thus these new possibilities also need a new breed of tools to really leverage the benefits of container technology in real world production environments and scenarios."
+++

## ***What do canaries and containers have in common?*** 

With the advent of container-technology (developed by Google in their now famous Borg project and made wildly popular by companies like Docker and Mesosphere) innovative ways of deploying, running and (auto)scaling software like microservices become possible for everybody. But “with great power also comes great responsibility” and thus these new possibilities also need a new breed of tools to really leverage the benefits of container technology in real world production environments and scenarios.

![](/img/weight_sliders.gif)

[DC/OS] (http://dcos.io) and [VAMP] (http://vamp.io) are such tools that help you make it easy to get the best out of using containers when you move away from “hello world” test-setups and into real world environments.

<!--more-->

To run containers in production environments, you will need a cluster manager. A single machine to run your containers on simply doesn’t give you the resilience you are aiming for. If a machine breaks down you want your containers to instantly, automatically and transparently be moved to other machines without your users experiencing any downtime. If you need more processing-power because of increased demand you want to be able to easily and quickly add machines to increase the pool of computing-resources that your containers can transparently make use of. This is where a container cluster-manager comes in.

One of the most used and battle-hardened container cluster-managers out there is Mesos. Mesos is an Apache project that spun out of technology developed and used by AirBnB and Twitter. Mesosphere is the company that is one of the core contributors to Mesos and also packages Mesos into DC/OS (the Datacenter Operation System). DC/OS is a robust and commercially supported product that is built on top of Mesos and adds powerful features like command-line and web-interfaces, simple packaging and installation, and a growing ecosystem of frameworks that can run on top of it. Mesos and DC/OS are powering famous platforms like Apple Siri, Bloomberg, Paypal, but can also be very useful on (much) smaller clusters.

An important feature of DC/OS is that it’s open-source. Opensource software these days is an important aspect of running trusted and hardened production systems and has become an important requirement for engineers and IT departments alike. We believe DC/OS is a great step forward in easing the transition to and adoption of containers and container-cluster managers in real world production environments.

Because of the heritage of Mesos, DC/OS delivers a very compelling way to run containers in production. It’s opensource, easy to install, well documented, fully featured and solves real world problems with a growing ecosystem of integrated solutions and frameworks that are easy to install and experiment with.

## Canary testing & releasing containers
One of the most popular and essential frameworks for Mesos and DC/OS is Marathon. Marathon is a container-orchestration framework and is designed to manage long-running jobs. Long-running jobs in containers are typically web-oriented API’s, applications and microservices.

While DC/OS and Marathon make it easy to deploy, run and orchestrate these containers, you need an additional “experiment framework” to enable a process of continuously measuring, improving and scaling your container-packaged software without negatively affecting your visitors or having downtime. We call this “Continuous Improvement” and this is where VAMP comes in. 

Companies like Facebook, Spotify and Netflix are very successfully using a pattern called Canary testing & releasing. It’s an advanced variant of blue-green releasing, where you seamlessly switch from the current to a new version of software without perceived downtime for your visitors. VAMP is an opensource framework that integrates with DC/OS and Marathon and delivers canary-testing & releasing and autoscaling features in an easy-to-use and powerful way.

When deploying one or more new versions of your software in containers to production, VAMP enables you to expose these versions to only a small percentage of your visitors with specific criteria (a ‘bucket’ or ‘cohort’).

You can now test and validate the technical and/or business performance of your new software versions in this limited setting but in production. This means you don’t need to over-optimise prematurely, and can detect and fix potential  issues before you move gradually to a full scale deployment.

A typical real world use-case for canary-testing & releasing with VAMP and DC/OS is:

Validating the performance of a new (e.g. responsive) website front-end by developing and optimising it only for Chrome-browsers first, exposing it to 5% of your visitors with Chrome-browsers (you could even do this for specific resolutions and devices), validating your hypothesis (e.g. better conversion and/or faster response times), fixing technical issues, and then scaling up to a higher percentage of visitors and/or gradually adding new browser-types until you reach a full deployment. 

With VAMP on DC/OS this can done by simply sending these rules to VAMP (either using our Graphical UI, command-line interface or directly to the REST API):

```yaml
---
 frontend_A: 
   weight: 100%
 frontend_B:
   weight: 0%
   filter_strength: 5%
   filters:
     - user-agent == Chrome
```  

Other use-cases are the validation and testing of different technological and architectural solutions (f.e. couchDB vs MongoDB as an embedded microservice datastore) in production and without impacting your visitors, or experimental finding of the optimal balance between allocated computing-resources (i.e. running costs) and the performance of your services.

VAMP supports grouping of filters, Boolean expressions (AND/OR/NOT), and provides a built-in set of commonly used “gateway short codes” like cookies, browser-types, headers and host-names in addition to supporting HAProxy ACL rules and configuration templates. VAMP also supports sticky sessions, URL path rewriting (very useful for API versioning, aggregation and gateway) and makes sure that services are correctly “drained” when taken out of the gateway.

## Autoscaling
So now we know that VAMP makes it very easy to implement all kinds of useful canary-testing & releasing patterns. But when you are increasing the percentage of visitors or are expanding your filter-criteria to allow more visitors, you also need to scale up the number of running instances or allocated computing resources. Of course with Marathon it’s easy to use the UI or API to set the scale of the running containers. But wouldn’t it be much more practical if you could simply change the scaling-settings at the same time when changing the gateway and load-balancing rules? Or even cooler: change the scaling automatically, based on performance-criteria? We thought so too, so we made it easy to do with VAMP:

In VAMP you can set scaling parameters manually using our API, UI or CLI:

```yaml
---
name: my_VAMP_blueprint
  clusters:
    my_cluster:
      services:
        breed:
          name: my_breed
          deployable: registry.example.com/app:1.0
        scale:
          cpu: 2
          memory: 1024MB
          instances: 4
```

You can also use scale-sets and references to these, which is useful when working with several teams or environments:

```yaml
---
name: medium_prod
cpu: 2
memory: 4096MB
instances: 3
---
name: medium_test
cpu: 0.5
memory: 1024MB
instances: 1
```

and refer to them by using:

```yaml
---
scale:
  reference: medium_test 
```

Even cooler and very handy is that you can use VAMP to define automated up and down scaling. It’s very easy. In the deployment definition you simply define a Service Level Agreement (SLA) and an escalation-type. VAMP provides common built-in patterns for this, and our upcoming workflow-engine enables you to easily create your own workflows with a few lines of javascript.  

To setup a basic auto-scaling workflow based on the aggregated response-time of a cluster of containers we simply post the following to a VAMP cluster:

```yaml
---
 sla:
      # Type of SLA.
      type: response_time_sliding_window
      threshold:
        upper: 1000   # Upper threshold in milliseconds.
        lower: 100    # Lower threshold in milliseconds.
      window:
        interval: 300 # Time period in seconds used for
                      # average response time aggregation.
        cooldown: 600 # Time period in seconds. During this 
                      # period no new escalation events will 
                      # be generated. New event may be expected 
                      # not before cooldown + interval time has 
                      # been reached after the last event. 
     
      # List of escalations.
      escalations:
        - 
          type: scale_instances
          minimum: 1
          maximum: 3
          scale_by: 1
```

This will constantly measure the aggregated backend response time of the running cluster of containers, and when the response-time exceeds 1000 milliseconds for over 5 minutes the number of running instances will increase with one (1) until the maximum of three instances is reached. When the response-time becomes lower than 100 milliseconds for over 10 minutes VAMP will make sure the number of instances is scaled down one by one, until the defined minimum of one instance is reached again. VAMP will make sure that new instances are correctly load-balanced, and that removed instances will be correctly drained (of course taking into account sticky sessions and TTL settings).  

VAMP does not only support horizontal scaling as described above, but also vertical scaling (changing memory or CPU scales) and the grouping of multiple escalations, both in sequence or in parallel.

## Getting started with VAMP and DC/OS
What do I need to do if I want to start experimenting with all these possibilities that VAMP and DC/OS deliver as described in this blog post?

1. First setup a cluster and download and install DC/OS as instructed: [https://dcos.io/docs/1.7/administration/installing/custom/gui/] (https://dcos.io/docs/1.7/administration/installing/custom/gui/)

2. Now install VAMP as a DC/OS package: [http://vamp.io/documentation/installation/dcos/] (http://vamp.io/documentation/installation/dcos/)

3. Now you can start with our Getting started with VAMP tutorials: [http://vamp.io/documentation/guides/] (http://vamp.io/documentation/guides/)

## TL/DR & Summing it up
To make the best use of containers in production environments you need a container cluster manager to deliver resilience and performance. Mesos has an amazing heritage, and all this experience is now packaged into the DC/OS. This gives you an opensource container-cluster solution that is easy to install, battle-hardened, well documented, and solves real world problems by providing an extensive and growing set of solutions and frameworks that run on top of it. 

One of these solutions is VAMP (www.vamp.io) an opensource framework that makes canary-testing/releasing and autoscaling of containers and microservices easy and powerful. Companies like Spotify, Facebook and Booking.com have moved from linear continuous deployment pipelines to continuous improvement feedback-loops using canary-testing&releasing and autoscaling patterns. Canary-testing & releasing is an advanced version of blue-green deployments to avoid downtime when releasing new software. 

When deploying new versions of their software to production they expose these to a small percentage of visitors with specific criteria (a ‘bucket’ or ‘cohort’) to test and validate technical and business performance. When successfully validated they increase the percentage of visitors that land on the new version and at the same time scale-up the number of instances and/or assigned resources to handle the increasing number of visitors with the desired performance-requirements like f.e. response time. 

These canary-test/release and autoscaling patterns require a complex and highly technical coordination and choreography between deploying, load-balancing, metric-aggregation and scaling. Until recently this was only possible to the few companies that could dedicated large amounts of research and development capabilities to this problem.  

VAMP and DC/OS now make it easy to setup and leverage a container-cluster for production-grade environments and start working with containers, microservices and canary-test/release and autoscaling patterns without having to custom-build or understand the underlying technologies.

Olaf Molenveld
olaf@magnetic.io
