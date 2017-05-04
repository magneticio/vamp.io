---
date: 2016-09-13T09:00:00+00:00
title: Sticky Sessions
menu:
  main:
    identifier: "sticky-sessions-v093"
    parent: "Using Vamp"
    weight: 130
---

{{< note title="The information on this page is written for Vamp v0.9.3" >}} 

* Switch to the [latest version of this page](/documentation/using-vamp/sticky-sessions).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp supports `route` and `instance` level sticky sessions.

## Route Level

A common use case is when the end users have to have the same experience in A/B testing setup thus they should get the same service always (either A or B).

```yaml
---
name: sava:1.0
gateways:
  9050/http: sava/port
clusters:
  sava:
    gateways:
      sticky: route                           # setting the route level
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



## Instance Level 

A common use case is when the end users need to be served by the same instance (e.g. stateful application).

```yaml
---
name: sava:1.0
gateways:
  9050/http: sava/port
clusters:
  sava:
    gateways:
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

## Other Notes

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

{{< note title="What next?" >}}
* Read about [using Vamp for service discovery](/documentation/using-vamp/v0.9.3/service-discovery/)
* Check the [API documentation](/documentation/api/v0.9.3/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
