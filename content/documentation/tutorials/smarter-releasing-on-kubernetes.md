---
date: 2018-08-17T15:00:00+00:00
title: 5. Smarter releasing on Kubernetes
menu:
  main:
    parent: "Tutorials"
    weight: 60
---

In previous tutorials we've used Vamp blueprints to create deployments, this tutorial explains how to manually canary release a new version of a microservice deployed outside of Vamp.

The most common use case would be canary releasing a Deployment made using a CD (Continuous Delivery) pipeline.

To make this tutorial easy to follow, we are going to use `kubectl` to **simulate the actions of a CD pipeline deploying to our Kubernetes cluster.

{{< note title="Note!" >}}
The commands shown in this tutorial assume you are using the [Kubernetes Quickstart](/documentation/installation/kubernetes) and that there is an existing namespace called **vampio-organization-environment**.
{{< /note >}}

In this tutorial we will:

* [Deploy and release an internal microservice](#deploy-the-sava-product-service)
* [Deploy and release a public-facing microservice](#deploy-sava-cart-store-front)
* [Canary release a new version of a microservice](#canary-release)
* [API versioning using conditional routing](#api-versioning-using-conditional-routing)

## Deploying versus releasing

### Deploy
We define **deployment** as the process of installing a new version of **software on production** infrastructure. In Kubernetes terms, one or more containers have been created from the newly published Docker image and are running in pods on your production Kubernetes cluster. The Docker containers have started successfully, they are passing their health checks and are **ready to handle production traffic** but may not actually be receiving any.

### Release
We define a deployed version of your software as being **released** when it is **responsible for serving production traffic**. And we define **releasing** as **the process of moving production traffic to the new version**. 

## Microservices topology
In the previous tutorials, we've used "lab only" service topologies that are great for demonstrating the core concepts and features of Vamp but those topologies are not well suited to production use. In this tutorial and the ones that follow, we will be using a fictitious e-commerce application that highlights some of the best practices of real world micro-service projects.

### Minimum Viable Product
Our fictitious **sava** e-commerce application allows users to engage in fantasy shopping for awesome [hipster ipsum](https://hipsum.co/) inspired products.

The [MVP](http://theleanstartup.com/principles) provides a responsive store front (**sava-cart**) which depends on a product service (**sava-product**). The store will initially be available in the Republic of Ireland (ie. sub-domain) and the product service API will exposed on a separate (api.) sub-domain.

![architecture](/images/diagram/v100/tut5/k8s-arch-mvp-product-crelease.png)

#### sava-product service
The **sava-product** service is implemented using a Dockerized [typicode/json-server](https://github.com/typicode/json-server) forked from [clue/docker-json-server](https://github.com/clue/docker-json-server).

The service provides a REST API that returns a list (array) of products in JSON format for the specified locale, for example: `/products/ie` will return a list of products available in the Republic of Ireland store.

#### sava-cart store front
The **sava-cart** store front is a fork of [gtsopour/nodejs-shopping-cart](https://github.com/gtsopour/nodejs-shopping-cart)

The store front provides a responsive web app consisting of a products page, a shopping cart and a checkout page.

It tries to isolate users from realtime dependency failures by showing cached or stubbed data. For example, if the sava-product service is unavailable users can choose from a list of fruit (a throw back to the original project).

The store front locale is configured by setting the `LOCALE` environment variable.

## Initial Deployment and Release

So the DevOps team has been working hard and after a few interations **we are now ready to deploy the MVP on production**. The MVP consists of **sava-product version 1.0.3** and **sava-cart version 1.0.5**.

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

* If you have `kubectl proxy` running on port 8001 (the default port), you check the deployment by:
  * Creating a link to the **sava-product** proxy
  
     ```bash
     kubectl --namespace vampio-organization-environment get pods -l app=sava-product -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/vampio-organization-environment/pods/{{.metadata.name}}/proxy/products/ie{{"\n"}}{{end}}'
     ```
  * Open the link in your web browser and you should see the following output:
    ![sava-product/products/ie](/images/screens/v100/tut5/sava-product-products-ie-v1.png)

### Release the sava-product service
At this point version 1.0 of the **sava-product is deployed but not released**. The deployment is healthy but cannot yet be found by the clients that depend on it. 

#### Kubernetes Services
Since we only have one sava-product [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/) (Docker container) running, we could pass the IP address and port of that Pod to sava-cart but that would be a bad idea.

Kubernetes will maintain the requested number of Pods over time but individual [Pods can be destroyed at any time and new Pods created to replace them](https://kubernetes.io/docs/concepts/workloads/pods/pod/#durability-of-pods-or-lack-thereof). So whilst sava-product will get its own IP address, that address cannot be relied upon to be stable over time.

To avoid this tight coupling, Kubernetes provides the [Service](https://kubernetes.io/docs/concepts/services-networking/service/) abstraction. **Creating a Kubernetes Service for our sava-product service will provide a stable address which our sava-cart frontend can then use.**

If we were going to create a Kubernetes Service for our sava-product service, it would look something like this:

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

#### Vamp gateways
Instead of using a Kubernetes Service for our sava-product service, we're going to use a Vamp gateway.

Vamp gateways provide [a super set of Kubernetes Service and Ingress controller features](/documentation/how-vamp-works/v1.0.0/vamp-and-kubernetes/#vamp-deployments) and allow you to do fine-grained, automated or manual blue/green or canary releases of your internal-facing and external-facing microservices.

```yaml
name: sava-product
port: 9070
selector: label(app)(sava-product) && label(version)((.*))
```

1. In the Vamp UI, select the environment *environment* and go to the **Gateways** page and click **Add** (top right)
2. Paste in the above gateway config and click **Save**.
  Vamp will create a Service of type NodePort. 
3. You can check that the gateway Service has be created correctly using:
  
  ```
  kubectl --namespace vampio-organization-environment get service sava-product
  ```

Great! **You've released the sava-product service!**

### Debugging gateways
The **sava-product** Service created by Vamp behaves exactly like a normal Kubernetes Service but it **points to the vamp-gateway-agent Pods** (Selector: io.vamp=vamp-gateway-agent) **instead of the sava-product Pod** (selector: app=sava-product).

The Kubernetes [service discovery](https://kubernetes.io/docs/concepts/services-networking/service/#discovering-services) mechanisms work like normal but URLs like [http://localhost:8001/api/v1/namespaces/vampio-organization-environment/services/sava-product/proxy/](http://localhost:8001/api/v1/namespaces/vampio-organization-environment/services/sava-product/proxy/) don't work.

{{< note title="Note!" >}}
**If you need to debug a Service created by Vamp, you should use port forwarding**, like this:

```bash
kubectl port-forward --namespace vampio-organization-environment $(kubectl get pod --namespace vampio-organization-environment --selector="io.vamp=vamp-gateway-agent" --output jsonpath='{.items[0].metadata.name}') 9070:9070
```

The **sava-product** Service can then be accessed on [http://localhost:9070/products/ie](http://localhost:9070/products/ie).
{{< /note >}}

### Deploy sava-cart store front

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

* If you have `kubectl proxy` running on port 8001, you check the deployment by:
  * Creating a link to the **IE sava-cart** proxy
  
     ```bash
     kubectl --namespace vampio-organization-environment get pods -l app=sava-cart,locale=UK -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/vampio-organization-environment/pods/{{.metadata.name}}/proxy/{{"\n"}}{{end}}'
     ```
  * Open the link in your web browser and you should see the IE product page:
    ![sava-cart-ie-v1](/images/screens/v100/tut5/sava-cart-ie-v1.png)

### Release the sava-cart store front

At this point version 1.0 of the **sava-cart-ie is deployed but not released**. Once again, the deployment is healthy but cannot yet be found by the customers.

We want the store front to be available to customers in the Republic of Ireland using an **ie.** sub-domain, so we need an external IP address we can use in our public DNS A record.

To get an external IP address we could use a ([Service.Type=LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)) or we could use a Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller.

If we were going to create a Kubernetes Service for our sava-cart-ie store front, it would look something like this:

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
  type: ClusterIP
  selector:
    app: sava-cart
    locale: IE
```

And the Kubernetes Ingress would look something like this:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: sava-cart-ie
spec:
  rules:
  - host: ie.tutorials.vamp.cloud
    http:
      paths:
      - backend:
          serviceName: sava-cart-ie
          servicePort: 80
```

The `host` rule isn't strictly necessary but is included for completeness.

Instead of using a Kubernetes Service and an Ingress controller, we're going to use a Vamp gateway.

```yaml
name: sava-cart-ie
virtual_hosts:
- ie.tutorial5.vamp.cloud
selector: label(app)(sava-cart) && label(locale)(IE) && label(version)((.*))
```

1. In the Vamp UI, select the environment *environment* and go to the **Gateways** page and click **Add** (top right)
2. Paste in the above gateway config and click **Save**.
  Vamp will create a Service of type NodePort. 
3. You can check that the gateway Service has be created correctly using:
  
  ```
  kubectl --namespace vampio-organization-environment get service sava-cart-ie
  ```

Great! **You've released the sava-cart store front for the Republic of Ireland using Vamp!**

You can now access the store front through the Vamp Gateway Agent (VGA) using the virtual host name **ie.tutorial5.vamp.cloud**.

If you are using Kubernetes, you can find the external IP address of the VGA using `kubectl`:

```
kubectl --namespace vampio-organization-environment get service vamp-gateway-agent
```

Once you have the external IP address for the VGA, you can access the application using `curl`:

```
curl -H "Host: ie.tutorial5.vamp.cloud" http://<vga-external-ip>/
```

## Canary release

The MVP store front is "good enough" but our hister customers are always looking for something new.

In prepartion for the version 2.0 store front, the DevOps team want to **release a new version of the sava-product service and canary test it in production**.

To **deploy the new version of sava-product** (v2.0.1):

* Copy the deployment specification below and save it in a file called **sava-product-2.0.1.yml**.

  ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: sava-product-2.0.1
  spec:
    selector:
      matchLabels:
        app: sava-product
    replicas: 1
    template:
      metadata:
        labels:
          app: sava-product
          version: 2.0.1
      spec:
        containers:
        - name: sava-product
          image: vampio/sava-product:2.0.1
          ports:
          - containerPort: 8080
    ```

* Create the Deployment on your Kubernetes cluster.

  ```bash
  kubectl --namespace vampio-organization-environment create -f sava-product-2.0.1.yml
  ```

As soon as the new version has been deployed it will be automatically detected and a new route added to the gateway. The weight of the newly added route is set to 0%, this means that no traffic is currently being routed there. Whenever Vamp adds a new route to a gateway, it applies the default weight of 0%.

As we did in [tutorial 2](/documentation/tutorials/run-a-canary-release/), let's adjust the weight and **start to send traffic to the new version of sava-product**:

1. In the Vamp UI, select the environment *environment* and go to the **Gateways** page and open the **sava-product** gateway
2. Click the edit icon next to **WEIGHT**
3. Adjust the weight slider to distribute traffic 50% / 50% between the two versions
  ![](/images/screens/v100/tut5/vampee-environment-gateways-sava-product-editweights5050.png)
4. Click **Save** and Vamp will adjust the route weights accordingly

The store front is implemented as a [Tolerant Reader](http://servicedesignpatterns.com/WebServiceEvolution/TolerantReader) that expects changes to occur in the messages and media types it receives.

### API versioning using conditional routing

**Versioning of the sava-product API is done by media type**. The API defaults to the latest version and clients that care about the stability of the API can request a specific version in the HTTP `Accept` header - [GitHub's approach](https://developer.github.com/v3/media/).

For example, **version 1.0 of sava-cart requests version 1 of the sava-product service using `Accept: application/vnd.sava.v1+json`** but will try to work with later versions.

If you `curl` the store front a few times and check the results, you won't see any difference but if you look at the metrics on the **sava-product** gateway page, you'll see that the requests were distributed equally between the two versions.

Now let's add conditions to the two routes, so that client requests are correctly handled based on what is set in the HTTP Accept header.

1. In the Vamp UI, select the environment *environment* and go to the **Gateways** page and open the **sava-product** gateway
2. Click the edit condition icon for the **(1.0.3)** route and enter the condition `Header Accept Contains v1`.
3. Click the edit condition strength icon for the **(1.0.3)** route and move the slider to 100%, so that all requests for version 1 of the API to be sent to this route.
4. Next, click the edit condition icon for the **(2.0.1)** route and enter the condition `Header Accept Contains v2`.
5. Click the edit condition strength icon for the **(2.0.1)** route and move the slider to 100%, so that all requests for version 2 of the API to be sent to this route.
6. Finally, we want version 2 of the API to be the default for all requests that don't specify a version. We do this using the route weight:
  * Click the edit icon next to **WEIGHT**
  * Adjust the weight slider to **100%** for the **(2.0.1)** route.
  * Click **Save**

If you `curl` the store front a few more times and check the metrics on the **sava-product** gateway page, you'll see that all the requests are now correctly routed to version 1 of the API.

{{< note title="What next?" >}}
* Find out more about the synergy between [Vamp and Kubernetes](/documentation/how-vamp-works/v1.0.0/vamp-and-kubernetes/)
{{< /note >}}
