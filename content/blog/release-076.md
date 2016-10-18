+++
title = "Vamp 0.7.6: introducing the Marathon dialect" 
tags = ["releases", "news"]
category = ["news"]
date = "2015-05-21"
type = "blog"
author = "Tim Nolet"
+++

Release 0.7.6 is tagged and you can check the [full release note on Github](https://github.com/magneticio/vamp/releases/tag/0.7.6). Notice that there are breaking changes in this release so please update where necessary. We've updated our [getting started tutorial](/getting-started/) to reflect the latest changes.
Some of the highlights are below.

## Mesosphere Marathon dialect

Vamp now allows you to use Marathon specific tags inside Vamp blueprints by using the `marathon:` tag. We call this a "dialect". We will be enabling these dialects for all platforms Vamp supports (i.e. a 'straight' Docker driver and Kubernetes are on the roadmap).  

This effectively allows you to make full use of the underlying Marathon features like mounting disks, settings commands and providing access to private Docker registries.

Let's look at an example blueprint that pulls an image from private repo, mounts some volumes, sets some labels and gets run with an ad hoc command: all taken care of by Marathon.

```yaml
name: busy-top:1.0

clusters:

  busyboxes:
    services:
      breed:
        name: busybox
        deployable: registry.example.com/busybox:latest
      marathon:
       cmd: "top"      
       uris:
         -
           "https://some_host/some_path/some_file_with_docker_credentials"
       labels:
         environment: "staging"
         owner: "buffy the vamp slayer"
       container:  
         volumes:
           -
             containerPath: "/tmp/"
             hostPath: "/tmp/"
             mode: "RW"
      scale:
        cpu: 0.1       
        memory: 256  
        instances: 1
```


Notice the following:

1. Under the `marathon:` tag, we provide the command to run in the container by setting the `cmd:` tag.
2. We provide a url to some credentials file in the `uri` array. As described [in the Marathon docs](https://mesosphere.github.io/marathon/docs/native-docker.html#using-a-private-docker-repository) this enables Mesos
to pull from a private registry, in this case registry.example.com where these credentials are set up.
3. We set some labels with some arbitrary metadata.
4. We mount the `/tmp` to in Read/Write mode.

We can provide the `marathon:` tag either on the service level, or the cluster level. Any `marathon:` tag set on the service level will override the cluster level as it is more specific. However, in 9 out of 10 cases the cluster level makes the most sense. Later, you can also mix dialects so you can prep your blueprint for multiple environments and run times within one description.

We are convinced this is a very convenient addition and helps users to leverage their container platform while using Vamp's powerful, higher level features.


Find all downloadable packages at:  
https://bintray.com/magnetic-io/downloads


Closed issues:  
https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.7.6+is%3Aclosed

Tim Nolet, CTO