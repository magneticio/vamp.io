---
date: 2016-09-13T09:00:00+00:00
title: Using the Vamp CLI
menu:
  main:
    parent: "CLI"
    weight: 10
---

[![Build Status](https://travis-ci.org/magneticio/vamp-cli.svg?branch=master)](https://travis-ci.org/magneticio/vamp-cli)

## Installation

Vamp CLI EE is a Node.js package. Install it globally and export the host address of your Vamp installation via `VAMP_HOST`.

```bash
npm install -g vamp-cli-ee
export VAMP_HOST=http://vamp-host
vamp --help
```

You will need to authenticate and provide the correct namespace to further use the CLI

## Tokens & Namespaces

To use the CLI, you need have an API token and set the correct namespace.

- API token: can be set by `export VAMP_TOKEN=<token uuid>` or as an CLI argument `--token <token uuid>` 
- Namespace: can be set by `export VAMP_NAMESPACE=<namespace uuid>` or as an CLI argument `--namespace <namespace uuid>` 


### Logging in as a non admin

If you do not have the access rights to create a token, your Vamp admin should provide you with one. Also,
you should be provided with the correct namespace UUID.

```bash
# Logging in will prompt you to request an API token from your admin
vamp login -u tim -p password
You do not have enough rights to create an API token, please request a token from your Vamp admin. Then add the token
to your request using the "--token [token]" syntax or export as VAMP_TOKEN

# Once you have the token and namespace, you can proceed
export VAMP_TOKEN=3366ca4397f87f5de6bc9b5863f37efb46f4bc6f4d9626e
export VAMP_NAMESPACE=6d1339c7c7a1ac54246a57320bb1dd15176ce29

# You can now use the CLI
vamp list deployments
NAME   CLUSTERS                   PORTS                                                                STATUS
sava   sava, backend1, backend2   sava.webport:40000, backend1.webport:40002, backend2.webport:40001   Deployed
```

Credentials are evaluated in the following order:
1. passed in on CLI with --namespace etc
2. passed in via ENV vars
3. passed in via `~/.vamp` file. This file is written when logging in as an admin


### Logging in as an admin

Admins are a bit different from other users:
- They can generate their own API access tokens
- They can query the organisation namespace for users, roles, tokens, environments etc.

```bash
# Logging in when you are an admin sets the admin namespace as default
vamp login -u admin -p password
Login successful

# You can now query the organisation namespace
vamp list users
NAME    ROLES
Bob     qa
Admin   admin
Tim     developer
Jason   developer

# Querying a specific environment artifacts requires setting the namespace. First get a list of the available namespaces
vamp list namespaces
NAME          UUID
test          6d1339c7c7a1ac54246a57320bb1dd15176ce29
prod          51b1a5465f4ea62adf537b4f72bb23dc096ce6ca

# Then set the namespace as cli parameters, or export it as an environment variable, `export VAMP_NAMESPACE=<uuid>`. Bot methods are equivalent.
export VAMP_NAMESPACE=6d1339c7c7a1ac54246a57320bb1dd15176ce29
vamp list deployments
NAME   CLUSTERS                   PORTS                                                                STATUS
sava   sava, backend1, backend2   sava.webport:40000, backend1.webport:40002, backend2.webport:40001   Deployed
```

> Admin credentials are written to a `.vamp` file in the user's home directory. 

## Note for Windows users

On Windows, the '%' sign is reserved. The Vamp CLI uses this character when updating the weight on gateways.
You need to surround the ``--weights` command argument with double quotes `"`, i.e.

```
vamp update-gateway myDeployment/myService/web --weights "route1@50%,route2@50%"
```

## Examples

```bash
# deploy a blueprint from a stored blueprint
vamp deploy myService:1.0.0 myDeployment

# deploy a blueprint directly from a file and wait for the deploy to finish
vamp deploy -f blueprint.yml myDeployment --wait

# get the details of a deployment
vamp describe deployment myDeployment

# merge a blueprint to a running deployment
vamp merge myService:1.1.0 myDeployment

# get the details of a gateway
vamp describe gateway myDeployment/myService/web

# set a condition on specific route in a gateway
vamp update-gateway myDeployment/myService/web --route  myDeployment/myCluster/myService:1.1.0/web --condition "User-Agent == Safari" --strength 100%

# set the weight distribution on set of routes in a gateway
vamp update-gateway myDeployment/myService/web --weights myDeployment/myCluster/myService:1.0.0/web@50%,myDeployment/myCluster/myService:1.1.0/web@50%

# undeploy a complete deployment, waiting for the undeploy to finish
vamp undeploy myDeployment --wait

# undeploy a specific service of a deployment
vamp undeploy myDeployment --service myService:1.0.0

# list metrics, filtered with tags and paginated
vamp list events --tags metrics --per-page 10 --page 1
# list all the roles
vamp list roles

# using environment variable for token and namespace
export VAMP_TOKEN=14b8a1e541edc87839d288368f0f0b7639509594cd934d61
export VAMP_NAMESPACE=851ff948633b26de75ffea856b1bb10d414df47d
vamp list roles

# see details of a role
vamp describe role admin

# create a role
vamp create role -f createRole.json

# delete a role
vamp delete role myrole2

# list all users
vamp list users

# see details of an user
vamp describe user admin

# create a user
vamp create user -f createUser.json

# delete an user
vamp delete user abc

# list all tokens
vamp list tokens

# see details of a token
vamp describe token mytoken

# create a token
vamp create token -f createToken.json

# delete an user
vamp delete token mytoken

# login
vamp login -u user -p passw0rd

# show stored token
vamp credentials
```

## Using the CLI programmatically

You can include the vamp-cli-ee package in your code. It will expose the `api` object which you can use to interact with
Vamp in your Node.js code.
Configure the host by either setting the `VAMP_HOST` environment variable or pass in a config object with a `host` entry


```javascript
const vamp = require('vamp-cli-ee/src/api')({ host: 'http://localhost:8080', token: <token>, namespace: <namespace> })

vamp.breed.list()
  .then(res => console.info(res))

vamp.deployment.get('mydeployment')
.then(res => console.info(res))

```

Checkout the `api.md` file for jsDoc styled API docs
