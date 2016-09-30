---
date: 2016-09-30T12:00:00+00:00
title: DC/OS quick setup
---

{{< warning title="Beware!" >}}
Quick setups are designed for demo purposes only - they are not production grade. 
{{< /warning >}}

## Overview 

This quick setup will run Vamp, Mesos and Marathon, together with Zookeeper, Elasticsearch and Logstash on DC/OS. If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)

#### Prerequisistes

Before you start you need to have a DC/OS cluster up and running, as well as the DC/OS CLI configured to use it. We assume you have it up and running on http://dcos.example.com/.
Setting up DC/OS is outside the scope of this document, for that you need to refer to the official DC/OS documentation:

* https://dcos.io/docs/latest/administration/installing/
* https://dcos.io/docs/latest/usage/cli/

#### In this quick setup we will:

1. Install Elasticsearch + Logstash
2. Deploy Vamp
3. Get some extra info on creating a custom Vamp setup
4. DC/OS with public and private nodes and Vamp

## In depth

### Step 1: Install Elasticsearch + Logstash

Mesos, Marathon and ZooKeeper are all installed by DC/OS. In addition to these, Vamp requires Elasticsearch and Logstash for metrics collection and aggregation. 

You could install Elasticsearch on DC/OS by following the Mesos Elasticsearch documentation ([mesos-elasticsearch - Elasticsearch Mesos Framework](http://mesos-elasticsearch.readthedocs.org/en/latest/)).
However, Vamp will also need Logstash (not currently available as a DC/OS package) with a specific Vamp Logstash configuration ([github.com/magneticio - Vamp Docker logstash.conf](https://github.com/magneticio/vamp-docker/blob/master/clique-base/logstash/logstash.conf)).  

To make life easier, we have created compatible Docker images for a Vamp Elastic Stack ([hub.docker.com - magneticio elastic](https://hub.docker.com/r/magneticio/elastic/)) that you can use with the Mesos elasticsearch documentation ([mesos-elasticsearch - How to install on Marathon](http://mesos-elasticsearch.readthedocs.org/en/latest/#how-to-install-on-marathon)).
Our advice is to use our custom Elasticsearch+Logstash Docker image. Let's get started! 

Create `elasticsearch.json` with the following content:

```json
{
  "id": "elasticsearch",
  "instances": 1,
  "cpus": 0.2,
  "mem": 1024.0,
  "container": {
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

Once you have elasticsearch up and running it's time to move on to Vamp.

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
      "image": "magneticio/vamp:katana-dcos",
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
    "VAMP_PERSISTENCE_DATABASE_ELASTICSEARCH_URL": "http://elasticsearch.marathon.mesos:9200",
    "VAMP_GATEWAY_DRIVER_LOGSTASH_HOST": "elasticsearch.marathon.mesos",
    "VAMP_WORKFLOW_DRIVER_VAMP_URL": "http://10.20.0.100:8080",
    "VAMP_PULSE_ELASTICSEARCH_URL": "http://elasticsearch.marathon.mesos:9200"
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
/vamp/vamp-gateway-agent  256   0.2    3/3    ---       ---        DOCKER   ['--storeType=zookeeper', '--storeConnection=zk-1.zk:2181', '--storeKey=/vamp/haproxy/1.6', '--logstash=elasticsearch.marathon.mesos:10001']
/vamp/workflow-health      64   0.1    1/1    ---       ---        DOCKER   None
/vamp/workflow-kibana      64   0.1    1/1    ---       ---        DOCKER   None
/vamp/workflow-metrics     64   0.1    1/1    ---       ---        DOCKER   None
/vamp/workflow-vga         64   0.1    1/1    ---       ---        DOCKER   None
```

Vamp has now spun up all it's components and you should be able to access the ui by opening http://dcos.example.com/service/vamp/ in your browser. 

* Now you're ready to follow our [Vamp Sava tutorials](/try-vamp/sava-tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)

> NB If you need help you can also find us on [Gitter] (https://gitter.im/magneticio/vamp)

### Extra info: Creating a custom Vamp setup

The Vamp DC/OS Docker image ([github.com/magneticio - Vamp DC/OS](https://github.com/magneticio/vamp-docker/tree/master/vamp-dcos)) contains configuration ([github.com/magneticio - Vamp DC/OS configuration](https://github.com/magneticio/vamp-docker/blob/master/vamp-dcos/application.conf)) that can be overridden for specific needs by:

* Making a new Docker image based on the Vamp DC/OS image
* Using [environment variables](/resources/run-vamp/vamp-configuration#environment-variable-configuration)

#### Example 1 - Remove the `metrics` and `health` workflows by configuration and keep the `kibana` workflow:

```yaml
vamp.lifter.artifact.resources = [
    "breeds/kibana.js", "workflows/kibana.yml"
  ]
```

or 

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

or 

```json
"env": {
  "VAMP_LIFTER_ARTIFACT_FILES": "[]"
}
```

### DC/OS with public and private nodes and Vamp

Running Vamp on public Mesos agent node and disabling automatic Vamp Gateway Agent deployment (but keeping other default workflows):

```json
{
  "id": "vamp/vamp",
  "instances": 1,
  "cpus": 0.5,
  "mem": 1024,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/vamp:katana-dcos",
      "network": "HOST",
      "forcePullImage": true
    }
  },
  "env": {
    "VAMP_LIFTER_ARTIFACT_FILES": "[\"breeds/health.js\",\"workflows/health.yml\",\"breeds/metrics.js\",\"workflows/metrics.yml\",\"breeds/kibana.js\",\"workflows/kibana.yml\"]",
    "VAMP_WAIT_FOR": "http://elasticsearch.marathon.mesos:9200/.kibana",
    "VAMP_PERSISTENCE_DATABASE_ELASTICSEARCH_URL": "http://elasticsearch.marathon.mesos:9200",
    "VAMP_GATEWAY_DRIVER_LOGSTASH_HOST": "elasticsearch.marathon.mesos",
    "VAMP_WORKFLOW_DRIVER_VAMP_URL": "http://10.20.0.100:8080",
    "VAMP_PULSE_ELASTICSEARCH_URL": "http://elasticsearch.marathon.mesos:9200"
  },
  "acceptedResourceRoles": [
    "slave_public"
  ]
}
```

Deploying Vamp Gateway Agent - replace `$INSTANCES` (e.g. to be the same as total number of Mesos agent nodes) and optionally other parameters:

```json
{
  "id": "vamp/vamp-gateway-agent",
  "instances": $INSTANCES,
  "cpus": 0.2,
  "mem": 256.0,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/vamp-gateway-agent:katana",
      "network": "HOST",
      "privileged": true,
      "forcePullImage": true
    }
  },
  "args": [
    "--storeType=zookeeper",
    "--storeConnection=zk-1.zk:2181",
    "--storeKey=/vamp/gateways/haproxy/1.6",
    "--logstash=elasticsearch.marathon.mesos:10001"
  ],
  "constraints": [
    [
      "hostname",
      "UNIQUE"
    ]
  ],
  "acceptedResourceRoles": [
    "slave_public",
    "*"
  ]
}

```

## What next?

* Now you're all set to follow our [Vamp Sava tutorials](/try-vamp/sava-tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)
