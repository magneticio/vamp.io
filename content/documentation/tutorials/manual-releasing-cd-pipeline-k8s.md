---
date: 2018-08-17T15:00:00+00:00
title: 5. Working with a CD pipeline on Kubernetes
menu:
  main:
    parent: "Tutorials"
    weight: 60
---

Build, test, deploy, and release. 

### Deploy
Deployment is your team’s process for installing the new version of your service’s code on production infrastructure. When we say a new version of software is deployed, we mean it is running somewhere in your production infrastructure. That could be a newly spun-up EC2 instance on AWS, or a Docker container running in a pod in your data center’s Kubernetes cluster. Your software has started successfully, passed health checks, and is ready (you hope!) to handle production traffic, but may not actually be receiving any.

### Release
When we say a version of a service is released, we mean that it is responsible for serving production traffic. In verb form, releasing is the process of moving production traffic to the new version.

### Using the Accept Header to version your API
There are differing opinions on how to version a REST API

We are going to use the Github's approach.

Github chose to use the latest API version when the client doesn't request a specific version.

But there is a good argument to always require the clients to specify a version; when you would default to the latest version, a lot of clients will break as soon as you update your API.

https://tools.ietf.org/html/rfc4288#section-3.2