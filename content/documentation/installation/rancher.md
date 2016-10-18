---
title: Quick start Rancher
type: documentation
weight: 95
menu:
    main:
      parent: installation
---

# Vamp with Rancher

>**Note**: Rancher support is still in Alpha.

## Prerequisites

- Rancher up and running
- Key-value store like ZooKeeper, Consul or etcd
- Elasticsearch and Logstash

>**Note**: If you want to make a setup on your local VM based Docker, it's advisable to increase default VM memory size from 1GB to 4GB.

Good starting point with using Rancher would be to try out at least the official [Quick Start Guide](http://docs.rancher.com/rancher/latest/en/quick-start-guide/) tutorial first.
Based on the tutorial these are few simple steps to run Rancher locally:
```bash
$ docker run -d --restart=always -p 8080:8080 rancher/server
```
Rancher UI is exposed on port 8080, so go to http://SERVER_IP:8080 - for instance [http://192.168.99.100:8080](http://192.168.99.100:8080), [http://localhost:8080](http://localhost:8080) or something similar depending on your Docker setup.
Now follow instruction on the screen and add new Rancher host - click on "Add Host" and then on "Save".
You should get instructions (bullet point 5) to run an `agent` Docker image:
```bash
$ docker run \
  -d --privileged \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /var/lib/rancher:/var/lib/rancher \
  rancher/agent:v1.0.1 \
  http://192.168.99.100:8080/v1/scripts/E78EF5848B989FD4DA77:1466265600000:SYqIvhPgzKLonp8r0erqgpsi7pQ
```
## Run Vamp stack from catalog

Go to `Catalog` and find the `Vamp` entry, click the `Details` button.

- Choose a version
- Change the stack name and/or description if you want
- Enter the port you want to access the Vamp UI on
- Enter the Rancher API endpoint
- Click `Launch` to start the stack
- Head over to the `Deploy Application` section on this page! 

## Run Vamp stack from scratch

Go to `Add Stack` and create a new stack `vamp` (lowercase). Let's now install other dependencies.

### Consul

Use `vamp` stack and go to `Add Service`:

- `Name` ⇒ `consul`
- `Select Image` ⇒ `gliderlabs/consul-server`
- set `Command` ⇒ `-server -bootstrap`
- go to `Networking` tab
- under `Hostname` select `Set a specific hostname:` and enter `consul`
- click on `Create` button

### Elasticsearch and Logstash

Use `vamp` stack and go to `Add Service`:

- `Name` ⇒ `elastic`
- `Select Image` ⇒ `magneticio/elastic:2.2`
- go to `Networking` tab
- under `Hostname` select `Set a specific hostname:` and enter `elastic`
- click on `Create` button

Docker image `magneticio/elastic:2.2` contains Elasticsearch, Logstash and Kibana with proper Logstash configuration.
More details can be found on the [project page](https://github.com/magneticio/elastic).

## Running Vamp

Let's first run Vamp Gateway Agent. Use `vamp` stack and go to `Add Service`:

- set scale to `Always run one instance of this container on every host`
- `Name` ⇒ `vamp-gateway-agent`
- `Select Image` ⇒ `magneticio/vamp-gateway-agent:0.9.0`
- set `Command` ⇒ `--storeType=consul --storeConnection=consul:8500 --storeKey=/vamp/haproxy/1.6 --logstash=elastic:10001`
- go to `Networking` tab
- under `Hostname` select `Set a specific hostname:` and enter `vamp-gateway-agent`
- click on `Create` button

Now let's find a Rancher API endpoint that can be accessed from running container.

- go to `API` page and find the endpoint, e.g. `http://192.168.99.100:8080/v1/projects/1a5`
- go to `Infrastructure`/`Containers` and find the IP address of `rancher/server`, e.g. `172.17.0.2`
- Rancher API endpoint should be then `http://IP_ADDRESS:PORT/PATH` based on values we have, e.g. `http://172.17.0.2:8080/v1/projects/1a5`

Now let's deploy Vamp. Use `vamp` stack and go to `Add Service`:

- `Name` ⇒ `vamp`
- `Select Image` ⇒ `magneticio/vamp:0.9.0-rancher`
- go to `Add environment variable` VAMP_CONTAINER_DRIVER_RANCHER_URL with value of Rancher API endpoint, e.g. `http://172.17.0.2:8080/v1/projects/1a5`
- go to `Networking` tab
- under `Hostname` select `Set a specific hostname:` and enter `vamp`
- click on `Create` button
- go to `Add Load Balancer` (click arrow next to `Add Service` button label)
- choose name (e.g. `vamp-lb`), `Source IP/Port` ⇒ 9090, `Default Target Port` ⇒ 8080 and `Target Service` ⇒ `vamp`

If you go now to http://SERVER_IP:9090 (e.g [http://192.168.99.100:9090](http://192.168.99.100:9090)), you should get Vamp UI.
You should also notice that Vamp Gateway Agent is running (one instance on each node) and additional Vamp workflows.

If you want to access HAProxy stats:

- go to `Add Load Balancer` (click arrow next to `Add Service`)
- choose name (e.g. `vamp-gateway-agent-lb`), `Source IP/Port` ⇒ 1988, `Default Target Port` ⇒ 1988 and `Target Service` ⇒ `vamp-gateway-agent`
- for HAProxy stats page use the following username/password: `haproxy`

## Deploy application

Let's deploy our `sava` demo application:
{{% copyable %}}
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
{{% /copyable %}}

If you want to get gateway port exposed outside of the cluster via Rancher Load Balancer:

- go to `Add Load Balancer` (click arrow next to `Add Service`)
- choose name (e.g. `gateway-9050`), `Source IP/Port` ⇒ 9050, `Default Target Port` ⇒ 9050 and `Target Service` ⇒ `vamp-gateway-agent`
