---
date: 2017-04-03T09:00:00+00:00
title: Dialects
menu:
  main:
    identifier: "dialects-v100"
    parent: "Using Vamp"
    weight: 90
aliases:
    - /documentation/using-vamp/dialects/
    - /documentation/using-vamp/blueprints/#dialects
---

A dialect is a set of native commands for the underlying container platform.  Vamp allows you to use container driver
specific tags in workflows and inside blueprints on a breed or deployment level. Dialects effectively enable you to make
full use of, for instance, the underlying features like mounting disks, settings commands and providing access to private
Docker registries.

Dialects can be used by adding the `dialects` tag, followed by the preferred dialect:

We currently support the following dialects:

* [DC/OS & Marathon](/documentation/using-vamp/v1.0.0/dialects/#dc-os-marathon-dialect)
* [Docker](/documentation/using-vamp/v1.0.0/dialects/#docker-dialect)

A Kubernetes dialect is in the make.

## DC/OS & Marathon dialect

The `marathon` dialect tag should be used on Mesosphere DC/OS and standalone Marathon installations running on Mesos.
The example below accomplishes the following:

1. Under the `marathon:` tag, we provide the command to run in the container by setting the `cmd:` tag.
2. We provide a url to some credentials file in the `uri` array. As described in the Marathon docs ([mesosphere.github.io/marathon - using a private Docker repository](https://mesosphere.github.io/marathon/docs/native-docker.html#using-a-private-docker-repository)) this enables Mesos
to pull from a private registry, in this case registry.example.com where these credentials are set up.
3. We set some labels with some arbitrary metadata.
4. We mount the `/tmp` to in Read/Write mode.
5. We switch on `forcePullImage` option, so the we don't use the local node's Docker cache when pulling the Docker image.

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
          uris:
            -
              "https://some_host/some_path/some_file_with_docker_credentials"
          labels:
            environment: "staging"
            owner: "buffy the vamp slayer"
          container:
            docker:
              forcePullImage: true
            volumes:
              -
                containerPath: "/tmp/"
                hostPath: "/tmp/"
                mode: "RW"
```

After deploying this blueprint, you can check the DC/OS UI and notice the settings

![](/images/screens/dcos_artefact_uri.png)
*artefact uri injected into DC/OS*

![](/images/screens/dcos_volume_mount.png)
*local Volume mounted in container*


We can provide the `dialects:` tag either on the service level, cluster level or deployment level and then use the `marathon`
tag within this. Dialects set on the service level will override the cluster level as it is more specific. However, in 9
out of 10 cases the cluster level makes the most sense. Later, you can also mix dialects so you can prep your blueprint
for multiple environments and run times within one description.

{{< note title="What next?" >}}
* Read about [Vamp environment variables](/documentation/using-vamp/v1.0.0/environment-variables/)
* Check the [API documentation](/documentation/api/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}

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
