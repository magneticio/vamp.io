---
title: Installation
type: documentation
weight: 10
series: "tuts"
aliases:
  - /getting-started/
menu:
    main:
      parent: getting-started
    
---

# Getting Started

By far the easiest way to get started with Vamp is by spining up one of the pre-baked Docker images stored
in the [vamp-docker repo](https://github.com/magneticio/vamp-docker). This repo contains a number of 
`Dockerfile` files and `docker-compose.yml` to help setup Vamp in different situations. 
They should run anywhere Docker runs, but most situations will probably be on your laptop. 
Probably a recent Macbook.

## Prerequisites

You should have Docker installed which, on a Macbook with OSX, means [Boot2Docker](http://boot2docker.io/) and its dependencies. 
For Docker compositions, you should have [Docker compose](https://docs.docker.com/compose/install/) installed. 
Luckily, that's a two-liner:
{{% copyable %}}
<pre>curl -L https://github.com/docker/compose/releases/download/1.1.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose  
chmod +x /usr/local/bin/docker-compose</pre>
{{% /copyable %}}

With the prerequisites sorted, pick the thing you want to do...

## Run Vamp with a Mesos cluster all-in-one

This command will create a full Mesosphere stack on your laptop and connect Vamp to it.
{{% copyable %}}
<pre>git clone https://github.com/magneticio/vamp-docker.git && \
cd vamp-docker/docker-compositions/vamp-marathon-mesos/ && \
docker-compose up</pre>
{{% /copyable %}}

{{% alert info %}}
**Note 1**: grab a coffee while everything gets installed on the first run. The containers are somewhat large due
to Java dependencies. Luckily, you'll only have to do this once. After that is crazy fast.
{{% /alert%}}

{{% alert warn %}}
**Note 2:** This runs all of Vamp's components in one container. This is definitely not ideal, but works fine for kicking the tires.
You will run into cpu, memory and storage issues pretty soon though. Also, random ports are assigned by the Vamp which
you might not have exposed.
{{% /alert%}}

## Run Vamp with an external Mesos cluster

If you want to tweak things a bit more, grab the Vamp all-in-one Docker image and provide your own Mesosphere stack.
   
1. Pull the latest Vamp image.
{{% copyable %}}<pre> docker pull magneticio/vamp:latest</pre>{{% /copyable %}}

2. Now set up a Mesosphere stack on Google Compute Engine or Digital
Ocean really easily using the great wizards at [Mesosphere.com](https://mesosphere.com/downloads/).

3. After the wizard is finished, we are going to do two things:

    a) Make a note of the Marathon endpoint, typically something like `http://10.143.22.49:8080`
    We are going to pass this in as an environment variable to our Vamp Docker container
    
    b) Deploy vamp-router to the Mesosphere stack. You can use the piece of JSON below for this. Just `POST` it to 
    the Marathon endpoint and note the IP number of the host it gets deployed to eventually. In our case this 
    was `10.16.107.232`
    
    ![](/img/marathon_router.png)
    
    {{% copyable %}}<pre class="prettyprint lang-json">{
    "id": "main-router",
    "container": {
        "docker": {
            "image": "magneticio/vamp-router:latest",
            "network": "HOST"
        },
        "type": "DOCKER"
    },
    "instances": 1,
    "cpus": 0.5,
    "mem": 512,
    "env": {},
    "ports": [
        0
    ],
    "args": [
        ""
    ]
}</pre>{{% /copyable %}}

4. Start up Vamp while providing it with the necessary external inputs. Note: these are examples from our test!

    VAMP_MARATHON_URL=http://10.143.22.49:8080  
    VAMP_ROUTER_URL=http://10.16.107.232:10001  <= 10001 is the Vamp-Router REST API port  
    VAMP_ROUTER_HOST=10.16.107.232 
    
    Copy & paste these into a `docker run` command, like this
{{% copyable %}}
<pre>docker run -i -t -p 81:80 -p 8081:8080 -p 10002:10001 -p 8084:8083 -e VAMP_MARATHON_URL=http://10.143.22.49:8080 -e VAMP_ROUTER_URL=http://10.16.107.232:10001 -e VAMP_ROUTER_HOST=10.16.107.232 magneticio/vamp:latest</pre>    
{{% /copyable %}}

5. Now check if Vamp says "Hi!" by  doing a GET on `/api/v1/hi`

    <pre class="prettyprint lang-json">
    {
      "message":"Hi, I'm Vamp! How are you?",
      "vitals":{
        "operating_system":{
          "name":"Linux",
          "architecture":"amd64",
          "version":"3.16.1-tinycore64",
          "available_processors":4.0,
          "system_load_average":0.06
        },
        "runtime":{
          "process":"12@e221586513b0",
          "virtual_machine_name":"Java HotSpot(TM) 64-Bit Server VM",
          "virtual_machine_vendor":"Oracle Corporation",
          "virtual_machine_version":"25.40-b25",
          "start_time":1427595771672,
          "up_time":552920
        },
        "memory":{
          "heap":{
            "init":33554432,
            "max":469762048,
            "committed":61865984,
            "used":12665144
          },
          "non_heap":{
            "init":2555904,
            "max":-1,
            "committed":80084992,
            "used":78949296
          }
        },
        "threads":{
          "count":29,
          "peak_count":29,
          "daemon_count":11,
          "total_started_count":38
        }
      }
    }
    </pre>
