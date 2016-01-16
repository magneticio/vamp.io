---
title: Workflows
weight: 100
menu:
  main:
    parent: using-vamp
    identifier: using-workflows    
---

# Workflows

A "workflow" is an automated change of the running system and its deployments. Changing number of running instances based on metrics (e.g. SLA) is an example of a workflow. A workflow can be seen as a recipe or solution, however it has more generic meaning not just related to a "problematic" situation.


Another example is a workflow that will decide automatically if a new version, when doing a canary release, should be accepted or not. For instance, push the route up to 50% of traffic to the new version, compare metrics over some time (e.g. frequency of 5xx errors, response time), change to 100% and remove the old version. This workflow could define the rate of the transitions (e.g. 5% -> 10% -> 25%, ...) as well.

## Rationale

Workflows allow closing the feedback loop: deploy, measure, **react**.
Vamp workflows are based on scripting - scripting allows experimentation with different features and if the feature is common and generic enough, it could be supported later in DSL itself.

## Workflow API

* Each workflow is represented as an artifact and they follow basic CRUD operation patterns as any other artifact:
```
  /api/v1/workflows
```

* Scheduled workflow are artifacts consisted of an embedded or reference workflow and its trigger (time or event based):
```
  /api/v1/scheduled-workflows
```

### Scripting

Workflow example:

```yaml
# Name of the workflow, mandatory.
name: logger

# Optional script to be included before the execution of the main script.
import:
- http://underscorejs.org/underscore-min.js # External (http) script.
- vamp.js                                   # Reference to another 
                                            # workflow (by name).

# Optional variables expected to be set before the execution.
requires:
- deployment
- cluster

# Script.
script: log.info("hi")
```

Scheduled workflow example:

```yaml
# Mandatory name of the scheduling.
name: logger-schedule

# Triggers can be deployment (created, updated or deleted), 
# event and time based. Precedence of triggers: 
# deployment, time and then event based.

# Example of deployment trigger with specified deployment id:
deployment: 9e67a7eb-cb64-45f5-b619-fbad179afe5a

# Example of time (CRON) trigger:
time: 15 9 5 1

# Event based trigger - if any Vamp event matches specified tags, 
# workflow will be triggered.
tags:
- deployment
- cluster

# Optional script to be included before the execution.
import:
- http://underscorejs.org/underscore-min.js
- vamp.js

# Either reference to the workflow (by name)
workflow: logger
# or embedded script if no workflow is referenced.
script: log.debug("hi there!")

```

### Features

* Support for JavaScript only scripts - other languages may be supported later.
* Script has access to its trigger data:
  * deployment trigger, "tags" and "deployment"
  * time trigger - "timestamp", Unix epoch
  * event trigger - "tags"
```javascript
  _.each(tags, function(tag){ log.info(tag); }); 
```

