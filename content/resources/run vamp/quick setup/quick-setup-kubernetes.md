---
date: 2016-03-09T19:56:50+01:00
title: Quick setup with Kubernetes
---

## Overview

>**Note**: Kubernetes support is still in Alpha.

This quick setup will run Vamp together with etcd, Elasticsearch and Logstash on Google container engine and kubernetes.   
(We will also deploy our demo Sava application to give you something to play around on).   


### Quick setup steps:

1. Create a new GKE cluster
2. Deploy etcd, Elasticsearch and Logstash
3. Run Vamp
4. Deploy the demo Sava application

### Prerequisistes:

* Google Container Engine cluster
* Key-value store (like ZooKeeper, Consul or etcd)
* Elasticsearch and Logstash

>**Note**:   

> * [Minikube](https://github.com/kubernetes/minikube) can also be used.  
> * **Stuck?** If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)


## In depth

### Before we begin...
It is advisable to try out [the official Quickstart for Google Container Engine](https://cloud.google.com/container-engine/docs/quickstart) tutorial first.  

### Step 1: Create a new GKE cluster:

The simple way to create a new GKE cluster:

1. open Google Cloud Shell
2. set zone, e.g. `gcloud config set compute/zone europe-west1-b`
3. create cluster `vamp` using default parameters: `gcloud container clusters create vamp`

After the (new) Kubernetes cluster is setup, we are going to continue with installation using the Kubernetes CLI `kubectl`.
You can use `kubectl` directly from Google Cloud Shell, e.g. to check the Kubernetes client and server version:

```bash
kubectl version
```

### Step 2: Deploy etcd, Elasticsearch and Logstash

Let's deploy `etcd` - our installation is based on this [tutorial](https://github.com/coreos/etcd/tree/master/hack/kubernetes-deploy).
Execute: 

```bash

kubectl create \
        -f https://raw.githubusercontent.com/magneticio/vamp-docker/master/vamp-kubernetes/etcd.yml
```

Deploy [Elasticsearch and Logstash](https://github.com/magneticio/elastic) with proper Vamp Logstash configuration:

```bash
kubectl run elastic --image=magneticio/elastic:2.2
kubectl expose deployment elastic --protocol=TCP --port=9200 --name=elasticsearch
kubectl expose deployment elastic --protocol=UDP --port=10001 --name=logstash
kubectl expose deployment elastic --protocol=TCP --port=5601 --name=kibana
```
>**Note**: This is not a production grade setup. You would need to take care also about persistence and running multiple replicas of each pods.

### Step 3: Run Vamp

Let's run Vamp gateway agent as a `daemon set` first:
```bash
kubectl create \
        -f https://raw.githubusercontent.com/magneticio/vamp-docker/master/vamp-kubernetes/vga.yml
```

To deploy Vamp, execute:

```bash
kubectl run vamp --image=magneticio/vamp:0.9.0-kubernetes
kubectl expose deployment vamp --protocol=TCP --port=8080 --name=vamp --type="LoadBalancer"
```


The Vamp image uses the following [configuration](https://github.com/magneticio/vamp-docker/blob/master/vamp-kubernetes/application.conf).

Wait a bit until Vamp is running and check out the Kubernetes services:

```bash
kubectl get services
```


Output should be similar to this:

```
NAME                 CLUSTER-IP     EXTERNAL-IP      PORT(S)             AGE
elasticsearch        10.3.242.188   <none>           9200/TCP            4m
etcd-client          10.3.247.112   <none>           2379/TCP            4m
etcd0                10.3.251.13    <none>           2379/TCP,2380/TCP   4m
etcd1                10.3.251.103   <none>           2379/TCP,2380/TCP   4m
etcd2                10.3.250.20    <none>           2379/TCP,2380/TCP   4m
kubernetes           10.3.240.1     <none>           443/TCP             5m
logstash             10.3.254.16    <none>           10001/UDP           4m
vamp                 10.3.242.93    146.148.118.45   8080/TCP            2m
vamp-gateway-agent   10.3.254.234   146.148.22.145   80/TCP              2m
```

Notice that the Vamp UI is exposed (in this example) on `http://146.148.118.45:8080`

### Step 4: Deploy the Sava demo application


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

>**Note**: Be sure that the cluster has enough resources (CPU, memory), otherwise deployments will be in pending state.

Once it's running if we get services:

```bash
kubectl get services --show-labels -l vamp=gateway
```


We can see that for each gateway a new service is created:

```
NAME                      CLUSTER-IP     EXTERNAL-IP     PORT(S)     AGE       LABELS
hex1f8c9a0157c9fe3335e9   10.3.243.199   104.155.24.47   9050/TCP    2m        lookup_name=a7ad6869e65e9c047f956cf7d1b4d01a89e
ef486,vamp=gateway
hex26bb0695e9a85ec34b03   10.3.245.85    23.251.143.62   40000/TCP   2m        lookup_name=6ace45cb2c155e85bd0c84123d1dab5a6cb
12c97,vamp=gateway
```

>**Note**: In this setup Vamp is deliberately configured to initiate exposure of all gateway and VGA ports. That would not be the case if default and recommended setting is used.

We can access our `sava` service on `http://104.155.24.47:9050`

Default Kubernetes service type can be set in configuration: `vamp.container-driver.kubernetes.service-type`, possible values are `LoadBalancer` or `NodePort`. 

We can also access using virtual hosts. Vamp Gateway Agent service is on IP `146.148.22.145` in this example, so:
```bash
curl --resolve 9050.sava-1-0.vamp:80:146.148.22.145 -v http://9050.sava-1-0.vamp
```

>**Note**: Don't forget to [clean up your Kubernetes cluster and firewall rules](https://cloud.google.com/container-engine/docs/quickstart#clean-up) if you don't want to use them anymore.

## What next?

* Now you're all set to follow the [Vamp Sava tutorials](/try-vamp/sava-tutorials/) (you can start with tutorial 2 - run a canary release as we already deployed the Sava demo application).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

>**Note** If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)