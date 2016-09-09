---
date: 2016-03-09T19:56:50+01:00
title: Quick setup with Rancher
---

## Overview

>**Note**: Rancher support is still in Alpha.

This quick setup will run Vamp together with Consul, Elasticsearch and Logstash on Rancher.  
(We'll also deploy our demo Sava application to give you something to play around on).


### Quick setup steps:

1. Run Rancher locally
2. Install Elasticsearch, Consul and Logstash
3. Run Vamp
4. Deploy the Sava demo application

### Prerequisistes

* Rancher up and running
* Key-value store like ZooKeeper, Consul or etcd
* Elasticsearch and Logstash

>**Note** If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)

## In depth

### Before we begin...
It is advisable to try out [the official Rancher Quick Start Guide](http://docs.rancher.com/rancher/latest/en/quick-start-guide/) tutorial first.  

>**Note**: If you want to make a setup on your local VM based Docker, it's advisable to increase default VM memory size from 1GB to 4GB.

### Step 1: Run Rancher locally
Based on the official Rancher quickstart tutorial, these are a few simple steps to run Rancher locally:
```bash
$ docker run -d --restart=always -p 8080:8080 rancher/server
```
The Rancher UI is exposed on port 8080, so go to http://SERVER_IP:8080 - for instance [http://192.168.99.100:8080](http://192.168.99.100:8080), [http://localhost:8080](http://localhost:8080) or something similar depending on your Docker setup.
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

Go to `Add Stack` and create a new stack `vamp` (lowercase).   

### Step 2: Install Consul, Elasticsearch and Logstash
We can now install the other dependencies.

#### Consul

Use your newly created `vamp` stack and go to `Add Service`:

1. `Name` ⇒ `consul`
2. `Select Image` ⇒ `gliderlabs/consul-server`
3. Set `Command` ⇒ `-server -bootstrap`
4. Go to `Networking` tab
5. Under `Hostname` select `Set a specific hostname:` and enter `consul`
6. Click the `Create` button

#### Elasticsearch and Logstash

> Our custom Docker image `magneticio/elastic:2.2` contains Elasticsearch, Logstash and Kibana with the proper Logstash configuration for Vamp. More details can be found on the [project page](https://github.com/magneticio/elastic).

Use the `vamp` stack and go to `Add Service`:

1. `Name` ⇒ `elastic`
2. `Select Image` ⇒ `magneticio/elastic:2.2`
3. Go to `Networking` tab
4. Under `Hostname` select `Set a specific hostname:` and enter `elastic`
5. Click on `Create` button

### Step 3: Run Vamp

First we'll run the Vamp Gateway Agent: 

Use the `vamp` stack and go to `Add Service`:

1. Set scale to `Always run one instance of this container on every host`
2. `Name` ⇒ `vamp-gateway-agent`
3. `Select Image` ⇒ `magneticio/vamp-gateway-agent:0.9.0`
4. Set `Command` ⇒ `--storeType=consul --storeConnection=consul:8500 --storeKey=/vamp/haproxy/1.6 --logstash=elastic:10001`
5. Go to `Networking` tab
6. Under `Hostname` select `Set a specific hostname:` and enter `vamp-gateway-agent`
7. Click on `Create` button

Now let's find a Rancher API endpoint that can be accessed from running container:

1. Go to the `API` page and find the endpoint, e.g. `http://192.168.99.100:8080/v1/projects/1a5`
2. Go to the `Infrastructure`/`Containers` and find the IP address of `rancher/server`, e.g. `172.17.0.2`
3. The Rancher API endpoint should be then `http://IP_ADDRESS:PORT/PATH` based on values we have, e.g. `http://172.17.0.2:8080/v1/projects/1a5`

Now we can deploy Vamp:

Use the `vamp` stack and go to `Add Service`:

1. `Name` ⇒ `vamp`
2. `Select Image` ⇒ `magneticio/vamp:0.9.0-rancher`
3. Go to `Add environment variable` VAMP_CONTAINER_DRIVER_RANCHER_URL with value of Rancher API endpoint, e.g. `http://172.17.0.2:8080/v1/projects/1a5`
4. Go to `Networking` tab
5. Under `Hostname` select `Set a specific hostname:` and enter `vamp`
6. Click the `Create` button
7. Go to `Add Load Balancer` (click arrow next to `Add Service` button label)
8. Choose a name (e.g. `vamp-lb`), `Source IP/Port` ⇒ 9090, `Default Target Port` ⇒ 8080 and `Target Service` ⇒ `vamp`

If you go to http://SERVER_IP:9090 (e.g [http://192.168.99.100:9090](http://192.168.99.100:9090)), you should get the Vamp UI.  
You should also notice that Vamp Gateway Agent is running (one instance on each node) and additional Vamp workflows.

To access HAProxy stats:

1. Go to `Add Load Balancer` (click arrow next to `Add Service`)
2. Choose aname (e.g. `vamp-gateway-agent-lb`), `Source IP/Port` ⇒ 1988, `Default Target Port` ⇒ 1988 and `Target Service` ⇒ `vamp-gateway-agent`
3. Use the following username/password: `haproxy` for the HAProxy stats page

### Step 4: Deploy the Sava demo application

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

If you want to the gateway port to be exposed outside of the cluster via Rancher Load Balancer:

1. Go to `Add Load Balancer` (click arrow next to `Add Service`)
2. Choose name (e.g. `gateway-9050`), `Source IP/Port` ⇒ 9050, `Default Target Port` ⇒ 9050 and `Target Service` ⇒ `vamp-gateway-agent`
 

## What next?

* Now you're all set to follow our [Vamp Sava tutorials](/try-vamp/sava-tutorials/) (you can start with tutorial 2 - run a canary release as we already deployed the Sava demo application).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

>**Note** If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)