* Script has restricted access to Java API and [Nashorn](https://docs.oracle.com/javase/8/docs/technotes/guides/scripting/nashorn/) additional functions (e.g. exit).

* Support for local storage (keeping data between executions):

```yaml
---
name: counter-schedule
time: "*/3 * * * * ?"
storage:
  counter: 0

script: |
  var counter = storage.get("counter");
  log.info(counter);
  storage.put("counter", ++counter);

  log.info(storage.getOrElse("message", "Hello World!"));
```

#### Logging API

* debug, info, warn, error:

```javascript
  log.error("alert!");
```

#### Info API
```javascript
  log.info(vamp.info().message); // logs Vamp Hi message
```

#### Event API
- add: tag(String)
- add type: type(String)
- add value: value(AnyRef)
- publish event: publish()
- time range: lt(String), lte(String), gt(String), gte(String)
- query (get all): query()
- aggregation: count(), max(), min(), average()/avg(), sum()
- reset all parameters: reset()

```javascript
  events.tag("deployments").publish();
```
```javascript
  events.tag("deployments").gt("now() - 10m").count();
```
```javascript
  var list = events.tag("servers").tag("services").query();
  // Requires underscore.js
  _.each(list, function(event){ 
    _.each(event.tags, function(tag){ log.info(tag); });
  });
```

```javascript
  /* response time is nested object
  {
    "tags": [
      "services",
      "servers",
      "metrics"
    ],
    "value": {
        "response": {
            "time": 15
        }
    },
    "timestamp": "2015-06-05T15:12:38.000Z",
    "type": "router-metric"
  }
  */
  // set tags
  events.tag("servers").tag("services")
  // log average value of complex type field.
  log.info(events.field("response.time").average());
```


#### Vamp REST API

Artifacts: breeds, blueprints, slas, scales, escalations, routings, filters, workflows, scheduled_workflows:

- all() - get all (paginated internally, problem with large data set)
- create(artifacts) - create an artifact
- update(artifacts)
- delete(artifacts)

```javascript
  function listBreeds(title) {
    log.info(title);
    var list = breeds.all();
    for (var i = 0; i < list.length; i++) {
      log.info(list[i].name + " -> " + list[i].deployable);
    }
  }

  listBreeds("Before:");

  // create a new breed
  var breed = {};
  breed.name = "sava";
  breed.deployable = "vamp/sava:1.0.0";
  breeds.create(breed);

  listBreeds("After creation:");

  // update
  breed.deployable = "vamp/sava:1.1.0";
  breeds.update(breed);

  listBreeds("After update:");

  // delete
  breed = breeds.get("sava"); // 'get' example
  breeds.delete(breed);

  listBreeds("After deletion:");
```

Deployments:

- all() - get all (paginated internally, problem with large data set)
- create(blueprint) - create a deployment
- update(name, blueprint) - update deployment (partial update)
- delete(name, blueprint) - delete deployment (or partial update)

Example of the simple canary release - on each sequential call stage is incremented starting from 0:

{{% copyable %}}
```yaml
---
name: canary
time: "*/30 * * * * ?"

storage:
  counter: 0

script: |
  var stage = storage.getOrElse("stage", 0);

  if(stage == 0) { 
    // create breeds, just to use them as reference
    breeds.create({
      "name": "sava:1.0.0",
      "deployable": "docker://magneticio/sava:1.0.0",
      "ports": {
        "port": "8080/http"
      }
    });
    breeds.create({
      "name": "sava:1.1.0",
      "deployable": "docker://magneticio/sava:1.1.0",
      "ports": {
        "port": "8080/http"
      }
    });

    // deploy the 1.0.0 service
    var deployment = deployments.create({
      "name": "sava",
      "gateways": {
        "9050/http": "sava/port"
      },
      "clusters": {
        "sava": {
          "services": [
            {
              "breed": "sava:1.0.0"
            }
          ]
        }
      }
    });
    storage.put("deployment", deployment.name);
  } else if(stage == 1) { // deploy the 1.1.0 service
    deployments.update(storage.get("deployment"), {
      "name": "sava",
      "clusters": {
        "sava": {
          "services": [
            {
              "breed": "sava:1.1.0"
            }
          ]
        }
      }
    });
  } else if(stage == 2) { // adjust weight of services
    deployments.update(storage.get("deployment"), {
      "name": "sava",
      "clusters": {
        "sava": {
          "services": [
            {
              "breed": "sava:1.0.0",
            },
            {
              "breed": "sava:1.1.0",
            }
          ],
          "routing": {
            "routes": {
              "sava:1.0.0": {
                "weight": "0%"
              },
              "sava:1.1.0": {
                "weight": "100%"
              }
            }
          }
        }
      }
    });
  } else if(stage == 3) { // delete the 1.0.0
    deployments.delete(storage.get("deployment"), {
      "name": "sava",
      "clusters": {
        "sava": {
          "services": [
            {
              "breed": "sava:1.0.0"
            }
          ]
        }
      }
    });
  }
  
  storage.put("stage", ++stage);
``` 
{{% /copyable %}}

#### HTTP API

Similar to [superagent](https://github.com/visionmedia/superagent) but synchronous.

- set header: set(name, value)
- set body: send(body)
- get request: get(url)
- post request: post(url)
- put request: put(url)
- delete request: delete(url)
- get response as string (end): string()
- get response as json (end): json()
- reset all parameters: reset()

```yaml
name: counter-schedule
time: "*/3 * * * * ?"

import:
- http://underscorejs.org/underscore-min.js

storage:
  counter: 0

script: |

  var breeds = http.get("http://localhost:8080/api/v1/breeds").json();
  _.each(breeds, function(breed){ log.info(breed); });
  
  // set custom header
  http.set("Accept", "application/x-yaml")
  // specify method (GET) and URL
  http.get("http://localhost:8080/api/v1/breeds")
  // retrieve YAML response
  var breeds = http.string();
  log.info(breeds);
  
```





#### Time API

* format(pattern: String): String
* now():  [OffsetDateTime](https://docs.oracle.com/javase/8/docs/api/java/time/OffsetDateTime.html)
* epoch() // Unix Epoch
* timestamp() == epoch()

```javascript
  log.info("now: " + time.format("dd-MM-yyyy HH:mm:SS"));
```