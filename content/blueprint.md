---
date: 2016-03-09T19:56:50+01:00
title: blueprint (reference)
---
[back to resources page](/resources/)  

reference - work in progress

## Blueprints

Blueprints allow you to add the following properties:

* gateways: a stable port where the service can be reached.
* clusters & services: a cluster is a grouping of services with one purpose, i.e. two versions (a/b) of one service.
* environment variables: a list of variables (interpolated or not) to be made available at runtime.
* dialects: a dialect is a set of native commands for the underlying container platform, i.e. Docker or Mesosphere Marathon.
* scale: the CPU and memory and the amount of instance allocate to a service.
* routing: how much and which traffic the service should receive.
* filters: how traffic should be directed based on HTTP and/or TCP properties.
* sla & escalations: SLA definition that controls autoscaling.

## Breeds

Breeds allow you to set the following properties:

* deployable: the name of actual container or command that should be run. Vamp supports Docker containers or can support any other artefacts supported by your container manager. 
* ports: a map of ports your container exposes.
* environment variables: a list of variables (interpolated or not) to be made available at runtime.
* dependencies: a list of other breeds this breed depends on.

### Deployable

Let’s start with an example breed that deploys a Docker container:


```
---
name: my_breed:0.1
deployable: company/my_frontend_service:0.1

ports:
  web: 8080/http   
```
  
This breed, with a unique name, describes a deployable and the port it works on. By default, the deployable is a Docker container. We could make this also explicit by adding docker://. The following statements are equivalent.

```
deployable: company/my_frontend_service:0.1
deployable: docker://company/my_frontend_service:0.1
```

Docker images are pulled by your container manager from any of the repositories configured. This can be private repos but by default are the public Docker hub.

Running “other” artefacts such as zips or jars heavily depend on the underlying container manager. When Vamp is setup to run with Marathon, command:// (or cmd://) deployable type can be used. In that case cmd parameter will have value of deployable.

For instance running a custom jar after it has been downloaded (uris parameter):

```
name: location
clusters:
  api:
    services:
      breed:
        name: location
        deployable: cmd://java -jar location.jar
      marathon:
        uris: ["https://my_repo_location_jar"]
```

For instance it can be specified cmd://java -jar some.jar and using Vamp Marathon dialect uris parameter can be used for some.jar can be downloaded from the remote location.

### Ports

The ports property is an array of named ports together with their protocol. It describes on what ports the deployables is offering services to the outside world. 

Ports come in two flavors:

* `/tcp` this is the default type if none is specified. Use it for things like Redis, MySQL etc.
* `/http` HTTP ports are always recommended when dealing with HTTP-based services. Vamp can record a lot of interesting metrics like response times, errors etc. Of course, using `/tcp` will work but you miss out on cool data.


{{< note title="TIP!" >}}
Use the `/http` notation for ports whenever possible!
{{< /note >}}

#### Example - breed with multiple ports

```
---
name: my_breed:0.1
deployable: company/my_frontend_service:0.1

ports:
  web: 8080/http
  admin: 8081/http
  redis: 9023/tcp   
  ```
  
Notice we have given the ports sensible names.   
This specific deployable has a web port for customer traffic, an admin port for admin access and a redis port for some caching probably. These names will come in handy when we start to compose different breeds in blueprints.

[back to resources page](/resources/)
