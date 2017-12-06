---
date: 2016-09-13T09:00:00+00:00
title: Rancher
menu:
  main:
    identifier: "rancher-v092"
    parent: "Installation"
    weight: 60
aliases:
    - /documentation/installation/rancher
---

This installation will run Vamp together with Consul, Elasticsearch and Logstash on Rancher. (We'll also deploy our demo Sava application to give you something to play around on). Before you begin, it is advisable to try out the official Rancher Quick Start Guide tutorial first ([rancher.com - quick start guide](http://docs.rancher.com/rancher/latest/en/quick-start-guide/)).

{{< note title="Note!" >}}
Rancher support is still in Alpha.
{{< /note >}}

#### Tested against
This guide has been tested on Rancher version 1.1.x.

#### Requirements

* Rancher up and running
* Key-value store like ZooKeeper, Consul or etcd
* Elasticsearch and Logstash
* If you want to make a setup on your local VM based Docker, it's advisable to increase default VM memory size from 1GB to 4GB.

## Run Rancher locally
Based on the official Rancher quickstart tutorial, these are a few simple steps to run Rancher locally:
```bash
$ docker run -d --restart=always -p 8080:8080 rancher/server
```
The Rancher UI is exposed on port 8080, so go to http://SERVER_IP:8080 - for instance [http://192.168.99.100:8080](http://192.168.99.100:8080), [http://localhost:8080](http://localhost:8080) or something similar depending on your Docker setup.

Follow the instructions on the screen to add a new Rancher host. Click on "Add Host" and then on "Save". You should get instructions (bullet point 5) to run an `agent` Docker image:

```
$ docker run \
  -d --privileged \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /var/lib/rancher:/var/lib/rancher \
  rancher/agent:v1.0.1 \
  http://192.168.99.100:8080/v1/scripts/E78EF5848B989FD4DA77:1466265600000:SYqIvhPgzKLonp8r0erqgpsi7pQ
```


## Create a Vamp stack
Next we need to create a Vamp stack and add all dependencies (Consul, Elasticsearch, Logstash). Our custom Docker image `magneticio/elastic:2.2` contains Elasticsearch, Logstash and Kibana with the proper Logstash configuration for Vamp. More details can be found on the github project page ([github.com/magneticio - elastic](https://github.com/magneticio/elastic)).

1. Go to `Add Stack` and create a new stack `vamp` (lowercase).
2. Install Consul:
  * Use the `vamp` stack and go to `Add Service`:
    1. `Name` ⇒ `consul`
    2. `Select Image` ⇒ `gliderlabs/consul-server`
    3. Set `Command` ⇒ `-server -bootstrap`
    4. Go to the `Networking` tab
    5. Under `Hostname` select `Set a specific hostname:` and enter `consul`
    6. Click the `Create` button

3. Install Elasticsearch and Logstash:
  * Use the `vamp` stack and go to `Add Service`:
    1. `Name` ⇒ `elastic`
    2. `Select Image` ⇒ `magneticio/elastic:2.2`
    3. Go to the `Networking` tab
    4. Under `Hostname` select `Set a specific hostname:` and enter `elastic`
    6. Click `Create`

## Run Vamp

First we'll run the Vamp Gateway Agent:

* Use the `vamp` stack and go to `Add Service`:
* Set scale to `Always run one instance of this container on every host`
* `Name` ⇒ `vamp-gateway-agent`
* `Select Image` ⇒ `magneticio/vamp-gateway-agent:0.9.2`
* Set `Command` ⇒ `--storeType=consul --storeConnection=consul:8500 --storeKey=/vamp/gateways/haproxy/1.6 --logstash=elastic:10001`
* Go to `Networking` tab
* Under `Hostname` select `Set a specific hostname:` and enter `vamp-gateway-agent`
* Click `Create`

Now let's find a Rancher API endpoint that can be accessed from running container:

* Go to the `API` page and find the endpoint, e.g. `http://192.168.99.100:8080/v1/projects/1a5`
* Go to the `Infrastructure`/`Containers` and find the IP address of `rancher/server`, e.g. `172.17.0.2`
* The Rancher API endpoint should be then `http://IP_ADDRESS:PORT/PATH` based on values we have, e.g. `http://172.17.0.2:8080/v1/projects/1a5`

Now we can deploy Vamp:

* Use the `vamp` stack and go to `Add Service`:
* `Name` ⇒ `vamp`
* `Select Image` ⇒ `magneticio/vamp:0.9.2-rancher`
* Go to `Add environment variable` VAMP_CONTAINER_DRIVER_RANCHER_URL with value of Rancher API endpoint, e.g. `http://172.17.0.2:8080/v1/projects/1a5`
* (optional) add a `VAMP_CONTAINER_DRIVER_RANCHER_USER` variable with a [Rancher API access key](https://docs.rancher.com/rancher/v1.2/zh/api/api-keys/#environment-api-keys) if your Rancher installation has access control enabled
* (optional) add a `VAMP_CONTAINER_DRIVER_RANCHER_PASSWORD` variable with a matching Rancher API secret key.
* Go to `Networking` tab
* Under `Hostname` select `Set a specific hostname:` and enter `vamp`
* Click `Create`
* Go to `Add Load Balancer` (click arrow next to `Add Service` button label)
* Choose a name (e.g. `vamp-lb`)
* `Source IP/Port` ⇒ 9090
* `Default Target Port` ⇒ 8080 and `Target Service` ⇒ `vamp`

If you go to http://SERVER_IP:9090 (e.g [http://192.168.99.100:9090](http://192.168.99.100:9090)), you should get the Vamp UI.  You should also notice that Vamp Gateway Agent is running (one instance on each node) and you can see some [Vamp workflows](/documentation/using-vamp/workflows/) running.
The Vamp UI includes mixpanel integration. We monitor data on Vamp usage solely to inform our ongoing product development. Feel free to block this at your firewall, or [contact us](/contact) if you’d like further details.


To access HAProxy stats, go to `Add Load Balancer` (click the arrow next to `Add Service`). Choose a name (e.g. `vamp-gateway-agent-lb`) and set:

* `Source IP/Port` ⇒ 1988
* `Default Target Port` ⇒ 1988
* `Target Service` ⇒ `vamp-gateway-agent`

You can access the HAProxy stats page with username/password `haproxy`.

## Deploy the Sava demo application

Let's deploy our `sava` demo application:

```yaml
---
name: sava:1.0
gateways:
  9050: sava/port
clusters:
  sava:
    services:
      breed:
        name: sava:1.0.0
        deployable: magneticio/sava:1.0.0
        ports:
          port: 8080/http
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
```

If you want the gateway port to be exposed outside of the cluster via a Rancher Load Balancer:

1. Go to `Add Load Balancer` (click arrow next to `Add Service`)
2. Choose name (e.g. `gateway-9050`),
  * `Source IP/Port` ⇒ 9050
  * `Default Target Port` ⇒ 9050
  * `Target Service` ⇒ `vamp-gateway-agent`


{{< note title="What next?" >}}

* Once you have Vamp up and running you can jump into the [getting started tutorials](/documentation/tutorials/)
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
