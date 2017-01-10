---
date: 2016-09-13T09:00:00+00:00
title: Workflows
menu:
  main:
    identifier: "workflows-v092"
    parent: "Using Vamp"
    weight: 120
aliases:
    - /documentation/using-vamp/workflows/
---

A "workflow" is an automated change of the running system and its deployments and gateways. 
Changing the number of running instances based on metrics (e.g. SLA) is an example of a workflow. 
A workflow can be seen as a recipe or solution, however it has a more generic meaning not just related to "problematic" situations.

Another example is a workflow that will decide automatically if a new version, when doing a canary release, should be accepted or not. 
For instance, push the route up to 50% of traffic to the new version, compare metrics over some time (e.g. frequency of 5xx errors, response time), change to 100% and remove the old version. 
This workflow could define the rate of the transitions (e.g. 5% -> 10% -> 25%, ...) as well.

### Rationale

Workflows allow closing the feedback loop: deploy, measure, **react**.
Vamp workflows are based on running separate services (breeds) and in its simplest form scripting can be used - e.g. `application/javascript` breeds. 
Scripting allows experimentation with different features and if the feature is common and generic enough, it could be supported later in Vamp DSL.
Since workflows are running breeds in similar way as in deployments (blueprints), all other breed features are supported - ports, environment variables etc.

## API

Each workflow is represented as an artifact and they follow basic CRUD operation patterns as any other artifact. Note that workflows must be restarted to apply changes.
```
  /api/v1/workflows
```

## Artifacts

Workflow artifacts are similar to  blueprints or deployments. Note that workflows must be restarted to apply changes.

```
---
name: metrics
breed: metrics
status: running
schedule: daemon
environment_variables:
  VAMP_WORKFLOW_EXECUTION_TIMEOUT: '7'
  VAMP_KEY_VALUE_STORE_CONNECTION: 192.168.99.100:2181
  VAMP_KEY_VALUE_STORE_PATH: /vamp/workflows/metrics
  VAMP_WORKFLOW_EXECUTION_PERIOD: '5'
  VAMP_KEY_VALUE_STORE_TYPE: zookeeper
  VAMP_URL: http://192.168.99.100:8080
scale:
  cpu: 0.1
  memory: 128.00MB
  instances: 1
```

Field name  |  Options  |  Required |  Description  
------------|-------|--------|--------
name  | - |   yes |  
breed  | - |   yes |  either a reference or inline definition, similar to blueprints. Best practice would be to store the breed separately and reference it from the workflow
status  |  running, stopping, suspending, starting, restarting |   - |  `restarting` will first suspend and then start the workflow (applying any changes since last start). `suspending` will stop a workflow from running without deleting it. `stopping` a workflow will delete it (not reversible).
schedule  | daemon, event, time |   yes |  See [schedules](/documentation/using-vamp/v0.9.2/workflows/#schedules) below
environment_variables (or env) | - |   yes (when using the Vamp workflow agent) |  overrides breed environment variables. You can provide your own variabes here. The following variables must be specified when using Vamp workflow agent: `VAMP_WORKFLOW_EXECUTION_TIMEOUT`, `VAMP_KEY_VALUE_STORE_CONNECTION`, `VAMP_KEY_VALUE_STORE_PATH`,  `VAMP_WORKFLOW_EXECUTION_PERIOD`, `VAMP_KEY_VALUE_STORE_TYPE`, `VAMP_URL`. For a workflow that will run forever, also set VAMP_API_CACHE=false (by default this is set to true)
scale  | - |   - |  when not specified, the default scale will be used

## Schedules

Workflows can be schedulde to run as a daemon, be triggered by specific events or rn according to a time schedule. See the examples for each below.

### Scheduled as a daemon
For example:
```
schedule: daemon
```

### Triggered by events
For example:
```  
schedule:
  event: # event with following tags will trigger the workflow
  - deployments:sava
  - cluster:runner

schedule:  # shortened notation in case of single event (still array can be used as above)
  event: archive:bluprints
```

### Scheduled by time
`period`, `start` (optional, by default starts now) and `repeat` (optional, by default runs forever). The time schedule period is in [ISO8601](http://en.wikipedia.org/wiki/ISO_8601) repeating interval notation.   
For example:
```
schedule:
  time:
    period: P1Y2M3DT4H5M6S
    start: now # or e.g. start: 2016-12-03T08:15:30Z
    repeat: 10
```


## Example JavaScript workflow
The below examples show a JavaScript workflow with a separately stored JavaScript breed.
JavaScript breeds are executed by Vamp Workflow Agent ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)).  For additional information on using JavaScript to access the Vamp API check out the Vamp Node Client project ([github.com/magneticio - Vamp node client](https://github.com/magneticio/vamp-node-client)).

### Metrics workflow
```
name: metrics
breed: metrics
status: running
schedule: daemon
environment_variables:
  VAMP_WORKFLOW_EXECUTION_TIMEOUT: '7'
  VAMP_KEY_VALUE_STORE_CONNECTION: 192.168.99.100:2181
  VAMP_KEY_VALUE_STORE_PATH: /vamp/workflows/metrics
  VAMP_WORKFLOW_EXECUTION_PERIOD: '5'
  VAMP_KEY_VALUE_STORE_TYPE: zookeeper
  VAMP_URL: http://192.168.99.100:8080
scale:
  cpu: 0.1
  memory: 128.00MB
  instances: 1
```

### Metrics breed
The JavaScript breed will be executed by Vamp Workflow Agent ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)).  
You can send the required JavaScript directly to the API to store as a breed:

* Request syntax:

```
PUT  
/api/v1/breeds/metrics  
Content-Type: application/javascript
```
* Request body:


```
'use strict';

let _ = require('highland');
let vamp = require('vamp-node-client');

let api = new vamp.Api();
let logger = new vamp.Log();
let metrics = new vamp.ElasticsearchMetrics(api);

let window = 30; // seconds

function publish(tags, metrics) {
  logger.log('metrics: [' + JSON.stringify(tags) + '] - ' + metrics);
  api.event(tags, metrics, 'metrics');
}

api.gateways().each(function (gateway) {

  metrics.average({ft: gateway.lookup_name}, 'Tt', window).each(function (response) {
    publish(['gateways:' + gateway.name, 'gateway', 'metrics:rate'], response.rate);
    publish(['gateways:' + gateway.name, 'gateway', 'metrics:responseTime'], response.average);
  });

  api.namify(gateway.routes).each(function (route) {
    metrics.average({ft: route.lookup_name}, 'Tt', window).each(function (response) {
      publish(['gateways:' + gateway.name, 'routes:' + route.name, 'route', 'metrics:rate'], response.rate);
      publish(['gateways:' + gateway.name, 'routes:' + route.name, 'route', 'metrics:responseTime'], response.average);
    });
  });
});
```


{{< note title="What next?" >}}
* Read about [Sticky sessions](/documentation/using-vamp/v0.9.2/sticky-sessions/)
* Check the [API documentation](/documentation/api/v0.9.2/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}