---
date: 2019-06-24T09:00:00+00:00
title: "Schrödinger's Canary"
author: "Agnes"
avatar: "agnes.jpg"
tags: ["Microservices", "Canary Releasing", "Testing-in-Production"]
publishdate: 2019-06-24
featured_image: "/images/blog/schrodinger_canary.png"
---

![](/images/blog/schrodinger_canary.png)  

Sometimes, releasing software to production is like Schrödinger's cat. You don’t know how well the release performs until 
you observe it in a live production environment. That is already daunting if you have a monolithic application but becomes 
even more nerve-wracking when releasing microservices.

<!--more-->


By applying the right methodologies, like canary releasing, you can minimize some of the risk of testing in production. 
But even if you do that, how do you know when to scale up the rollout or what to do if it fails? Gathering telemetry, or 
looking inside Schrödinger's box, is not enough. In this blog, we explore how by setting objectives around the health of 
your canary release, and [automating](https://vamp.io/blog/everything-a-machine/?utm_source=blog&utm_content=schrodingercanary) those objectives, you can ensure frequent, safe and scalable software release of microservices.

## Schrödinger’s cat box
Schrödinger's cat is a thought experiment that asks us to imagine a cat in a box with a flask of poison. It illustrates a 
paradox in quantum mechanics, where physical systems generally do not have definite properties prior to being measured. 
Because quantum mechanics can only predict the probability distribution of a given measurement's possible results, the 
cat may be simultaneously both alive and dead. The act of measurement affects the system, causing the set of probabilities 
to reduce to only one of the possible values immediately after the measurement. 

## Wait, wasn’t there a canary?
In software release management, we often see a comparable paradox, albeit one that luckily has nothing to do with quantum 
mechanics; that would make software development infinitely more difficult. The paradox in canary releases is about the 
lack of measuring and the set of probabilities to reduce to only one of the possible values. You can do a canary release, 
but you need to be able to “look inside the box” to see if your canary, or new version, is dead or alive.

## Is the canary dead or live?
To do effective canary releases, the operator doing the release must define on what basis to increase or decrease the 
gradual rollout. Often, this is done by measuring and comparing against the current known-good state of the system, 
monitoring the [golden signals](https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/) of the production system (latency, traffic volume, errors and performance).

In the comparison to the Schrödinger's cat paradox, the operator causes the set of probabilities of the canary release 
to reduce to only one of the possible values by measuring the canary’s state: the operator knows for certain what state 
the canary is in and can decide with a high level of certainty to increase or decrease the rollout.

## Manually monitoring canary health: is the graph squiggly enough?
Manually monitoring each release increases the variation of human interpretation. Each operator in the team will watch
 different metrics, interpret the telemetry differently and have different triggers to increase or decrease rollout.

Some will increase the gradual rollout at a performance improvement of one second, others might increase at half a second. 
Others will wait for 5 more minutes before increasing the rollout, ‘just to be sure’.

And this problem gets worse, because how do operators know how to increase the release? Is jumping from the new release 
from 5% of traffic to 15% a smart move? Or should they go to 6%? Or 75%? 

## Looking inside Schrödinger's cat box, not Pandora’s Box.
Instead, taking the “golden signals” of a production system and translating them into policies around your release, 
then automating those policies, allows a method to see “inside the box” of your production environment. 
Policies leave a data trail that goes beyond basic log files so you can increase your incident response rate. Policies 
also take guesstimating out of when and by how much to scale up a rollout. Automation improves consistency and reduces 
variation: the policy engine works identically for each release, no matter who does the release.

The bottom line is: Guesstimating random numbers based on a gut-feeling opens a Pandora’s Box of problems that can lead 
to dead canaries, outages and messes to constantly clean up so that you can’t increase release frequency and scale. 
Canary releasing is only useful when you can look ‘inside the box’ by observing the golden metrics and scaling each 
release up or down based on actual production data.

Interested in creating your own policy-based canary release? Go to [https://vamp.io/ee-trial-signup/]( https://vamp.io/ee-trial-signup/) for a install-yourself 
or hosted environment of VAMP, and use the documentation [on our docs page](https://vamp.io/documentation/installation/v1.0.0/overview/) to help you walk through the process.
