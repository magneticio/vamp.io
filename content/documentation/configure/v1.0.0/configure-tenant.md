---
date: 2018-08-11T09:00:00+00:00
title: Create a tenant
menu:
  main:
    identifier: "configure-tenant-v100"
    parent: "Configuration"
    weight: 30
aliases:
    - /documentation/configure/configure-tenant
    - /documentation/installation/configure-tenant
---

Tenants can be different teams within a business division, different business divisions inside the same organization, or entirely different organizations. Each tenant's data is isolated and remains invisible to other tenants.

## Using the Vamp Lifter UI

### Kubernetes
Open the Vamp Lifter UI in your web browser. Details of how to access the Vamp Lifter UI using `kubectl` can be found in the in the Vamp EE [Kubernetes quickstart](/documentation/installation/kubernetes).

### DC/OS
In the DC/OS UI, click the icon next to the **vamp-ee-lifter** service name to open the Vamp Lifter UI in a new window
![](/images/screens/v100/dcos-vamp-lifteree.png)

### Create a tenant origanization
The organization namespace holds configuration that is common to all environments such as password salts, users and roles. The configuration for the persistent storage are also normally defined at the organization level.

1. Select **Organizations** from the left-hand menu
2. Click on the **Add** button (top right)
3. Enter the name of the organization namespace and click **Ok**
  * The name must be web safe and should only contain lowercase  letters (`a-z`), digits (`0-9`) and underscore (`_`) characters. It must not contain dashes (`-`) as these are used are delimiters
  * The organization will be created with a default display name, you will have an opportunity to change this later
  ![](/images/screens/v100/lifteree-organizations-add.png)
4. Click on the card for the newly created organization
  ![](/images/screens/v100/lifteree-organizations.png)
5. Select **Configuration** from the left-hand menu
  * The configuration is copied from the **admin template**
6. To change the display name, edit the `metadata.namespace.title` and click the **Apply** button
  ![](/images/screens/v100/lifteree-configuration-new_org.png)
7. Select **Setup** from the left-hand menu and click **Run**
  This configures the **key-value store** (Hashicorp Vault), **persistence** (MySQL), and **pulse** (Elasticsearch)
  ![](/images/screens/v100/lifteree-setup-new_org.png)
8. You can check the setup by selecting **Connections** from the left-hand menu
  ![](/images/screens/v100/lifteree-connections-new_org.png)

### Add an admin user
The tenant cannot be accessed until at least one admin user has been created. Only admin users are created in Lifter. Administrators can create other users and roles in Vamp.

To add an admin user:

1. Select **Organizations** from the left-hand menu
2. Click on the card for the organization where you want to add the admin user
3. Select **Administrators** from the left-hand menu
4. Click on the **Add** button (top right)
  ![](/images/screens/v100/lifteree-administrators-add.png)
5. Enter a **user name** and **password** and click **Ok**
  * The usernames are shared between tenants, so it's a good idea to include the tenant as part of the username
  ![](/images/screens/v100/lifteree-administrators-new_org.png)

### Add a tenant environment
An environment namespace typically represents part of a DTAP-pipeline (Development > Testing > Acceptance > Production). The container scheduler (Kubernetes or Marathon) is defined at the environment level. 

When using Kubernetes, there is a one-to-one mapping between a Vamp namespace and a Kubernetes namespace.

1. Select **Organizations** from the left-hand menu
2. Click on the card for the organization where you want to add the environment 
