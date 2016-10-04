---
date: 2016-09-13T09:00:00+00:00
title: Other tools
---

## Vamp compared to CI/CD tools
_Spinnaker, Jenkins, Wercker, Travis, Bamboo_    
Continuous Integration and Continuous Deployment/Delivery (CI/CD) tools automate the release process up to deployment. But what happens after an upgrade is deployed? How to do an upgrade from one version to the next without downtime and in a controlled and managed way? Complexity explodes when doing this with multiple teams, multiple times a day, with multiple microservices. Vamp closes the loop between the development and operations parts of a CI/CD pipeline by canary-testing and canary-releasing a deployable gently into production and feeding back runtime technical and business metrics for optimising workflows like f.e. autoscalers. Vamp integrates with CI/CD tools like Travis, Jenkins or Wercker to canary-release and scale the built deployables they provide to Vamp. The initial deployment setup is defined in a YAML blueprint (e.g. deployable details, required resources, routing filters) and is typically provided by the CI tool as a template to the Vamp API. Vamp will then run, canary-release, monitor and scale the deployment based on the filters and conditions specified in the blueprint.

## Vamp compared to feature toggle frameworks
_LaunchDarkly, Togglz, Petri_  
Feature toggle frameworks use code level feature toggles to conditionally test new functionality in an application or service. Tools such as LaunchDarkly and Togglz work with these toggles to enable, for example, A/B testing and canary functionality. It can be argued if feature toggling is the smartest way to test out new features: https://dzone.com/articles/feature-toggles-are-one-worst.
Vamp provides mature possibilities to test out new features in a controlled way and without having to adjust your code. To achieve this, Vamp controls the traffic routing that connects your application and services, providing a model to describe individual (micro)services and their dependencies, and how traffic is routed towards and between them. This makes sense on an application code level, offering increased security and reduced technical debt compared to maintaining toggles in your code.

## Vamp compared to configuration management and provisioning tools
_Puppet, Ansible, Chef, Terraform_    
The responsbilities of configuration management and infrastructure provisioning tools are often stretched to cover container deployment features. These tools were not intended for handling container deployments or the dynamic management and routing traffic over these containers. Vamp has been designed and developed from the ground up specifically to fit these use cases.  

## Vamp compared to custom built solutions
Building and maintaining a scalable and robust enterprise-grade system for canary-testing and releasing is not trivial. Vamp delivers programmable routing and automatic load balancing, deployment orchestration and workflows, as well as a powerful event system, REST API, graphical UI, integration testing tools and a CLI.  

## Vamp compared to A/B and MVT testing tools
_Optimizely, VisualWebsiteOptimizer, Google Analytics, Planout_  
Vamp enables canary testing versions of applications, effectively providing A/B and MVT testing of applications and services by deploying two or more versions of an application or service and dividing incoming traffic between the running versions. Vamp doesn't have a built-in analytics engine though, so the analysing of the relevant metrics needs to be done with a specific Vamp workflow or an external analytics engine. Winning results can be fed back to Vamp to automatically update routing rules and deployments to push a winning version to a full production release. Because of the flexible programmable routing and use of environment variables, Vamp can be used to canary test almost everything, from content and business logic to configuration settings and architectural changes.  

## Vamp compared to DevOps tools
_Deis, Flynn, Dokku_  
Vamp has no ambition to provide a Heroku-like environment for containers. Vamp integrates programmable routing and load balancing, container deployments and orchestration to enable canary testing and canary releasing features. Vamp also adds metrics-driven workflows for auto-scaling and other optimisations. Vamp sees business as a first class citizen in DevOps teams, providing a graphical UI and tools for non-technical roles.   






