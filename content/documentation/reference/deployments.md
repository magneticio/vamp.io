---
title: Deployments
weight: 30
menu:
  main:
    parent: reference
---
# Deployments

> endpoint: /api/v1/deployments

A deployment is a "running" blueprint. Over time, new blueprints can be merged with existing deployments or parts of
the running bleuprint can be removed from it. Each deployment can be exported as a blueprint and 
copy & pasted to another environment or even to the same environment to function as a clone.

Creating a deployment is done by sending a POST request to `/deployments` endpoint.

<pre class="prettyprint lang-yaml"> 
name: my_monarch_blueprint

endpoints:
  crown.ports.port: 80

clusters:
  a_bunch_of_monarchs:
    # This blueprint has a reference to breed "crown" 
    # This breed needs to exist at deployment time otherwise
    # an error (4xx) will be reported back.
    breed: crown
    # Scale and routing are not specified: a default
    # environment configuration will be used.
    
</pre>

The name of the deployment is automatically assigned as a UUID (e.g. `123e4567-e89b-12d3-a456-426655440000`).
Here is an example with two versions of the same service within the one cluster. 
{{% alert info %}}
Notice that we have distributed the weight between the two services.
{{% /alert%}}


<pre class="prettyprint lang-yaml"> 
name: my_monarch_blueprint

endpoints:
  monarch.ports.port: 80/http

clusters:
  a_bunch_of_monarchs:
    services:
      -
        breed: crown1
        routing:
          weight: 80        # 80% of traffic is handled by this service.
      -
        breed: crown2
        routing:                    
          weight: 20        # 20% of traffic handled by this service.
          
</pre>

## Canary Releases & A/B Testing

Common process is to introduce a new version of the service to an existing cluster - **merge**.
After testing/migration is done old or new version can be removed from the cluster - **removal**.

### Merge

Merge of new services is done as a deployment update.
Using the common REST API (PUT with deployment name) together with the new blueprint as request body will trigger the merge.
If a service already exists then only routing & scale update will be done. Otherwise a new service will be added. If a new cluster doesn't exist in the deployment, it will be added.

### Removal

Removal is done using REST API Delete request together with the new blueprint as request body.
If service exists it will be removed otherwise request is ignored. If cluster has no more services it will be removed, if deployment has no more clusters it will be completely removed (destroyed).

