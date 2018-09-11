---
date: 2018-09-07T21:00:00+00:00
title: Vamp and Kubernetes
aliases:
    - /documentation/how-vamp-works/vamp-and-kubernetes
menu:
  main:
    identifier: "vamp-and-kubernetes-v100"
    parent: "How Vamp works"
    weight: 40
---

There is a strong synergy between Vamp artifacts such as Environments, Deployments and Gateways, and the corresponding Kubernetes constructs but the terminology can be confusing.

### Vamp tenant environments

Vamp implements multi-tenancy using a two-level [namespace model](/documentation/how-vamp-works/v1.0.0/concepts-and-components/#namespaces). A tenant has exactly one organisation namespace plus one or more environment namespaces.

Kubernetes [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) are a logical construct which can be use as a way to divide cluster resources between multiple users.

On Kubernetes, Vamp environment namespaces are implemented using Kubernetes Namespaces.

### Vamp deployments

Vamp has the concept of [blueprints](/documentation/using-vamp/v1.0.0/blueprints), which are execution plans that describe how microservices should be hooked up and what their topology should look like at runtime. **Blueprints are static resources that describe the *desired state***.

A Vamp [deployment](/documentation/using-vamp/v1.0.0/deployments) is a dynamic entity that describes a “running” blueprint with added runtime information such as the current state, resolved ports etc.

During the lifecycle of the deployment, Vamp monitors the state of each deployment and when differences arise **Vamp will adjust the state of that deployment so that it's *current state* matches the *desired state***.

A Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) uses a Deployment object to describe a *desired state*, and **a Deployment controller which is responsible for changing the *actual state* into the *desired state***.

On Kubernetes, Vamp deployments are realised using one or more Kubernetes Deployments.

### Vamp gateways

Vamp gateways provide a super set of Kubernetes Service and Ingress controller features.

Kubernetes [Services](https://kubernetes.io/docs/concepts/services-networking/service/) are simple transparent proxies with load balancing capabilities. Services can be used to expose microservices running in a cluster on an external network ([Service.Type=LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer)) or on the private network used by the nodes ([Service.Type=NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport)).

Kubernetes [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) offers name based virtual hosting, path-based routing ([simple fanout](https://kubernetes.io/docs/concepts/services-networking/ingress/#simple-fanout), path rewriting, TLS termination and simple weight-based routing.

**Vamp gateways allow you to do fine-grained, automated or manual blue/green or canary releases of your internal-facing and external-facing microservices.**

Vamp Gateway Agents (VGAs) are not implemented as a Ingress controller on Kubernetes, this is because the VGAs offer a much richer set of features than is supported by the Ingress controller API. Instead, Vamp gateways are dropin replacements for Kubernetes Services that provide all the features of Ingress plus powerful condition-based routing and traffic metrics which can be used for data-driven release automation.

An example Kubernetes Service might look like this:
```yaml
kind: Service
apiVersion: v1
metadata:
  name: foo
spec:
  selector:
    app: foo
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

And the corresponding Kubernetes Ingress might look like this:
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: foo-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: foo
          servicePort: 80
```

This exposes a Service called *foo* on an external IP address on port 80 using the virtual host *foo.bar.com*.

The equivalent Vamp gateway config would be:
```yaml
name: foo-ingress
kind: gateways
virtual_hosts:
- foo.bar.com
selector: label(app)(foo) && label(version)((.*))
```

This also exposes a Service called *foo* on an external IP address on port 80 (default) using the virtual host *foo.bar.com* but adds weight-based routing, condition-based routing and traffic metrics to that Service.

```bash
NAME                 TYPE           CLUSTER-IP     EXTERNAL-IP       PORT(S)           AGE
foo-ingress          NodePort       10.0.117.255   <none>            40001:32036/TCP   1h
vamp-gateway-agent   LoadBalancer   10.0.34.200    104.215.188.161   80:30606/TCP      13d
```

The *vamp-gateway-agent* Service is shared between all gateways. So the public DNS entry for *foo.bar.com* should be mapped to external IP address of the *vamp-gateway-agent*. The Service can be looked up as *foo-ingress* using kube-dns and, by default, it is also reachable at *<node-ip>:<node-port>* on the private network used by the nodes, in this example the node port is 40001.
    
The power of using a Vamp gateway is in `&& label(version)((.*))` part of the selector. The variable part `(.*)` causes Vamp to monitor for Deployments that match the selector and create a new route on the gateway if it finds a version label that doesn't match an existing route. The gateway also reacts to Deployments being removed and to changes in the number of Replicas.

If you have a current version of a Kubernetes Deployment with the labels *app:foo* and *version:1.0.3* and then create a new Deployment with the labels *app:foo* and *version:2.0.1*, A new route called *(2.0.1)* is automatically added to the gateway. You can then do a condition-based and/or weight-based, automated or manual blue/green or canary release of the new version.

{{< note title="What next?" >}}
* Find out how to [install Vamp](/documentation/installation/v1.0.0/overview)
{{< /note >}}
