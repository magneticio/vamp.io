---
date: 2016-09-13T09:00:00+00:00
title: Workflows
menu:
  main:
    parent: "Using Vamp"
    weight: 120
---

{{< note title="The information on this page is written for Vamp v0.9.1" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/workflows).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

A "workflow" is an automated change of the running system and its deployments and gateways. 
Changing the number of running instances based on metrics (e.g. SLA) is an example of a workflow. 
A workflow can be seen as a recipe or solution, however it has a more generic meaning not just related to "problematic" situations.


Another example is a workflow that will decide automatically if a new version, when doing a canary release, should be accepted or not. 
For instance, push the route up to 50% of traffic to the new version, compare metrics over some time (e.g. frequency of 5xx errors, response time), change to 100% and remove the old version. 
This workflow could define the rate of the transitions (e.g. 5% -> 10% -> 25%, ...) as well.

## Rationale

Workflows allow closing the feedback loop: deploy, measure, **react**.
Vamp workflows are based on running separate services (breeds) and in its simplest form scripting can be used - e.g. `application/javascript` breeds. 
Scripting allows experimentation with different features and if the feature is common and generic enough, it could be supported later in Vamp DSL.
Since workflows are running breeds in similar way as in deployments (blueprints), all other breed features are supported - ports, environment variables etc.

## Workflow API

* Each workflow is represented as an artifact and they follow basic CRUD operation patterns as any other artifact:
```
  /api/v1/workflows
```

Each workflow has to have:

 - `name`
 - `breed` - either reference or inline definition, similar to blueprints
 - `schedule` 
 - `scale` - optional
 - `environment_variables` (or `env`)- overrides breed environment variables
 - `arguments`- Docker arguments, overrides default configuration arguments and breed arguments

Example:

```yaml
---
name: metrics
breed: metrics   # breed reference, inline definition can be also used
schedule: daemon
scale:           # inline scale, reference definition can be also used, e.g. scale: small
  cpu: 1
  memory: 128MB
  instances: 2
environment_variables:
  interval: 5s
```

### Schedule

Following schedule types are supported:

- `daemon`
- `event` with `tags` (set)
- `time` - `period`, `start` (optional, by default starts now) and `repeat` (optional, by default runs forever) 

Examples:

```yaml
---
schedule: daemon
  
# time schedule

schedule:
  time:
    period: P1Y2M3DT4H5M6S
    start: now # or e.g. start: 2016-12-03T08:15:30Z
    repeat: 10

# event schedule

schedule:
  event: # event with following tags will trigger the workflow
  - deployments:sava
  - cluster:runner
  
# or shorten notation in case of single event (still array can be used as above)

schedule:
  event: archive:bluprints

```
      
Time schedule period is in [ISO8601](http://en.wikipedia.org/wiki/ISO_8601) repeating interval notation.

Example:

```yaml
---
name    : metrics
schedule: daemon
breed   :
  name: metrics
  deployable:
    type: application/javascript
    definition: |
      'use strict';
      
      var _ = require('lodash');
      var vamp = require('vamp-node-client');
      
      var api = new vamp.Api();
      var metrics = new vamp.Metrics(api);
      
      var period = 5;  // seconds
      var window = 30; // seconds
      
      var process = function() {
        api.gateways(function (gateways) {
          _.forEach(gateways, function(gateway) {
            metrics.average({ 
              ft: gateway.lookup_name 
            }, 'Tt', window, function(total, rate, responseTime) {
              api.event(['gateways:' + gateway.name, 'metrics:rate'], rate);
              api.event(['gateways:' + gateway.name, 'metrics:responseTime'], responseTime);
            });
          });
        });ß
      };
      
      setInterval(process, period * 1000);
```

{{< note title="Note!" >}}
Probably it would be better to keep breed as a reference and create breed as shown below:
{{< /note >}}

```
PUT Content-Type: application/javascript /api/v1/breeds/metrics
```
```javascript
'use strict';

var _ = require('lodash');
var vamp = require('vamp-node-client');

var api = new vamp.Api();
var metrics = new vamp.Metrics(api);

var period = 5;  // seconds
var window = 30; // seconds

var process = function() {
  api.gateways(function (gateways) {
      _.forEach(gateways, function(gateway) {
          metrics.average({ ft: gateway.lookup_name }, 'Tt', window, function(total, rate, responseTime) {
              api.event(['gateways:' + gateway.name, 'metrics:rate'], rate);
              api.event(['gateways:' + gateway.name, 'metrics:responseTime'], responseTime);
          });
      });
  });
};

setInterval(process, period * 1000);
```



JavaScript breeds will be executed by Vamp Workflow Agent ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)).  

For additional JavaScript API check out Vamp Node Client ([github.com/magneticio - Vamp node client](https://github.com/magneticio/vamp-node-client)) project.

{{< note title="What next?" >}}
* Read about [Sticky sessions](/documentation/using-vamp/v0.9.1/sticky-sessions/)
* Check the [API documentation](/documentation/api/v0.9.1/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
