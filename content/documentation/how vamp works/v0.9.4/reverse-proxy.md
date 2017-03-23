---
title: Reverse proxy
aliases: 
    - /documentation/how-vamp-works/reverse-proxy
menu:
  main:
    identifier: "hvw-reverse-proxy-v094"
    parent: "How Vamp works"
    weight: 45
---

Vamp can function as a reverse proxy to access elements inside the cluster and not visible outside the cluster. This is useful as it allows direct access to e.g. Mesos logs from within the Vamp UI and enables workflows to access details Vamp may be unaware of.

Reverse proxy access is available through the Vamp API (HTTP & WebSocket) at the following endpoints:

* **Specific host and port:** `/proxy/host/{host}/port/{port}/`
* **Gateway:** `/proxy/gateways/{name}/`
* **Specific deployment instance:** `/proxy/deployments/{name}/clusters/{name}/service/{name}/instances/{name}/ports/{name}`
* **Specific workflow instance:** `/proxy/workflows/{name}/instances/{name}/ports/{name}`

### Example - access sava 9050 gateway via Vamp reverse proxy
```
http://localhost:8080/proxy/gateways/sava%2F9050/
```

{{< note title="What next?" >}}
* Read about how Vamp works with [routing and load balancing](/documentation/how-vamp-works/v0.9.4/routing-and-load-balancing)
{{< /note >}}