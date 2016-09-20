---
date: 2016-09-13T09:00:00+00:00
title: Deployments
---

A deployment is a "running" blueprint. Over time, new blueprints can be merged with existing deployments or parts of the running blueprint can be removed from it. Each deployment can be exported as a blueprint and 
copy / pasted to another environment, or even to the same environment to function as a clone.

## Create a deployment

You can create a deployment in the following ways:

* Send a `POST` request to the `/deployments` endpoint.
* Use the UI to deploy a blueprint using the "deploy" button on the "blueprints" tab.
* Use the CLI `vamp deploy` command  
 `$ vamp deploy my_blueprint`.

The name of the deployment will be automatically assigned as a UUID (e.g. `123e4567-e89b-12d3-a456-426655440000`).



## Vamp deployment process

Once we have issued the deployment, Vamp will do the following:

1. Update Vamps internal model.
2. Issue and monitor deployment commands to the container platform.
3. Update the ZooKeeper entry.
4. Start collecting metrics.
5. Monitor the container platform for changes.

Vamp will add runtime information to the deployment model, like start times, resolved ports etc.


## Where next?

* Read about [Environment variables](/resources/using-vamp/environment-variables/)
* Read about [Canary releases and A/B testing](/resources/using-vamp/canary-releases-and-a-b-testing/)
* check the [API documentation](/resources/api-documentation/)
* [Try Vamp](/try-vamp)
