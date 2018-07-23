---
date: 2016-10-04T09:00:00+00:00
title: Kubernetes
platforms: ["Kubernetes"]
menu:
  main:
    identifier: "kubernetes-v100"
    parent: "Installation"
    weight: 20
aliases:
    - /documentation/installation/kubernetes
---

## Azure Container Service

Please refer to our dedicated [Azure Kubernetes installation guide](/documentation/installation/azure-container-service/#kubernetes-orchestrator) for deploying Vamp and Kubernetes on Azure Container Service

## Google Container Engine

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

### Create a new GKE cluster

The simple way to create a new GKE cluster:

1. open Google Cloud Shell
2. set a zone, e.g. `gcloud config set compute/zone europe-west1-b`
3. create a cluster `vamp` using default parameters: `gcloud container clusters create vamp`

After the (new) Kubernetes cluster is setup, we are going to continue with the installation using the Kubernetes CLI `kubectl`.
You can use `kubectl` directly from the Google Cloud Shell, e.g. to check the Kubernetes client and server version:

```
kubectl version
```
### Quickstart

This section describes how to quickly install Vamp 1.0 on Kubernetes so you can evaluate it. The installation uses an installer built into the Vamp Lifter application.

**Do not run this default installation in production!** It does not include persistent storage and makes use of a [Hashicorp Vault 'dev' server](https://www.vaultproject.io/docs/concepts/dev-server.html).

After a successful installation, you will be able to login to Vamp EE as and admin user and deploy a service. 

**What You'll Need**

* A machine on which to run the installation.
   * This can be a local machine, VM or a Docker container that has [kubectl](http://kubernetes.io/docs/user-guide/kubectl-overview/) installed.
* A Kubernetes cluster on which to install Vamp itself.
  * This can be a 1.8.x, 1.9.x or 1.10.x cluster. 
  * It should have 4 nodes and a minimum of 2 vCPUs and 7.5 GB memory per node 

**Step-by-step guide**

1. Download the [lifter-standalone.yml](https://magneticio.atlassian.net/wiki/download/attachments/232226834/lifter-standalone.yml?version=1&modificationDate=1529531975151&cacheVersion=1&api=v2) and [clusterrolebinding.yml](https://magneticio.atlassian.net/wiki/download/attachments/232226834/clusterrolebinding.yml?version=1&modificationDate=1531256054343&cacheVersion=1&api=v2) files
2. Configure [kubectl](http://kubernetes.io/docs/user-guide/kubectl-overview/) command line access to your Kubernetes cluster
3. Create a *cluster-admin* user. This step can be skipped if you already have a suitable user with the *cluster-admin* role.

```
kubectl create -f clusterrolebinding.yml
```

4. Create a secret to allow the Vamp docker images to be pulled from our private Docker Hub repos.

```
kubectl create secret docker-registry regsecret --docker-server=https://index.docker.io/v1/ --docker-username=vampro --docker-password=roUser4Vamp --docker-email=docker@[vamp.io](http://mvamp.io/)
```

5. Deploy the Vamp Lifter application into the *default* Kubernetes namespace:

```
kubectl --namespace default create -f lifter-standalone.yml
```

6. Start a [HTTP Proxy](https://kubernetes.io/docs/tasks/access-kubernetes-api/http-proxy-access-api/) to allow access the Vamp Lifter UI

```
kubectl proxy &
```

  * This will start a proxy server on http://localhost:8001
7. Create a link to the Vamp Lifter UI

```
kubectl --namespace default get pods -l app=lifter -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/default/pods/{{.metadata.name}}/proxy/{{"\n"}}{{end}}'
```

8. Complete the Vamp EE Quick Start installation
  * Open the generated link in your web browser to view the installer
  ![ss-lifter-installer-deploy.png](url missing)
  * With the *Deploy* tab selected, click on the green icon at the top right of the page
  * This will start start the installation and:
    * Deploy *MySQL, Hashicorp Vault and Elasticsearch* into the *default* Kubernetes namespace
    * Create a sample organisation called "organisation"
    * Create a sample environment called "environment" for the sample organisation
    * Create a Kubernetes namespace called "vampio-organisation-environment"
    * Install the *Vamp Gateway Agent* (VGA) into the *vampio-organisation-environment* namespace
    * Deploy the *Vamp* application into the *default* Kubernetes namespace
9. To view the progress of the installation, click on the *Log* tab
10. Login to the Vamp UI
  * At the end of the installer log there is a message with a link to the Vamp UI, paste this into your web browser
  * You can login using the username: *admin* and password: *abc12345*
  * You can regenerate the link with the following command:

```
  kubectl --namespace default get pods -l app=vamp -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/default/pods/{{.metadata.name}}/proxy/{{"\n"}}{{end}}'
```

### Manual deployment

#### Deploy etcd, Elasticsearch

Now let's deploy `etcd` - this installation is based on the tutorial ([github.com/coreos - etcd on Kubernetes](https://github.com/coreos/etcd/tree/master/hack/kubernetes-deploy)).  Note that this is not a production grade setup - you would also need to take care of persistence and running multiple replicas of each pod.
First, execute:

```
kubectl create -f https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v1.0.0/etcd.yml
```

Then deploy Elasticsearch with a proper Vamp configuration ([github.com/magneticio - elastic](https://github.com/magneticio/elastic)) using:

```
kubectl run elasticsearch --image=elasticsearch:2.4.4
kubectl run kibana --image=kibana:4.6.4 --env="ELASTICSEARCH_URL=http://elasticsearch:9200"
kubectl expose deployment elasticsearch --protocol=TCP --port=9200 --name=elasticsearch
kubectl expose deployment kibana --protocol=TCP --port=5601 --name=kibana
```

#### Run Vamp

Now we can run Vamp gateway agent as a `daemon set`:
```
kubectl create -f https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v1.0.0/vga.yml
```

To deploy Vamp, execute:

```
kubectl run vamp --image=magneticio/vamp:0.9.5-kubernetes
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
