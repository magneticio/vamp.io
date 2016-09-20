---
date: 2016-09-13T09:00:00+00:00
title: DC/OS quick setup
---

{{< warning title="Warning!" >}}
Quick setups are designed for demo purposes only - they are not production grade setups!
{{< /warning >}}

## Overview 

This quick setup will run Vamp, Mesos and Marathon, together with Zookeeper, Elasticsearch and Logstash on DC/OS. (We'll also give you some additional information for creating a custom Vamp setup).

{{< note title="Note!" >}}
In this guide we will be using DC/OS as our container-manager ([dcos.io](http://dcos.io)), but this guide will also work with Mesos and Marathon.
{{< /note >}}

#### Quick setup steps:

1. Install Elasticsearch + Logstash
2. Deploy Vamp
3. Extra info: Create a custom Vamp setup

#### Prerequisistes:

*  Running DC/OS cluster (1.7)


If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)

## In depth

### Step 1: Install Elasticsearch and Logstash

Mesos, Marathon and ZooKeeper are all installed by DC/OS. In addition to these, Vamp requires Elasticsearch and Logstash for metrics collection and aggregation.
You could install Elasticsearch on DC/OS by following the [Mesos Elasticsearch documentation](http://mesos-elasticsearch.readthedocs.org/en/latest/).
However, Vamp will also need Logstash (not currently available as a DC/OS package) with a specific [Vamp Logstash configuration] (https://github.com/magneticio/vamp-docker/blob/master/clique-base/logstash/logstash.conf).  

To make life easier, we have created compatible [Docker images for a Vamp Elastic Stack](https://hub.docker.com/r/magneticio/elastic/) that you can use with the [Mesos elasticsearch documentation - How to install on Marathon](http://mesos-elasticsearch.readthedocs.org/en/latest/#how-to-install-on-marathon).
Our advice is to use our custom Elasticsearch+Logstash Docker image. Let’s go!

First, let's create `marathon.json` file with the following content:

```json
{
  "id": "elasticsearch",
  "container": {
    "docker": {
      "image": "mesos/elasticsearch-scheduler",
      "network": "HOST",
      "forcePullImage": true
    }
  },
  "args": [
    "--zookeeperMesosUrl", "zk://zk-1.zk:2181/mesos",
    "--elasticsearchDockerImage", "magneticio/elastic:2.2",
    "--elasticsearchRam", "1024",
    "--elasticsearchPorts", "9200,9300"
  ],
  "cpus": 0.2,
  "mem": 512.0,
  "env": {
    "JAVA_OPTS": "-Xms128m -Xmx256m"
  },
  "instances": 1
}
```

This is quite similar to the normal Mesos Elasticsearch installation. Notice that:  

 * We use our custom Docker image `"--elasticsearchDockerImage", "magneticio/elastic:2.2"`   
 * We increased the amount of memory (by default it is 256MB).  
 * We explicitly added the default 9200 and 9300 Elasticsearch ports by adding the additional argument: `"--elasticsearchPorts", "9200,9300"`. (There are many other different arguments which can be used as well if you need them.)

Following the Mesos Elasticsearch documentation, now send `marathon.json` file to Marathon:

```
curl -k -XPOST -d @marathon.json -H "Content-Type: application/json" http://MARATHON_IP_ADDRESS:8080/v2/apps
```

### Step 2: Deploy Vamp

{{< tip>}}
Vamp is available as DC/OS Universe package, so you could also deploy Vamp using the DC/OS web UI.
{{< /tip >}}

Create a `vamp.json` file with the content:

```json
{
  "id": "vamp/vamp",
  "instances": 1,
  "cpus": 0.5,
  "mem": 1024,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/vamp:0.9.0-dcos",
      "network": "HOST",
      "forcePullImage": true
    }
  },
  "env": {
  }
}
```


If you want to change the default Vamp DC/OS configuration, you can do it by setting [environment variables](/resources/run-vamp/vamp-configuration#environment-variable-configuration).
For example:

```json
"env": {
  "VAMP_REST_API_PORT": "9090"
}
```

Now send the request to Marathon:

```
curl -k -XPOST -d @vamp.json -H "Content-Type: application/json" http://MARATHON_IP_ADDRESS:8080/v2/apps
```

Marathon will now start deploying Vamp and, if all arguments are set correctly, you will notice that Vamp Gateway Agent will be also be deployed automatically.

Now we need to find out on what IP the public node is running, so you can access the VAMP dashboard from the outside. This IP is most often the same as where you find the Marathon dashboard. Vamp will expose its UI on port 8080 (`network: HOST`), you may set a different port (`VAMP_REST_API_PORT`) if you want.

Have fun! 


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

Rremove `vga-marathon` breed and workflow from `vamp.lifter.artifact.files`:

```yaml
vamp.lifter.artifact.files = []
```

or 

```json
"env": {
  "VAMP_LIFTER_ARTIFACT_FILES": "[]"
}
```

## What next?

* Now you're all set to follow our [Vamp Sava tutorials](/try-vamp/sava-tutorials/).
* Things still not running? [We're here to help →](https://github.com/magneticio/vamp/issues)
* Remember, this is not a production grade setup!

If you need help you can find us on [Gitter] (https://gitter.im/magneticio/vamp)