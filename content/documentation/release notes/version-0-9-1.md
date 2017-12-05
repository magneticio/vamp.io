---
date: 2016-10-01T09:00:00+00:00
title: Version 0.9.1
---

_1st November 2016_

![](/img/006-mock-ups/VAMP-laptop-v091.png)



## The new stuff
This release of Vamp introduces:

* The biggie: We've added Websockets support to our HTTP API. And we're now using this heavily in our new UI to improve responsiveness, smoothness and speed. https://github.com/magneticio/vamp/issues/529
* We've updated our UI to a nice dark theme due to public demand, we love it as it's much easier on the eyes, and of course we're very interested in hearing [your thoughts](mailto:info@vamp.io)!
* We've updated our charts with the amazing Smoothie Charts library for smooth running charts and sparklines.
* You can now configure Vamp to use a key-value store for persistence data storage. By default nothing is defined, and you need to choose either ElasticSearch or key-value. Take a look at the [Vamp Quickstart configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) for possible settings. The design reasons for this addition are having less dependencies on Elasticsearch, better re-use of the available key-value stores that come with cluster-managers (like Zookeeper in DC/OS or Etcd in Kubernetes) and more robustness (i.e. if we temporarily loose ES the persistence data is still available in the K/V store, only the metrics data is temporarily unavailable). Possible issues might be the performance of the key-value store after some time. This is a known issue being investigated. https://github.com/magneticio/vamp/issues/750
* Gateway stickyness is now editable through the UI
* Scales and gateways are seperate entities exposed through the UI
* Multi-select delete actions in the UI
* You can now filter health and/or metrics events in the EVENTS stream panel
* And of course lots of other improvements and bug-fixes that can be found here: https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.9.1+is%3Aclosed


## What has changed
* **BREAKING CHANGE**: In the Vamp configuration the “rest-api” section has changed to “http-api”. When running Vamp 0.9.1 you need to change this setting accordingly. NB REST and websockets are both a part of our HTTP API. Check this [Vamp configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) example.
* **BREAKING CHANGE**: The default value for Vamp Gateway Agent `storeKey` has `/vamp/gateways/haproxy/1.6` - changed from `/vamp/haproxy/1.6`
* In the [Vamp configuration](/documentation/configure/configure-vamp/#persistence) we set `persistence caching` by default to `false`. In our pre-build Vamp images we set this to `true` to make it easier on the persistence store load. https://github.com/magneticio/vamp/issues/792
* We've changed the updating deployment service states. https://github.com/magneticio/vamp/issues/797

## Known issues
* Health in deployment detail screen stays at 100% even when a gateway error is measured. In the gateway detail screen this works correctly. 
* Memory leak issues when running workflows.
* Instability when using Zookeeper in the Vamp quickstart packages after a period of time.
* When using Elasticsearch for persistence storage there can be stale data due to speed of the websockets implementation and slower / eventual indexing of ES. A browser refresh solves this.
* Vamp-docker quickstart throws error when starting up.


The full list of improvements and bug-fixes that can be found here: https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.9.1+is%3Aclosed

{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
