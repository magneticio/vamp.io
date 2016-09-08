+++
title = "Vamp 0.7.10: weight editing and easy A/B-testing with environment variables" 
tags = ["releases", "news"]
category = ["news"]
date = "2015-08-28"
type = "blog"
author = "Tim Nolet"
description = "A/B-testing micro services and Docker containers using easy weight distribution and setting environment variables for different containers."
+++


Vamp **release 0.7.10** introduces a nice addition to the UI where you can easily shift traffic between multiple services based on percentages. You can combine this with our revised way of handling environment variables. 

Just launch two exactly the same containers and tweak them using standard `ENV` variables. **A/B-testing Docker containers** has never been easier.

![](/img/weight_sliders.gif)

<!--more--> 

## Easy A/B-testing

During our last sprint we dedicated a lot of time to how we can make simple A/B-testing scenario's easier. Taking in the feedback we get through Github we changed how we handle the scope of environment variables. 

You can now just launch two (or more) of exactly the same containers and just give them different environment variables to tweak and configure the application inside the container. To this, we added a nice little extra in the UI to shift around the traffic based on percentages. 

An extra benefit of changing how we deal with scopes is the option to override variables on different levels if you want to. This allows for a separation of concerns, i.e. have operations override settings provided by developers. [Check the updated docs for more scenario's →](/documentation/using-vamp/environment_variables/#environment-variable-scope)

## Clearer references

In addition to changing how we deal with scopes we made using references to artifacts more explicit. You now use the `reference` or `ref` keyword to include artifacts by name in other artifacts. Previously, this was done using the `name` keyword, which was confusing. [Check the reference docs for more info →](/documentation/using-vamp/references/)


> **Note**: this is a breaking change. Please update blueprints and other artifacts accordingly.

## Docker dialect

When using Vamp with Docker, you can now add Docker API specific commands to your blueprint. This means you can hook up volumes or use a private registry, or basically do anything the Docker API allows. The example below mount "/tmp"
in every `busybox` container:

```yaml
---
name: busybox
clusters:
  busyboxes:
    services:
      breed:
        name: busybox-breed
        deployable: busybox:latest
      docker:
        Volumes:
          "/tmp": ~
```
[Check the dialects docs for more info →](/documentation/using-vamp/blueprints/#dialects)

## Simple deployment validation, or a NOOP run

The last thing I'd like to point out is that we've added the `?validate_only=true` option to de `/deployments` endpoint. This means you can have Vamp validate whether the blueprint you are about to deploy is actually valid!
Vamp will check if all references to other artifacts are in place and if the blueprint is semantically valid.
This works like a "noop" (no operation) run and helps with sanity checking complex blueprints. [Check the deployment API docs for more info →](/documentation/api-reference/deployments/)


**Release notes:**  
https://github.com/magneticio/vamp/releases/tag/0.7.10

**Closed issues:**  
https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.7.10+is%3Aclosed

Tim Nolet, CTO