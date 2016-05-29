---
title: Kubernetes
type: documentation
weight: 90
menu:
    main:
      parent: installation
---

# Kubernetes on Google Container Engine

## Prerequisites

- Google Container Engine cluster
- Key-value store like ZooKeeper, Consule or etcd
- Elasticsearch and Logstash

It is advisable to try out the official [Quickstart for Google Container Engine](https://cloud.google.com/container-engine/docs/quickstart) tutorial first.
For instance container cluster can be created running command:

{{% copyable %}}
```
gcloud container clusters create example-cluster
```
{{% /copyable %}}

After the cluster is setup, let's deploy `etcd` - we will base installation on the following [tutorial](https://github.com/coreos/etcd/tree/master/hack/kubernetes-deploy).
Execute: 
{{% copyable %}}
```
kubectl create -f https://raw.githubusercontent.com/coreos/etcd/master/hack/kubernetes-deploy/etcd.yml
```
{{% /copyable %}}

Deploy [Elasticsearch and Logstash](https://github.com/magneticio/elastic) with proper Vamp Logstash configuration:
{{% copyable %}}
```
kubectl run elastic --image=magneticio/elastic:2.2
kubectl expose deployment elastic --protocol=UDP --port=10001 --name=logstash
kubectl expose deployment elastic --protocol=TCP --port=9200 --name=elasticsearch
```
{{% /copyable %}}

>**Note**: This is not a production grade setup. You would need to take care also about persistence and running multiple replicas of each application.

## Running Vamp

Execute:
{{% copyable %}}
```
kubectl run vamp --image=magneticio/vamp:develop-kubernetes
kubectl expose deployment vamp --protocol=TCP --port=8080 --name=vamp --type="LoadBalancer"
```
{{% /copyable %}}

Vamp image uses the following [configuration](https://github.com/magneticio/vamp-docker/blob/master/vamp-kubernetes/conf/application.conf).

Wait a bit until Vamp is running and check out the Kubernetes services:
{{% copyable %}}
```
kubectl get services
```
{{% /copyable %}}

Output should be similar to this:

```
...
```
Notice that Vamp UI is exposed (in this example) on `...`
When Vamp start it deploys Vamp Gateway Agent as a Kubernetes daemon set and creates a service for it.
If you wish to disable this automatic deployment just set `vamp.lifter.vamp-gateway-agent.enabled = false`

Let's deploy `sava` demo application:

{{% copyable %}}
```yaml
---
name: sava:1.0
gateways:
  9050: sava/port
clusters:
  sava:
    services:
      breed:
        name: sava:1.0.0
        deployable: magneticio/sava:1.0.0
        ports:
          port: 8080/http
      scale:
        cpu: 0.2       
        memory: 64MB
        instances: 1
```
{{% /copyable %}}

Once it's running if we execute again:
{{% copyable %}}
```
kubectl get services
```
{{% /copyable %}}

We can see that for each gateway a new service is created. 
Default Kubernetes service type can be set in configuration: `vamp.container-driver.kubernetes.service-type`, possible values are `LoadBalancer` or `NodePort`. 

We can also access using virtual hosts. Vamp Gateway Agent service is on IP `...` in this example, so:
```
curl --resolve 9050.sava.vamp:80:192.168.99.100 -v http://9050.sava.vamp
```

You can also try out other [guides](/documentation/guides/).

>**Note**: Don't forget to [clean up](https://cloud.google.com/container-engine/docs/quickstart#clean-up) your Kubernetes cluster if you don't want to use it anymore.