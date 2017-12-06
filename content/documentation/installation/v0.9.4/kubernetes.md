---
date: 2016-10-04T09:00:00+00:00
title: Kubernetes
menu:
  main:
    identifier: "kubernetes-v094"
    parent: "Installation"
    weight: 50
---

{{< note title="The information on this page applies to Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/installation/kubernetes).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

The installation will run Vamp together with etcd and Elasticsearch on Google container engine and kubernetes. Before you begin, it is advisable to try out the official Quickstart for Google Container Engine tutorial first ([google.com - container engine quickstart](https://cloud.google.com/container-engine/docs/quickstart)).

{{< note title="Note!" >}}
Kubernetes support is still in Alpha.
{{< /note >}}

**Tested against**
This guide has been tested on Kubernetes and kubectl 1.4.x, 1.5.x and 1.6.0. Minikube 0.13.x or higher can also be used. ([github.com - minikube](https://github.com/kubernetes/minikube))

**Requirements**

* Google Container Engine cluster or Minikube (0.13.1 or later)
* Key-value store (like ZooKeeper, Consul or etcd)
* Elasticsearch
* Enough (CPU and memory) resources on your K8s cluster to deploy the Vamp dependencies AND the containers at the scale you define. NB take a look into the available resources when a deployment keeps "hanging" to see if you actually have enough resources available.
* Vamp currently only supports the 'default' namespace, so this should be available.

## Create a new GKE cluster

The simple way to create a new GKE cluster:

1. open Google Cloud Shell
2. set a zone, e.g. `gcloud config set compute/zone europe-west1-b`
3. create a cluster `vamp` using default parameters: `gcloud container clusters create vamp`

After the (new) Kubernetes cluster is setup, we are going to continue with the installation using the Kubernetes CLI `kubectl`.
You can use `kubectl` directly from the Google Cloud Shell, e.g. to check the Kubernetes client and server version:

```
kubectl version
```
## Quickstart

To quickly get started with Vamp on Kubernetes use the following command to automate the quick start described below (requires curl):

```
curl -s \
  https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v0.9.4/vamp_kube_quickstart.sh \
  | bash
```
The script will poll for the external ip of Vamp, note that this process will take a while. if the installation was successful the ip will be displayed:

```
$ [OK] Quickstart finished, Vamp is running on http://104.xxx.xxx.xxx:8080
```

We don't recommend running this setup in production. You might want to add a HTTPS proxy in front of Vamp with at least basic authentication.

To remove the quickstart deployment, use the following command:

```
curl -s \
  https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v0.9.4/vamp_kube_uninstall.sh \
  | bash
```

## Manual deployment

### Deploy etcd, Elasticsearch

Now let's deploy `etcd` - this installation is based on the tutorial ([github.com/coreos - etcd on Kubernetes](https://github.com/coreos/etcd/tree/master/hack/kubernetes-deploy)).  Note that this is not a production grade setup - you would also need to take care of persistence and running multiple replicas of each pod.
First, execute:

```
kubectl create -f https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v0.9.4/etcd.yml
```

Then deploy Elasticsearch with a proper Vamp configuration ([github.com/magneticio - elastic](https://github.com/magneticio/elastic)) using:

```
kubectl run elasticsearch --image=elasticsearch:2.4.4
kubectl run kibana --image=kibana:4.6.4 --env="ELASTICSEARCH_URL=http://elasticsearch:9200"
kubectl expose deployment elasticsearch --protocol=TCP --port=9200 --name=elasticsearch
kubectl expose deployment kibana --protocol=TCP --port=5601 --name=kibana
```

### Run Vamp

Now we can run Vamp gateway agent as a `daemon set`:
```
kubectl create -f https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v0.9.4/vga.yml
```

To deploy Vamp, execute:

```
kubectl run vamp --image=magneticio/vamp:0.9.4-kubernetes
kubectl expose deployment vamp --protocol=TCP --port=8080 --name=vamp --type="LoadBalancer"
```


As a reference, you can find the latest Vamp katana  Kubernetes configuration here: [github.com/magneticio - Vamp Kubernetes configuration](https://github.com/magneticio/vamp-docker-images/blob/master/vamp-kubernetes/application.conf). Vamp katana includes all changes since the last official release, check the [katana documentation](/documentation/release-notes/katana) for details.

The Vamp UI includes mixpanel integration. We monitor data on Vamp usage solely to inform our ongoing product development. Feel free to block this at your firewall, or [contact us](/contact) if you’d like further details.

Wait a bit until Vamp is running and check out the Kubernetes services:

```
kubectl get services
```


The output should be similar to this:

```
NAME                 CLUSTER-IP     EXTERNAL-IP      PORT(S)             AGE
elasticsearch        10.3.242.188   <none>           9200/TCP            4m
etcd-client          10.3.247.112   <none>           2379/TCP            4m
etcd0                10.3.251.13    <none>           2379/TCP,2380/TCP   4m
etcd1                10.3.251.103   <none>           2379/TCP,2380/TCP   4m
etcd2                10.3.250.20    <none>           2379/TCP,2380/TCP   4m
kubernetes           10.3.240.1     <none>           443/TCP             5m
vamp                 10.3.242.93    146.148.118.45   8080/TCP            2m
vamp-gateway-agent   10.3.254.234   146.148.22.145   80/TCP              2m
```

Notice that the Vamp UI is exposed (in this example) on `http://146.148.118.45:8080`
On Minikube you can use the handy `minikube service vamp` command to open the Vamp UI in your browser.
In the Kubernetes dashboard under 'Services' you will see the external endpoint appear with a hyperlink icon behind it when the Vamp UI service is available.

## Deploy the Sava demo application


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

Be sure that the cluster has enough resources (CPU, memory), otherwise deployments will be in pending state. Once it's running we can check if all Vamp Gateway Agent services are up:

```
kubectl get services --show-labels -l vamp=daemon
```


We can see that for each gateway a new service is created:

```
NAME                      CLUSTER-IP     EXTERNAL-IP     PORT(S)     AGE       LABELS
hex1f8c9a0157c9fe3335e9   10.3.243.199   104.155.24.47   9050/TCP    2m        lookup_name=a7ad6869e65e9c047f956cf7d1b4d01a89e
ef486,vamp=gateway
hex26bb0695e9a85ec34b03   10.3.245.85    23.251.143.62   40000/TCP   2m        lookup_name=6ace45cb2c155e85bd0c84123d1dab5a6cb
12c97,vamp=gateway
```

{{< note title="Note!" >}}
In this setup Vamp is deliberately configured to initiate exposure of all gateway and VGA ports. This would not be the case if the default and recommended setting are used.
{{< /note >}}

Now we can access our `sava` service on `http://104.155.24.47:9050`

In the Kubernetes dashboard you will see the external endpoint appear with a hyperlink icon behind it in the "Services" overview when the external gateway of your deployment is available. You can recognise it by the port that's included in the endpoint that you have defined in your blueprint gateway definition.

The default Kubernetes service type can be set in configuration: `vamp.container-driver.kubernetes.service-type`, possible values are `LoadBalancer` or `NodePort`. We can also access gateways using virtual hosts. Vamp Gateway Agent service is on IP `146.148.22.145` in this example, so:
```
curl --resolve 9050.sava-1-0.vamp:80:146.148.22.145 -v http://9050.sava-1-0.vamp
```

Don't forget to clean up your Kubernetes cluster and firewall rules  if you don't want to use them anymore ([google.com - container engine quickstart: clean up](https://cloud.google.com/container-engine/docs/quickstart#clean-up)).

{{< note title="What next?" >}}

* Once you have Vamp up and running you can jump into the [getting started tutorials](/documentation/tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
