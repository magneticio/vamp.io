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
? Habitat

## Routers and load balancers
_HAproxy, NGINX, Linkerd, traefik_  
Vamp provides A/B testing and canary functionality on an infrstructure level, arranging the distribution of incoming traffic across separate, containerised instances of deployed services. This means routing and load balancing are essential for Vamp to do its job.     
Vamp runs together with HAproxy, but could also be integrated on top of NGINX or other microservice orientated solutions that are better suited to dynamic reconfiguration, such as Linkerd (finagle/twitter) or traefik.

* [How could you benefit from Vamp's programmable routing?](/what/usecases/)  

## CI/CD tools
_Spinnaker, Jenkins, Wercker_  
Modern deployment pipelines use Continuous Integration and Continuous Delivery (CI/CD) tools to keep development agile and automate everything possible in the release process, but what happens after a service update is deployed? Vamp is the missing link at the operations end of a CI/CD pipeline.  
Vamp can work together with CI/CD tools like Spinnaker (Netflix), Jenkins and Wercker to deploy and monitor the services or functionality they deliver. The initial deployment setup is defined in a Vamp blueprint (containing information such as container details, required resources and routing filters). Vamp will run, monitor and scale the deployment based on the filters and conditions specified in the blueprint. 
Deployments can be tracked and adapted dynamically from Vamp's API, CLI or graphical interface, so you always maintain complete control and have a clear overview of running services.

* [How can Vamp enhance your deployment pipeline?](/what/usecases/)  

## Feature toggle frameworks
_LaunchDarkly, Gatekeeper_  
Feature toggle frameworks use code level feature toggles to isolate functionality in an application or service. Tools such as LaunchDarkly and Gatekeeper (Facebook) work with these toggles to enable, for example, A/B testing and canary functionality. Vamp provides the same possibilities without using code level toggles.   
To achieve this, Vamp sits on - or more wraps - the application layer, providing a model to describe individual (micro)services and their dependencies. This makes sense on an application code level, offering increased security and reduced technical debt compared to maintaining toggles in your code. You can instruct Vamp to deploy instances of containerised services and route incoming traffic dynamically based on your service descriptions (blueprints). A/B testing and canary functionality are, therefore, realised on an infrastructure level, and individual microservices can be automatically scaled as required.  

* [How will Vamp-style canary functionality change the way you work?](/what/usecases/)  