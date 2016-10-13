---
date: 2016-09-13T09:00:00+00:00
title: Configure Elastic Stack
---



## Configure Logstash
In general, for each HTTP/TCP request to HAProxy, several log messages are created (e.g. for gateway, service and instance level).
Using one of the simplest Logstash configurations should be sufficient for dozens of requests per second - or even more.
This also depends on whether ELK is used for custom application/service logs etc.

You can transform logs to plain JSON, which can be parsed easily later on (e.g. for Kibana visualization), with this Logstash configuration together with the default `vamp.gateway-driver.haproxy` log format ([github.com/magneticio - logstash.conf](https://github.com/magneticio/vamp-docker/blob/master/clique-base/logstash/logstash.conf)).

{{< tip title="Examples" >}}

* Different Logstash/Elasticsearch setups: ([elastic.co - Deploying and Scaling Logstash](https://www.elastic.co/guide/en/logstash/current/deploying-and-scaling.html)).
* Logstash command line parameter ([/github.com/magneticio - Logstash section](https://github.com/magneticio/vamp-docker/blob/master/quick-start/supervisord.conf)).
{{< /tip >}}

## Configure Vamp for 


{{< note title="What next?" >}}
* [Configure Vamp](/documentation/installation/configure-vamp)
* [Set container driver](/documentation/installation/set-container-driver)
* Follow the [getting started tutorials](/documentation/tutorials)
{{< /note >}}



