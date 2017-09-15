---
date: 2016-09-13T09:00:00+00:00
title: Using the Vamp CLI
menu:
  main:
    parent: "CLI"
    weight: 20
---

Vamp's command line interface (CLI) can be used to perform basic actions against the Vamp API. The CLI was
primarily developed to work in continuous delivery situations. In these setups, the CLI takes care of automating (canary) 
releasing new artifacts to Vamp deployments and clusters.   
Source is at [https://github.com/magneticio/vamp-cli](https://github.com/magneticio/vamp-cli)  
Npm distribution is at [https://www.npmjs.com/package/vamp-cli](https://www.npmjs.com/package/vamp-cli)

## Installation

The Vamp CLI requires Node.js 6 or higher. Install the CLI globally with

```bash
npm install --global vamp-cli
```

## Configuration

After installation, set Vamp's host location. This location can be specified via the environment variable `VAMP_HOST`

```bash
export VAMP_HOST=http://192.168.59.103:8080
```

## Simple commands

The basic commands of the CLI, like `list`, allow you to do exactly what you would expect:

```
$ vamp list breeds
 NAME                       DEPLOYABLE                              
 kibana                     javascript                              
 recommended:1.0            magneticio/vamp-music-recommended:1.0.0 
 activity:1.0               magneticio/vamp-music-activity:1.0.0    
 allocation                 javascript                              
 gateway:1.0                magneticio/vamp-music-gateway:1.0.0     
 web-client:1.0             magneticio/vamp-music-web-client:1.0.0  
 profile-mongo              mongo:latest                            
 runner:2                   magneticio/sava:runner_1.0              
 auth-redis                 redis:latest                     
```

```
$ vamp list deployments
 NAME                  CLUSTERS        PORTS                     STATUS 
 simpleservice:1.0.0   simpleservice   simpleservice.web:40010   Deployed 
```

[Full list of available CLI commands](/documentation/cli/cli-reference/)

## CI and chaining

In more complex continuous integration situations you can use the CLI with the `--stdin` flag to chain a bunch of commands together. You could for instance:

* generate a new breed based on the previous one, while inserting a new deployable
* create the breed in the backend

```bash
vamp generate breed --source my_service:1.0.0 --deployable repo/image:1.1.0 --target my_service:1.1.0 | \ 
vamp create breed --stdin
```

Once you have the new breed stored, you can insert it into a running deployment at the right position, i.e:

* generate a new blueprint with `generate` while inserting a new breed
* create the blueprint in the backend

```bash
vamp generate blueprint --source my_blueprint:1.0.0 --cluster my_cluster --breed my_service:1.1.0 --target my_blueprint:1.1.0 | \
vamp create blueprint --stdin
```

After this, just deploy...

```bash
vamp deploy my_blueprint:1.1.0 my_deployment
```

Or merge to an existing deployment

```bash
vamp merge my_blueprint:1.1.0 my_deployment
```
