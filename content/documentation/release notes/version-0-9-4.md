---
date: 2017-03-14T09:00:00+00:00
title: Version 0.9.4
menu:
  main:
    parent: "Release notes"
    name: Version 0.9.4
    weight: 995
aliases:
    - /documentation/release-notes/
    - /documentation/release-notes/latest/
---

_13 April 2017_

## What is new
* Vamp namespaces [#927](https://github.com/magneticio/vamp/issues/927)
* Optional DC/OS driver namespace cluster constraint [#929](https://github.com/magneticio/vamp/issues/929)
* Deployment level dialects [#922](https://github.com/magneticio/vamp/issues/922)
* Workflow dialects [#925](https://github.com/magneticio/vamp/issues/925)
* Vamp workflow agent port support and standalone UI [#909](https://github.com/magneticio/vamp/issues/909) & [#14](https://github.com/magneticio/vamp-workflow-agent/issues/14)
* Workflow status endpoint [#939](https://github.com/magneticio/vamp/issues/939)
* Access to configuration values from breed environment variables [#906](https://github.com/magneticio/vamp/issues/906)
* Vamp JavaScript workflow agent breed as an external configurable breed [#908](https://github.com/magneticio/vamp/issues/908)
* Access to workflow and deployment instances via Vamp reverser proxy [#912](https://github.com/magneticio/vamp/issues/912)
* Unique ID assigned to each event [#907](https://github.com/magneticio/vamp/issues/907)
* Service-, cluster-, workflow- and breed level health checks DSL for Marathon
([#709](https://github.com/magneticio/vamp/issues/709),
[#914](https://github.com/magneticio/vamp/issues/914),
[#899](https://github.com/magneticio/vamp/issues/899),
[#913](https://github.com/magneticio/vamp/issues/913)).
* Transform a docker-compose.yml to Blueprint ([#928](https://github.com/magneticio/vamp/issues/928))
* Additional blueprint validation [#802](https://github.com/magneticio/vamp/issues/802)

## What has changed
* Synchronization when health checks are changed needs to be explicitly specified `vamp.operation.synchronization.check.health-check`: `true` or `false` [#709](https://github.com/magneticio/vamp/issues/709)
* Vamp JavaScript workflow breed configuration is removed from main configuration [#908](https://github.com/magneticio/vamp/issues/908)

## Additions and changes to related Vamp components and projects
## Vamp Workflow Agent



## Vamp Gateway Agent


## Vamp UI


## Known issues

All closed issues can be found here:


{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
