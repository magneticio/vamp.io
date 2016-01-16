---
title: Sticky Sessions
weight: 110
menu:
  main:
    parent: using-vamp
    identifier: sticky-sessions
---

# Sticky Sessions

Vamp supports `service` and `instance` level sticky sessions.

#### Service Level

Common use case is when the end users have to have the same experience in A/B testing setup thus they should get the same service always (either A or B).
{{% copyable %}}
```yaml
---
name: sava:1.0
gateways:
  9050/http: sava/port
clusters:
  sava:
    routing:
      sticky: service                         # setting the service level
      routes:
        sava:1.0.0:
          weight: 50%
        sava:1.1.0:
          weight: 50%
          
    services:
      -
        breed:
          name: sava:1.0.0
          deployable: magneticio/sava:1.0.0
          ports:
            port: 8080/http
          environment_variables:
            debug[SAVA_DEBUG]: true           # to show debug information such as instance id
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
      -
        breed:
          name: sava:1.1.0
          deployable: magneticio/sava:1.1.0
          ports:
            port: 8080/http
          environment_variables:
            debug[SAVA_DEBUG]: true
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
```
{{% /copyable %}}


#### Instance Level 

Common use case is when the end users need to be served by the same instance (e.g. stateful application).
{{% copyable %}}
```yaml
---
name: sava:1.0
gateways:
  9050/http: sava/port
clusters:
  sava:
    routing:
      sticky: instance                         # setting the instance level
      routes:
        sava:1.0.0:
          weight: 50%
        sava:1.1.0:
          weight: 50%
          
    services:
      -
        breed:
          name: sava:1.0.0
          deployable: magneticio/sava:1.0.0
          ports:
            port: 8080/http
          environment_variables:
            debug[SAVA_DEBUG]: true           # to show debug information such as instance id
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
      -
        breed:
          name: sava:1.1.0
          deployable: magneticio/sava:1.1.0
          ports:
            port: 8080/http
          environment_variables:
            debug[SAVA_DEBUG]: true
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
```
{{% /copyable %}}

#### Other Notes

Resetting the `sticky` value can be done by: `sticky: none` or `sticky: ~` (setting it to `null`).

Sticky sessions can be also used for gateways:

```yaml
---
name: sava:1.0
gateways:
  9050/http:
    sticky: service
    routes:           # let's say we have 2 clusters: sava1 (90%) and sava2 (10%)
      sava1/port:   
        weight: 90%
      sava2/port:
        weight: 10%
clusters:
  sava1: 
    ...
  sava2: 
    ...
```