---
title: Reverse proxy
menu:
  main:
    identifier: "uv-reverse-proxy-v094"
    parent: "Using Vamp"
    weight: 145
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/reverse-proxy).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp can function as a reverse proxy to access elements inside the cluster and not visible outside the cluster. This is useful as it allows direct access to e.g. Mesos logs from within the Vamp UI and enables workflows to access details Vamp may be unaware of.

Reverse proxy access is available through the Vamp API (HTTP & WebSocket) and used by the Vamp UI to display logs, deployment instances and gateways.

## Proxy endpoints

Reverse proxy access is available through the Vamp API (HTTP & WebSocket) and through the Vamp UI. Note that the API endpoints for reverse proxy access are structured `<vamp uri>/proxy/...` (they do not include the standard `api/v1/...`)

### Host and port  
You can access a specific host and port at the following endpoint:
```
<vamp uri>/proxy/host/{host}/port/{port}/
```
    
### Internal or external gateway
You can access an exposed gateway (internal or external) at the following endpoint:
```
<vamp uri>/proxy/gateways/{name}/
```
Example - access sava 9050 gateway via Vamp reverse proxy
An external gateway that exposes port 9050 external gateway can be accessed through Vamp reverse proxy in the following ways:  

* through the API endpoint at the URL `http://localhost:8080/proxy/gateways/sava%2F9050/`
* in the Vamp UI: 
  1. Go to the **Gateways** page
  - Click on the gateway
  - Click the **HOST - PORT/TYPE** and you will be routed according to the defined rules.


### Deployment instance
You can access a specific instance of a deployment at the following endpoint:
```
<vamp uri>/proxy/deployments/{name}/clusters/{name}/service/{name}/instances/{name}/ports/{name}
```

### Workflow instance  
You can access a specific instance of a workflow at the following endpoint:
```
<vamp uri>/proxy/workflows/{name}/instances/{name}/ports/{name}
```


{{< note title="What next?" >}}
* Read about [using Vamp for service discovery](/documentation/using-vamp/v0.9.4/service-discovery/)
* Check the [API documentation](/documentation/api/v0.9.4/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
