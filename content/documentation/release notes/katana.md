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
* Using Vamp namespace in Docker labels[#679](https://github.com/magneticio/vamp/issues/679).

## What has changed
* Pulse storage type needs to be explicitly specified `vamp.pulse.type`: `elasticsearch` or `no-store` [#869](https://github.com/magneticio/vamp/issues/869).

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* [Try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
