---
date: 2016-10-19T09:00:00+00:00
title: Katana
menu:
  main:
    parent: "Release notes"
    name: Katana
    weight: 10
---

{{< note title="Katana is not an official release">}}
All changes since the last official release are described below. This applies only to binaries built from source (master branch). 
{{< /note >}}

## What is new
* `no-store` pulse storage [#869](https://github.com/magneticio/vamp/issues/869).
* Configurable service network [#730](https://github.com/magneticio/vamp/issues/730).
* Using Vamp namespace in Docker labels [#679](https://github.com/magneticio/vamp/issues/679).
* Key-value store for (additional) Vamp configuration [#872](https://github.com/magneticio/vamp/issues/872).

## What has changed
* Pulse storage type needs to be explicitly specified `vamp.pulse.type`: `elasticsearch` or `no-store` [#869](https://github.com/magneticio/vamp/issues/869).
* Removed redundant HAProxy configuration: `vamp.gateway-driver.haproxy.virtual-hosts`, `vamp.gateway-driver.haproxy.tcp-log-format` and `vamp.gateway-driver.haproxy.http-log-format` [#763](https://github.com/magneticio/vamp/issues/763). 

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* [Try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
