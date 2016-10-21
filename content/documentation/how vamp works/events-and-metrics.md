---
date: 2016-10-21T09:00:00+00:00
title: Events and metrics
---
HAProxy (VGA) generates logs and makes them accessible via open socket - check the HAProxy configuration of `log` ([github.com/magneticio - haproxy.cfg](https://github.com/magneticio/vamp-gateway-agent/blob/master/haproxy.basic.cfg)).

VGA listens on log socket and any new messages are forwarded to the Logstash instance.
Log format is configurable in Vamp configuration vamp.gateway-driver.haproxy ([github.com/magneticio - reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)).

* For an effective feedback loop, HTTP/TCP logs should be collected, stored and analyzed
* Collection and storing is done by a combination of HAProxy, VGA and Logstash setup
* Logs can be stored in Elasticsearch and later analysed and visualised by Kibana

## Logstash

{{< note title="Note!" >}}
* Logstash is listening on UDP port, but in principle any other listener can receive logs forwarded by VGA.
* Different VGAs can use different Logstash instances.
{{< /note >}}

In general, for each HTTP/TCP request to HAProxy, several log messages are created (e.g. for gateway, service and instance level).
Using one of the simplest Logstash configurations should be sufficient for dozens of requests per second - or even more.
This also depends on whether ELK is used for custom application/service logs etc.

You can transform logs to plain JSON, which can be parsed easily later on (e.g. for Kibana visualization), with this Logstash configuration together with the default `vamp.gateway-driver.haproxy` log format ([github.com/magneticio - logstash.conf](https://github.com/magneticio/vamp-docker/blob/master/clique-base/logstash/logstash.conf)).

{{< tip title="Examples" >}}

* Different Logstash/Elasticsearch setups: ([elastic.co - Deploying and Scaling Logstash](https://www.elastic.co/guide/en/logstash/current/deploying-and-scaling.html)).
* Logstash command line parameter ([/github.com/magneticio - Logstash section](https://github.com/magneticio/vamp-docker/blob/master/quick-start/supervisord.conf)).
{{< /tip >}}

## Kibana

  Vamp can be configured to create Kibana `searches`, `visualisations` and `dashboards` automatically with the `vamp.gateway-driver.kibana.enabled` configuration parameter.
  Vamp will do this by inserting ES documents to the Kibana index, so only the URL to access ES is needed (by default reusing the same as for persistence).  

{{< note title="What next?" >}}
* Let's [install Vamp](/documentation/installation/) 
{{< /note >}}
