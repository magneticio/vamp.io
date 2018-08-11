---
date: 2018-08-11T09:00:00+00:00
title: Configure tenant
menu:
  main:
    identifier: "configure-tenant-v100"
    parent: "Configuration"
    weight: 30
aliases:
    - /documentation/configure/configure-tenant
    - /documentation/installation/configure-tenant
---

## Create A Tenant

### Using the Vamp Lifter UI

#### Kubernetes
Open the Vamp Lifter UI in your web browser. Details of how to access the Vamp Lifter UI are in the Vamp EE [Kubernetes quickstart](/documentation/installation/kubernetes).

#### DC/OS
In the DC/OS UI, click the icon next to the **vamp-ee-lifter** service name to open the Vamp Lifter UI in a new window
![](/images/screens/v100/dcos-vamp-lifteree.png)

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

