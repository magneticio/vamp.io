---
date: 2016-09-13T09:00:00+00:00
title: Health checks
menu:
  main:
    identifier: "health-v095"
    parent: "Using Vamp"
    weight: 130

---

Vamp tracks the health of deployed service instances and gateways. The [default Vamp health workflow](/documentation/using-vamp/v0.9.5/workflows/) reports health based on a combination of defined health checks and gateway monitoring. Health status is stored in the Elasticsearch index `vamp-pulse-health-YYYY-MM-DD` and displayed in the Vamp UI. It can also be retrieved directly using the [Vamp API health endpoint](/documentation/api/v0.9.5/api-health/).

## Custom health checks

Custom health checks can be added on a service, cluster or breed level:

### Service level health checks
Defined in a blueprint and applied to all instances of a service. Service level health checks override all health checks defined on a breed or cluster level. For example, including an empty health check specification for a service  (`healthchecks: []`) will cause all cluster and breed level health checks to be skipped for this service.

### Cluster level health checks
Defined in a blueprint and applied to all services within the cluster (unless overridden by a health check defined on a service level). Cluster level health checks override breed level health checks.

### Breed level health checks
Defined in a breed (an individual artifact, or inline as part of a blueprint). Applied to all instances of the breed, unless overridden by health checks defined on the service or cluster level.

## Defining health checks

A health check definition contains the following fields (fields with a default value are optional):

field  |  default   |   description
----|----|----
`protocol`  |  `HTTP`  |  protocol for health check requests (`HTTP` or `HTTPS`)
`path`  |  `/`   |  path for health check requests (string value)
`initial_delay`  |  - |  delay before initial health check request (time value *)
`port`   |  -  |  port for health check requests (string value referencing a defined port)
`timeout`   |  -  |   how long a request can timeout before counting the request as a failure (time value *)
`interval`   |  -  |   interval between health check requests (time value *)
`failures`    |  -  |   maximum amount of failures before service is restarted due to being unhealthy (numerical value)

*) Note that time value must be specified in lower case:

```
s|sec|second|seconds
m|min|minute|minutes
h|hrs|hour|hour
```

### Example: Single health check
Path in this example evaluates to `/` and protocol to HTTP.

```
---
name: sava:1.0
gateways:
  9050: sava/webport
clusters:
  sava:
    services:
      breed:
        name: sava:1.0.0
        deployable: magneticio/sava:1.0.0
        ports:
          webport: 8080/http
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
      health_checks:
        initial_delay: 10s
        port: webport
        timeout: 5s
        interval: 10s
        failures: 10
```
### Example: Multiple health checks

```
 health_checks:
  -
     initial_delay: 10s
     port: webport
     timeout: 5s
     interval: 10s
     failures: 10
     protocol: HTTPS
  -
     initial_delay: 1m
     port: webport
     path: /test
     timeout: 10s
     interval: 1m
     failures: 5
     protocol: HTTPS
```

{{< note title="What next?" >}}
* Read about [Referencing artifacts in Vamp](/documentation/using-vamp/v0.9.5/references/)
* Check the [API documentation](/documentation/api/v0.9.5/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
