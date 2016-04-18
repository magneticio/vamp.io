---
title: Mesosphere DCOS
type: documentation
weight: 80
menu:
    main:
      parent: installation
---

# Mesosphere DCOS

Here we assume Mesosphere DCOS installation but this will work also on open source Mesos and Marathon.
A part of Mesos, Marathon and ZooKeeper provided by DCOS, Vamp requires also Elasticsearch and Logstash (Logstash is not mandatory but metrics will not be collected otherwise).
One way to install Elasticsearch on DCOS is by following [Mesos Elasticsearch documentation](http://mesos-elasticsearch.readthedocs.org/en/latest/).
Since we also need Logstash, we provide a compatible Docker [images](https://hub.docker.com/r/magneticio/elastic/) that can be used with [How to install on Marathon](http://mesos-elasticsearch.readthedocs.org/en/latest/#how-to-install-on-marathon).
Let's create `marathon.json` file with the following content:

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
    "--zookeeperMesosUrl", "zk://ZOOKEEPER_IP_ADDRESS:2181/mesos",
    "--elasticsearchDockerImage", "magneticio/elastic:2.2",
    "--elasticsearchRam", "1024"
  ],
  "cpus": 0.2,
  "mem": 512.0,
  "env": {
    "JAVA_OPTS": "-Xms128m -Xmx256m"
  },
  "instances": 1
}
```

This is quite similar to Mesos Elasticsearch installation - notice that we just use a custom image `"--elasticsearchDockerImage", "magneticio/elastic:2.2"` and we increased amount of memory (default is 256MB). 
In case you want to use default 9200 and 9300 Elasticsearch ports, then add an additional argument: `"--elasticsearchPorts", "9200,9300"`.
There are many other different arguments which can be used as well.
Following the Mesos Elasticsearch documentation now send `marathon.json` file to Marathon:

```
curl -k -XPOST -d @marathon.json -H "Content-Type: application/json" http://MARATHON_IP_ADDRESS:8080/v2/apps
```

Ok, now we are going to deploy Vamp.
Create `vamp.json` file with content:

```json
{
  "id": "vamp/vamp",
  "instances": 1,
  "cpus": 0.5,
  "mem": 1024,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "magneticio/vamp:develop",
      "network": "HOST",
      "forcePullImage": true
    }
  },
  "env": {
    "VAMP_REST_API_PORT": "9090",
    "VAMP_PERSISTENCE_KEY_VALUE_STORE_ZOOKEEPER_SERVERS": "$ZOOKEEPER_SERVERS",
    "VAMP_CONTAINER_DRIVER_MESOS_URL": "http://$MESOS_IP:$MESOS_PORT",
    "VAMP_CONTAINER_DRIVER_MARATHON_URL": "http://$MARATHON_IP:$MARATHON_PORT",
    "VAMP_GATEWAY_DRIVER_LOGSTASH_HOST": "$LOGSTASH_IP",
    "VAMP_PULSE_ELASTICSEARCH_URL": "http://$ELASTICSEARCH_IP:$ELASTICSEARCH_PORT",
    "VAMP_LIFTER_VAMP_GATEWAY_AGENT_ENABLED": "true"
  }
}
```

Replace `$ZOOKEEPER_SERVERS` (ZooKeeper IP address and port), `$MESOS_IP`, `$MESOS_PORT`, `$MARATHON_IP`, `$MARATHON_PORT`, `$LOGSTASH_IP`, `$ELASTICSEARCH_IP` and `$ELASTICSEARCH_PORT`.
For instance environment may look like this:

```json
"env": {
  "VAMP_REST_API_PORT": "9090",
  "VAMP_PERSISTENCE_KEY_VALUE_STORE_ZOOKEEPER_SERVERS": "10.240.0.3:2181",
  "VAMP_CONTAINER_DRIVER_MESOS_URL": "http://10.240.0.3:5050",
  "VAMP_CONTAINER_DRIVER_MARATHON_URL": "http://10.240.0.3:8080",
  "VAMP_GATEWAY_DRIVER_LOGSTASH_HOST": "10.240.0.4",
  "VAMP_PULSE_ELASTICSEARCH_URL": "http://10.240.0.4:9200",
  "VAMP_LIFTER_VAMP_GATEWAY_AGENT_ENABLED": "true"
}
```

Send the request to Marathon:

```
curl -k -XPOST -d @vamp.json -H "Content-Type: application/json" http://MARATHON_IP_ADDRESS:8080/v2/apps
```

Marathon will start deploying Vamp and if all arguments are set correctly you will notice that Vamp Gateway Agent will be also deployed.
What we did (`VAMP_LIFTER_VAMP_GATEWAY_AGENT_ENABLED`) is that we enabled Vamp to automatically deploy Vamp Gateway Agent on each Marathon agent.

Note that Vamp will expose its UI on port 9090 (`network: HOST`), otherwise you may set different port (`VAMP_REST_API_PORT`).
