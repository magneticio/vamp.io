---
date: 2016-09-13T09:00:00+00:00
title: PaaS and container systems
menu:
  main:
    parent: "Vamp compared to..."
    weight: 20
---

## Vamp compared to container schedulers and container clouds (CPaaS)
_Docker Swarm, DC/OS, Mesos/Marathon, Kubernetes, Nomad, Rancher, AWS ECS, Azure CS, Mantl, Apollo_  
Container cluster managers and schedulers like Marathon, DC/OS, Kubernetes, Nomad or Docker Swarm provide great features to run containers in clustered setups. What they don't provide are features to manage the lifecycle of a microservices or container based system. How to do continuous delivery, how to gradually introduce and upgrade versions in a controlled and risk-free way, how to aggregate metrics and how to use these metrics to optimise and scale your running system. Vamp adds these features on top of well-used container schedulers by dynamically managing routing and load balancing, deployment automation and metric driven workflows. Vamp also adds handy features like dependencies, ordering of deployments and resource management.

## Vamp compared to PaaS systems
_Cloud foundry, OpenStack, IBM Bluemix, Openshift_  
Vamp adds an experimentation layer to PaaS infrastructures by providing canary-releasing features that integrate with common PaaS proxies like HAProxy. For continuous delivery and auto-scaling features, Vamp integrates with common container-schedulers included in PaaS systems, like Kubernetes in Openshift V3.   

{{< note title="What next?" >}}
* Read about [Vamp compared to common frameworks and tools](/product/vamp-compared-to/frameworks-and-tools)
* [Try Vamp](/documentation/installation/v1.0.0/overview/)
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}




