---
date: 2016-03-09T19:56:50+01:00
title: Service discovery
---

## How does Vamp do service discovery?

Vamp uses a service discovery pattern called server-side service discovery. This pattern allows service discovery without the need to change your code or run any other daemon or agent. The provided link explains the general pro’s and cons in good detail. In addition to service discovery, Vamp also functions as a service registry.

For Vamp, we recognise the following benefits of this pattern:

* No code injection needed.
* No extra libraries or agents needed.
* platform/language agnostic: it’s just HTTP.
* Easy integration using ENV variables.

## Workflow

The general workflow for creating and publishing a service is as follows.

DSL -> Vamp API -> Vamp Gateway Agent -> HAproxy

1. The user describes a service and its desired endpoint port in the Vamp DSL.
2. The service is deployed to the configured container manager by Vamp.
3. Vamp instruct Vamp Gateway Agent (via ZooKeeper, etcd or Consul) to set up service endpoints.
4. Vamp Gateway Agent takes care of configuring HAProxy, making the services available.

{{< note title="Note" >}}
Services do not register themselves. They are explicitly created, registered in the Vamp database and provisioned on the load balancer.
{{< /note >}}

After this, the user is free to scale up/down or in/out the service either by hand or using Vamp’s auto scaling functionality. The endpoint is stable.

## Discovering a service

So, how does one service find a dependent service? Services are found by just referencing them in the DSL. Take a look at the following example:
```
---
name: my_blueprint:1.0
clusters:
  my_frontend_cluster:
    services:
      breed:
        name: my_frontend_service:0.1
        deployable: company/frontend:0.1
        ports:
          port: 8080/http
        dependencies:
          backend: my_backend_service:0.3
        environment_variables:
         BACKEND_HOST: $backend.host
         BACKEND_PORT: $backend.ports.jdbc
      scale:
        instances: 3         
  my_backend_cluster:
    services:
      breed:
        name: my_backend_service:0.3
        deployable: company/backend:0.3
        ports:
          jdbc: 8080/tcp
      scale:
        instances: 4
```

1. We have a __frontend__ cluster and a __backend cluster__. These are just organisational units.
2. The frontend cluster runs just one version of our service, consisting of __three instances__.
3. The frontend service has a hard __dependency on a backend (tcp) service__.
4. We __reference the backend__ by name, `my_backend:0.3`, and assign it a label, in this case just backend
5. We use the label backend to get the __host and a specific port__ (`jdbc`) from this backend.
6. We __assign these values to environment variables__ that are exposed in the container runtime.
7. Any frontend service now has access to the location of the dependent backend service.

{{< note title="Note" >}}
There is no point-to-point wiring. The $backend.host and $backend.ports.jdbc variables resolve to service endpoints Vamp automatically sets up and exposes.
{{< /note >}}

Even though Vamp provides this type of service discovery, it does not put any constraint on other possible solutions. For instance services can use their own approach specific approach using service registry, self-registration etc.