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

* SQL persistence - ([#950](https://github.com/magneticio/vamp/issues/950))
  * Mysql persistence - [vamp-mysql](https://github.com/magneticio/vamp-mysql)
  * Postgres persistence - [vamp-postgres](https://github.com/magneticio/vamp-postgresql)
  * SQLServer persistence - [vamp-sqlserver](https://github.com/magneticio/vamp-sqlserver)
* Support for multiple zookeeper nodes
  * VAMP - [#956](https://github.com/magneticio/vamp/issues/956)
  * workflow-agent - [#956](https://github.com/magneticio/vamp/issues/956)
  * gateway-agent - [#39](https://github.com/magneticio/vamp-gateway-agent/issues/39)
* Docker-compose bugfixes - [#945](https://github.com/magneticio/vamp/issues/945)
* Upgrade HAProxy to 1.7.5 in the vamp-gateway-agent [#43](https://github.com/magneticio/vamp-gateway-agent/issues/43)

## What has changed

* Persistence of artifacts in Elasticsearch in no longer supported (Only pulse)
  * Search of artifacts via Elasticsearch and synchronization of persistence either via SQL or In-Memory is on the planning [#962](https://github.com/magneticio/vamp/issues/962)
* Configuration of SQL Persistence

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* [Try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
