---
date: 2017-02-07T12:00:00+00:00
title: DC/OS
menu:
  main:
    identifier: "dcos-v094"
    parent: "Installation"
    weight: 30
---

{{< note title="The information on this page applies to Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/installation/dcos).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

There are different ways to install Vamp on DC.OS. On this page we start out with the most common setup, but if you are interested in doing a custom install or working with public and private nodes you should jump to that section.

* [Universe package](/documentation/installation/v0.9.4/dcos/#universe-package)
* [Manual install](/documentation/installation/v0.9.4/dcos/#manual-install)
* [Custom install](/documentation/installation/v0.9.4/dcos/#custom-install)
* [Public and private nodes](/documentation/installation/v0.9.4/dcos/#public-and-private-nodes)


## Universe package

Vamp is available in the DC/OS Universe. Navigate to Universe in the DC/OS UI and search for Vamp and click "Install Package".

For detailed steps on installing the Unvierse package refer to the tutorial here: https://github.com/dcos/examples/tree/master/vamp

## Manual install
This setup will run Vamp, Mesos and Marathon, together with Zookeeper and Elasticsearch on DC/OS.

**Tested against**
This guide has been tested on the 1.8 and 1.9 version of DC/OS.

**Requirements**
Before you start you need to have a DC/OS cluster up and running, as well as the its CLI configured to use it. We assume you have it up and running on http://dcos.example.com/.
Setting up DC/OS is outside the scope of this document, for that you need to refer to the official documentation:

* https://dcos.io/docs/1.8/administration/installing/
* https://dcos.io/docs/1.8/usage/cli/

### Step 1: Install Elasticsearch

Mesos, Marathon and ZooKeeper are all installed by DC/OS. In addition to these, Vamp requires Elasticsearch for metrics collection and aggregation. If you don't have an Elasticsearch cluster setup already you can use the magneticio Docker images to deploy a compatible Vamp Elastic Stack [(hub.docker.com - magneticio elastic)](https://hub.docker.com/r/magneticio/elastic/)

Create `elasticsearch.json` with the following content:

```json
{
  "id": "elasticsearch",
  "instances": 1,
  "cpus": 0.2,
  "mem": 1024.0,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/elastic:2.2",
      "network": "HOST",
      "forcePullImage": true
    }
  },
  "healthChecks": [
    {
      "protocol": "TCP",
      "gracePeriodSeconds": 30,
      "intervalSeconds": 10,
      "timeoutSeconds": 5,
      "port": 9200,
      "maxConsecutiveFailures": 0
    }
  ]
}
```

This will run the container with 1G of RAM and a basic health check on the elasticsearch port.

Using the CLI we can install this in our cluster:

```bash
$ dcos marathon app add elasticsearch.json
```

If you get no error message you should now be able to see it being deployed:

```bash
$ dcos marathon app list
ID              MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
/elasticsearch  1024  0.2    0/1    0/0      scale       DOCKER   None
```

Once it's fully up and running you should see all tasks and health checks being up:

```bash
$ dcos marathon app list
ID              MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
/elasticsearch  1024  0.2    1/1    1/1       ---        DOCKER   None
```


### Step 2: Deploy Vamp

Once you have elasticsearch up and running it's time to move on to Vamp. The Vamp UI includes mixpanel integration. We monitor data on Vamp usage solely to inform our ongoing product development. Feel free to block this at your firewall, or [contact us](/contact) if you’d like further details.

Create `vamp.json` with the following content:

```json
{
  "id": "vamp/vamp",
  "instances": 1,
  "cpus": 0.5,
  "mem": 1024,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/vamp:0.9.4-dcos",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 0,
          "name": "vip0",
          "labels": {
            "VIP_0": "10.20.0.100:8080"
          }
        }
      ],
      "forcePullImage": true
    }
  },
  "labels": {
    "DCOS_SERVICE_NAME": "vamp",
    "DCOS_SERVICE_SCHEME": "http",
    "DCOS_SERVICE_PORT_INDEX": "0"
  },
  "env": {
    "VAMP_WAIT_FOR": "http://elasticsearch.marathon.mesos:9200/.kibana",
    "VAMP_WORKFLOW_DRIVER_VAMP_URL": "http://10.20.0.100:8080",
    "VAMP_ELASTICSEARCH_URL": "http://elasticsearch.marathon.mesos:9200"
  },
  "healthChecks": [
    {
      "protocol": "TCP",
      "gracePeriodSeconds": 30,
      "intervalSeconds": 10,
      "timeoutSeconds": 5,
      "portIndex": 0,
      "maxConsecutiveFailures": 0
    }
  ]
}
```

This service definition will download our Vamp container and spin it up in your DC/OS cluster on a private node in bridge networking mode. It will also configure the apporiate labels for the AdminRouter to expose the UI through DC/OS, as well as an internal VIP for other applications to talk to Vamp, adjusting some defaults to work inside DC/OS, and finally a health check for monitoring.

Deploy it with the CLI, like with did with elasticsearch:

```bash
$ dcos marathon app add vamp.json

$ dcos marathon app list
ID              MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
/elasticsearch  1024  0.2    1/1    1/1       ---        DOCKER   None
/vamp/vamp      1024  0.5    0/1    0/0      scale       DOCKER   None

```

It will take a minute for Vamp to deploy all its components, you can see that by looking in the "tasks" column, where Vamp is listed as 0/1. Run the list command again and you should see all the components coming online:

```bash
$ dcos marathon app list
ID                        MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
/elasticsearch            1024  0.2    1/1    1/1       ---        DOCKER   None
/vamp/vamp                1024  0.5    1/1    1/1       ---        DOCKER   None
/vamp/vamp-gateway-agent  256   0.2    3/3    ---       ---        DOCKER   None
/vamp/workflow-health      64   0.1    1/1    ---       ---        DOCKER   None
/vamp/workflow-kibana      64   0.1    1/1    ---       ---        DOCKER   None
/vamp/workflow-metrics     64   0.1    1/1    ---       ---        DOCKER   None
/vamp/workflow-vga         64   0.1    1/1    ---       ---        DOCKER   None
```

Vamp has now spun up all it's components and you should be able to access the ui by opening http://dcos.example.com/service/vamp/ in your browser.

* Now you're ready to follow our [Vamp getting started tutorials](/documentation/tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

> NB If you need help you can also find us on [Gitter] (https://gitter.im/magneticio/vamp)

## Custom install

The Vamp DC/OS Docker image ([github.com/magneticio - Vamp DC/OS](https://github.com/magneticio/vamp-docker-images/tree/master/vamp-dcos)) contains configuration ([github.com/magneticio - Vamp DC/OS configuration](https://github.com/magneticio/vamp-docker-images/blob/master/vamp-dcos/application.conf)) that can be overridden for specific needs by:

* Making a new Docker image based on the Vamp DC/OS image
* Using [environment variables](/documentation/configure/v0.9.4/configure-vamp#environment-variable-configuration)

#### Example 1 - Remove the `metrics` and `health` workflows by Vamp configuration and keep the `kibana` workflow:

```yaml
vamp.lifter.artifact.resources = [
    "breeds/kibana.js", "workflows/kibana.yml"
  ]
```

or doing the same using Marathon JSON

```json
"env": {
  "VAMP_LIFTER_ARTIFACT_RESOURCES": "[\"breeds/kibana.js\",\"workflows/kibana.yml\"]"
}
```

#### Example 2 - Avoid automatic deployment of Vamp Gateway Agent

Remove `vga-marathon` breed and workflow from `vamp.lifter.artifact.files`:

```yaml
vamp.lifter.artifact.files = []
```

or using Marathon JSON

```json
"env": {
  "VAMP_LIFTER_ARTIFACT_FILES": "[]"
}
```

## Public and private nodes

Running Vamp on public Mesos agent node(s) and disabling automatic Vamp Gateway Agent deployments (but keeping other default workflows) can be done with the following Marathon JSON:

```json
{
  "id": "vamp/vamp",
  "instances": 1,
  "cpus": 0.5,
  "mem": 1024,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/vamp:0.9.4-dcos",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 0,
          "name": "vip0",
          "labels": {
            "VIP_0": "10.20.0.100:8080"
          }
        }
      ],
      "forcePullImage": true
    }
  },
  "labels": {
    "DCOS_SERVICE_NAME": "vamp",
    "DCOS_SERVICE_SCHEME": "http",
    "DCOS_SERVICE_PORT_INDEX": "0"
  },
  "env": {
    "VAMP_LIFTER_ARTIFACT_FILES": "[\"breeds/health.js\",\"workflows/health.yml\",\"breeds/metrics.js\",\"workflows/metrics.yml\",\"breeds/kibana.js\",\"workflows/kibana.yml\"]",
    "VAMP_WAIT_FOR": "http://elasticsearch.marathon.mesos:9200/.kibana",
    "VAMP_WORKFLOW_DRIVER_VAMP_URL": "http://10.20.0.100:8080",
    "VAMP_ELASTICSEARCH_URL": "http://elasticsearch.marathon.mesos:9200"
  },
  "acceptedResourceRoles": [
    "slave_public"
  ],
  "healthChecks": [
    {
      "protocol": "TCP",
      "gracePeriodSeconds": 30,
      "intervalSeconds": 10,
      "timeoutSeconds": 5,
      "portIndex": 0,
      "maxConsecutiveFailures": 0
    }
  ]
}
```

Deploying Vamp Gateway Agent on all public and private Mesos agent nodes through Marathon JSON - NB replace `$INSTANCES` (e.g. to be the same as total number of Mesos agent nodes) and optionally other parameters:

```json
{
  "id": "vamp/vamp-gateway-agent",
  "instances": $INSTANCES,
  "cpus": 0.2,
  "mem": 256.0,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/vamp-gateway-agent:0.9.4",
      "network": "HOST",
      "privileged": true,
      "forcePullImage": true
    }
  },
  "env": {
    "VAMP_KEY_VALUE_STORE_TYPE": "zookeeper",
    "VAMP_KEY_VALUE_STORE_CONNECTION": "zk-1.zk:2181",
    "VAMP_KEY_VALUE_STORE_PATH": "/vamp/vamp/gateways/haproxy/1.7/configuration",
    "VAMP_ELASTICSEARCH_URL": "http://elasticsearch.marathon.mesos:9200"
  },
  "constraints": [
    ["hostname","UNIQUE"]
  ],
  "healthChecks": [
    {
      "path": "/health",
      "protocol": "HTTP",
      "port": 1988,
      "gracePeriodSeconds": 30,
      "intervalSeconds": 10,
      "timeoutSeconds": 5,
      "maxConsecutiveFailures": 3
    }
  ],
  "acceptedResourceRoles": [
    "slave_public",
    "*"
  ]
}
```

{{< note title="What next?" >}}

* Once you have Vamp up and running you can follow our [getting started tutorials](/documentation/tutorials/).
* Chcek the [Vamp documentation](/documentation/how-vamp-works/architecture-and-components/)
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
{{< /note >}}
