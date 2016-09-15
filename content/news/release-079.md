+++
title = "Vamp 0.7.9: introducing the UI and CLI." 
tags = ["releases", "news"]
category = ["news"]
date = "2015-08-02"
type = "blog"
author = "Tim Nolet"
description = "Deploying microservices with Vamp using the UI and CLI on Docker on Mesosphere"
+++


We just pushed **release 0.7.9** which is easily the biggest Vamp release to date! With this release we focused on making Vamp **easy to install** and work with.

![](/img/screenshots/deploy_detail.png)

<!--more--> 


First of all, we package the first version of our **graphical user interface**. With this ReactJS based UI, you can create, update and delete Vamp artifacts quickly and dive into the Vamp metrics feed. [Quick start →](/quick-start)

Secondly, we released the first version of the **Vamp command line interface**. The CLI allows admins and Devops engineers to do fully automated canary releases and blue/green deployments on Docker and Mesophere's/DCOS Marathon from CI tools like Jenkins or just from bash scripts.  

You can install the CLI on your Mac using Homebrew, [Learn more →](/documentation/cli-reference/)

<a href="https://asciinema.org/a/371lzojapwenuoxd7ihta3857?autoplay=1" target="_blank"><img src="https://asciinema.org/a/371lzojapwenuoxd7ihta3857.png" width="700" /></a>

Thirdly, we've updated our website, the configuration and installation documentation and quick start to make using and installing Vamp easier than ever. We support native package managers **Centos, RHEL, Debian, Ubuntu**. [Check the docs →](/installation/)


Closed issues:  
https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.7.9+is%3Aclosed

Tim Nolet, CTO