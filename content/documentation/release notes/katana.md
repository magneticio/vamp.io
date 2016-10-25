---
date: 2016-10-19T09:00:00+00:00
title: katana
---
_19th October 2016_

{{< note title="katana is not an official release">}}
All changes since the last official release are described below. This applies only to binaries built from source (master branch). 
{{< /note >}}


## What has changed
* **BREAKING CHANGE**: In the Vamp configuration the “rest-api” section has changed to “http-api”. When running Vamp 0.9.1 you need to change this setting accordingly. NB REST and websockets are both a part of our HTTP API. Check this [Vamp configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) example.
* In the [Vamp configuration](/documentation/installation/configure-vamp/#persistence) we set `persistence caching` by default to `false`. In our Vamp images we set this to `true` to make it easier on the persistence store load. https://github.com/magneticio/vamp/issues/792
* We've changed the updating deployment service states. https://github.com/magneticio/vamp/issues/797

## What is new
* The biggie: We've added Websockets support to our HTTP API. And we're already using this heavily in our new UI to improve responsiveness and speed. https://github.com/magneticio/vamp/issues/529
* We've updated our UI to a dark theme due to public demand, we love it as it's much easier on the eyes, and of course we're very interested in hearing [your thoughts](mailto:info@magnetic.io)!
* You can now configure Vamp to use a key-value store for persistence data storage. By default nothing is set, and thus you need to choose either ElasticSearch or key-value. Take a look at the [Vamp Quickstart configuration](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf) for possible settings. The design reasons for this addition  are less dependencies on elasticsearch, better re-use of the available key-value stores that come with cluster-managers (like Zookeeper in DCOS or etcd in Kubernetes) and more robustness (i.e. if we loose ES the persistence data is still available, only the metrics data is temporarily unavailable). Possible issues might be the performance of the key-value store. https://github.com/magneticio/vamp/issues/750
* And of course lots of improvements and bug-fixes that can be found here: https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.9.1+is%3Aclosed


{{< note title="What next?" >}}
* Read all release notes on github ([github.com/magneticio - Vamp releases](https://github.com/magneticio/vamp/releases))
* You can [try out Vamp](/documentation/installation/hello-world) with our single container hello world package.
{{< /note >}}
