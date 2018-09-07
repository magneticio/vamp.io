---
date: 2016-09-13T09:00:00+00:00
title: Virtual Hosts
menu:
  main:
    identifier: "virtual-hosts-v100"
    parent: "Using Vamp"
    weight: 180
aliases:
    - /documentation/using-vamp/virtual-hosts/
---

Vamp can leverage the virtual hosting offered by HAproxy to support serving multiple endpoints on for example port 80
and port 443. This mostly comes in handy when you are offering public (internet) facing services where adding a port number
to a URL is not an option.

## Enabling Virtual Hosts

To enable the use of virtual hosts you need to configure the following options in the Vamp configuration.
The option `virtual-hosts-domain` functions as the TLD and can be anything you like. In our example this means we could
create virtual hosts like `myservices.mydomain.vamp`

```
vamp.operation.gateway {
    virtual-hosts = true
    virtual-hosts-domain = "vamp"
}
```

## Automatic Virtual Hosts

When Vamp is configured to allow virtual hosting, Vamp automatically creates a virtual host and binds it to port 80
for each gateway you define using the following pattern:

```
{ PORT }.{ DEPLOYMENT NAME }.{ DOMAIN }
```

{{< note title="Note!" >}}
Virtual hosts are automatically bound to port 80! You do not need supply that port anywhere in the configuration.
{{< /note >}}


Let's say we deploy the following blueprint: a deployment called `simpleservice` with a gateway defined on port `9050`.

```yaml
name: simpleservice
gateways:
9050: simpleservice/web
clusters:
simpleservice:
  services:
    breed:
      name: simpleservice:1.0.0
      deployable: magneticio/simpleservice:1.0.0
      ports:
        web: 3000/http
    scale:
      cpu: 0.2
      memory: 128MB
      instances: 1
```

After deployment, we have an external gateway called `simpleservice/9050` with a virtual host called `9050.simpleservice.vamp`.
This service is now available on port `9050` but also on port `80` when explicitly using the virtual host name in het HOST
header of the HTTP request,

i.e using HTTPie

```bash
http ${VAMP_GATEWAY_AGENT_IP} Host:9050.simpleservice.vamp
```

or using Curl

```bash
curl --resolve 9050.simpleservice.vamp:80:${VAMP_GATEWAY_AGENT_IP} http://9050.simpleservice.vamp
```

This means you could put a `CNAME` record in your DNS pointing `9050.simpleservice.vamp` to the IP of your public facing
Vamp Gateway.

{{< note title="Note!" >}}
If you are running Vamp in one of the quick setups, `${VAMP_GATEWAY_AGENT_IP}` should have value of `${DOCKER_HOST_IP}` - See the [hello world quick setup instructions](/documentation/installation/hello-world#step-2-run-vamp).
{{< /note >}}


## Custom Virtual Hosts

In addition to automatically generated virtual hosts, you can also provide your own virtual host name(s). We just need to
expand the gateway definition a bit, adding separate `routes` and `virtual_hosts` keys. Afte deployment, you can leverage
the same

```yaml
name: simpleservice
gateways:
  9050:
    routes: simpleservice/web
    virtual_hosts: ["my.simple-vhost.service", "alternative.simple-vhost.name"]
clusters:
  simpleservice:
    services:
      breed:
        name: simpleservice:1.0.0
        deployable: magneticio/simpleservice:1.0.0
        ports:
          web: 3000/http
      scale:
        cpu: 0.2
        memory: 128MB
        instances: 1
```

{{< note title="What next?" >}}
* Check the [API documentation](/documentation/api/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
