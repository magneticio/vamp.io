---
date: 2018-08-11T09:00:00+00:00
title: Create a Tenant
aliases:
    - /documentation/configure/
menu:
  main:
    identifier: "configure-tenant-v100"
    parent: "Configuration"
    weight: 30
---

Tenants can be different teams within a business division, different business divisions inside the same organization, or entirely different organizations. Each tenant's data is isolated and remains invisible to other tenants.

## Using the Vamp Lifter UI

### Kubernetes
Open the Vamp Lifter UI in your web browser. Details of how to access the Vamp Lifter UI using `kubectl` can be found in the in the Vamp EE [Kubernetes quickstart](/documentation/installation/kubernetes).

### DC/OS
In the DC/OS UI, click the icon next to the **vamp-ee-lifter** service name to open the Vamp Lifter UI in a new window
![](/images/screens/v100/dcos-vamp-lifteree.png)

### Create a tenant organization
The organization namespace holds configuration that is common to all environments such as password salts, users and roles. The configuration for the persistent storage are also normally defined at the organization level.

1. Select **Organizations** from the left-hand menu
2. Click on the **Add** button (top right)
3. Enter the name of the organization namespace and click **Ok**
  * The name must be web safe and should only contain lowercase  letters (`a-z`), digits (`0-9`). It must not contain dash (`-`) characters as Vamp uses dashes as namespace delimiters
  * **DC/OS only**: the name may contain underscore (`_`) characters
  * **Kubernetes only**: the name must not contain underscore (`_`) characters
  * The organization will be created with a default display name, you will have an opportunity to change this later
  ![](/images/screens/v100/lifteree-organizations-add.png)
4. Click on the card for the newly created organization
  ![](/images/screens/v100/lifteree-organizations.png)
5. Select **Configuration** from the left-hand menu
  * The configuration is copied from the **admin template**
6. To change the display name, edit the `metadata.namespace.title` and click the **Apply** button
  ![](/images/screens/v100/lifteree-configuration-neworg.png)
7. After you have finished making changes, click the **Push to KV Store** button
8. Select **Setup** from the left-hand menu and click **Run**
  * This configures the **key-value store** (Hashicorp Vault), **persistence** (MySQL), and **pulse** (Elasticsearch)
  ![](/images/screens/v100/lifteree-setup-neworg.png)
9. You can check the setup by selecting **Connections** from the left-hand menu
  ![](/images/screens/v100/lifteree-connections-neworg.png)

### Add an admin user
The tenant cannot be accessed until at least one admin user has been created. Only admin users are created in Lifter. Administrators can create other users and roles in Vamp.

To add an admin user:

1. Select **Organizations** from the left-hand menu
2. Click on the card for the organization to which you want to add the admin user
3. Select **Administrators** from the left-hand menu
4. Click on the **Add** button (top right)
  ![](/images/screens/v100/lifteree-administrators-add.png)
5. Enter a **user name** and **password** and click **Ok**
  * The usernames are shared between tenants, so it's a good idea to include the tenant as part of the username
  ![](/images/screens/v100/lifteree-administrators-neworg.png)

### Add a tenant environment
An environment namespace typically represents part of a DTAP-pipeline (Development > Testing > Acceptance > Production). 

When using Kubernetes, there is a one-to-one mapping between a Vamp namespace and a Kubernetes namespace.

1. Select **Organizations** from the left-hand menu
2. Click on the card for the organization to which you want to add the environment
3. Select **Environments** from the left-hand menu
4. Click on the **Add** button (top right)
5. Enter the name of the environment namespace and click **Ok**
  * The name must be web safe and should only contain lowercase  letters (`a-z`), digits (`0-9`). It must not contain dash (`-`) characters as Vamp uses dashes as namespace delimiters
  * **DC/OS only**: the name may contain underscore (`_`) characters
  * **Kubernetes only**: the name must not contain underscore (`_`) characters
  * The environement will be created with a default display name, you will have an opportunity to change this later
  ![](/images/screens/v100/lifteree-environments-add.png)
6. Click on the card for the newly created environment
  ![](/images/screens/v100/lifteree-environments-neworg.png)
7. Select **Configuration** from the left-hand menu
  * The configuration is copied from the **operation template**
8. To change the display name, edit the `metadata.namespace.title` and click the **Apply** button
  ![](/images/screens/v100/lifteree-configuration-neworg-newenv.png)
9. After you have finished making changes, click the **Push to KV Store** button
10. Select **Setup** from the left-hand menu and click **Run**
  
  This:
  
  * (Kubernetes only) creates a Kubernetes **namespace**
  * **key-value store** stores the environment configuration in Hashicorp Vault
  * **persistence** creates a table and/or database schema for the namespace (depending on the chosen database model)
  * **pulse** creates the Elasticsearch indexes 
  * stores the native workflow **artifacts** in Hashicorp Vault
  ![](/images/screens/v100/lifteree-setup-neworg-newenv.png)
10. You can check the setup by selecting **Connections** from the left-hand menu
  ![](/images/screens/v100/lifteree-connections-neworg-newenv.png)

## Restart Vamp

The updates you make to tenants in Lifter will not take effect until you restart Vamp.

Vamp is not a realtime application and restarting it has no effect on gateways or deployments Vamp is managing.

### Kubernetes
Restarting a healthy Pod is hard to achieve in Kubernetes. The simplest option is to delete the current **vamp** Pod. Kubernetes will immediately replace the deleted Pod with a new one.

You can delete the **vamp** Pod using:
```bash
kubectl --namespace default delete pods -l app=vamp
```

### DC/OS
In the DC/OS UI, click the "More actions" icon on the right of the **vamp-ee** service name and then click **Restart**.
