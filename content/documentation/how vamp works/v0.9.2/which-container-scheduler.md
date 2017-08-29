---
date: 2016-09-13T09:00:00+00:00
title: Which container scheduler?
menu:
  main:
    identifier: "which-container-scheduler-v092"
    parent: "How Vamp works"
    weight: 30
---

{{< note title="The information on this page is written for Vamp v0.9.2" >}}

* Switch to the [latest version of this page](/documentation/how-vamp-works/which-container-scheduler).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp can run on top of Mesos/Marathon, DC/OS, Kubernetes and Rancher (Docker Swarm support is coming soon). In case you’re “greenfield” and don’t have anything selected or running yet, here are some high-level pointers to help you make an informed decision: 

* [Working with big data](/documentation/how-vamp-works/v0.9.2/which-container-scheduler/#working-with-big-data) - Mesos/Marathon, DC/OS, Azure Container Service
* [Running web-based applications](/documentation/how-vamp-works/v0.9.2/which-container-scheduler/#running-web-based-applications) - Kubernetes, Google Container Engine
* [Managing (virtual) infrastructure](/documentation/how-vamp-works/v0.9.2/which-container-scheduler/#managing-virtual-infrastructure) - Rancher with Docker or Kubernetes
* [Just running Docker](/documentation/how-vamp-works/v0.9.2/which-container-scheduler/#just-running-docker)

Whichever option you choose now, Vamp is container systems agnostic, so all your blueprints and workflows will keep on working if you decide to switch in the future *.

-------

## Working with big data 
If you are working with typical big data solutions like Kafka, Cassandra or Spark (often combined in something called SMACK stack), and/or want to run not only containers on your cluster it makes sense to investigate [Mesos/Marathon](/documentation/installation/v0.9.2/mesos-marathon/) first. A lot of big data frameworks can run as native Mesos frameworks and you can combine the underlying infrastructure to share resources between these frameworks running on Mesos and your containers running inside Marathon (which is a Mesos framework in itself).

### Add in commercial support
If you have the same requirements as described above, but you're more comfortable buying commercial support, moving towards [DC/OS](/documentation/installation/v0.9.2/dcos/) makes sense. DC/OS is based on Mesos/Marathon, but adds additional features and a fancy UI. You can purchase commercial DC/OS support or buy an enterprise version from Mesosphere (the company that initiated Mesos and Marathon).

### Hosted solution
If you're looking for a hosted version of DC/OS you could investigate [Azure Container Service](/documentation/installation/v0.9.2/azure-container-service/) which let's you choose between DC/OS or Docker Swarm.

-------

## Running web-based applications  
If you're solely interested in running (micro)services, APIs and other web-based applications, [Kubernetes](/documentation/installation/v0.9.2/kubernetes/) is an integrated cluster-manager and -scheduler, and is specifically designed for running containers with web-focused payloads. 

### Add in commercial support
At this point, commercial support and fancy dashboards are less easy to find for Kubernetes. However, Kubernetes is the scheduler used in Redhat software (Openshift V3), so if your company used Redhat software this might make sense to investigate.

### hosted solution
A hosted version of Kubernetes is available from Google (Google Container Engine). 

-------

## Managing (virtual) infrastructure
If you want to manage and provision (virtual) infrastructure as well as manage and run containers, [Rancher](/documentation/installation/v0.9.2/rancher/) is a viable option. Rancher provides a Docker or Kubernetes based container scheduler and adds infrastructure provisioning with a nice graphical UI.

-------

## Just running Docker
If you want to stay within the Docker ecosystem, Vamp works nicely with (single machine) [Docker](/documentation/installation/v0.9.2/docker/). Docker Swarm support is coming up soon.

-------
  
_* Note that Vamp [dialects](/documentation/using-vamp/v0.9.2/blueprints#dialects) and some specific metric store settings are scheduler or container cloud specific._

{{< note title="What next?" >}}
* Find out how to [install Vamp](/documentation/installation/v0.9.2/overview) 
* Read about the [requirments to run Vamp](/documentation/how-vamp-works/v0.9.2/requirements) 
{{< /note >}}
