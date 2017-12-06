---
date: 2016-12-22T09:00:00+00:00
title: Version 0.9.2
---

_22nd December 2016_

![](/img/006-mock-ups/VAMP-light-laptop-v091-hero.png)

This v0.9.2 release of Vamp has plenty of improvements in the areas of installation, robustness and stability. We also give the workflows feature some TLC so they're even easier to use from the UI. Check out our ["Automated canary release with rollback" tutorial](/documentation/tutorials/automate-a-canary-release/) to get a feeling for the power of Vamp workflows.

## What is new
* [#789](https://github.com/magneticio/vamp/issues/789) Workflows can now be suspended without deleting them and there is an option to restart them.
* [#813](https://github.com/magneticio/vamp/issues/813) Workflow execution period (successive executions) and execution timeout (max allowed execution time) can now be set for each workflow.
  More details: [using workflows - artifacts](/documentation/using-vamp/v0.9.2/workflows/#artifacts)
* [#834](https://github.com/magneticio/vamp/issues/834) Kubernetes bearer can be added as an optional configuration parameter.
  More details: [configuration reference - container driver](/documentation/configure/configuration-reference/#container-driver)
* [#840](https://github.com/magneticio/vamp/issues/840) Time out can now be disabled for deployment operations.
  More details: [configuration reference - operation](/documentation/configure/configuration-reference/#operation)
* [#846](https://github.com/magneticio/vamp/issues/846) Proper HTTPS support (client side).
  More details: [configuration reference - common](/documentation/configure/configuration-reference/#common)
* [#762](https://github.com/magneticio/vamp/issues/762) The default container type can now be configured.
  More details: [configuration reference - model](/documentation/configure/configuration-reference/#model)
* [#761](https://github.com/magneticio/vamp/issues/761) Support for Kubernetes driver with rkt runtime.
* [#862](https://github.com/magneticio/vamp/issues/862) Workflow environment variable values can be parametrised with workflow name (e.g. as $workflow or ${workflow}).
* [Vamp UI #13](https://github.com/magneticio/vamp-ui/issues/13) We've added a help panel to the Vamp UI - click on the ? in the top right corner.
* Website documentation is now versioned - where available, you can select content for specific Vamp versions.

## What has changed
* [#830](https://github.com/magneticio/vamp/issues/830) Custom event types - only alphanumerics, '_' and '-' are allowed in type names.
  More details: [using events - basic event rules](/documentation/using-vamp/v0.9.2/events/#basic-event-rules)
* [#831](https://github.com/magneticio/vamp/issues/831) Logstash URL (host, port) can now be configured (instead of just host).
  More details: [how to configure Vamp - extra configuration](/documentation/configure/configure-vamp/#extra-configuration-not-intended-for-vamp)
* [#771](https://github.com/magneticio/vamp/issues/771) The API now returns a 500 response code if any of /info response parts return an error.
  More details: [API reference - get runtime info](/documentation/api/v0.9.2/api-reference/#system)
* [#845](https://github.com/magneticio/vamp/issues/845) Spported workflow deployable types can be explicitly mapped.
  More details: [configuration reference - workflow-driver.workflow](/documentation/configure/configuration-reference/#workflow-driver-workflow)
* [#862](https://github.com/magneticio/vamp/issues/862) All default workflow environment variables need to be specified, e.g. VAMP_URL and VAMP_KEY_VALUE_STORE_PATH.
  More details: [using workflows - artifacts](/documentation/using-vamp/v0.9.2/workflows/#artifacts).

## Known issues
  * On some infrastructures we sometimes noticed time-outs on the UI side. Accessing the API directly works fine.

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
