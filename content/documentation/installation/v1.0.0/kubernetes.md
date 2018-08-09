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

This section describes how to quickly install Vamp 1.0 on Kubernetes so you can evaluate it. The installation uses an installer built into the Vamp Lifter application to bootstrap a full Vamp installation.

After a successful installation, you will be able to login to Vamp EE as an admin user and deploy services. 

{{< note title="Note!" >}}
**Do not run this default installation in production!** It does not include persistent storage and makes use of a [Hashicorp Vault 'dev' server](https://www.vaultproject.io/docs/concepts/dev-server.html).
{{< /note >}}

### What You'll Need

* A machine on which to run the installation
   * This can be a local machine, VM or a Docker container that has [kubectl](http://kubernetes.io/docs/user-guide/kubectl-overview/) installed
* A Kubernetes cluster on which to install Vamp
  * This can be a 1.8.x, 1.9.x or 1.10.x cluster
  * The cluster should have 4 nodes and a minimum of 2 vCPUs and 7.5 GB memory per node

### Google Cloud Platform

TODO

### Azure Container Service

TODO


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

## Manual deployment

TODO

{{< note title="What next?" >}}

* Once you have Vamp up and running you can jump into the [getting started tutorials](/documentation/tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
