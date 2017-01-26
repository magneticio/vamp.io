---
date: 2017-01-26T09:00:00+00:00
title: Deploy vamp on ACS
draft: true
---
Before we begin:

- **???** which version of Vamp will we base this on (093/092)?

My questions:

- Why DC/OS and not Kubernetes? 
- 

## Intro
- Explain what Vamp is:
  * open source, self hosted platform for managing microservice architectures that rely on container technology
  * business-friendly interface for deployment and microservice management
  * **NOT:** shameless marketing - that would be very bad
  * **NOT:** don't talk about managing lifecycle
- **???** What is the WHY? (start with the "why" approach, why Vamp?)
- How Vamp is different from what's already in DC/OS and kubernetes (i.e. rolling updates)
  * Vamp takes a business level approach (percentage and condition based deployments)
  * Describe functionality already in DC/OS and Kubernetes - what can/can't you do with that?
  * **NICE:** table showing the comparison? (careful it doesn't get out dated quickly)

  |  DC/OS  |  Kubernetes  |  Vamp
---|----|----|----
 Rolling updates   |   | update one pod at a time  |
 Rollback  |  |  |
 Percentage and condition based deployments |    |    |


- What Vamp adds
  * slider
- **IMAGE:** UI screenshot in laptop - showing the slider?
- What this tutorial/article covers:
  * Walkthrough of steps to set up Vamp on Azure Container Service DC/OS cluster
  * Get started using Vamp to manage deployments and running services
  * Discover ...

## Requirements
- **???** What do we require readers have (how much are we willing to cover ourselves - don't want to dilute too much)
  * **???** what elements would readers get the most out of?
  * **???** what has been covered elsewhere (on docs.microsoft.com) that we can refer to?

## Set up Vamp on ACS
Three steps, based on https://blogs.technet.microsoft.com/livedevopsinjapan/2016/12/08/enable-vamp-on-azure-container-service-dcos/

1. Deploy Azure Container Service (DC/OS)  
  * **???** Better be placed in the REQUIREMENTS section?
- Deploy Vamp on ACS
  * **???** Can we add a template/script to do this? e.g. https://github.com/vlesierse/vamp-acs
- Access Vamp and Vamp managed deployments
  * **???** Could we create a workflow to handle all the "Open your public agent port for your application" bits?
  * **???** Would this require reverse proxy functionality and how realistic is this?
  * _configure health probe_
  * _configure load balancing rules_
  * _configure network security group_

## Explore the Vamp UI
- Walk through some interesting aspects of Vamp once this is all done
  * The slider 
  * **LINK:** tutorials?
  
## Summing up
- What have we covered
- **???** What are our future plans?
- **???** What are the next steps?
- **LINK:** Where do we want to link to on vamp.io:
  * tutorials
  

