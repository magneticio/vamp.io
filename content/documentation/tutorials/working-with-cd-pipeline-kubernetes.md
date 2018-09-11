---
date: 2018-08-17T15:00:00+00:00
title: 5. Working with CD pipelines on Kubernetes
menu:
  main:
    parent: "Tutorials"
    weight: 60
---

In this tutorial explains how to manually canary release a new version of an existing microservice on Kubernetes.

The most common use case would be canary releasing a Deployment made using a CD (Continuous Delivery) pipeline.

TODO look no blueprints!

## Deploying versus releasing

### Deploy
We define **deployment** as the process of installing a new version of **software on production** infrastructure. In Kubernetes terms, one or more containers have been created from the newly published Docker image and are running in pods on your production Kubernetes cluster. The Docker containers have started successfully, they are passing their health checks and are **ready to handle production traffic** but may not actually be receiving any.

### Release
We define a deployed version of your software as being **released** when it is **responsible for serving production traffic**. And we define **releasing** as **the process of moving production traffic to the new version**. 

## Microservices topology
In the previous tutorials, we've used "lab only" service topologies that are great for demonstrating the core concepts and features of Vamp but that are not well suited to production use. In this tutorial and the ones that follow, we will be using a fictitious e-commerce application that highlights some of the best practices of real world micro-service projects.

### Minimum Viable Product
Our fictitious **sava** e-commerce application allows users to engage in fantasy shopping for awesome [hipster ipsum](https://hipsum.co/) inspired products.

The [MVP](http://theleanstartup.com/principles) provides a responsive store front (**sava-cart**) which depends on a product service (**sava-product**). The store will initially be available in two countries, the UK and the the Republic of Ireland. 

![architecture](/images/diagram/v100/tut5/k8s-arch-without-vamp.png)

#### sava-product service
The **sava-product** service is implemented using a Dockerized [typicode/json-server](https://github.com/typicode/json-server) forked from [clue/docker-json-server](https://github.com/clue/docker-json-server).

The service provides a REST API that returns a list (array) of products in JSON format for the specified locale, for example: `/products/ie` will return a list of products available in the Republic of Ireland store.

Versioning of the API is done by media type. The API defaults to the latest version and clients that care about the stability of the API can request a specific version in the `Accept` header - [GitHub's approach](https://developer.github.com/v3/media/)

#### sava-cart store front
The **sava-cart** store front is a fork of [gtsopour/nodejs-shopping-cart](https://github.com/gtsopour/nodejs-shopping-cart)

The store front provides a responsive web app consisting of a products page, a shopping cart and a checkout page.

It is implemented to a [Tolerant Reader](http://servicedesignpatterns.com/WebServiceEvolution/TolerantReader) that expects changes to occur in the messages and media types it receives. For example, version 1.0 requests version 1 of the sava-product service (`Accept: application/vnd.sava.v1+json`) but will try to work with later versions.

It also tries to isolate users from realtime dependency failures by showing cached or stubbed data. For example, if the sava-product service is unavailable users can choose from a list of fruit (a throw back to the original project).

The store front locale is configured by setting the `LOCALE` environment variable.

## Initial Deployment and Release

Our development team has been working hard and after a few interations **we are now ready to deploy the MVP on production**. The MVP consists of **sava-product version 1.0.3** and **sava-cart version 1.0.5**.

To make this tutorial easy to follow, we are going to use `kubectl` to **simulate the actions of a continuous delivery (CD) pipeline deploying our application** on a Kubernetes cluster.

{{< note title="Note!" >}}
The commands shown in this tutorial assume you are using the [Kubernetes Quickstart](/documentation/installation/kubernetes) and that there is an existing namespace called **vampio-organization-environment**.
{{< /note >}}

### Deploy the sava-product service

To **deploy the initial version of sava-product** (v1.0.3):

* Copy the deployment specification below and save it in a file called **sava-product-1.0.3.yml**.

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: sava-product-1.0.3
  spec:
    selector:
      matchLabels:
        app: sava-product
    replicas: 1
    template:
      metadata:
        labels:
          app: sava-product
          version: 1.0.3
      spec:
        containers:
        - name: sava-product
          image: vampio/sava-product:1.0.3
          ports:
          - containerPort: 8080
    ```

* Create the Deployment on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-product-1.0.3.yml
  ```

* If you have `kubectl proxy` running on port 8001 (default), you check the deployment by:
  * Creating a link to the **sava-product** proxy
  
     ```bash
     kubectl --namespace vampio-organization-environment get pods -l app=sava-product -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/vampio-organization-environment/pods/{{.metadata.name}}/proxy/products/ie{{"\n"}}{{end}}'
     ```
  * Open the link in your web browser and you should see the following output:
    ![sava-product/products/ie](/images/screens/v100/tut5/sava-product-products-ie.png)

### Release the sava-product service
At this point version 1.0 of the **sava-product is deployed but not released**. The deployment is healthy but cannot yet be found by the clients that depend on it. 


