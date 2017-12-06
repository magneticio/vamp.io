---
date: 2016-09-30T12:00:00+00:00
title: Mesos/Marathon
menu:
  main:
    identifier: "mesos-marathon-v092"
    parent: "Installation"
    weight: 40
---

{{< note title="The information on this page applies to Vamp v0.9.2" >}}

* Switch to the [latest version of this page](/documentation/installation/mesos-marathon).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}


Vamp can use the full power of Marathon running on either a DCOS cluster or custom Mesos cluster. You can use Vamp's DSL, or you can pass native Marathon options by [using a dialect in a blueprint.](/documentation/using-vamp/blueprints/#dialects)

#### Install
The instructions included on the [DC/OS installation page](/documentation/installation/v0.9.2/dcos) will also work with Mesos/Marathon.

#### set Marathon as the Vamp container driver

1. Set up a DCOS cluster using Mesosphere's assisted install on AWS ([mesosphere.com - product](https://mesosphere.com/product/)).
If you prefer, you can build your own Mesos/Marathon cluster. Here are some tutorials and scripts to help you get started:

  * Mesos Ansible playbook ([github.com/mhamrah - ansible mesos playbook](https://github.com/mhamrah/ansible-mesos-playbook))
  * Mesos Vagrant ([github.com/everpeace - vagrant-mesos](https://github.com/everpeace/vagrant-mesos))
  * Mesos Terraform ([github.com/ContainerSolutions - Terraform Mesos](https://github.com/ContainerSolutions/terraform-mesos))

3. Whichever way you set up Marathon, in the end you should be able to see something like this:
![](/images/screens/marathon-screenshot.png)

4. Make a note of the Marathon endpoint (host:port) and update the `container-driver` section in the Vamp `application.conf` config file. If you use a package installer like `yum` or `apt-get` you can find this file in `/usr/share/vamp/conf/application.conf`. Set the "url" option to the Marathon endpoint.

    ```
    ...
    container-driver {
      type = "marathon"
      url = "http://<marathon_host>:<marathon_port>"
      response-timeout = 30 # seconds, timeout for container operations
    }
    ...
    ```
5. (Re)start Vamp by restarting the Java process by hand.

{{< note title="What next?" >}}
* Find out [how to configure Vamp](/documentation/configure/v0.9.2/configure-vamp)
* Check the [configuration reference](/documentation/configure/v0.9.2/configuration-reference)
* Look at some [example configurations](/documentation/configure/v0.9.2/example-configurations)
* Follow the [tutorials](/documentation/tutorials/)
{{< /note >}}

