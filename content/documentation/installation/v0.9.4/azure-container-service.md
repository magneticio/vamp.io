---
date: 2016-09-30T12:00:00+00:00
title: Azure Container Service
menu:
  main:
    identifier: "azure-container-service-v094"
    parent: "Installation"
    weight: 80
---

{{< note title="The information on this page applies to Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/installation/azure-container-service).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

To run Vamp together with Azure Container Service ([azure.microsoft.com - Container Service](https://azure.microsoft.com/en-us/services/container-service/)), use DC/OS as the default ACS Docker container scheduler.

To install DC/OS in Azure you should follow these steps: https://dcos.io/docs/1.8/administration/installing/cloud/azure/

After you have activated your ACS setup with DC/OS, go to your DC/OS admin environment and install Vamp using our [DC/OS installation instructions](/documentation/installation/v0.9.4/dcos/).


{{< note title="What next?" >}}

* Once you have Vamp up and running you can jump into the [getting started tutorials](/documentation/tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
