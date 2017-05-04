---
date: 2016-09-13T09:00:00+00:00
title: CLI reference
menu:
  main:
    parent: "CLI"
    weight: 10
---

The VAMP CLI supports the following commands:  
[create](/documentation/cli/cli-reference/#create), [deploy](/documentation/cli/cli-reference/#deploy), [generate](/documentation/cli/cli-reference/#generate), [help](/documentation/cli/cli-reference/#help), [info](/documentation/cli/cli-reference/#info), [inspect](/documentation/cli/cli-reference/#inspect), [list](/documentation/cli/cli-reference/#list), [merge](/documentation/cli/cli-reference/#merge), [remove](/documentation/cli/cli-reference/#remove), [undeploy](/documentation/cli/cli-reference/#undeploy), [update](/documentation/cli/cli-reference/#update), [version](/documentation/cli/cli-reference/#version)  
See [using the Vamp CLI](/documentation/cli/using-the-cli) for details on installation, configuration and effective use of the CLI

For details about a specific command, use `vamp COMMAND --help`

-------------
## Create

Create an artifact read from the specified filename or read from stdin.

```
vamp create blueprint|breed|deployment|escalation|condition|scale|sla [--file|--stdin]
```

Parameter | purpose
----------|--------
`--file`        |       Name of the yaml file [Optional]
`--stdin`        |      Read file from stdin [Optional]
  
#### Example
```bash
> vamp create scale --file my_scale.yaml
name: my_scale
cpu: 2.0
memory: 2GB
instances: 2
```

-------------
## Deploy

Deploys a blueprint

```
vamp deploy NAME --deployment [--file|--stdin]
```

Parameter | purpose
----------|--------
`--file`      |         Name of the yaml file [Optional]
`--stdin`     |         Read file from stdin [Optional]
`--deployment`|         Name of the deployment to update [Optional]

#### Example
```bash
> vamp deploy --deployment 1111-2222-3333-4444 --file my_new_blueprint.yaml
```

-------------
## Generate

Generates an artifact

```
vamp generate breed|blueprint|condition|scale [NAME] [--file|--stdin]
```
| Parameter | purpose |
|-----------|---------|
`--file`    |           Name of the yaml file to preload the generation [Optional]
`--stdin`   |           Read file from stdin [Optional]

### generate breed

| Parameter | purpose |
|-----------|---------|
`--deployable`  |       Deployable specification [Optional]

#### Example
```bash
> vamp generate breed my_new_breed --json
{
  "name":"my_new_breed",
  "deployable":"docker://",
  "ports":{
    
  },
  "environment_variables":{
    
  },
  "constants":{
    
  },
  "dependencies":{
    
  }
}
```

### generate blueprint

| Parameter | purpose |
|-----------|---------|
`--cluster`   |         Name of the cluster
`--breed`     |         Name of the breed   [Optional, requires --cluster]
`--scale`     |         Name of the scale   [Optional, requires --breed]

-------------
## Help

Displays the Vamp help message

#### Example
```bash
> vamp help
Usage: vamp COMMAND [args..]

Commands:
  create              Create an artifact
  deploy              Deploys a blueprint
  help                This message
  generate            Generates an artifact
  info                Information from Vamp
  inspect             Shows the details of the specified artifact
  list                Shows a list of artifacts
  merge               Merge a blueprint with an existing deployment or blueprint
  remove              Removes an artifact
  undeploy            Removes (part of) a deployment
  update              Update an artifact
  version             Shows the version of the VAMP CLI client
  
Run vamp COMMMAND --help  for additional help about the different command options
```

-------------
## Info

Displays the Vamp Info message

#### Example
```bash
> vamp info
message: Hi, I'm Vamp! How are you?
jvm:
  operating_system:
    name: Mac OS X
    architecture: x86_64
    version: 10.9.5
    available_processors: 8.0
    system_load_average: 4.8095703125
  runtime:
    process: 12871@MacMatthijs-4.local
    virtual_machine_name: Java HotSpot(TM) 64-Bit Server VM
    virtual_machine_vendor: Oracle Corporation
    virtual_machine_version: 25.31-b07
    start_time: 1433415167162
    up_time: 1305115
...    
```

-------------
## Inspect
Shows the details of the specified artifact

```
vamp inspect blueprint|breed|deployment|escalation|condition|scale|sla NAME --json
```

| Parameter | purpose |
|-----------|---------|
`--as_blueprint` | Returns a blueprint (only for inspect deployment) [Optional]|
`--json`    |  Output Json instead of Yaml [Optional]|

#### Example
```bash
> vamp inspect breed sava:1.0.0
name: sava:1.0.0
deployable: magneticio/sava:1.0.0
ports:
  port: 80/http
environment_variables: {}
constants: {}
dependencies: {}
```

-------------
## List
Shows a list of artifacts

```
vamp list blueprints|breeds|deployments|escalations|conditions|gateways|scales|slas
```

#### Example 
```bash
> vamp list deployments
NAME                                    CLUSTERS
80b310eb-027e-44e8-b170-5bf004119ef4    sava
06e4ace5-41ce-46d7-b32d-01ee2c48f436    sava
a1e2a68b-295f-4c9b-bec5-64158d84cd00    sava, backend1, backend2
```

-------------
## Merge

Merges a blueprint with an existing deployment or blueprint.
Either specify a deployment or blueprint in which the blueprint should be merged
The blueprint can be specified by NAME, read from the specified filename or read from stdin.

`vamp merge --deployment|--blueprint [NAME] [--file|--stdin]` 
      
| Parameter | purpose |
|-----------|---------|
`--file`     | Name of the yaml file [Optional]
`--stdin`    | Read file from stdin [Optional]

#### Example
```bash
vamp merge --blueprint my_existing_blueprint -- file add_this_blueprint.yaml
```

-------------
## Remove

Removes artifact

`vamp remove blueprint|breed|escalation|condition|scale|sla NAME`

#### Example
```bash
> vamp remove scale my_scale
```
-------------
## Undeploy

Removes (part of) a deployment.
By only specifying the name, the whole deployment will be removed. To remove part of a deployment, specify a blueprint. The contents of the blueprint will be subtracted from the active deployment.

`vamp undeploy NAME [--blueprint|--file|--stdin]` 

Parameter | purpose
----------|--------
`--blueprint`|    Name of the stored blueprint to subtract from the deployment
`--file`   |       Name of the yaml file [Optional]
`--stdin`  |      Read file from stdin [Optional]

#### Example
```bash
> vamp undeploy 9ec50a2a-33d7-4dd3-a027-9eeaeaf925c1 --blueprint sava:1.0
```
-------------
## Update

Updates an existing artifact read from the specified filename or read from stdin.

`vamp update blueprint|breed|deployment|escalation|condition|scale|sla NAME [--file] [--stdin]`

Parameter | purpose
----------|--------
`--file`   |      Name of the yaml file [Optional]
`--stdin`  |      Read file from stdin [Optional]

-------------
## Version

Displays the Vamp CLI version information 

#### Example
```bash
> vamp version
CLI version: 0.7.9
```
-------------

#### See also

* [Using the Vamp CLI](/documentation/cli/using-the-cli/) - installation, configuration and effective use of the CLI