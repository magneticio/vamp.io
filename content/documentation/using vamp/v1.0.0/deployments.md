---
date: 2016-09-13T09:00:00+00:00
title: Deployments
menu:
  main:
    identifier: "deployments-v100"
    parent: "Using Vamp"
    weight: 20
aliases:
    - /documentation/using-vamp/deployments/
---

A deployment is a "running" blueprint with added runtime information, such as start times, resolved ports etc.
Existing deployments can be updated, merging new blueprints or removing parts from it. Each deployment can be exported as a blueprint and copy / pasted to another environment, or even to the same environment to function as a clone.

### On this page:

* [Create a deployment](/documentation/using-vamp/v1.0.0/deployments/#create-a-deployment)
* [Track running deployments](/documentation/using-vamp/v1.0.0/deployments/#track-deployments)
* [Deployment scenarios](/documentation/using-vamp/v1.0.0/deployments/#deployment )


## Create a deployment

You can create a deployment in the following ways:

* Send a `POST` request to the `/deployments` endpoint.
* Use the UI to deploy a blueprint using the "deploy" button on the "blueprints" tab.
* Use the CLI `vamp deploy` command
 `$ vamp deploy my_blueprint`.

The name of the deployment will be automatically assigned as a UUID (e.g. `123e4567-e89b-12d3-a456-426655440000`).

## Track deployments

Deployments contain clusters (groups of services). Each service can have one or multiple instances, according to its scale. In the Vamp UI you can track health of the overall deployment and individual services - read [how health is reported](/documentation/using-vamp/v1.0.0/health/). Each instance of a service can be accessed individually (go to the **Deployments** page, open the service and select an instance to view), or you can access the deployment through the [exposed gateways](/documentation/using-vamp/v1.0.0/gateways/) with any applied conditions or route weights.
[Read more about using Vamp as a reverse proxy to access deployment instances and gateways](/documentation/using-vamp/v1.0.0/reverse-proxy/).

## Deployment scenarios

A common Vamp deployment scenario is to introduce a new version of the service to an existing cluster, this is what we call a **merge**. After testing/migration is done, the old or new version can be removed from the cluster, simply called a **removal**. Let's look at each in turn.

### Merge

Merging of new services is performed as a deployment update. You can merge in many ways:

- Send a `PUT` request to the `/deployments/{deployment_name}` endpoint.
- Use the UI to update a deployment using the "Edit deployment" button.
- Use the CLI with a combination of the `vamp merge` and `vamp deploy` commands.

If a service already exists then only the gateways and scale will be updated. Otherwise a new service will be added. If a new cluster doesn't exist in the deployment, it will be added.

Let's deploy a simple service:

```yaml
---
name: monarch_1.0

clusters:
  monarch:
    # Specifying only a reference to the breed.
    breed: monarch_1.0
```

After this point we may have another version ready for deployment and now instead of only one service, we have added another one:

```yaml
---
name: monarch_1.1

environment_variables:
  # Some variable needed for our new recommendation engine,
  # just as an example.
  recommendation.route: "/api/v1"

clusters:

  monarch:
    # Just a reference and this breed has one dependency:
    # recommendation_1.0
    breed: monarch_1.1

  recommendation:
    breed: recommendation_1.0

```

Now our deployment (in simplified blueprint format) looks like this:

```yaml
---
name: monarch_1.0

environment_variables:
  recommendation.route: "/api/v1"

clusters:

  monarch:
    services:
      -  breed: monarch_1.0
      -  breed: monarch_1.1

    gateways:
      monarch_1.0:
        weight: 100%
      monarch_1.1:
        weight: 0%

  recommendation:
    services:
      - breed: recommendation_1.0

    gateways:
      recommendation_1.0:
        weight: 100%

```

Note that the route weight for monarch_1.1 is 0, i.e. no traffic is sent to it.
Let's redirect some traffic to our new monarch_1.1 (e.g. 10%):

```yaml
---
clusters:
  monarch:
    services:
      - breed: monarch_1.0
      - breed: monarch_1.1

    gateways:
      monarch_1.0:
        weight: 90%
      monarch_1.1:
        weight: 10%
```

Note that we can omit other fields like name, parameters and even other clusters (e.g. recommendation) if the change is not relevant to them. In this example we just wanted to update the weights.

In the last few examples we have shown the following:

* A fresh new deployment.
* A canary release with a cluster update and change of the topology (a new cluster was added).
* An update of the gateways for a cluster - similar to a cluster scale update (instances, cpu, memory).

### Removal

Removal is done using the REST API `DELETE` request together with the new blueprint as request body.
If a service exists it will be removed, otherwise the request is ignored. If a cluster has no more services left the cluster will be removed completely. Lastly, if a deployment has no more clusters it will be completely removed (destroyed).

Let's use the example from the previous section. Notice the weight is evenly distributed (50/50).

```yaml
---
name: monarch_1.0

environment_variables:
  recommendation.route: "/api/v1"

clusters:

  monarch:
    services:
      - breed: monarch_1.0
      - breed: monarch_1.1

    gateways:
      monarch_1.0:
        weight: 50%
      monarch_1.1:
        weight: 50%

  recommendation:
    services:
      - breed: recommendation_1.0
    gateways:
      recommendation_1.0:
        weight: 100
```

If we are happy with the new monarch version 1.1, we can proceed with the removal of the old version.
This change is applied on the running deployment. We send the following YAML as the body of the `DELETE` request
to the `/deployments/<deployment_UUID>` endpoint.

```yaml
---
name: monarch_1.0

clusters:
  monarch:
    breed: monarch_1.0

```

Note that this is the same original blueprint we started with. What we are doing here is basically "subtracting" one blueprint from the other, although "the other" is a running deployment.
After this operation our deployment is:

```yaml
---
name: monarch_1.0

environment_variables:
  recommendation.route: "/api/v1"

clusters:

  monarch:
    services:
      breed: monarch_1.1
    gateways:
      monarch_1.1:
        weight: 100%

  recommendation:
    services:
      breed: recommendation_1.0
    gateways:
      recommendation_1.0:
        weight: 100%

```

In a nutshell: If we say that the first version was A and the second B, then we just did the migration from A to B without downtime:
* **A** -> A + B -> A + B - A -> **B**

We could also remove the newer version (monarch_1.1 with/without recommendation cluster) in case that it didn't perform as we expected.


{{< note title="What next?" >}}
* Read about [Vamp gateways](/documentation/using-vamp/v1.0.0/gateways/)
* Check the [API documentation](/documentation/api/v1.0.0/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
