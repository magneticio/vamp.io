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
    ![sava-products/products/ie](/images/screens/v100/tut5/sava-product-products-ie.png)

### Release the sava-product service
At this point version 1.0 of the **sava-product is deployed but not released**. The deployment is healthy but cannot yet be found by the clients that depend on it. 

#### Kubernetes Services
Since we only have one sava-product [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/) (Docker container) running, we could pass the IP address and port of that Pod to sava-cart but that would be a bad idea. Kubernetes will maintain the requested number of Pods over time but individual [Pods can be destroyed at any time and new Pods created to replace them](https://kubernetes.io/docs/concepts/workloads/pods/pod/#durability-of-pods-or-lack-thereof). So whilst sava-product will get its own IP address, that address cannot be relied upon to be stable over time.

To avoid this tight coupling, Kubernetes provides the [Service](https://kubernetes.io/docs/concepts/services-networking/service/) abstraction. **Creating a Kubernetes Service for our sava-product service will provide a stable address which our sava-cart frontend can then use.** Decoupling sava-cart from sava-product in this was allows us to scale up the number of Pods as the number of request for increases and also to transparently introduce new versions of the sava-product.

There are three types of Kubernetes Service we could use:

* **ClusterIP**: this exposes the service on a cluster-internal IP address. Choosing this value means the service will only be reachable from within the cluster
* **[NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)**: this exposes the service outside the cluster on the private network used by the Kubernetes Nodes. A ClusterIP service, to which the NodePort service will route, is automatically created.
* **[LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)**: this exposes the service externally. If you are using a public cloud such as AWS, Azure or Google Cloud, the service will be given a public IP address. NodePort and ClusterIP services, to which the external load balancer will route, are automatically created.

Since we don't a public IP address, **NodePort is the best option for sava-product service**. It give us both an cluster-internal IP address and the flexibility to share the service between clusters on the same private network.

To **release the initial version of sava-product**:

* Copy the deployment specification below and save it in a file called **sava-product-svc.yml**.

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

* Create the Service on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-product-svc.yml
  ```

* With `kubectl proxy` running, you check the deployment by opening the this link in your web browser:

  ```
  http://localhost:8001/api/v1/namespaces/vampio-organization-environment/services/sava-product/proxy/products/ie
  ```
  
  You should see exactly the same results as you did when you accessed the sava-product Pod directly.
  
Great! **You've just released the sava-product service!**

### Deploy sava-cart store fronts

#### Service discovery
Kubernetes provides two mechanisms for [finding a Service](https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services):

* **Environment variables**: when a Pod runs it receives `{SVCNAME}_SERVICE_HOST` and `{NAME}_SERVICE_PORT` environment variables for each active Service. Every Pod created after our sava-product Service is created it will have `SAVA_PRODUCT_SERVICE_HOST` (the cluster IP) and `SAVA_PRODUCT_SERVICE_PORT` environment variables defined. However, **to use environment variables for discovery, sava-cart must be deployed after the sava-product Service has been created**.
* **DNS**: A Pod can also lookup the cluster IP address of a Service by name. **Pods in same [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) as the our sava-product Service can do a name lookup for "sava-product"**. Pods in other Namespaces must look it up using the qualified name **"sava-product.vampio-organization.environment"**. DNS does not have the ordering restrictions that environment variables have.

The first version of sava-cart uses environment variables to find sava-product.

To **deploy the initial version of sava-cart for the Republic of Ireland** (v1.0.5):

* Copy the deployment specification below and save it in a file called **sava-cart-1.0.5-ie.yml**.

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: sava-cart-1.0.5-ie
  spec:
    selector:
      matchLabels:
        app: sava-cart
    replicas: 1
    template:
      metadata:
        labels:
          app: sava-cart
          version: 1.0.5
          locale: IE
      spec:
        containers:
        - name: sava-cart
          image: vampio/sava-cart:1.0.5
          ports:
          - containerPort: 3000
          env:
          - name: LOCALE
            value: IE
  ```

* Create the Deployment on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-cart-1.0.5-ie.yml
  ```

* If you have `kubectl proxy` running on port 8001 (default), you check the deployment by:
  * Creating a link to the **IE sava-cart** proxy
  
     ```bash
     kubectl --namespace vampio-organization-environment get pods -l app=sava-cart,locale=UK -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/vampio-organization-environment/pods/{{.metadata.name}}/proxy/{{"\n"}}{{end}}'
     ```
  * Open the link in your web browser and you should see the IE product page:
    ![sava-products/products/ie](/images/screens/v100/tut5/sava-cart-uk-v1.png)

To **deploy the initial version of sava-cart for the United Kingdom** (v1.0.5):

* Copy the deployment specification below and save it in a file called **sava-cart-1.0.5-uk.yml**.

  ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: sava-cart-1.0.5-uk
    spec:
      selector:
        matchLabels:
          app: sava-cart
      replicas: 1
      template:
        metadata:
          labels:
            app: sava-cart
            version: 1.0.5
            locale: UK
        spec:
          containers:
          - name: sava-cart
            image: vampio/sava-cart:1.0.5
            ports:
            - containerPort: 3000
            env:
            - name: LOCALE
              value: EN
  ```
  **Note**: confusing language and locale is a common mistake, in this case it is a deliberate mistake that we will correct in a later version.

* Create the Deployment on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-cart-1.0.5-uk.yml
  ```

* If you have `kubectl proxy` running on port 8001 (default), you check the deployment by:
  * Creating a link to the **UK sava-cart** proxy
  
     ```bash
     kubectl --namespace vampio-organization-environment get pods -l app=sava-cart,locale=UK -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/vampio-organization-environment/pods/{{.metadata.name}}/proxy/{{"\n"}}{{end}}'
     ```
  * Open the link in your web browser and you should see the IE product page:
    ![sava-products/products/ie](/images/screens/v100/tut5/sava-cart-uk-v1.png)

### Release the sava-cart store fronts

#### Service Selectors
The set of Pods targeted by a Service is determined by a [Label Selector](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). The sava-product Service targets Pods that have an "app" label with the value "sava-product". Since we have sava-cart Pods running for IE and UK locales, the sava-cart Services target Pods using both the "app" label and the "locale" label.

To **release the initial version of sava-cart for the Republic of Ireland**:

* Copy the deployment specification below and save it in a file called **sava-cart-svc-ie.yml**.

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: sava-cart-ie
  spec:
    ports:
    - port: 80
      protocol: TCP
      targetPort: 3000
    type: LoadBalancer
    selector:
      app: sava-cart
      locale: IE
  ```

* Create the Service on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-cart-svc-ie.yml
  ```

* Get the external IP address of service.

  ```bash
  kubectl get services --namespace vampio-organization-environment
  ```
  Initially you will probably see the external IP as `<pending>`. If so, wait a few minutes and try again. Depending on your cloud provider you may need to run the command a few times before an IP address is assigned.

* If you open the external IP in your web browser, you should see exactly the same IE product page as you did when you accessed the IE sava-cart Pod directly.

Great! **You've released the sava-cart store front for the Republic of Ireland!**

To **release the initial version of sava-cart for the United Kingdom**:

* Copy the deployment specification below and save it in a file called **sava-cart-svc-uk.yml**.

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: sava-cart-uk
  spec:
    ports:
    - port: 80
      protocol: TCP
      targetPort: 3000
    type: LoadBalancer
    selector:
      app: sava-cart
      locale: UK
  ```

* Create the Service on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-cart-svc-uk.yml
  ```

* Get the external IP address of service.

  ```bash
  kubectl get services --namespace vampio-organization-environment
  ```
  Initially you will probably see the external IP as `<pending>`. If so, wait a few minutes and try again. Depending on your cloud provider you may need to run the command a few times before an IP address is assigned.

* If you open the external IP in your web browser, you should see exactly the same UK product page as you did when you accessed the UK sava-cart Pod directly.

Great! **You've now released both sava-cart store fronts!**

## Release a new version of the store front

TODO deploy and release v2 for IE
