---
date: 2016-09-13T09:00:00+00:00
title: Blueprints
menu:
  main:
    identifier: "blueprints-v095"
    parent: "Using Vamp"
    weight: 50

---

Blueprints are execution plans - they describe how your services should be hooked up and what their topology should look like at runtime. This means you reference your breeds (or define them inline) and add runtime configuration to them. Blueprints can be created and edited using the Vamp Domain Specific Language (DSL). Vamp tracks all revisions made to artifacts, so you can check back and compare the current blueprint against a previous version.

## Docker compose

The Vamp UI includes a handy tool to import Docker Compose files and convert these into the Vamp DSL format for deployment in Vamp. Note that some fields may need manual adjustment after conversion (see comments attached to the generated blueprint for details).

## Blueprint artifacts

Blueprints allow you to specify the following properties:

- [Gateways](/documentation/using-vamp/v0.9.5/blueprints/#gateways): a stable port where the service can be reached.
- [Clusters and services](/documentation/using-vamp/v0.9.5/blueprints/#clusters-and-services): a cluster is a grouping of services with one purpose, i.e. two versions (a/b) of one service.
- [Environment variables](/documentation/using-vamp/v0.9.5/environment-variables/): a list of variables (interpolated or not) to be made available at runtime.
- [Dialects](/documentation/using-vamp/v0.9.5/dialects): a dialect is a set of native commands for the underlying container platform, i.e. Docker or Mesosphere Marathon.
- [Scale](/documentation/using-vamp/v0.9.5/blueprints/#scale): the CPU and memory and the amount of instance allocate to a service.
- [Conditions](/documentation/using-vamp/v0.9.5/conditions/): how traffic should be directed based on HTTP and/or TCP properties.
- [SLA](/documentation/using-vamp/v0.9.5/sla/) and [escalations](/documentation/using-vamp/escalations/): SLA definition that controls autoscaling.
- [Health](/documentation/using-vamp/v0.9.5/health/): The health checks to be applied to a service, cluster or breed.

#### Example - key concepts of blueprints

```yaml
---
name: my_blueprint                        # Custom blueprint name
gateways:
  8080/http: my_frontend/port
clusters:
  my_frontend:                            # Custom cluster name.

    gateways:                             # Gateway for this cluster services.
      routes:                             # Makes sense only with
        some_cool_breed:                  # multiple services per cluster.
          weight: 95%
          condition: User-Agent = Chrome
        some_other_breed:                 # Second service.
          weight: 5%

    services:                             # List of services
      -
        breed:
          ref: some_cool_breed
        scale:                            # Scale for this service.
          cpu: 2                          # Number of CPUs per instance.
          memory: 2048MB                  # Memory per instance (MB/GB units).
          instances: 2                    # Number of instances
      -
        breed:
          ref: some_other_breed           # Another service in the same cluster.
        scale: large                      # Notice we used a reference to a "scale".
                                          # More on this later.
```

## Gateways

A gateway is a "stable" endpoint (or port in simplified sense) that almost never changes. When creating the mapping, it uses the definition (my_frontend/port in this case) from the "first" service in the cluster definition you reference. This service can of course be changed, but the gateway port normally doesn't.

Please take care of setting the `/tcp` or `/http` (default) type for the port. Using `/http` allows Vamp to record more relevant metrics like response times and metrics.

Read more about [gateways](/documentation/using-vamp/gateways/).

{{< note title="Note!" >}}
gateways are optional. You can just deploy services and have a home grown method to connect them to some stable, exposable endpoint.
{{< /note >}}

## Clusters and services

In essence, blueprints define a collection of clusters.
A cluster is a group of different services, which will appear as a single service and serve a single purpose.

Common use cases would be service A and B in an A/B testing scenario - usually just different
versions of the same service (e.g. canary release or blue/green deployment).

Clusters are configured by defining an array of services. A cluster can be given an arbitrary name. Services are just lists or arrays of breeds.

```yaml
---
my_cool_cluster
  services
   - breed:
      ref: my_cool_service_A      # reference to an existing breed
   -
     breed:                       # shortened inline breed
       name: my_cool_service_B
       deployable: some_container
       ...
```

Clusters and services are just organisational items. Vamp uses them to order, reference and control the actual containers and gateways and traffic.

> **This all seems redundant, right?** We have a reference chain of blueprints -> gateways -> clusters -> services -> breeds -> deployable. However, you need this level of control and granularity in any serious environment where DRY principles are taken seriously and where "one size fits all" doesn't fly.

## Scale

Scale is the "size" of a deployed service. Usually that means the number of instances (servers) and allocated CPU and memory.

Scales can be defined inline in a blueprint or they can defined separately and given a unique name. The following example is a scale named "small". `POST`-ing this scale to the `/scales` REST API endpoint will store it under that name so it can be referenced from other blueprints.

#### Example scale

```yaml
---
name: small   # Custom name.

cpu: 2        # Number of CPUs per instance.
memory: 2gb   # Memory per instance, MB/GB units.
instances: 2  # Number of instances.
```

{{< note title="What next?" >}}
* Read about [Vamp breeds](/documentation/using-vamp/v0.9.5/breeds/)
* Check the [API documentation](/documentation/api/v0.9.5/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}

