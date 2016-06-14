---
title: Virtual Hosts
weight: 120
menu:
  main:
    parent: using-vamp
    identifier: virtual-hosts
---

# Virtual Hosts

Vamp can be configured to support virtual host via HAProxy:

```
vamp.gateway-driver {
    virtual-hosts = true
    virtual-hosts-domain = "vamp"
}
```

Let's try an example: `PUT ${VAMP_URL}/api/v1/deployments/runner` with body:
{{% copyable %}}

```yaml
---
name: runner

gateways:
  9070: runner1/port
  9080: runner2/port

clusters:
  runner1:
    services:
      breed:
        name: http:1.0.0
        deployable: magneticio/sava:runner_1.0
        ports:
          port: 8081/http
        environment_variables:
          SAVA_RUNNER_ID: 1.0.0
  runner2:
    services:
      breed:
        name: http:2.0.0
        deployable: magneticio/sava:runner_1.0
        ports:
          port: 8081/http
        environment_variables:
          SAVA_RUNNER_ID: 2.0.0
```{{% /copyable %}}

Now you can request:

```bash
$ curl --resolve 9070.runner.vamp:80:${VAMP_GATEWAY_AGENT_IP} http://9070.runner.vamp
{"id":"1.0.0","runtime":"CF2136D9CA81282E","port":8081,"path":""}


$ curl --resolve 9080.runner.vamp:80:${VAMP_GATEWAY_AGENT_IP} http://9080.runner.vamp
{"id":"2.0.0","runtime":"1E188B006FF44AA6","port":8081,"path":""}
```

In case of using Vamp quick start, `${VAMP_GATEWAY_AGENT_IP}` should have value of `${DOCKER_HOST_IP}` - [docs](/documentation/installation/quick_start/#step-2-run-vamp).

Vamp creates a virtual host for each gateway - name of the gateway (`/` replaced with `.`) appended to value from `vamp.gateway-driver.virtual-hosts-domain`.
In case of above example:

- 9050.runner.vamp
- 9060.runner.vamp
- port.runner1.runner.vamp
- port.runner2.runner.vamp
