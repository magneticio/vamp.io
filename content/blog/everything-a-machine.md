---
date: 2019-06-05T09:00:00+00:00
title: "Everything a Machine: Automate CI/CD to Bend, Even When Code Breaks"
author: "Agnes"
avatar: "agnes.jpg"
tags: ["Microservices", "KubeCon", "Machine-Learning", "DevOps"]
publishdate: 2019-06-05
featured_image: "/images/blog/Code-bending.jpg"
---

![](/images/blog/Code-bending.jpg) 

Fast! Microservices! Cloud! A bright, shiny CI/CD pipeline that pumps out innovative but reliable software at scale –
how often have you thought “sure, I’ll get right on that!”  while in digital transformation meetings. We all know that
the move to microservices-based architecture is [”the newblack”] (https://www.mindtree.com/blog/look-devops-microservices) for many enterprises. But being tasked with **balancing
flexible software release with reliable working software** in production can sometimes feel like being in the Twilight
Zone. At least, you inevitably end up in the Outage Zone. Code that worked on someone’s machine is mysteriously broken
in production. And now you’re in a post-mortem.

<!--more-->

Last week, our team was at KubeCon talking about [the future of
DevOps](https://vamp.io/news/vamp-at-kubecon-2019/?utm_source=blog&utm_medium=blog2&utm_campaign=20190529-KubeCon&utm_content=EverythingAMachine)
and canary-testing for machine-learning models. But what about the present of DevOps? For those of us entrusted with
building that present, it can seem that rather than a bright, shiny CI/CD pipeline, we have a clunky juggernaut held
together by a stick of tape and a paperclip. 

## Set policies that allow your infrastructure to bend, even when code breaks

The solution, however, is the same for DevOps present as for DevOps future – you will always have broken code, **so
architect for failure**, automate validation early on in your release process and the result is microservice releases
that won’t crash your whole dependency ecosystem.

Architecting for failure for the release part of your pipeline means
not just implementing canary-testing, but policy-based [canaryreleasing](https://cloud.google.com/blog/products/gcp/how-release-canaries-can-save-your-bacon-cre-life-lessons). This
is done by setting approval gates early in the deployment pipeline to remove much of the hasty final approval chaos
usually seen in bigger, slower release trains. 

Policies around approval gates are set by including input from business,
operations and development stakeholders, as each group will have different parameters to measure a release’s health and
success in real-time. 

By defining parameters against the four [‘goldenmetrics’](https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/) as defined by Google’s SRE
methodology, each release can be measured and compared to historical data. Set values for performance of your existing
version compared to your new version and bake those “if-then” statements into the code of your approval gates. That way
the quality of each release can be definitively and continuously validated against your custom service-level objectives
(SLOs).

## Let data-driven release automation show you how to make your release successful

Creating code around the policies at your approval gates is where the magic happens because now you have the flexibility
to test and release a host of different versions of your service. Doing a canary release by sending small amounts of
traffic to your production environment is one thing, but monitoring it manually is another. Setting policies in advance
allows you to trust the machine to rollback automatically if things break. Your gateways are set up to spot early signs
of problems before all users are impacted. 

Automation allows you to do this in real-time with real production traffic
because your failsafe is built in. Automatically rolling back to the current version is just part of the story. The
other part is automatically sending real-time notifications to your support team and handing your developers the data
they need to know what went wrong. Since this data is tied to your SLO policy metrics, it goes beyond just log files.
Basically, a data-driven decision caused the rollback so your developers need access to the data that decision was based
on so they can fix it.

## Automate continuous validation, automate continuous delivery


The moral of the story is: code will break. Unforeseen, unplanned-for issues arise. It’s not the ability to prevent
this, but the ability to plan and react that makes all the difference in the world.  

Setting and automating a policy-based framework for testing in production makes sure that (1) testing is done safely, but with real-world data
and (2) deviations from the established norm are captured and acted upon, rolling back a release and giving engineers
insight into how to repair it. 

This is what we call continuous validation: architecting for continuous validation not
only prevents application-wide outages but ensures a smoother continuous delivery process that you can rely on as a
stepping-stone to scale.
