---
date: 2016-09-13T09:00:00+00:00
title: Breeds 
---
Breeds are static descriptions of applications and services available for deployment. Each breed is described by the DSL in YAML notation or JSON, whatever you like. This description includes name, version, available parameters, dependencies etc.
To a certain degree, you could compare a breed to a Maven artifact or a Ruby Gem description.

Breeds allow you to set the following properties:

- [Deployable](#deployable): the name of actual container or command that should be run.
- [Ports](#ports): a map of ports your container exposes.
- [Environment variables](/documentation/using-vamp/environment_variables/): a list of variables (interpolated or not) to be made available at runtime.
- [Dependencies](#environment-variables-dependencies): a list of other breeds this breed depends on.


## Deployable

Deployables are pointers to the actual artifacts that get deployed. Vamp supports Docker containers or can support any other artifacts supported by your container manager. 

#### Example breed - deploy a Docker container

```yaml
---
name: my_breed:0.1
deployable: company/my_frontend_service:0.1

ports:
  web: 8080/http   
```

This breed, with a unique name, describes a deployable and the port it works on. 

### Docker deployables

By default, the deployable is a Docker container. 
We could also make this explicit by setting type to `docker`. The following statements are equivalent:

```yaml
---
deployable: company/my_frontend_service:0.1
```

```yaml
---
deployable: 
  type: docker
  definition: company/my_frontend_service:0.1
```

This shows the full (expanded) deployable with `type` and `definition`.


Docker images are pulled by your container manager from any of the repositories configured. By default that would be the public Docker hub, but it could also be a private repo.

### Other deployables

Running "other" artifacts such as zips or jars heavily depends on the underlying container manager.
When Vamp is set up to run with [Marathon](https://mesosphere.github.io/marathon/), `command` (or `cmd`) deployable types can be used.
In that case [cmd](https://mesosphere.github.io/marathon/docs/rest-api.html#post-v2-apps) parameter will have value of deployable.

#### Example breed - run a custom jar after it has been downloaded ([uris](https://mesosphere.github.io/marathon/docs/rest-api.html#uris-array-of-strings) parameter)

```yaml
---
name: location
clusters:
  api:
    services:
      breed:
        name: location
        deployable: 
          type: cmd
          definition: java -jar location.jar
      marathon:
        uris: ["https://my_repo_location_jar"]

```

For instance together with this definition and Vamp Marathon dialect `uris` parameter requested jar can be downloaded from remote location. 

### JavaScript deployables 

Breeds can have type `application/javascript` and definition should be a JavaScript script:

```yaml
---
name: hello-world
deployable:
  type: application/javascript
  definition: |
    console.log('Hello World Vamp!');
```

It is possible to create or update breeds with the API request `POST|PUT /api/v1/breeds/{name}`, Javascript script as body and header `Content-Type: application/javascript`.

## Ports

The `ports` property is an array of named ports together with their protocol. It describes on what ports the deployables is offering services to the outside world. Let's look at the following breed:

```yaml
---
name: my_breed:0.1
deployable: company/my_frontend_service:0.1

ports:
  web: 8080/http
  admin: 8081/http
  redis: 9023/tcp   
```

Ports come in two flavors:

- `/tcp` this is the default type if none is specified. Use it for things like Redis, MySQL etc.

- `/http` HTTP ports are always recommended when dealing with HTTP-based services. Vamp can record a lot of 
interesting metrics like response times, errors etc. Of course, using `/tcp` will work but you miss out on cool data.

> **Tip:** Use the `/http` notation for ports whenever possible!

Notice we can give the ports sensible names. This specific deployable has `web` port for customer traffic, an `admin` port for admin access and a `redis` port for some caching probably. These names come in handy when we later compose different breeds in blueprints.

## Where next?

* Read about [Blueprints](/resources/using-vamp/blueprints/)
* check the [API documentation](/resources/api-documentation/)
* [Try Vamp](/try-vamp)
