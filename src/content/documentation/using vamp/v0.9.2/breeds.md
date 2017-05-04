---
date: 2016-09-13T09:00:00+00:00
title: Breeds
menu:
  main:
    identifier: "breeds-v092"
    parent: "Using Vamp"
    weight: 20
---

{{< note title="The information on this page is written for Vamp v0.9.2" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/breeds).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Breeds are static descriptions of applications and services available for deployment. Each breed is described by the DSL in YAML notation or JSON, whatever you like. This description includes name, version, available parameters, dependencies etc.
To a certain degree, you could compare a breed to a Maven artifact or a Ruby Gem description.

Breeds allow you to set the following properties:

- [Deployable](/documentation/using-vamp/v0.9.2/breeds/#deployable): the name of actual container or command that should be run.
- [Ports](/documentation/using-vamp/v0.9.2/breeds/#ports): a map of ports your container exposes.
- [Dependencies](/documentation/using-vamp/v0.9.2/breeds/#dependencies): a list of other breeds this breed depends on.
- [Environment variables](/documentation/using-vamp/v0.9.2/environment-variables/): a list of variables (interpolated or not) to be made available at runtime.

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

Docker images are pulled by your container manager from any of the repositories configured. By default that would be the public Docker hub, but it could also be a private repo.
The default deployable type is a Docker container, but we could also make this explicit by setting type to `docker`. The following statements are equivalent:

```yaml
---
deployable: company/my_frontend_service:0.1
```

```yaml
---
deployable: 
  type: container/docker
  definition: company/my_frontend_service:0.1
```

This shows the full (expanded) deployable with `type` and `definition`.



### Other deployables

Running "other" artifacts such as zips or jars heavily depends on the underlying container manager.
When Vamp is set up to run with Marathon ([mesosphere.github.io - Marathon](https://mesosphere.github.io/marathon/)), `command` (or `cmd`) deployable types can be used.
In that case cmd ([Marathon REST API - post v2/apps](https://mesosphere.github.io/marathon/docs/rest-api.html#post-v2-apps)) parameter will have value of deployable.

#### Example breed - run a custom jar after it has been downloaded 
Combining this definition and the Vamp Marathon dialect  `uris` parameter allows the requested jar to be downloaded from a remote location ([Marathon REST API - uris Array of Strings](https://mesosphere.github.io/marathon/docs/rest-api.html#uris-array-of-strings)). 


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

- `/http` HTTP ports are the default type if none is specified. They are always recommended when dealing with HTTP-based services. Vamp can record a lot of interesting metrics like response times, errors etc. Of course, using `/tcp` will work but you miss out on cool data.
- `/tcp` Use TCP ports for things like Redis, MySQL etc.

{{< note title="Note!" >}}
`/http` notation for ports is required for use of filters.
{{< /note >}}

Notice we can give the ports sensible names. This specific deployable has `web` port for customer traffic, an `admin` port for admin access and a `redis` port for some caching probably. These names come in handy when we later compose different breeds in blueprints.

## Dependencies

Breeds can also have dependencies on other breeds. These dependencies should be stated explicitly, similar to how you would do in a Maven pom.xml, a Ruby Gemfile or similar package dependency systems, i.e:

```yaml
---
dependencies:
  cache: redis:1.1
``` 

It is also possible to use wildcard `*` at the end of the name. This will match any breed name that starts with `redis:1.`:

```yaml
---
dependencies:
  cache: redis:1.*
```



In a lot of cases, dependencies coexist with interpolated environment variables or constants because exact values are not known untill deploy time.  
[Read more about environment variables](/documentation/using-vamp/v0.9.2/environment-variables/)


{{< note title="What next?" >}}
* Read about [Vamp blueprints](/documentation/using-vamp/v0.9.2/blueprints/)
* Check the [API documentation](/documentation/api/v0.9.2/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}

