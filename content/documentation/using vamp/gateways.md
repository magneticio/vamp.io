---
date: 2016-09-13T09:00:00+00:00
title: Gateways
---

Gateways are dynmic runtime entities in the Vamp eco-system. They represent load balancer rules to deployment, cluster and service instances.

There are two types of gateways:

* **Internal gateways:** created automatically for each deployment cluster, updated using the gateway/deployment API
* **External gateways:** explicitly declared either in a deployment blueprint or using the gateway API

This is an example of automatically created gateway for deployment `vamp`, cluster `sava` and port `port`.
Cluster contains 2 services `sava:1.0.0` and `sava:1.1.0` with 2 running instances each. 
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

Gateway API allows programmable routing and having external gateways gives:

- entry point to clusters, e.g. specified (but not necessarily) in deployment blueprints
- canary release and A/B testing on cross deployment level.

**Example of A/B testing of 2 deployments**

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

This is similar to putting both `sava:1.0.0` and `sava:1.1.0` in the same cluster but that is just because this is a basic example.
It is easy to imagine having an older legacy application and the new one and doing full canary release (or A/B testing) in seamless way by using gateways like this.

### Gateway Usage

Gateways define a set of rules for routing traffic between different services within the same cluster.
Vamp allows you to determine this in following ways:

1. by setting a **weight** in the percentage of traffic.
2. by setting a **condition** condition to target specific traffic.
3. by setting a **condition strength** in the percentage of traffic matching the condition.

You can define gateways inline in a blueprint or store them separately under a unique name and just use that name to reference them from a blueprint.

Let's have a look at a simple inline gateway. This would be used directly inside a blueprint.

```yaml
---
condition_strength: 10%  # Amount of traffic for this service in percents.
condition: User-Agent = IOS
```

> **Notice:** we added a condition named `really_cool_condition` here. This condition is actually a reference to a separately stored condition definition we stored under a unique name on the `/conditions` endpoint.

### Defining weights, condition strength and basic weight rules

For each route, weight can be set regardless of any condition.
The basic rule is the following:

- find the first condition that matches request
- if route exists, send the request to it depending on condition strength
- if based on condition strength route **should not** follow that route then send request to one from all routes based on their weights.

When defining weights, please make sure the total weight of routes always adds up to 100%.
This means that when doing a straight three-way split you give one service 34% as `33%+33%+33%=99%`. Vamp has to account for all traffic and 1% can be a lot in high volume environments.


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

## Where next?

* Read about [Conditions](/documentation/using-vamp/conditions/)
* check the [API documentation](/documentation/api/)
* [Try Vamp](/try-vamp)