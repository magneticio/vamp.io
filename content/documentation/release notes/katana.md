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

* Service-, cluster-, workflow- and breed level health checks DSL for Marathon
([#709](https://github.com/magneticio/vamp/issues/709),
[#914](https://github.com/magneticio/vamp/issues/914),
[#899](https://github.com/magneticio/vamp/issues/899),
[#913](https://github.com/magneticio/vamp/issues/913)).
* Transform a docker-compose.yml to Blueprint ([#928](https://github.com/magneticio/vamp/issues/928))

## What has changed

* Synchronization when health checks are changed needs to be explicitly specified `vamp.operation.synchronization.check.health-check`: `true` or `false` [#709](https://github.com/magneticio/vamp/issues/709)

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* [Try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
