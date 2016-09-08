---
date: 2016-03-09T19:56:50+01:00
title: Vamp compared to...
menu:
   main:
     parent: WHAT IS VAMP?
     identifier: Vamp compared to...
     weight: 20 
---

* Compared to doing it yourself:  consul / buoyant / linkerd (orchestration and management)

## PaaS layer infrastructure management  
_Cloud foundry, OpenStack, Docker, DC/OS, Mesos/Marathon, Kubernetes_  
Vamp adds an experimentation layer to PaaS infrastructures.
experiment framework, continuous improvement

## Configuration management tools
_Puppet, Ansible, Chef_  
? Habitat    
? application realease automation (e.g. automic)  
? also Amazon cloudformation, heroku buildpacks, hashicopr terraform?)  
Vamp DSL, blueprints, deployment as code

## Routers and load balancers
_HAproxy, NGINX, Linkerd, traefik_  
Vamp provides A/B testing and canary functionality on an infrstructure level, arranging the distribution of incoming traffic across separate, containerised instances of deployed services. This means routing and load balancing are essential for Vamp to do its job.     
Vamp runs together with HAproxy, but could also be integrated on top of microservice-orientated solutions such as NGINX, Linkerd (finagle/twitter) or traefik which are better optimised for dynamic reconfiguration.

* [Benefits of Vamp's programmable routing](/what/usecases/)  

## CI/CD tools
_Spinnaker, Jenkins, Wercker_  
Continuous Integration and Continuous Delivery (CI/CD) tools automate the release process up to deployment, but what happens after an upgrade is deployed? Vamp completes the loop at the operations end of a CI/CD pipeline.  
Vamp can work together with CI/CD tools like Spinnaker (Netflix), Jenkins and Wercker to deploy and monitor the software they deliver. The initial deployment setup is defined in a Vamp YAML blueprint (such as container details, required resources, routing filters). Vamp will run, monitor and scale the deployment based on the filters and conditions specified in the blueprint. 
Deployments can be tracked and adapted dynamically from Vamp's API, CLI or graphical interface, so you always maintain complete control and have a clear overview of running services.

* [How Vamp enhances deployment pipelines](/what/usecases/)  

## Feature toggle frameworks
_LaunchDarkly, Gatekeeper_  
Feature toggle frameworks use code level feature toggles to isolate functionality in an application or service. Tools such as LaunchDarkly and Gatekeeper (Facebook) work with these toggles to enable, for example, A/B testing and canary functionality. Vamp provides the same possibilities without using code level toggles.   
To achieve this, Vamp sits on - or more wraps - the application layer, providing a model to describe individual (micro)services and their dependencies. This makes sense on an application code level, offering increased security and reduced technical debt compared to maintaining toggles in your code. You can instruct Vamp to deploy instances of containerised services and route incoming traffic dynamically based on your deployment descriptions (blueprints). This means, A/B testing and canary functionality are realised on an infrastructure level, and individual microservices can be automatically scaled as required.  

* [How Vamp-style canary functionality can change the way you work](/what/usecases/)  
