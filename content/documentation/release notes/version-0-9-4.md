---
date: 2017-03-14T09:00:00+00:00
title: Version 0.9.4
---

_14 April 2017_
![](/images/screens/v094/VAMP-dark-laptop-v094-hero.png)
The Vamp 0.9.4 release marks the beginning of a new level of sophistication and maturity of the Vamp system. It shows the first features of our longer term vision on what Vamp can be and deliver. One of the most powerful additions is the addition of a Vamp controlled "reverse proxy" functionality. This enables powerful new features like showing logs of running container instances, showing the contents of the containers itself, and exposing event-logs from all the Vamp workflows, all directly within the Vamp UI. With this new feature Vamp can effectively act as a unified accesspoint and view to all the components and services running in the system. We've also added support for importing and converting Docker Compose files to Vamp blueprints. Another powerful addition is now defining health-definitions for Marathon within Vamp blueprints. Much requested is having a smart check on available cluster-resources in Marathon before deploying a blueprint. We have a service instances overview screen now, and better support for health-checks for Vamp containers. We also added an artifact revisions history view to the UI. And of course we've fixed plenty of bugs and added numerous enhancements and improvements along the way. Enjoy this new Vamp release and we look forward to building upon these great new core features to deliver even more powerful functionalities in the upcoming releases.  

## What is new
* Vamp namespaces [#927](https://github.com/magneticio/vamp/issues/927)
* Optional DC/OS driver namespace cluster constraint [#929](https://github.com/magneticio/vamp/issues/929)
* Deployment level dialects [#922](https://github.com/magneticio/vamp/issues/922)
* Workflow dialects [#925](https://github.com/magneticio/vamp/issues/925)
* Vamp workflow agent port support and standalone UI [#909](https://github.com/magneticio/vamp/issues/909) & [#14](https://github.com/magneticio/vamp-workflow-agent/issues/14)
* Workflow status endpoint [#939](https://github.com/magneticio/vamp/issues/939)
* Access to configuration values from breed environment variables [#906](https://github.com/magneticio/vamp/issues/906)
* Vamp JavaScript workflow agent breed as an external configurable breed [#908](https://github.com/magneticio/vamp/issues/908)
* Access to workflow and deployment instances via Vamp reverse proxy [#912](https://github.com/magneticio/vamp/issues/912)
* Unique ID assigned to each event [#907](https://github.com/magneticio/vamp/issues/907)
* Service-, cluster-, workflow- and breed level health checks DSL for Marathon
* Namespace based logging [#931] (https://github.com/magneticio/vamp/issues/931)
* Extend Time unit to accept "second" and "minute" [#919] (https://github.com/magneticio/vamp/issues/919)
* Support for DC/OS 1.9.0
* Health check suport in Vamp DSL ([#709](https://github.com/magneticio/vamp/issues/709),
* Cluster level health checks [#914](https://github.com/magneticio/vamp/issues/914),
* Support for workflow health checks [#899](https://github.com/magneticio/vamp/issues/899),
* Health on a breed level [#913](https://github.com/magneticio/vamp/issues/913)).
* Transform a docker-compose.yml to Blueprint ([#928](https://github.com/magneticio/vamp/issues/928))
* Additional blueprint validation [#802](https://github.com/magneticio/vamp/issues/802)
* Using Kubernetes Jobs for event based workflows [#838] (https://github.com/magneticio/vamp/issues/838)
* Vamp UI instance view [#299] (https://github.com/magneticio/vamp-ui/issues/299) 
* Vamp UI service detail view [#298] (https://github.com/magneticio/vamp-ui/issues/298)
* Vamp UI artifact revisions view [#294] (https://github.com/magneticio/vamp-ui/issues/294)
* Vamp UI show logs of containers [#280] (https://github.com/magneticio/vamp-ui/issues/280)
* Vamp UI expose external workflow event log view inside UI panel [#206] (https://github.com/magneticio/vamp-ui/issues/206)

## What has changed
* Synchronization when health checks are changed needs to be explicitly specified `vamp.operation.synchronization.check.health-check`: `true` or `false` [#709](https://github.com/magneticio/vamp/issues/709)
* Vamp JavaScript workflow breed configuration is removed from main configuration [#908](https://github.com/magneticio/vamp/issues/908)
* Dialects must be specified inside a `Dialects:` tag. See [using vamp - dialects](/documentation/using-vamp/v0.9.4/dialects/)

## Known issues
* Sometimes errors are logged due to starting of Vamp dependencies
* When in Marathon/DCOS Zookeeper is unavailable/restarted Vamp can sometimes become out of sync, showing failed deployments when the deployments are running normally. Going into scale and saving syncs Vamp again.
* On DC/OS the container logs are not shown by default, it needs setting of the vamp.container-driver.dcos.url to access these and show them in the UI. 

## All closed issues can be found here:
https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.9.4+is%3Aclosed
https://github.com/magneticio/vamp-ui/issues?q=is%3Aissue+milestone%3A0.9.4+is%3Aclosed

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
