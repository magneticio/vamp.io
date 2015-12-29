---
title: Gateways
weight: 35
menu:
  main:
    parent: using-vamp
    identifier: using-gateways
---

# Gateways

Gateways are another non-static entities in the Vamp eco-system. They represent load balancer rules to deployment, cluster and service instances.

There are 2 types of gateways:

- internal - created automatically for each deployment cluster, updated via Gateway/Deployment API
- external - explicitly declared either in deployment blueprint or using gateway API

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
    weight: 50
    filters: []
    instances:
    - name: vamp_6fd83b1fd01f7dd9eb7f.cda3c376-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31463
    - name: vamp_6fd83b1fd01f7dd9eb7f.cda2d915-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31292
  vamp/sava/sava:1.1.0/port:
    weight: 50
    filters: []
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
{{% copyable %}}
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
          memory: 256
          instances: 2
```
{{% /copyable %}}

Deployment 2: `PUT /api/v1/deployments/sava:1.1`
{{% copyable %}}
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
          memory: 256
          instances: 2
```
{{% /copyable %}}

Gateway (90% / 10%): `POST /api/v1/gateways`
{{% copyable %}}
```yaml
---
name: sava
port: 9070/http
routes:
  sava:1.0/sava/port:
    weight: 90          # filters can be used as well
  sava:1.1/sava/port:
    weight: 10
```
{{% /copyable %}}

This is similar to putting both `sava:1.0.0` and `sava:1.1.0` in the same cluster but that is just because this is a basic example.
It is easy to imagine having an older legacy application and the new one and doing full canary release (or A/B testing) in seamless way by using gateways like this.
