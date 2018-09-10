---
date: 2016-09-13T09:00:00+00:00
title: Sticky Sessions
menu:
  main:
    identifier: "sticky-sessions-v095"
    parent: "Using Vamp"
    weight: 170

---

Gateways can optionally be set as sticky on either a route or instance level.

* **Route level**
  Use when end users should always have the same experience, for example A/B testing service variants.
* **Instance level**
  Use when end users need to be served by the same instance, for example a stateful application.

Vamp sticky sessions are managed using cookies. Traffic routed through a gateway set as sticky will receive a cookie with the unique hash for the route or instance served. Subsequent visits to the same gateway will result in the same hashed route or instance being served. In the case that a route or instance with the stored hash is not available (for example, when a service variant has been removed), cookie settings will be ignored and standard routing rules applied.

![](/images/screens/v095/gateways_sticky_route.png)

## Examples

### Example - blueprint with route level sticky sessions

```
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

### Example - blueprint with instance level sticky sessions

A common use case is when the end users need to be served by the same instance (e.g. stateful application).

```
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

{{< note title="What next?" >}}
* Read about [using Vamp with virtual hosts](/documentation/using-vamp/v0.9.5/virtual-hosts/)
* Check the [API documentation](/documentation/api/v0.9.5/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
