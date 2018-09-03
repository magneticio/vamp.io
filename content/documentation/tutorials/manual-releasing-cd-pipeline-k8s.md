---
date: 2018-08-17T15:00:00+00:00
title: 5. Working with a CD pipeline on Kubernetes
menu:
  main:
    parent: "Tutorials"
    weight: 60
---

TODO what does this tutorial demonstrate?

## The DevOps Pipeline

Build, publish, deploy, and release. 

### Deploy
We define **deployment** as the process of installing a new version of **software on production** infrastructure. In Kubernetes terms, one or more containers have been created from the newly published Docker image and are running in pods on your production Kubernetes cluster. The Docker containers have started successfully, they are passing their health checks and are **ready to handle production traffic** but may not actually be receiving any.

### Release
We define a deployed version of your software as being **released** when it is **responsible for serving production traffic**. And we define **releasing** as **the process of moving production traffic to the new version**. 

## Micro-services topology
In the previous tutorials, we've used "lab only" service topologies that are great for demonstrating the core concepts and features of Vamp but that are not well suited to production use. In this tutorial and the ones that follow, we will be using a fictitious e-commerce application that highlights some of the best practices of real world micro-service projects.

### Minimum Viable Product
Our fictitious **sava** e-commerce application allows users to engage in fantasy shopping for awesome [hipster ipsum](https://hipsum.co/) inspired products.

The [MVP](http://theleanstartup.com/principles) provides a responsive store front (**sava-cart**) which depends on a product service (**sava-product**). The store will initially be available in two countries, the UK and the the Republic of Ireland. 

![architecture](/images/diagram/v100/tut5/k8s-arch-without-vamp.png)

#### sava-product service
The **sava-product** service is implemented using a Dockerized [typicode/json-server](https://github.com/typicode/json-server) forked from [clue/docker-json-server](https://github.com/clue/docker-json-server).

The service provides a REST API that returns a list (array) of products in JSON format for the specified locale, for example: `/products/ie` will return a list of products available in the Republic of Ireland store.

Versioning of the API is done by media type. The API defaults to the latest version and clients that care about the stability of the API can request a specific version in the `Accept` header - [GitHub's approach](https://developer.github.com/v3/media/)

#### sava-cart service
The **sava-cart** store front is a fork of [gtsopour/nodejs-shopping-cart](https://github.com/gtsopour/nodejs-shopping-cart)

TODO brief functional description, v1.x depends on s-p v1 `Accept: application/vnd.sava.v1+json`, service discovery

## Initial Deployment

TODO The team has been through a few interations and **we are now ready to deploy the MVP on production**. The MVP consists of **sava-product version 1.0.3** and **sava-cart version 1.0.5**.

To make this tutorial easy to follow, we are going to use `kubectl` to **simulate the actions of a continuious deployment pipeline deploying our application** to Kubernetes.

{{< note title="Note!" >}}
The commands shown in this tutorial assume you are using the [Kubernetes Quickstart](/documentation/installation/kubernetes) and that there is an existing namespace called **vampio-organization-environment**.
{{< /note >}}

### Deploy sava-product service

* To **deploy the initial version of sava-product** (v1.0.3), copy the deployment specification below and save it in a file called **sava-product-1.0.3.yml**.

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

* Create the deployment on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-product-1.0.3.yml
  ```

* If you have `kubectl proxy` running on port 8001 (default), you check the deployment by:
  * Creating a link to the **sava-product** proxy
  
     ```bash
     kubectl --namespace vampio-organization-environment get pods -l app=sava-product -o go-template --template 'ms}}http://localhost:8001/api/v1/namespaces/vampio-organization-environment/pods/{{.metadata.name}}/proxy/products/ie{{"\n"}}{{end}}'
     ```
  * Open the link in your web browser
    ![sava-products/products/ie](/images/screens/v100/tut5/sava-product-products-ie.png)

### Release sava-product service
At this point version 1.0 of the **sava-product is deployed but not released**, the deployment is healthy but receiving traffic. Since sava-product is an internal service we need it to be discoverable but it doesn't need a public IP address.

#### Service discovery
Since we only have one sava-product [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/) (Docker container) running, we could pass the IP address and port of that Pod to sava-cart but that would be a bad idea. Kubernetes will maintain the requested number of Pods over time but individual [Pods can be destroyed at any time and new Pods created to replace them](https://kubernetes.io/docs/concepts/workloads/pods/pod/#durability-of-pods-or-lack-thereof). So whilst sava-product will get its own IP address, that address cannot be relied upon to be stable over time.

To avoid this tight coupling, Kubernetes provides the [Service](https://kubernetes.io/docs/concepts/services-networking/service/) abstraction. **Creating a Kubernetes Service for our sava-product service will provide a stable address which our sava-cart frontend can then use.** Decoupling sava-cart from sava-product in this was allows us to scale up the number of Pods as the number of request for increases and also to transparently introduce new versions of the sava-product.

There are three types of Kubernetes Service we could use:

* **ClusterIP**: this exposes the service on a cluster-internal IP address. Choosing this value means the service will only be reachable from within the cluster
* **[NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)**: this exposes the service outside the cluster on the private network used by the Kubernetes Nodes. A ClusterIP service, to which the NodePort service will route, is automatically created.
* **[LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)**: this exposes the service externally. If you are using a public cloud such as AWS, Azure or Google Cloud, the service will be given a public IP address. NodePort and ClusterIP services, to which the external load balancer will route, are automatically created.

Since we don't a public IP address, **NodePort is the best option for sava-product service**. It give us both an cluster-internal IP address and the flexibility to share the service between clusters on the same private network.

TODO service discovery

* To **release the initial version of sava-product**, copy the deployment specification below and save it in a file called **sava-product-svc.yml**.

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: sava-product
  spec:
    ports:
    - port: 9070
      protocol: TCP
      targetPort: 8080
    type: NodePort
    selector:
      app: sava-product
  ```

* Create the deployment on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-product-svc.yml
  ```

* With `kubectl proxy` running, you check the deployment by opening the this link in your web browser:

  ```
  http://localhost:8001/api/v1/namespaces/vampio-organization-environment/services/sava-product/proxy/products/ie
  ```
  
  You should see exactly the same results as you did when you accessed the sava-product pod directly.

### Deploy sava-cart service

