---
date: 2018-08-17T15:00:00+00:00
title: 5. Working with a CD pipeline on Kubernetes
menu:
  main:
    parent: "Tutorials"
    weight: 60
---

Build, publish, deploy, and release. 

### Deploy
We define **deployment** as the process of installing a new version of **software on production** infrastructure. In Kubernetes terms, one or more containers have been created from the newly published Docker image and are running in pods on your production Kubernetes cluster. The Docker containers have started successfully, they are passing their health checks and are **ready to handle production traffic** but may not actually be receiving any.

### Release
We define a deployed version of your software as being **released** when it is **responsible for serving production traffic**. And we define **releasing** as **the process of moving production traffic to the new version**. 

## Example microservices topology
The service topologies we've used in the previous tutorials have been useful for demonstrating some of core concepts and features of Vamp but they are @@


### Using the Accept Header to version your API
There are differing opinions on how to version a REST API

We are going to use the Github's approach.

Github chose to use the latest API version when the client doesn't request a specific version.

But there is a good argument to always require the clients to specify a version; when you would default to the latest version, a lot of clients will break as soon as you update your API.

https://tools.ietf.org/html/rfc4288#section-3.2
