---
date: 2016-09-13T09:00:00+00:00
title: Virtual Hosts
menu:
  main:
    identifier: "virtual-hosts-v094"
    parent: "Using Vamp"
    weight: 180
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}} 

* Switch to the [latest version of this page](/documentation/using-vamp/virtual-hosts).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}


Vamp can be configured to support virtual host via HAProxy:

```
vamp.operation.gateway {
    virtual-hosts = true
    virtual-hosts-domain = "vamp"
}
```

#### Example - Virtual hosts
 
 `PUT ${VAMP_URL}/api/v1/deployments/runner` with body:


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
```

Now you can request:

```bash
$ curl --resolve 9070.runner.vamp:80:${VAMP_GATEWAY_AGENT_IP} http://9070.runner.vamp
{"id":"1.0.0","runtime":"CF2136D9CA81282E","port":8081,"path":""}

$ curl --resolve 9080.runner.vamp:80:${VAMP_GATEWAY_AGENT_IP} http://9080.runner.vamp
{"id":"2.0.0","runtime":"1E188B006FF44AA6","port":8081,"path":""}
```
{{< note title="Note!" >}}
If you are running Vamp in one of the quick setups, `${VAMP_GATEWAY_AGENT_IP}` should have value of `${DOCKER_HOST_IP}` - See the [hello world quick setup instructions](/documentation/installation/hello-world#step-2-run-vamp).
{{< /note >}}

Vamp creates a virtual host for each gateway - name of the gateway (`/` replaced with `.`) appended to value from `vamp.gateway-driver.virtual-hosts-domain`.
In case of above example:

- 9050.runner.vamp
- 9060.runner.vamp
- port.runner1.runner.vamp
- port.runner2.runner.vamp

Using Gateway API it is possible to get virtual hosts for each gateway, e.g.
```
GET ${VAMP_URL}/api/v1/gateways
```

## Custom virtual hosts

As you could see each gateways has `virtual_hosts` field.
Using that field it is also possible to set list of custom virtual hosts.
Let's see that in the following example:


```yaml
---
name: runner

gateways:
  9080:
    virtual_hosts: [
      "run.vamp.run"
    ]
    routes:
      runner1/port:
        weight: 50%
      runner2/port:
        weight: 50%

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
```

If you deploy this blueprint as `runner` and check gateway `9080/runner`:

```bash
GET ${VAMP_URL}/api/v1/gateways/runner/9080
```
```yaml
{
  "name": "runner/9080",
  "virtual_hosts": [
    "9080.runner.vamp",
    "run.vamp.run"
  ]
  ...
```

```bash
$ curl --resolve run.vamp.run:80:${VAMP_GATEWAY_AGENT_IP} http://run.vamp.run
{"id":"1.0.0","runtime":"C0013E858F213AE0","port":8081,"path":""}
```

`9080.runner.vamp` is added if configuration parameter `vamp.operation.gateway.virtual-hosts` is set, otherwise just custom virtual hosts if any.

{{< note title="What next?" >}}
* Check the [API documentation](/documentation/api/v0.9.4/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
