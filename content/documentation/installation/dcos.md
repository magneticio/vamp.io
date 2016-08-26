---
title: Quick start DC/OS
type: documentation
weight: 80
menu:
    main:
      parent: installation
---

# Vamp with DC/OS

>**Note**: In this guide we will be using [DC/OS] (http://dcos.io) as our container-manager, but this guide will also work with Mesos and Marathon.

Mesos, Marathon and ZooKeeper are all installed by DC/OS, additionally Vamp requires Elasticsearch and Logstash for its metrics collection and aggregation.
One way to install Elasticsearch on DC/OS is by following the [Mesos Elasticsearch documentation](http://mesos-elasticsearch.readthedocs.org/en/latest/).
But we also need Logstash (which is not available as a package) and give it a [specific configuration] (https://github.com/magneticio/vamp-docker/blob/master/clique-base/logstash/logstash.conf), so we created a compatible Docker [images](https://hub.docker.com/r/magneticio/elastic/) that can be used with [How to install on Marathon](http://mesos-elasticsearch.readthedocs.org/en/latest/#how-to-install-on-marathon).
Our advice is to use our custom Elasticsearch+Logstash Docker image. Let’s go!

First, let's create `marathon.json` file with the following content:
{{% copyable %}}
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
{{% /copyable %}}

This is quite similar to the normal Mesos Elasticsearch installation - notice that we use our custom Docker image `"--elasticsearchDockerImage", "magneticio/elastic:2.2"` and we also increased the amount of memory (by default it is 256MB).
We also explicitly added the default 9200 and 9300 Elasticsearch ports by adding the additional argument: `"--elasticsearchPorts", "9200,9300"`. (There are many other different arguments which can be used as well if you need them.)

Following the Mesos Elasticsearch documentation now send `marathon.json` file to Marathon:

```
curl -k -XPOST -d @marathon.json -H "Content-Type: application/json" http://MARATHON_IP_ADDRESS:8080/v2/apps
```

Ok, now we are going to deploy Vamp.

>**Note**: Vamp is available as DC/OS Universe package and you can proceed with Vamp deployment using also DC/OS web UI.

Create `vamp.json` file with content:
{{% copyable %}}
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
{{% /copyable %}}

If you want to change default Vamp DC/OS configuration, you can do it by setting [environment variables](/documentation/installation/configuration/).
For instance:

```json
"env": {
  "VAMP_REST_API_PORT": "9090"
}
```

Now send the request to Marathon:

```
curl -k -XPOST -d @vamp.json -H "Content-Type: application/json" http://MARATHON_IP_ADDRESS:8080/v2/apps
```

Marathon will now start deploying Vamp and if all arguments are set correctly you will notice that Vamp Gateway Agent will be also be deployed automatically.

Now we need to find out on what IP the public node is running, so you can access the VAMP dashboard from the outside. This IP is most often the same as where you find the Marathon dashboard. Vamp will expose its UI on port 8080 (`network: HOST`), you may set a different port (`VAMP_REST_API_PORT`) if you want.

Happy VAMP’ing! Make sure to run through our [QuickStart tutorials](http://vamp.io/documentation/guides/).

## Custom Vamp setup

Vamp DC/OS Docker [image](https://github.com/magneticio/vamp-docker/tree/master/vamp-dcos) contains [configuration](https://github.com/magneticio/vamp-docker/blob/master/vamp-dcos/application.conf) that may be overridden for specific needs:

- making a new Docker image based on Vamp DC/OS image, and/or
- using [environment variables](/documentation/installation/configuration/#environment-variable-configuration)

Examples:

1) remove `metrics` and `health` workflows by configuration and keep `kibana` workflow:

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

2) avoid automatic deployment of Vamp Gateway Agent, `vga-marathon` breed and workflow should be removed from `vamp.lifter.artifact.files`:

```yaml
vamp.lifter.artifact.files = []
```

or 

```json
"env": {
  "VAMP_LIFTER_ARTIFACT_FILES": "[]"
}
```