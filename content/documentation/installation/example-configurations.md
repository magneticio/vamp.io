---
date: 2016-09-13T09:00:00+00:00
title: Example configurations
menu:
  main:
    parent: "Installation"
    weight: 120
draft: true
---


## reference.conf
`reference.conf` is part of the Vamp code and should not be modified. It contains generic defaults for many parameters, but does not include a full Vamp configuration. Environment-specific settings should be specified in `application.conf` or using environment variables and/or Java system properties (not advised).  

The full `reference.conf` file can be found in the Vamp project repo [github.com/magneticio - Vamp reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf).

## application.conf
You can use `application.conf` to tailor the Vamp configuration to fit your environment. Settings specified here, or in environment variables, will override any defaults included in `reference.conf`. Template configuration files are provided for all supported container drivers. These complete the standard required settings and include the Vamp Health and Metrics workflows (required by the Vamp UI).  If your environment requires extensive customisation, you can [use a custom application.conf file](/documentation/installation/how-to-configure-vamp/#use-a-custom-application-conf-file).


* [DCOS application.conf](https://github.com/magneticio/vamp-docker/blob/master/vamp-dcos/application.conf)  
  _Container driver:_ Marathon  
  _Key-value store:_ Zookeeper

* [Docker application.conf]()  
  _Container driver:_ Docker  
  _Key-value store:_ 
  
* [Kubernetes application.conf](https://github.com/magneticio/vamp-docker/blob/master/vamp-kubernetes/application.conf)  
  _Container driver:_ Kubernetes  
  _Key-value store:_ etcd
  
* [Rancher application.conf](https://github.com/magneticio/vamp-docker/blob/master/vamp-rancher/application.conf)  
  _Container driver:_ Rancher  
  _Key-value store:_ consul


{{< note title="What next?" >}}
* Read about [how to configure Vamp](documentation/installation/how-to-configure-vamp)
* Check the [Vamp configuration reference](documentation/installation/configuration-reference)
* Follow the [tutorials](/documentation/tutorials/overview)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}
