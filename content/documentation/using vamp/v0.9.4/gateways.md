---
date: 2016-09-13T09:00:00+00:00
title: Gateways
menu:
  main:
    identifier: "gateways-v094"
    parent: "Using Vamp"
    weight: 30
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}} 

* Switch to the [latest version of this page](/documentation/using-vamp/gateways).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Gateways are dynamic runtime entities in the Vamp eco-system defined by ports (incoming) and routes (outgoing). They represent load balancer rules to deployment, cluster and service instances. There are two types of Vamp gateway:
Gateways allows for programmable routing. 

* **Internal gateways** created automatically for each deployment cluster and shared by all services deployed within it. Used to distribute traffic for canary releasing and A/B testing across service variants.
* **External gateways**  explicitly declared either in a deployment blueprint or using the gateways API. Provide a stable entry point to a defined, existing route or routes.

Each gateway defines a set of rules for filtering and distributing traffic across the included routes and can optionally be set as [sticky](/documentation/using-vamp/v0.9.4/sticky-sessions/). You can access internal and external gateways through [Vamp reverse proxy](/documentation/using-vamp/v0.9.4/reverse-proxy).

### On this page:

* [Route weight and condition strength](/documentation/using-vamp/v0.9.4/gateways/#route-weight-and-condition-strength)
* [URL path rewrite](/documentation/using-vamp/v0.9.4/gateways/#url-path-rewrite)
* [Vamp managed and external routes](/documentation/using-vamp/v0.9.4/gateways/#vamp-managed-and-external-routes)

## Route weight and condition strength

Each route in a gateway has a weight and optionally one or more conditions with a `condition_strength` (used to target specific traffic for routing). Read more about [conditions](/documentation/using-vamp/v0.9.4/conditions)  

Routing is calculated as followed:

1. Vamp will first check for a condition that matches the incoming request.   
  _for example, IOS users_
- If a matching condition is found, Vamp will check the `condition_strength`. The condition strength specifies the percentage of traffic matching the condition to target.  
  _for example, 10% of IOS_
- Finally, if no matching condition was found or the request was not selected for routing based on the conditionstrength, it will be routed according to the route weight of **all** available routes.    
  _for example, all non-IOS traffic and 90% of IOS users are routed according to route weight_

{{< note title="Route weights must always total 100%" >}}
Vamp has to account for all traffic.  
When defining weights, the total weight of all routes must always add up to 100%.
This means that in a straight three-way split one service must be given 34% as `33%+33%+33%=99%` - 1% can be a lot of traffic in high volume environments.
{{< /note >}}

### Example - Route all `Firefox` and only `Firefox` users to route `service_B`:

```
service_A:
  weight: 100%
service_B:
  weight: 0%
  condition_strength: 100%
  condition: user-agent == Firefox
```

### Example - Route half of `Firefox` users to `service_B`, other half to `service_A` (80%) or `service_B` (20%):
Non `Firefox` requests will be just sent to `service_A` (80%) or `service_B` (20%).
```
service_A:
  weight: 80%
service_B:
  weight: 20%
  condition_strength: 50%
  condition: user-agent == Firefox
```

### Example - A/B test two deployments using route weight
Below is a basic example, similar to putting both deployments (`sava:1.0.0` and `sava:1.1.0`) in the same cluster.  
It is easy to imagine having an older legacy application and the new one and doing a full canary release (or A/B testing) in seamless way by using gateways like this.

Deployment 1: `PUT /api/v1/deployments/sava:1.0`

```
name: sava:1.0
gateways:
  9050/http: sava/port
clusters:
  sava:
    services:
      -
        breed:
          name: sava:1.0.0
          deployable: magneticio/sava:1.0.0
          ports:
            port: 8080/http
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
```


Deployment 2: `PUT /api/v1/deployments/sava:1.1`

```
name: sava:1.1
gateways:
  9060/http: sava/port
clusters:
  sava:
    services:
      -
        breed:
          name: sava:1.1.0
          deployable: magneticio/sava:1.1.0
          ports:
            port: 8080/http
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
```


Gateway (90% / 10%): `POST /api/v1/gateways`

```
name: sava
port: 9070/http
routes:
  sava:1.0/sava/port:
    weight: 90%          # condition can be used as well
  sava:1.1/sava/port:
    weight: 10%
```

## URL path rewrite

Vamp supports URL path rewrite. This can be a powerful solution in defining service APIs (e.g. RESTful) outside of application service.  Path rewrite is defined in the format `path: NEW_PATH if CONDITION`, where:

- `NEW_PATH` new path to be used; HAProxy variables are supported, e.g. `%[path]`
- `CONDITION` condition using HAProxy directives, e.g. matching path, method, headers etc.

### Example
```
routes:
  web/port1:
    rewrites:
    - path: a if b
  web/port2:
    weight: 100%
```

## Vamp managed and external routes

Vamp managed routes are in the format:

- `gateway` - pointing to another gateway, e.g. it is possible to chain gateways
- `deployment/cluster` - pointing to deployment cluster, i.e. services are not 'visible'
- `deployment/cluster/service` - pointing to specific service within deployment cluster

All examples above cover only Vamp managed routes.
It is also possible to route traffic to specific IP or hostname and port.
In that case IP or hostname and port need to be specified between brackets, e.g. `[hostname:port]` (and double quotes due to Yaml syntax).

```
name: mesos
port: 8080/http
sticky: route

routes:
  "[192.168.99.100:5050]":
    weight: 50%
  "[localhost:5050]":
    weight: 50%
```

{{< note title="What next?" >}}
* Read about [Vamp workflows](/documentation/using-vamp/v0.9.4/workflows/)
* Check the [API documentation](/documentation/api/v0.9.4/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
