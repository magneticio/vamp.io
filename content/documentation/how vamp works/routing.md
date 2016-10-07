---
date: 2016-09-13T09:00:00+00:00
title: Routing and load balancing
---

## Vamp Gateway Agent (VGA) and HAProxy

All communication between Vamp and the VGA instances is done by managing specific KV in the store. 
When Vamp needs to update the HAProxy configuration (e.g. when a new service has been deployed) Vamp will generate the new configuration and store it in the KV store.
The VGA's read specific value and reload HAProxy instances. 

Since VGA (and HAProxy) is a single point of failure (proxy to all traffic), it is recommended for high availability to have more than one VGA instance.
VGA instances can be added or removed any time. Once VGA starts running it will pick up the HAProxy configuration from the configured KV store and reload the HAProxy instance.
This also means that Vamp (not VGA) can be restarted, stopped etc. without main consequences on running services. There would be no HAProxy configuration update, but, once Vamp is up, it will sync the HAProxy configuration (e.g. if Marathon restarted some service, so hosts/ports are changed).  

{{< note title="Note!">}}
* There should be one dedicated HAProxy for each VGA. 
* Vamp also supports custom HAProxy configuration - base configuration should be used as a template and HAProxy frontends and backends are appended by VGA.
* To correctly set up Vamp with single/multiple VGA instances, check out [Vamp gateway driver configuration](/documentation/installation/configure-vamp#gateway-driver).
{{< /note >}}