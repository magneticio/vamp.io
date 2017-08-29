---
date: 2016-09-13T09:00:00+00:00
title: Service discovery
menu:
  main:
    identifier: "service-discovery-2"
    parent: "Using Vamp"
    weight: 135
---

{{< note title="The information on this page is written for Vamp v0.9.1" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/service-discovery).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp uses a service discovery pattern called server-side service discovery, which allows for service discovery without the need to change your code or run any other daemon or agent ([microservices.io - server side discovery](http://microservices.io/patterns/server-side-discovery.html)). In addition to service discovery, Vamp also functions as a service registry ([microservices.io - service registry](http://microservices.io/patterns/service-registry.html)).

For Vamp, we recognise the following benefits of this pattern:

* No code injection needed.
* No extra libraries or agents needed.
* platform/language agnostic: it’s just HTTP.
* Easy integration using ENV variables.

## Create and publish a service

{{< note title="Note" >}}
Services do not register themselves. They are explicitly created, registered in the Vamp database and provisioned on the load balancer.
{{< /note >}}

Services are created and published as follows:

![](/images/diagram/vamp-service-discovery.svg)

1. The user describes a service and its desired endpoint port in the Vamp DSL.
2. The service is deployed to the configured container manager by Vamp.
3. Vamp instructs Vamp Gateway Agent (via ZooKeeper, etcd or Consul) to set up service endpoints.
4. Vamp Gateway Agent takes care of configuring HAProxy, making the services available.

After this, you can scale the service up/down or in/out either by hand or using Vamp’s auto scaling functionality. The endpoint is stable.

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

Note that there is no point-to-point wiring. The `$backend.host` and `$backend.ports.jdbc` variables resolve to service endpoints Vamp automatically sets up and exposes.

Even though Vamp provides this type of service discovery, it does not put any constraint on other possible solutions. For instance services can use their own approach specific approach using service registry, self-registration etc.

## Configure the gateway-driver

The gateway-driver section of the Vamp configuration file `application.conf` configures how traffic should be routed through Vamp Gateway Agent. See the below example on how to configure this:

```yaml
vamp {
  gateway-driver {
    host: "10.193.238.26"              # Vamp Gateway Agent / Haproxy, internal IP.
    response-timeout: 30 seconds

    haproxy {
      ip: 127.0.0.1                    # HAProxy backend server IP

      template: ""                     # Path to template file, if not specified default will be used

      virtual-hosts {
        ip: "127.0.0.1"                # IP, if virtual hosts are enabled
        port: 40800                    # Port, if virtual hosts are enabled
      }
    }
  }
}  
```

The reason for the need to configure `vamp.gateway-driver.host` is that when services are deployed, they need to be able to find Vamp Gateway Agent in their respective networks. This can be a totally different network than where Vamp is running.
Let's use an example: `frontend` and `backend` service, `frontend` depends on `backend` - in Vamp DSL that would be 2 clusters (assuming the same deployment).
There are different ways how `frontend` can discover its dependency `backend`, and to make things simpler Vamp supports using specific environment parameters.

```yaml
---
name: my-web-app
clusters:
  frontend:
    services:
      breed:
        name: my-frontend:1.0.0
        deployable: magneticio/my-frontend:1.0.0
        ports:
          port: 8080/http
        environment_variables:
          BACKEND: http://$backend.host:$backend.ports.port
        dependencies:
          backend: my-backend:1.0.0
  backend:
    services:
      breed:
        name: my-backend:1.0.0
        deployable: magneticio/my-backend:1.0.0
        ports:
          port: 8080/http

```
In this example `$backend.host` will have the value of the `vamp.gateway-driver.host` configuration parameter, while `$backend.ports.port` the next available port from `vamp.operation.gateway.port-range`.
`frontend` doesn't connect to `backend` directly but via Vamp Gateway Agent(s) - given on these host and port parameters.
This is quite simmilar to common pattern to access any clustered application.
For instance if you want to access DB server, you will have an address string based on e.g. DNS name or something simmilar.
Note that even without Vamp, you would need to setup access to `backend` in some similar way.
With Vamp, access is via VGA's and that allows specific routing (conditions, weights) needed for A/B testing and canary releasing.

{{< note title="What next?" >}}
* Read about [using Vamp with virtual hosts](/documentation/using-vamp/v0.9.1/virtual-hosts/)
* Check the [API documentation](/documentation/api/v0.9.1/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
