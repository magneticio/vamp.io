---
date: 2017-02-14T09:00:00+00:00
title: Version 0.9.3
menu:
  main:
    parent: "Release notes"
    name: Version 0.9.3
    weight: 996
aliases:
    - /documentation/release-notes/
    - /documentation/release-notes/latest/
---

_14th February 2017_

![](/images/screens/v093/VAMP-dark-laptop-v093-hero.png)



## What is new
* `no-store` pulse storage [#869](https://github.com/magneticio/vamp/issues/869)
* Configurable service network [#730](https://github.com/magneticio/vamp/issues/730)
* Using Vamp namespace in Docker labels [#679](https://github.com/magneticio/vamp/issues/679)
* Key-value store for (additional) Vamp configuration and option to update Vamp configuration at runtime [#872](https://github.com/magneticio/vamp/issues/872)
* Multiple gateway marshallers and option to update VGA (HAProxy) templates at runtime [#870](https://github.com/magneticio/vamp/issues/870).
* Querying events by type [#878](https://github.com/magneticio/vamp/issues/878)
* Showing Vamp logs in UI [#863](https://github.com/magneticio/vamp/issues/863)
* Kubernetes namespace support [#667](https://github.com/magneticio/vamp/issues/667)
* Artifact metadata [#890](https://github.com/magneticio/vamp/issues/890)

## What has changed
* Pulse storage type needs to be explicitly specified `vamp.pulse.type`: `elasticsearch` or `no-store` [#869](https://github.com/magneticio/vamp/issues/869)
* Removed redundant HAProxy configuration: `vamp.gateway-driver.haproxy.virtual-hosts`, `vamp.gateway-driver.haproxy.tcp-log-format` and `vamp.gateway-driver.haproxy.http-log-format` [#763](https://github.com/magneticio/vamp/issues/763).
* Debug API endpoints have been removed [#308](https://github.com/magneticio/vamp/issues/308)
* API endpoint to get HAProxy configuration and key-value key for VGA [#870](https://github.com/magneticio/vamp/issues/870)
* Configuration change: `vamp.workflow-driver.workflow.deployables."application/javascript"` has been changed to `vamp.workflow-driver.workflow.deployables.application.javascript`
* Default workflow parameters are applied only on `application/javascript` workflows [#880](https://github.com/magneticio/vamp/issues/880)

## Known issues
* Rancher not currently supported - use [Vamp v0.9.2 Rancher install](/documentation/installation/v0.9.2/rancher/)

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
