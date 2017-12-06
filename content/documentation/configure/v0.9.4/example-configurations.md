---
date: 2016-09-13T09:00:00+00:00
title: Example configurations
menu:
  main:
    identifier: "example-configurations-v094"
    parent: "Configuration"
    weight: 20
aliases:
    - /documentation/installation/v0.9.4/example-configurations
---

{{< note title="The information on this page applies to Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/configure/example-configurations).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

## reference.conf default settings
reference.conf files are part of the Vamp code and should not be modified. They contains generic defaults for many parameters, but does not constitute a full Vamp configuration. Environment-specific settings need to be added in in application.conf or using environment variables and/or Java system properties.

The Vamp reference.conf file can be found in the Vamp project repo ([github.com/magneticio - Vamp reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)). For links to vendor-specific reference.conf files, see the [Vamp configuration reference](/documentation/configure/v0.9.4/configuration-reference/)

## application.conf
You can use application.conf to tailor the Vamp configuration to fit your environment. Settings specified here, or in environment variables, will override any defaults included in reference.conf. Template configuration files are provided, these complete the standard required settings and include the Vamp Health and Metrics workflows (required by the Vamp UI).  If your environment requires extensive customisation, you can [use a custom application.conf file](/documentation/configure/v0.9.4/configure-vamp/#use-a-custom-application-conf-file).


* [DC/OS application.conf - Vamp v0.9.4](https://github.com/magneticio/vamp-docker-images/blob/0.9.4/vamp-dcos/application.conf)
  _Container driver:_ Marathon
  _Key-value store:_ Zookeeper


* [Kubernetes application.conf - Vamp v0.9.4](https://github.com/magneticio/vamp-docker-images/blob/0.9.4/vamp-kubernetes/application.conf)
  _Container driver:_ Kubernetes
  _Key-value store:_ etcd


{{< note title="What next?" >}}
* Read about [how to configure Vamp](/documentation/configure/v0.9.4/configure-vamp)
* Check the [configuration reference](/documentation/configure/v0.9.4/configuration-reference)
* Follow the [tutorials](/documentation/tutorials/)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}
