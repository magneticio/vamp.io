---
date: 2016-10-19T09:00:00+00:00
title: Version 0.9.0
---

_9th September 2016_

The Vamp 0.9.0 release is a very important milestone in the lifecycle of Vamp, as we're removing the Alpha label and are moving to Beta! This means that we will do our utmost best to avoid breaking changes in our API's and DSL, focus even more on stabilising and optimising the current feature-set, while of course continuously introducing powerful new features.

The Vamp 0.9.0 release is the culmination of three months of hard work by our amazing team! This release incorporates nothing less than 115 issues and I'm very proud of what we've achieved.

![Vamp 0.9.0 UI](/images/screens/vamp_UI_090.png)

Some of the most notable new features are:

* a brand new opensource UI with much better realtime graphs, sparklines, info, events panel and access to all relevant API objects like breeds, deployments but also new options like gateways and workflows.  
* powerful integrated workflows for automation and optimisation like autoscaling, automated canary-releasing etc. using efficient Javascript-based scripting.
* Kubernetes and Rancher support.
* support for custom virtual host names in gateways.
* support for custom HAProxy templates.
* a brand new Vamp Runner helper application for automated integration testing, mocking scenarios and educational purposes.  

And, of course, there's a massive amount of improvements, bug fixes and other optimisations.

* [github.com/magneticio - complete list of all the closed issues in this release](https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.9.0+is%3Aclosed)

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
