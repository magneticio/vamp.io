---
date: 2016-09-13T09:00:00+00:00
title: CLI reference
menu:
  main:
    parent: "CLI"
    weight: 20
---

The VAMP CLI supports the following commands:
[create](/documentation/cli/cli-reference/#create), [deploy](/documentation/cli/cli-reference/#deploy),
 [generate](/documentation/cli/cli-reference/#generate), [describe](/documentation/cli/cli-reference/#describe),
 [list](/documentation/cli/cli-reference/#list), [merge](/documentation/cli/cli-reference/#merge),
 [update-gateway](/documentation/cli/cli-reference/#update-gateway), [undeploy](/documentation/cli/cli-reference/#undeploy),
 [delete](/documentation/cli/cli-reference/#delete).


See [using the Vamp CLI](/documentation/cli/using-the-cli) for details on installation, configuration and effective use of the CLI
For details about a specific command, use `vamp COMMAND --help`

-------------
## Create

Create an artifact read from the specified filename or read from stdin.

```
vamp create blueprint|breed [--file|--stdin]
```

Parameter | purpose
----------|--------
`--file`        |       Name of the yaml file [Optional]
`--stdin`        |      Read file from stdin [Optional]

#### Example
```bash
# read from a file
vamp create breed --file my_breed.yaml

# read from stdin
cat my_breed.yml | vamp create breed
```

-------------
## Deploy

Deploys a blueprint

```
vamp deploy <blueprint> <deployment>
```

#### Example
```bash
vamp deploy my_blueprint my_deployment
```

-------------
## Generate

Generate a breed or blueprint based on an existing one.

```bash
vamp generate breed|blueprint
```
| Parameter | purpose |
|-----------|---------|
`--source`    |          The name of the artifact to use as a source for generating a new artifact. [Required]
`--deployable`  |        Only valid for breeds, the deployable to replace in the breed source. [Optional]
`--cluster`     |        Only valid for blueprints, the cluster to place the new breed in.' [Optional]
`--breed`       |        Only valid for blueprint, the breed to replace in the blueprint source. [Optional]
`--target`      |        The name of the to be created artifact. [Required]

#### Example
```bash
# generate a breed: pick a source, replace the deployable and output a new breed
vamp generate breed --source my_breed:1.0.0 --deployable docker-repo/my-service:1.1.0 --target my_breed:1.1.0

# generate a blueprint: pick a source, pick the cluster in the source and replace the existing breed with a new breed
vamp generate blueprint --source my_blueprint:1.0.0 --cluster my_cluster --breed my_breed:1.1.0 --target my_blueprint:1.1.0
```

-------------
## Describe
Shows the details of the specified artifact

```
vamp describe blueprint|breed|deployment|gateway|workflow <name>
```


#### Example
```bash
vamp describe deployment simpleservice:1.0.0
 SERVICE               DEPLOYABLE                       STATUS     CLUSTER         CPU   MEM        INSTANCES   RUNNING   STAGED   HEALTHY   UNHEALTHY
 simpleservice:1.0.0   magneticio/simpleservice:1.0.0   Deployed   simpleservice   0.2   128.00MB   1           n/a       n/a      n/a       n/a
 ROUTE                 WEIGHT   CONDITION   STRENGTH   GATEWAY
 simpleservice:1.0.0   100%     -           0%         web
```

-------------
## List
Shows a list of artifacts

```
vamp list blueprints|breeds|deployments|gateways|workflows
```

#### Example
```bash
vamp list workflows
 NAME                  SCHEDULE   STATUS       BREED
 kibana                daemon     running      kibana
 allocation            daemon     running      allocation
 metrics               daemon     running      metrics
 health                daemon     running      health
 event-based-trigger   event      restarting   event-based-trigger
 vga                   daemon     running      vga
```

-------------
## Merge

Merges a blueprint with an existing deployment or blueprint.

`vamp merge <blueprint> <deployment>`

#### Example
```bash
vamp merge my_blueprint my_deployment
```

-------------
## Update Gateway
Updates either weight or condition for a gateway and its routes.

```
vamp update-gateway <name>
```

Parameter | purpose
----------|--------
`--condition`|    The routing condition applied to the specified route. [Optional]
`--route` | Specifies the route to target in a gateway condition update. [Optional]
`--strength` | The condition strength in % applied to the specified route, i.e. "50%"' [Optional]
`--weights` |  A comma separated set of "route@weight" combinations to apply to each route, i.e. --weights route1@70%,route2@30%' [Optional]

#### Example
```bash
# Update the weights in a set of routes.
vamp update-gateway my_gateway --weights my_route_a@50%,my_route_a@50%

# set a condition with a strength
vamp update-gateway my_gateway--route  my_route_a --condition "User-Agent == Safari" --strength 100%
```

-------------
## Undeploy

Removes a deployment or just a service in a deployment.

`vamp undeploy <deployment>`

Parameter | purpose
----------|--------
`--service`|    Name of the service to undeploy from the deployment [Optional]

#### Example
```bash
vamp undeploy my_deployment --service my_old_service:1.0
```

-------------
## Delete
Deletes an artifact

```
vamp delete blueprint|breed|gateway|workflow <name>
```

#### Example

```bash
vamp delete breed my_breed
```


#### See also

* [Using the Vamp CLI](/documentation/cli/using-the-cli/) - installation, configuration and effective use of the CLI
