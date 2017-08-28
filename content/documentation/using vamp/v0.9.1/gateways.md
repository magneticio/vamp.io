---
date: 2016-09-13T09:00:00+00:00
title: Gateways
menu:
  main:
    parent: "Using Vamp"
    weight: 60
---

{{< note title="The information on this page is written for Vamp v0.9.1" >}} 

* Switch to the [latest version of this page](/documentation/using-vamp/gateways).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Gateways are dynmic runtime entities in the Vamp eco-system. They represent load balancer rules to deployment, cluster and service instances. There are two types of gateways:

* **Internal gateways** are created automatically for each deployment cluster and updated using the gateway/deployment API
* **External gateways** are explicitly declared either in a deployment blueprint or using the gateway API

#### Example - automatically created gateway 

The below gateway is for deployment `vamp`, cluster `sava` and port `port`.  
The cluster contains two services `sava:1.0.0` and `sava:1.1.0`, each with two running instances. 
```yaml
---
name: vamp/sava/port           # name
port: 40000/http               # port, either http or tcp, assigned by Vamp
active: true                   # is it running - not in case of non (yet) existing routes
sticky: none
routes:                        # routes
  vamp/sava/sava:1.0.0/port:
    weight: 50%
    instances:
    - name: vamp_6fd83b1fd01f7dd9eb7f.cda3c376-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31463
    - name: vamp_6fd83b1fd01f7dd9eb7f.cda2d915-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31292
  vamp/sava/sava:1.1.0/port:
    weight: 50%
    instances:
    - name: vamp_2e2fc6ab8a1cdbe79dc3.caa3c9e4-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31634
    - name: vamp_2e2fc6ab8a1cdbe79dc3.caa37bc3-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31826
```

## Gateway Usage

The gateway API allows for programmable routing. External gateways give an entry point to clusters (optionally specified in deployment blueprints), and allow for canary releasing and A/B testing across deployments.

A gateway defines a set of rules for routing traffic between different services within the same cluster.
Vamp allows you to determine this in three ways:

* A `condition` will target specific traffic. Read more about [conditions](/documentation/using-vamp/v0.9.1/conditions)  
_for example, IOS users_
* The `condition_strength` targets a percentage of traffic matching a condition  
_for example, 10% of IOS users_
* The `weight` for each available route (%) defines the distribution of all remaining traffic (not matching or not targetted by a condition)  
_for example, 100% of all traffic, except the targetted 10% of IOS users_


### Routes, condition-strength and weights

Each route can have a weight and one or more conditions (see [boolean expression in conditions](/documentation/using-vamp/v0.9.1/conditions/#boolean-expression-in-conditions)). Each condition has a condition-strength.

Routing is calculated as followed:

1. Find the first `condition` that matches the request. Read more about [conditions](/documentation/using-vamp/v0.9.1/conditions)  
_for example, IOS users_
- If the route exists, send the request to it depending on the `condition strength`  
_for example, 10% of IOS users are sent to the route_
- If, based on `condition strength`, the request **should not** follow that route, then send request to one from all routes based on their `weight`.  
_for example, all non-IOS traffic and 90% of IOS users are routed according to route weight_

{{< note title="Note!" >}}
Vamp has to account for all traffic.  
When defining weights, the total weight of all routes must always add up to 100%.
This means that in a straight three-way split one service must be given 34% as `33%+33%+33%=99%`.  1% can be a lot of traffic in high volume environments.
{{< /note >}}

#### Example - Route all `Firefox` and only `Firefox` users to route `service_B`:

```yaml
service_A:
  weight: 100%
service_B:
  weight: 0%
  condition_strength: 100%
  condition: user-agent == Firefox
```

#### Example - Route half of `Firefox` users to `service_B`, other half to `service_A` (80%) or `service_B` (20%):
Non `Firefox` requests will be just sent to `service_A` (80%) or `service_B` (20%).
```yaml
service_A:
  weight: 80%
service_B:
  weight: 20%
  condition_strength: 50%
  condition: user-agent == Firefox
```

#### Example - A/B test two deployments using route weight
Below is a basic example, similar to putting both deployments (`sava:1.0.0` and `sava:1.1.0`) in the same cluster.  
It is easy to imagine having an older legacy application and the new one and doing a full canary release (or A/B testing) in seamless way by using gateways like this.

Deployment 1: `PUT /api/v1/deployments/sava:1.0`

```yaml
---
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

```yaml
---
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

```yaml
---
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

#### Example
```yaml
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

```yaml
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
* Read about [Vamp conditions](/documentation/using-vamp/v0.9.1/conditions/)
* Check the [API documentation](/documentation/api/v0.9.1/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
