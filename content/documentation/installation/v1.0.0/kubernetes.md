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

* A machine on which to run the installation. This can be your laptop, a virtual machine instance or a Docker container that has [kubectl](http://kubernetes.io/docs/user-guide/kubectl-overview/) installed
* A Kubernetes cluster on which to install Vamp
  * This can be a 1.8.x, 1.9.x or 1.10.x cluster
  * The cluster should have 4 nodes and a minimum of 2 vCPUs and 7.5 GB memory per node

### Deploying Vamp Lifter

1. Signed up for a [Vamp Enterprise Edition trial](/trial-signup/), if you haven't already. Then download the **lifter-standalone.yml** file
1. Download the [clusterrolebinding.yml](https://gist.github.com/jason-magnetic-io/3be85e096a038e5c17f536bc52e439d0) file
1. Configure [kubectl](http://kubernetes.io/docs/user-guide/kubectl-overview/) command line access to your Kubernetes cluster
  * TODO link to Google Cloud Platform page
  * TODO link to Azure Container Service page
1. Create a *cluster-admin* user. This step can be skipped if you already have a suitable user with the *cluster-admin* role.
  
  ```
  kubectl create -f clusterrolebinding.yml
  ```
1. Deploy the Vamp Lifter application into the *default* Kubernetes namespace:
  
  ```
  kubectl --namespace default create -f lifter-standalone.yml
  ```

### Install Vamp and dependencies

1. Start a [HTTP Proxy](https://kubernetes.io/docs/tasks/access-kubernetes-api/http-proxy-access-api/) to allow access the Vamp Lifter UI
  
  ```
  kubectl proxy &
  ```
  
  This will start a proxy server on http://localhost:8001
  
1. Create a link to the Vamp Lifter UI
  
  ```
  kubectl --namespace default get pods -l app=lifter -o go-template --template '{{range .items}}http://localhost:8001/api/v1/namespaces/default/pods/{{.metadata.name}}/proxy/{{"\n"}}{{end}}'
  ```
1. Open the link to the Vamp Lifter UI in your web browser
  ![](/images/screens/v100/lifteree-installer-deploy.png)
  * With the **Deploy** tab selected, click on the green icon at the top right of the page
  * This will start the installation and:
    * Deploy **MySQL**, **Hashicorp Vault** and **Elasticsearch** into the *default* Kubernetes namespace
    * Create a sample organisation called **organisation**
    * Create a sample environment called **environment** for the sample organisation
    * Create a Kubernetes namespace called **vampio-organisation-environment**
    * Install the **Vamp Gateway Agent** (VGA) into the *vampio-organisation-environment* namespace
    * Deploy the **Vamp** application into the *default* Kubernetes namespace
1. To view the progress of the installation, click on the **Log** tab

### Login to the Vamp UI

At the end of the installer log there is a message with a link to the Vamp UI, paste this into your web browser

You can login using the username: **admin** and password: **abc12345**
![](/images/screens/v100/vampee-login.png)
If necessary, you can regenerate the link with the following command:

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
