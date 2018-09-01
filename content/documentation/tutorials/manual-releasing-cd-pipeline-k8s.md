---
date: 2018-08-17T15:00:00+00:00
title: 5. Working with a CD pipeline on Kubernetes
menu:
  main:
    parent: "Tutorials"
    weight: 60
---

Build, publish, deploy, and release. 

### Deploy
We define **deployment** as the process of installing a new version of **software on production** infrastructure. In Kubernetes terms, one or more containers have been created from the newly published Docker image and are running in pods on your production Kubernetes cluster. The Docker containers have started successfully, they are passing their health checks and are **ready to handle production traffic** but may not actually be receiving any.

### Release
We define a deployed version of your software as being **released** when it is **responsible for serving production traffic**. And we define **releasing** as **the process of moving production traffic to the new version**. 

## Micro-services topology
In the previous tutorials, we've used "lab only" service topologies that are great for demonstrating the core concepts and features of Vamp but that are not well suited to production use. In this tutorial and the ones that follow, we will be using a fictitious e-commerce application that highlights some of the best practices of real world micro-service projects.

![architecture](/images/diagram/v100/tut5/k8s-arch-without-vamp.png)

Best practicies:
* **Cohesive design** - inter-service communication is minimised with no dependencies on shared databases
* **Independently deployable** - loosely coupled dependencies
  * Clients are [Tolerant Readers](http://servicedesignpatterns.com/WebServiceEvolution/TolerantReader) that expect changes to occur in the messages and media types their receive
  * Versioning is done by media type. APIs default to the latest version and clients that care about the stability of the API can request a specific version in the `Accept` header - [GitHub's approach](https://developer.github.com/v3/media/)
* **Failure isolation** - self-contained, stateless micro-services
  * Webapps revert to cached or studded data if a realtime dependency is unavailable
  * APIs return an empty response which UIs can then ignore ("fail silent")

### Minimum Viable Product
Our fictitious **sava** e-commerce application allow users to engage in fantasy shopping for awesome [hipster ipsum](https://hipsum.co/) inspired products. The [MVP](http://theleanstartup.com/principles) provides a responsive store front which depends on a product service.
* The **sava-cart** store front is a fork of [gtsopour/nodejs-shopping-cart](https://github.com/gtsopour/nodejs-shopping-cart)

#### sava-product service
The **sava-product** service is implemented using a Dockerized [typicode/json-server](https://github.com/typicode/json-server) forked from [clue/docker-json-server](https://github.com/clue/docker-json-server).

The service provides a REST API that returns a list (array) of products in JSON format for the specified locale, for example: `/products/ie` will return a list of products available in the Republic of Ireland store.

To deploy the initial version of the service (v1.0.3), copy the deployment specification below and save it in a file called **sava-product-1.0.3.yml**.

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

Next, create the deployment on your Kubernetes cluster.

{{< note title="Note!" >}}
The commands shown in this tutorial assume you are using the [Kubernetes Quickstart](/documentation/installation/kubernetes) and that there is an existing namespace called **vampio-organization-environment**.
{{< /note >}}

```bash
kubectl --namespace vampio-organization-environment create -f sava-product-1.0.3.yml
```

If you have `kubectl proxy` running, you check the deployment by:

* Creating a link to the **sava-product** pod
  
  ```bash
  kubectl --namespace vampio-organization-environment get pods -l app=sava-product -o go-template --template 'ms}}http://localhost:8001/api/v1/namespaces/vampio-organization-environment/pods/{{.metadata.name}}/proxy/products/ie{{"\n"}}{{end}}'
  ```
  
* Open the link in your web browser

TODO describe output

Service
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

With `kubectl proxy` running:
```bash
http://localhost:8001/api/v1/namespaces/vampio-organization-environment/services/sava-product/proxy/products
```
Same output as above

#### sava cart service
TODO
