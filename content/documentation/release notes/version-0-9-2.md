---
date: 2016-12-22T09:00:00+00:00
title: Version 0.9.2
menu:
  main:
    parent: "Release notes"
    name: Version 0.9.2
    weight: 997
aliases:
    - /documentation/release-notes/
    - /documentation/release-notes/latest/
---

_22nd December 2016_


## What is new
* Option to suspend workflows without deleting them and option to restart them [#789](https://github.com/magneticio/vamp/issues/789)
* Workflow execution period (successive executions) and execution timeout (max allowed execution time) [#813](https://github.com/magneticio/vamp/issues/813)
* Kubernetes bearer as an optional configuration parameter [#834](https://github.com/magneticio/vamp/issues/834)
* Option to disable timing out deployment operations [#840](https://github.com/magneticio/vamp/issues/840)
* Proper HTTPS support (client side) [#846](https://github.com/magneticio/vamp/issues/846)
* Configurable default container type [#762](https://github.com/magneticio/vamp/issues/762)
* Support for Kuberntes driver with rkt runtime [#761](https://github.com/magneticio/vamp/issues/761)
* Workflow environment variable values can be parametrised with workflow name (e.g. as $workflow or ${workflow}) [#862](https://github.com/magneticio/vamp/issues/862)
* We've added a help panel to the Vamp UI [#13](https://github.com/magneticio/vamp-ui/issues/13)
* Website documentation is now versioned - where available, you can select content for specific Vamp versions.

## What has changed
* Custom event types - only alphanumerics, '_' and '-' are allowed in type names [#830](https://github.com/magneticio/vamp/issues/830)
* Configurable Logstash URL (host, port) instead of just host [#831](https://github.com/magneticio/vamp/issues/831)
* 500 response code if any of /info response parts return an error [#771](https://github.com/magneticio/vamp/issues/771)
* Explicit mapping for supported workflow deployable types [#845](https://github.com/magneticio/vamp/issues/845)
* All default workflow environment variables need to be specified, e.g. VAMP_URL and VAMP_KEY_VALUE_STORE_PATH [#862](https://github.com/magneticio/vamp/issues/862)

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
