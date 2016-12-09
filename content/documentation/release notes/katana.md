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
* Option to suspend workflows without deleting them and option to restart them [#789](https://github.com/magneticio/vamp/issues/789)
* Workflow execution period (successive executions) and execution timeout (max allowed execution time) [#813](https://github.com/magneticio/vamp/issues/813)
* Kubernetes bearer as an optional configuration parameter [#834](https://github.com/magneticio/vamp/issues/834)
* Option to disable timing out deployment operations [#840](https://github.com/magneticio/vamp/issues/840)
* Proper HTTPS support (client side) [#846](https://github.com/magneticio/vamp/issues/846)
* Help panel in Vamp UI [#13](https://github.com/magneticio/vamp-ui/issues/13)

## What has changed
* Custom event types - only alphanumerics, '_' and '-' are allowed in type names [#830](https://github.com/magneticio/vamp/issues/830)
* Configurable Logstash URL (host, port) instead of just host [#831](https://github.com/magneticio/vamp/issues/831)
* 500 response code if any of /info response parts return an error [#771](https://github.com/magneticio/vamp/issues/771)
* Explicit mapping for supported workflow deployable types [#845](https://github.com/magneticio/vamp/issues/845)

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* [Try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
