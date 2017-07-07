---
date: 2017-04-03T09:00:00+00:00
title: Dialects
menu:
  main:
    identifier: "dialects-v094"
    parent: "Using Vamp"
    weight: 90
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}} 

* Switch to the [latest version of this page](/documentation/using-vamp/dialects).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

A dialect is a set of native commands for the underlying container platform.  Vamp allows you to use container driver specific tags in workflows and inside blueprints on a breed or deployment level. Dialects effectively enable you to make full use of, for instance, the underlying features like mounting disks, settings commands and providing access to private Docker registries.

We currently support the following dialects:

* [Docker](/documentation/using-vamp/v0.9.4/dialects/#docker-dialect)
* [Marathon](/documentation/using-vamp/v0.9.4/dialects/#marathon-dialect)

## Docker dialect

The following example show how you can mount a volume to a Docker container using the Docker dialect.

### Example blueprint - using the Docker dialect

```

name: busybox
clusters:
  busyboxes:
    services:
      breed:
        name: busybox-breed
        deployable: busybox:latest
      dialects:
        docker:
          Volumes:
            "/tmp": ~
```

Vamp will translate this into the proper API call. Inspecting the container after it's deployed should show something similar to this:

```
...
"Volumes": {
      "/tmp": "/mnt/sda1/var/lib/docker/volumes/1a3923fa6108cc3e19a7fe0eeaa2a6c0454688ca6165d1919bf647f5f370d4d5/_data"
  },
...    
```    

## Marathon dialect

This is an example with Marathon that pulls an image from private repo, mounts some volumes, sets some labels and gets run with an ad hoc command: all taken care of by Marathon.
  
We can provide the `dialects:` tag either on the service level, cluster level or deployment level and then use the `marathon` tag within this. Dialects set on the service level will override the cluster level as it is more specific. However, in 9 out of 10 cases the cluster level makes the most sense. Later, you can also mix dialects so you can prep your blueprint for multiple environments and run times within one description.


### example blueprint - using the Marathon dialect

Notice the following:

* Under the `marathon:` tag, we provide the command to run in the container by setting the `cmd:` tag.
* We provide a url to some credentials file in the `uri` array. As described in the Marathon docs ([mesosphere.github.io/marathon - using a private Docker repository](https://mesosphere.github.io/marathon/docs/native-docker.html#using-a-private-docker-repository)) this enables Mesos
to pull from a private registry, in this case registry.example.com where these credentials are set up.
* We set some labels with some arbitrary metadata.
* We mount the `/tmp` to in Read/Write mode.

```
name: busy-top:1.0
clusters:
  busyboxes:
    services:
      breed:
        name: busybox
        deployable: registry.example.com/busybox:latest
      dialects:
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
```

{{< note title="What next?" >}}
* Read about [Vamp environment variables](/documentation/using-vamp/v0.9.4/environment-variables/)
* Check the [API documentation](/documentation/api/v0.9.4/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}

