---
date: 2018-08-31T14:00:00+00:00
title: Vamp Enterprise Edition Trial for DC/OS 
platforms: ["DCOS","Mesosphere"]
---

{{< note title="Vamp Enterprise for DC/OS" >}}
Thank you for your interest in Vamp Enterprise! To start using Vamp Enterprise you need to setup and configure some dependencies and environments. To make this really easy we've created Vamp Lifter, our setup and configuration tool. You can read more about Vamp components, including Lifter [here.] (/documentation/how-vamp-works/v1.0.0/concepts-and-components/#vamp-components)
{{< /note >}}

If you’re new to Vamp Enterprise Edition and you want a quick way to evaluate it, copy the Vamp Lifter application specification below and save it as file named **lifter-standalone.json**. Then follow the [DC/OS Quickstart](/documentation/installation/dcos) guide. 

```json
{
  "id": "/vamp/vamp-ee-lifter",
  "cpus": 0.5,
  "mem": 1024,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "vampio/vamp-ee-lifter:latest-dcos-evaluation",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 8081,
          "hostPort": 0,
          "protocol": "tcp"
        }
      ],
      "forcePullImage": false,
      "parameters": [
        {
          "key": "dns-search",
          "value": "marathon.mesos"
        }
      ]
    }
  },
  "labels": {
    "DCOS_SERVICE_NAME": "vamp-lifter",
    "DCOS_SERVICE_SCHEME": "http",
    "DCOS_SERVICE_PORT_INDEX": "0"
  },
  "healthChecks": [
    {
      "gracePeriodSeconds": 30,
      "intervalSeconds": 10,
      "maxConsecutiveFailures": 0,
      "portIndex": 0,
      "timeoutSeconds": 5,
      "delaySeconds": 15,
      "protocol": "MESOS_TCP"
    }
  ],
  "env": {
    "VAMP_EE_NAMESPACE": "vampio",
    "VAMP_EE_METADATA_NAMESPACE_TITLE": "vamp.io",
    "VAMP_PERSISTENCE_KEY_VALUE_STORE_TYPE": "vault",
    "VAMP_PERSISTENCE_KEY_VALUE_STORE_BASE_PATH": "/secret/vamp",
    "VAMP_EE_PERSISTENCE_KEY_VALUE_STORE_BASE_PATH": "/secret/vamp",
    "VAMP_PERSISTENCE_KEY_VALUE_STORE_VAULT_TOKEN": "vamp",
    "VAMP_PERSISTENCE_KEY_VALUE_STORE_VAULT_URL": "http://vault.marathon.mesos:8200"
  }
}
```
{{< note title="What next?" >}}

* If you want to evaluate Vamp, follow the [DC/OS Quickstart guide →](/documentation/installation/dcos)
* If you’re curious how Vamp works, take a look at the Vamp [Concepts and Components](/documentation/how-vamp-works/).

{{< /note >}}
