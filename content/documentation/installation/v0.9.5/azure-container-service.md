---
date: 2016-09-30T12:00:00+00:00
title: Azure Container Service
platforms: ["Azure", "Kubernetes", "DCOS"]
menu:
  main:
    identifier: "azure-container-service-v095"
    parent: "Installation"
    weight: 80
---

You can run Vamp on [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) with either the DC/OS or Kubernetes orchestrator.

## DC/OS Orchestrator

To install DC/OS on ACS you should follow these steps:

1. Follow the instructions in the [ACS DC/OS quickstart](https://docs.microsoft.com/en-us/azure/container-service/dcos-swarm/container-service-dcos-quickstart).
2. After you have activated your ACS setup with DC/OS, go to your DC/OS admin environment and install Vamp using our [DC/OS installation instructions](/documentation/installation/v0.9.5/dcos/).


{{< note title="What next?" >}}

* Once you have Vamp up and running you can jump into the [getting started tutorials](/documentation/tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}

## Kubernetes Orchestrator

To install Kubernetes on ACS you should follow these steps. Make sure you have created a `resource group`  beforehand.

1. Follow the instructions in the [ACS Kubernetes quickstart](https://docs.microsoft.com/en-us/azure/container-service/kubernetes/container-service-tutorial-kubernetes-deploy-cluster).
2. After the installation, make sure `kubetctl` is running. Then execute the following script. This will install Vamp on
your Kubernetes cluster


```
curl -s \
  https://raw.githubusercontent.com/magneticio/vamp.io/master/static/res/v0.9.5/vamp_kube_quickstart.sh \
  | bash
```

3. When the Vamp installation finishes, start a proxy and you should be able to connect to the Kubernetes and Vamp UI

```bash
kubectl proxy
Starting to serve on 127.0.0.1:8001
```

The Kubernetes UI is now reachable at http://localhost:8001/ui/
You can find a link to the Vamp UI on the services tab

![](/images/screens/v095/acs_kubernetes.png)
