---
date: 2017-01-26T09:00:00+00:00
title: Deploy vamp on ACS
draft: true
---
Before we begin:

- which version of Vamp will we base this on (093/092)?

## Intro
- Explain what Vamp is:
  * open source, self hosted platform for managing microservice architectures that rely on container technology
  * business-friendly interface for deployment and microservice management
  * NOT shameless marketing - that would be very bad
  * NOT - don't talk about managing lifecycle
- ??? What is the WHY? (start with the "why" approach, why Vamp?)
- How Vamp is different from what's already in DC/OS and kubernetes (i.e. rolling upgrades)
  * Vamp takes a business level approach (percentage and condition based deployments)
  * Describe functionality already in DC/OS and K - what can/can't you do with that?
  * NICE to have a table showing the comparison? (careful it doesn't get out of date quickly)
- What Vamp adds
  * the slider!
- IMAGE nice UI screenshot in laptop - showing the slider?
- Explain what this tutorial/article covers
  * Walkthrough of steps to set up Vamp on Azure Container Service DC/OS cluster
  * Get you started using Vamp to manage deployments and running services

## Requirements
- ??? What do we require readers to have (how much are we willing to cover ourselves - don't want to dilute too much)
  * ??? what elements would readers get the most out of?
  * ??? what has been covered elsewhere (on docs.microsoft.com) that we can refer to?

## Set up Vamp on ACS
- based on (needs improving) https://blogs.technet.microsoft.com/livedevopsinjapan/2016/12/08/enable-vamp-on-azure-container-service-dcos/
  * _deploy Azure Container Service (DC/OS)_ (could better be placed in the REQUIREMENTS section)
  * _Deploy Vamp on ACS_
  * _Access Vamp and Vamp managed deployments_
- ??? can we add our own template/script like this one? https://github.com/vlesierse/vamp-acs
- ??? could we create a workflow to handle all the "Open your public agent port for your application" bits?
  * ??? would this require reverse proxy functionality and how realistic is this?
  * _configure health probe_
  * _configure load balancing rules_
  * _configure network security group_

## Explore the Vamp UI
- Walk through some interesting aspects of Vamp once this is all done
  * The slider 
  * ??? Will our setup allow everyone to use the tutorials? (we could link to them)
  
## Summing up
- What have we covered
- ??? What are our future plans?
- ??? What are the next steps?
- ??? Where do we want to link to on vamp.io?
  * tutorials
  

