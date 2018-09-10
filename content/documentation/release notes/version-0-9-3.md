---
date: 2017-02-14T09:00:00+00:00
title: Version 0.9.3
---

_14th February 2017_

![](/images/screens/v093/VAMP-dark-laptop-v093-hero.png)
This Vamp 093 release delivers powerful new features and improvements on both the UI, backend and architectural aspects of the system. Noticeable improvements are the redesigned UI with better support for larger deployments and lists due to a new list view and "as you type" search/filter. We moved the menu to the vertical left for better use of screen real-estate. We've added admin features to the UI to display logging, hot reloading of configurations and displaying the several layers of configurations. And very useful: all screens now have a context-sensitive help panel to the right.

On the backend side we now support configurable namespaces and service networks. We've solved a time-out issue in our UI implementation that was appearing when network packets would be chunked by the javascript engine. We've extended and improved our logging for better debugging, adding more log events and also streaming. The API now supports an additional endpoint, conditions, that can be referenced by name in the Vamp gateway routes. This helps to manage complex condition-rules.

Vamp 093 now supports HAproxy 1.7 and running multiple gateway configurations in parallel, including running several versions of HAproxy.

We replaced the original Vamp Gateway Agent agent binary with confd (magneticio/vamp-gateway-agent#7), added health-check endpoints to the VGA's, replaced logstash with elastic filebeat, and added elastic metricbeat to the Vamp Workflow Agents for better logging and debugging.

## What is new
* `no-store` pulse storage [#869](https://github.com/magneticio/vamp/issues/869)
* Configurable service network [#730](https://github.com/magneticio/vamp/issues/730)
* Using Vamp namespace in Docker labels [#679](https://github.com/magneticio/vamp/issues/679)
* Support for HAproxy 1.7.x compatible configurations [#871](https://github.com/magneticio/vamp/issues/871)
* Key-value store for (additional) Vamp configuration and option to update Vamp configuration at runtime [#872](https://github.com/magneticio/vamp/issues/872)
* Multiple gateway marshallers and option to update VGA (HAProxy) templates at runtime [#870](https://github.com/magneticio/vamp/issues/870).
* Querying events by type [#878](https://github.com/magneticio/vamp/issues/878)
* Calculate scales by workflow [#793](https://github.com/magneticio/vamp/issues/793)
* Showing Vamp logs in UI [#863](https://github.com/magneticio/vamp/issues/863)
* Kubernetes namespace support [#667](https://github.com/magneticio/vamp/issues/667)
* Artifact metadata [#890](https://github.com/magneticio/vamp/issues/890)
* Vamp as reverse proxy to Vamp gateways [#884](https://github.com/magneticio/vamp/issues/884)
* Log all API request [#898](https://github.com/magneticio/vamp/issues/898)
* Support for Kubernetes 1.5.x

## What has changed
* Pulse storage type needs to be explicitly specified `vamp.pulse.type`: `elasticsearch` or `no-store` [#869](https://github.com/magneticio/vamp/issues/869)
* Removed redundant HAProxy configuration: `vamp.gateway-driver.haproxy.virtual-hosts`, `vamp.gateway-driver.haproxy.tcp-log-format` and `vamp.gateway-driver.haproxy.http-log-format` [#763](https://github.com/magneticio/vamp/issues/763).
* Debug API endpoints have been removed [#308](https://github.com/magneticio/vamp/issues/308)
* API endpoint to get HAProxy configuration and key-value key for VGA [#870](https://github.com/magneticio/vamp/issues/870)
* Configuration change: `vamp.workflow-driver.workflow.deployables."application/javascript"` has been changed to `vamp.workflow-driver.workflow.deployables.application.javascript`
* Default workflow parameters are applied only on `application/javascript` workflows [#880](https://github.com/magneticio/vamp/issues/880)

## Additions and changes to related Vamp components and projects
## Vamp Workflow Agent

* Added elastic metricbeat https://github.com/magneticio/vamp-workflow-agent/issues/10
* Upgraded to Alpine 3.5 https://github.com/magneticio/vamp-workflow-agent/issues/11

## Vamp Gateway Agent
* Replaced VWA binary with confd https://github.com/magneticio/vamp-gateway-agent/issues/7 https://github.com/magneticio/vamp-gateway-agent/issues/25
* Added Runit for supervisor and init system https://github.com/magneticio/vamp-gateway-agent/issues/27
* Replaced logstash with filebeat https://github.com/magneticio/vamp-gateway-agent/issues/29
* Added health check endpoints https://github.com/magneticio/vamp-gateway-agent/issues/21

## Vamp UI
* Added pagination https://github.com/magneticio/vamp-ui/issues/177
* New navigation https://github.com/magneticio/vamp-ui/issues/196
* Backend configuration panel https://github.com/magneticio/vamp-ui/issues/199
* Full info panel https://github.com/magneticio/vamp-ui/issues/202
* List view https://github.com/magneticio/vamp-ui/issues/204
* Log panel https://github.com/magneticio/vamp-ui/issues/203
* VGA configuration panel https://github.com/magneticio/vamp-ui/issues/201
* Search option https://github.com/magneticio/vamp-ui/issues/182
* Support for retina and hDPI screens https://github.com/magneticio/vamp-ui/issues/229
* Several improvements to design and UX https://github.com/magneticio/vamp-ui/issues/182

## Known issues
* Vamp 093 currently is not tested with the latest stable Rancher releases. For now use [Vamp v0.9.2 Rancher install](/documentation/installation/v0.9.2/rancher/)
* Vamp 093 on "plain" Mesos/Marathon needs manual configuration.
* Not tested against the latest stable local/single-machine Docker version.

All closed issues can be found here:
https://github.com/magneticio/vamp/milestone/20?closed=1
https://github.com/magneticio/vamp-ui/milestone/5?closed=1

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
