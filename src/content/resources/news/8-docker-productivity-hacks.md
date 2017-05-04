+++
title = "8 Docker productivity hacks for better living" 
tags = ["articles","Docker","tips","tricks","linux","one-liners"]
category = ["articles"]
date = "2015-06-16"
author = "Tim Nolet"
type = "blog"
description = "8 Docker tips and tricks for daily Docker usage"
+++
![](/img/docker_nyan.svg)

We've been building smaller and bigger tools on/for/with Docker for roughly the last 1,5 years.
During that time I've found I always come back to using little productivity hacks and one-liners that
I found on the internet or came up with myself. Here they are in one place, as much as for our own reference
as for anybody else to enjoy. <!--more--> We use this stuff every day. Here we go:

## 1. Remove images that are no longer used by a container
Let's free up some disk space!

    $ docker rmi `docker images -q -f dangling=true`

## 2. Remove all exited containers
Let's free up some more disk space!

    $ docker rm `docker ps -q -a -f status=exited`

## 3. Log into an already running container
Somehow it took me ages to figure this one out. Hope I'm not the only dummy. Of course, the container should have some
shell installed, like bash.

    $ docker exec -i -t <ID_OF_RUNNING_CONTAINER> /bin/bash

## 4. Run "top" inside a container

This one is somewhat controversial. Resource usage in Docker is [counterintuitive](https://goldmann.pl/blog/2014/09/11/resource-management-in-docker/) and [complicated](https://docs.docker.com/articles/runmetrics/). Having said that, just running top
inside a container gives me a relatively good insight how things are doing in that container`s context:

    $ docker exec -t <ID_OF_RUNNNIG_CONTAINER> /bin/sh -c "export TERM=xterm-256color && top -bn 2"

P.S: Ignore the first output cycle. Why? Because [reasons](http://unix.stackexchange.com/questions/58539/top-and-ps-not-showing-the-same-cpu-result).    

## 5. Don't expect anything magic from the ":latest" tag     

One of the huge misconceptions among fresh Docker users. The `:latest` tag has no special magic. It is not the `HEAD`
in a Git log. It is not an automatic pointer to the top of of your stack of images. It is just a convention. Getting
the `:latest` version of an image implies you trust the creator of the image to really tag the last one the build with the
`:latest` tag. More info see this post by [our friends at Container Solutions](http://container-solutions.com/2015/01/docker-latest-confusion/)

## 6. Cut container download time with export/load in Vagrant

Not a real one-liner, but hey! When building stuff with (CoreOS) Vagrant boxes, I destroy those boxes quite often just to get a clean slate. However, my box runs Docker and stores the images inside the box. The box now has to download some of the containers I run in that box every time I refresh my environment. Let's fix that.

Just save the Docker image to disk as a tar file.

```bash
docker save magneticio/myimage:1.0 > /home/share/magneticio_myimage_10.tar
```

Now mount your disk to Vagrant and import it using this snippet in your Vagrantfile:

```ruby
# Vagrantfile
MY_CONTAINER="magneticio_myimage_10.tar"
vm.synced_folder ".", "/home/share", id: "core", :nfs => true, :mount_options => ['nolock,vers=3,udp']
config.vm.provision :shell, :inline => "export TMPDISK=/", :privileged => false
if File.exist?(MY_CONTAINER)
    config.vm.provision :shell, :inline => "docker load -i /home/share/#{MY_CONTAINER}", :privileged => false
end
```

## 7. Use "boot2docker shellinit" to setup your Docker ENV variables

Destroying and restarting a lot of [boot2docker](http://boot2docker.io/) instances on OSX? Creating too many terminal sessions? Use this your Docker client setup correctly for boot2docker.

    $ eval $(boot2docker shellinit)

## 8. Read the "Dockerfile best practices" info

Really useful and compulsory reading: [https://docs.docker.com/articles/dockerfile_best-practices/](https://docs.docker.com/articles/dockerfile_best-practices/)    


