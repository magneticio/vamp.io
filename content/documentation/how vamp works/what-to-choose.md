---
date: 2016-09-13T09:00:00+00:00
title: What to choose?
---
Vamp runs on top of a container scheduler to deliver it's scaling magic. But what container scheduler to choose when you're "greenfield" and don't have anything selected or running yet?

Literally hundreds of blog posts have been written about which container platform is the best. The answer of course is, as always, "it depends". ;)

From a very high-level overview we can give a few pointers though to make you help make a better decision.

If you simply want to play around with Vamp to get a feeling for what it can offer we suggest downloading and installing our [Vamp Hello World Docker Quickstart](/documentation/installation/hello-world/). It's a single Docker container including Vamp, Mesos/Marathon and ELK, and only needs Docker and at least 8GB to run.

If you like the power that Vamp gives you it's time to select a container cluster-manager and scheduler to start using Vamp in production settings, assuming you will be running more than one machine for fail-over. We currently support Mesos/Marathon, DC/OS (which is based on Mesos/Marathon but adds additional features and a fancy UI), Kubernetes and Rancher. Now what to choose?

Very high level we can make the following distinctions. If you are working with typical big data solutions like Kafka, Cassandra or Spark (often combined in something called SMACK stack), and/or want to run not only containers on your cluster, it makes sense to investigate [Mesos/Marathon](/documentation/installation/mesos-marathon/) first, as a lot of big data frameworks can run as native Mesos frameworks and you can combine the underlying infrastructure to share resources between these frameworks running on Mesos and your containers running inside Marathon (which is a Mesos framework in itself).

If you have the same requirements as described above, but you're more comfortable buying commercial support, moving towards [DC/OS](/documentation/installation/dcos/) makes sense, as you can purchase commercial DC/OS support or buy an enterprise version of DC/OS from Mesosphere (the company that initiated Mesos and Marathon).

If you're looking for a hosted version of DC/OS you could investigate [Azure Container Service](/documentation/installation/azure-container-service/) which let's you choose between DC/OS or Docker Swarm.

If you're solely interested in running (micro)services, API's and other web-based applications, [Kubernetes](/documentation/installation/kubernetes/) is an integrated cluster-manager and -scheduler, and is specifically designed for running containers with web-focused payloads. There is also a hosted version of Kubernetes available from Google (Google Container Engine). Commercial support or fancy dashboards are less easy to find for Kubernetes at this point. Kubernetes is also the scheduler used in Redhat software (Openshift V3), so if your company used Redhat software this might make sense to investigate.

If you not only want to manage and run containers, but are also interested in managing/provisioning (virtual) infrastructure, [Rancher](/documentation/installation/rancher/) is a viable option. It provides a Docker or Kubernetes based container scheduler, plus infrastructure provisioning with a very nice graphical UI.

For people wanting to stay within the Docker ecosystem, Vamp works nicely with (single machine) [Docker](/documentation/installation/docker/), and we have solid Docker Swarm support coming up soon.

The beauty of Vamp is that all your blueprints and workflows will keep on working (except for some [dialect](/documentation/using-vamp/blueprints#dialects) and specific metric store settings) when you want to move to a different scheduler or container cloud.
