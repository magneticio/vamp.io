---
title: Customise health checks
menu:
  main:
    parent: "Tutorials"
    name: "Customise health checks"
    weight: 130
draft: true
---

Vamp tracks the health of running services and gateways. Responses to outages, slowdowns and increased traffic can be automated as they occur.

Let's get started!

### Requirements

* A running version of Vamp 0.9.4 or later (this tutorial has been tested on [Vamp v0.9.4 hello world](/documentation/installation/v0.9.4/hello-world))

## Some background on default health
The default health status is calculated by the Vamp Health workflow.

- built from a combination of service health checks and gateway health
- if no health checks are specified, is calculated entirely based on gateway health

Health is reported in the Vamp UI on the pages:

* Deployment page: health for all services combined (calculated together with all deployment gateways health), and health for each individual service (calculated together with the related gateways health)
* Service page: health for all service instances combined (calculated together with the related gateways health)
* Gateway page: Health for all routes combined (??? does this also work on the service health or just gateway health???)

You can also retrieve health status through the API at the health endpoint. Health is reported as a number between 1 and 0, with 1 being healthy and 0 being unhealthy.

### What does Vamp do if health is reported at 0%?
By default,
You can create a workflow that would respond to measured drops in health.

## Specifying a custom health check
With a custom health check you can specify a path and port to check for health.

- health check artifact can (optionally) be included in breeds or blueprints on a service, cluster or breed level
  [read more about health checks](/documentation/using-vamp/health/)

```
health_checks:
  initial_delay: 10s
  port: webport
  timeout: 5s
  interval: 10s
  failures: 10
```



## Summing up


## Looking for more of a challenge?
Just for fun, you could try these:

*
*

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](/documentation/using-vamp/artifacts)
* Read more about the [Vamp API](/documentation/api/api-reference)
{{< /note >}}

