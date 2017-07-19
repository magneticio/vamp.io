---
date: 2017-03-14T09:00:00+00:00
title: Version 0.9.5
menu:
  sidenav:
    parent: "Release notes"
    name: Version 0.9.5
    weight: 994
aliases:
    - /documentation/release-notes/
    - /documentation/release-notes/latest/
---

_June 2017_
![](/images/screens/v095/vamp095-SQL.png)

The 095 release of Vamp is focused on increasing stability, scalability and performance. An important new feature is support for SQL databases for storing persistence data. This also enables us to deliver powerful (enterprise) multi-tenancy features. We've also added support for multiple Zookeeper nodes and upgraded HAProxy.


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

* Persistence of artifacts in Elasticsearch in no longer supported (Only pulse events and metrics can be stored in Elasticsearch)
* Configuration of SQL Persistence

## Known issues

* When in Marathon/DCOS Zookeeper is unavailable/restarted Vamp can sometimes become out of sync, showing failed deployments when the deployments are running normally. Going into scale and saving syncs Vamp again.
* The Vamp UI currently isn't fully responsive.
* Showing container logs on DC/OS is a beta feature, that may not always work correctly.

## All closed issues can be found here:

Vamp Core: https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.9.5+is%3Aclosed
Vamp UI: https://github.com/magneticio/vamp-ui/issues?q=is%3Aissue+milestone%3A0.9.5+is%3Aclosed

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
