---
date: 2016-03-09T19:56:50+01:00
title: Vamp compared to...
 menu:
   main:
     parent: WHAT IS VAMP?
     identifier: Vamp compared to...
     weight: 20 
---

{{< warning title="DRAFT" >}}
{{< /warning >}}  
Vamp works with scalable container infrastructures to provide programmable, microservice-level routing.   

## Infrastructure management  
_Cloud foundry, OpenStack, Docker, DC/OS, Mesos/Marathon, Kubernetes_

## Configuration management  
_Puppet, Ansible, Chef_

## Routers and load balancers
_Linkerd, Nginx, traefik, HA proxy_

## CI/CD tools
_Spinnaker, Jenkins, Wercker_  
Modern deployment pipelines use Continuous Integration and Continuous Delivery to stay agile and automate everything possible, but what happens once an application is released?  

## Feature toggle frameworks
_LaunchDarkly, Gatekeeper_  
Feature toggle frameworks use code level feature toggles to isolate functionality in an application or service. Tools such as LaunchDarkly and Gatekeeper (Facebook) work with these toggles to enable, for example, A/B testing and canary functionality. Vamp provides the same possibilities without using code level toggles.   
To achieve this, Vamp sits on - or more wraps - the application layer, providing a model to describe individual (micro)services and their dependencies. This makes sense on an application code level, offering increased security and reduced technical debt compared to maintaining toggles in your code. You can instruct Vamp to deploy instances of containerised services and route incoming traffic dynamically based on your service descriptions (blueprints). A/B testing and canary functionality are, therefore, realised on an infrastructure level, and individual microservices can be automatically scaled as required.  

* [How will __you__ use Vamp?](/what/usecases/)  