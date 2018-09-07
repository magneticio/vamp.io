---
date: 2015-08-15T09:00:00+00:00
title: "MesosCon Europe 2017 Themes and trends"
author: "Tim Nolet"
avatar: "tnolet.jpg"
tags: ["Mesos", "Apache", "Devops", "Docker"]
publishdate: 2017-10-26
---

![](https://cdn-images-1.medium.com/max/720/1*nxks34PDE35QNFOEQMjBig.png)

Let’s look at some of the themes and trends at **[MesosCon Europe 2017](http://events.linuxfoundation.org/events/mesoscon-europe)** in Prague. I’m interested in anything that has to do with **adoption, security, state** and anything “day 2 operations” related.

<!--more-->

Regretfully, I can’t visit all the talks so feel free to add comments if I missed some key insight. This post will be updated as the conference progresses and when I have time off from [my own talk on deployment on Friday](https://mesosconeu17.sched.com/event/Cl7O/advanced-deployment-strategies-and-workflows-for-containerized-apps-on-dcos-tim-nolet-vampio).

**Updated on 27/10/2017 with insights from the second day, specifically on platforming.**

## On industry adoption

There is no doubt that containers, orchestration and the SMACK stack have completely penetrated traditional industries. While maybe two years ago this was mostly a Netflix/Twitter/tech/startup party, now ASML, Deutsche Telekom and Audi (on stage during the Keynote panel discussion on Thursday) are all working with this tech to crunch some serious data loads. From the machines ASML ships out, to the IOT data from the cars Audi puts on the road, to mobile network data.

{{<tweet 923459784669564929 >}}

Looking at the MesosCon schedule, it’s good to see talks by “**non-sexy**” companies like Houghton Mifflin Harcourt (publishing) and Tunstall Nordic (health services). To many attendees, their experiences will resonate more than from Yelp or Twitter.

Audi mentions that their current setup runs on AWS, but being cloud independent is very important to them. For different countries, they want to use different providers: not only for cost optimisation, but for legal and political reason too. e.g. China.

Challenges for adoption are two-fold:

* **Stakeholder creation / internal adoption**. Audi mentions that for adopting something like a SMACK stack. Ideally you start with a “green field” situation. But convincing the board is difficult, as the they think “open source is for freaks”, which of course is true 😉. However, all parties mention that having Enterprise versions and support does make adoption easier.

* **Hiring**: all panel members mention finding people to actually use this software to build the system is very hard. See my notes on complexity also.

## On platforming

Every sufficiently large company seems to be building some form of a private container platform on top of Mesos, DC/OS and/or Kubernetes. Platforms are needed to centralise cross cutting concerns like logging, metrics collections, authentication, security, storage etc. It is actual the private cloud you want, when public cloud is not an option (think regulation, legacy integration, cost).

Robert Allen from HMH again stresses internal adoption to be a sine qua non for getting anything like a platform of the ground. Pretty much every other speaker has many anecdotes that relate to how “management” or “old timers” needed to be coaxed, educated and evangelised to get this cultural change to happen. Only then does platform stand any change of success.

There are/were quite some companies in this market — that we just called private PaaS — that promised this, mostly Redhat Openshift and Pivotal’s Cloud Foundry. Cloud Foundry does pretty well, they even have their own summit this year. Openshift has pivoted to a Kubernetes-as-a-Service. Even so, everyone seems to be going at it alone. Private Heroku is the goal. Consultancy agencies and service provides will pick this up and make a ton of cash.

## On security

Mesosphere is clearly emphasising their efforts on introducing security to the Mesos framework. This is clear from the amount of security related talks by Mesosphere on the schedule.

This is good news for everyone, as managing security aspects was up till now basically left to the user. Take **secrets management** (passwords, SSH keys, API keys etc. ) as an example. Vinod Kone, a Mesos committer, gives a completely frank overview that up till last months 1.40 release, secrets management was basically completely non-existent in Mesos.

Sysdig, a sponsor of the conference, has a pretty interesting product that will appeal to heavily regulated markets that demand audit trialling and intrusion detection on everything. It is no different than other security appliances that already do trip wiring and intrusion detection, but the ease of integration into a container stack can be a winner.

## On statefulness & persistence

The big elephants in the container space room have always **stateful** **services** **and** **databases**. One solution has been to pin containers to server nodes, but this prompts the question of how to balance the “snow flakiness” of servers against the need for persistence: we want servers to be cattle, not pets!

David von Thenen from {code}, a Dell-EMC organisation, hits the nail on the head and makes a strong case how, fundamentally, every container based app is vulnerable when not using some for of external storage. For instance, rebuilding and redeploying a failed process like Cassandra can totally kill your application due to high CPU and IO usage. **So, while it technically IS recovering automatically, and the data IS persistent, it still kills your app**. Whoops!

![Portworx and in the back {code} all bring storage and persistence solution to containers](https://cdn-images-1.medium.com/max/6528/1*LtecN3-ICsZ2-K69-6aGzg.jpeg)*Portworx and in the back {code} all bring storage and persistence solution to containers*

**ClusterHQ** was probably the first company to try and tackle this. They shut down in 2016. Make from that what you will. This year, there are at least two companies / organisations at MesosCon (Portworx and {code}/Dell-EMC) offering solutions.

Then there is the **Container Storage Interface**: an interface that should allow vendors to provide implementation independent persistence storage. This spec is however still at the proposal stage, but the companies that have pledged compatibility seems pretty solid (Google, IBM, Dell-EMC etc.). The task is humongous though:

* Snapshotting

* Volumes (mounting, unmounting, resizing)

* Quota

* Windows support

This kinda sounds and smells like [OpenSDS](https://www.opensds.io/). The answer to the question how CSI relates to OpenSDS is pretty long and pretty vague. Choice is good, but again, complexity rises…which brings us to:

## On complexity

This is a bit of a meta subject but summarises all other points quite nicely. One of the challenges to the container / cloud native world is the astounding level of complexity that is introduced to companies that embrace it. Take the SMACK stack as an example, comprising Spark, Mesos, Akka, Cassandra and Kafka.

{{< tweet 923448648972865537 >}}

Each of these technologies by themselves is deep, complex and takes some significant effort and experience to master. Moreover, they are all quite new so finding anyone with more than just a few years of experience in any of these can be tough, specifically outside of the Bay Area or other tech centers.

Katharina Probst, director of engineering at Netflix, give a great example of where this can lead. Their architecture is now so huge and complex, they had to build their own streaming framework (Mantis) and Mesos scheduler (Fenzo) to allow their teams to make sense of what is running where and how it is doing.


Netflix is probably one of a handful of companies that is perfectly positioned to undertake this challenge. For them this makes sense and they gracefully share the results with the larger community. But 99% of other companies would struggle to even find people to design such a thing, let alone build and maintain it.

Back to the SMACK stack panel discussion. One of the questions was what “SMACK stack 2.0” should look like. Two answers stuck out and can be paraphrased as:

1. **Alignment of all component lifecycles** in the stack, as upgrading can be a pain and causes friction.

1. “**SMACK Enterprise**”: out of the box maintainability, monitoring, encryption at rest, authorization, authentication etc.

## Wrap up

The adoption story is for everything Mesos seems a total success. However, it seems that currently everyone is figuring out a lot things by themselves:

* security

* storage

* monitoring

* lifecyle management

* etc.

So, basically every operational IT concern that has been around forever since **ITIL codified this in the late ‘80-ties**. This is a clear option for vendors to step in — and we/they are doing exactly that 😎— but also a call to the framework creators to double down on these issues an provide best practices and standards. Now people are experiencing what it means to run and develop this and they need more, better integrated and stable tools.
