---
date: 2017-02-07T12:00:00+00:00
title: DC/OS Quickstart
platforms: ["DCOS","Mesosphere"]
menu:
  main:
    identifier: "dcos-v100"
    parent: "Installation"
    weight: 30
aliases:
    - /documentation/installation/dcos
---

This section describes how to quickly install Vamp 1.0 on DC/OS so you can evaluate it. The installation uses an installer built into the Vamp Lifter application to bootstrap a full Vamp installation.

After a successful installation, you will be able to login to Vamp EE as an admin user and deploy services. 

{{< note title="Note!" >}}
**Do not run this default installation in production!** It does not include persistent storage and makes use of a [Hashicorp Vault 'dev' server](https://www.vaultproject.io/docs/concepts/dev-server.html).
{{< /note >}}

### What You'll Need

A DC/OS cluster on which to install Vamp:

* This can be a 1.10.x, or 1.11.x cluster
* It should have 4 nodes:
  * A minimum of 3 private agents
  * A minimum of 1 public agent
  * Each node should have a minimum of 4 vCPUs and 12 GB memory 

### Deploying Vamp Lifter

Sign up for a [Vamp Enterprise Edition trial](/ee-trial-signup/), if you haven't already. Then download the **lifter-standalone.json** file

### Using the DC/OS CLI
Deploy the Vamp Lifter application using the DC/OS CLI:
    
```
dcos marathon app add lifter-standalone.json
```

### Using the DC/OS UI
Deploy the Vamp Lifter application using the DC/OS CLI:

* Select **Services → Run a Service**
* Select **JSON Configuration**
* Paste the contents of the **lifter-standalone.json** file into the editor
* Click the **Review & Run** button
* Click the **Run Service** button to deploy the Vamp Lifter application

### Install Vamp and dependencies

In the DC/OS UI, click the icon next to the **vamp-ee-lifter** service name to open the Vamp Lifter UI in a new window
![](/images/screens/v100/dcos-vamp-lifteree.png)

* Select **Installer → Deploy**
  ![](/images/screens/v100/lifteree-installer-deploy.png)
* Click on the **Deploy** button (top right), this will start the installation and:
  * Deploy **MySQL**, **Hashicorp Vault** and **Elasticsearch**
  * Create a sample organisation called **organisation**
  * Create a sample environment called **environment** for the sample organisation
  * Create a Kubernetes namespace called **vampio-organisation-environment**
  * Install the **Vamp Gateway Agent** (VGA) into the *vampio-organisation-environment* namespace
  * Deploy the **Vamp** application
* To view the progress of the installation, click on the **Log** tab
  ![](/images/screens/v100/lifteree-installer-log-dcos.png)

### Login to the Vamp UI

In the DC/OS UI, click the icon next to the **vamp-ee** service name to open the Vamp UI in a new window
![](/images/screens/v100/dcos-vamp-vampee.png)

You can login using the username: **admin** and password: **abc12345**
![](/images/screens/v100/vampee-login.png)

{{< note title="What next?" >}}

* Once you have Vamp up and running you can follow our [getting started tutorials](/documentation/tutorials/).
* Chcek the [Vamp documentation](/documentation/how-vamp-works/architecture-and-components/)
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
