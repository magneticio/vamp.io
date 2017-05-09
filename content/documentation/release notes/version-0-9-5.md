---
date: 2017-03-14T09:00:00+00:00
title: Version 0.9.5
menu:
  main:
    parent: "Release notes"
    name: Version 0.9.5
    weight: 994
aliases:
    - /documentation/release-notes/
    - /documentation/release-notes/latest/
---

_May 2017_
![](/images/screens/v094/VAMP-dark-laptop-v094-hero.png)
  

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

## Known issues


## All closed issues can be found here:

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
