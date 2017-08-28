---
date: 2016-09-13T09:00:00+00:00
title: Workflows
menu:
  main:
    identifier: "workflows-v093"
    parent: "Using Vamp"
    weight: 120
---

{{< note title="The information on this page is written for Vamp v0.9.3" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/workflows).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp workflows are a convenient way to run Node JS based scripts that access the Vamp API to monitor and interact with running services. JavaScript workflows run in Vamp workflow agent containers ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)) and are managed just like any other container inside your cluster, making them robust, scalable and dynamic. Workflows can be scheduled to run as a daemon, be triggered by Vamp events or to run at specified times. 

Vamp ships with four default workflows:

* Health  - checks and stores the status of running services. Events stored by the health workflow are used by the Vamp UI.
* Metrics - stores metrics on running services. Events stored by the metrics workflow are used by the Vamp UI.
* Kibana - supports the easy creation of Kibana dashboards.
* Allocation - calculates resource usage (CPU, memory)

You can create your own workflows using Node JS based scripts running inside a Vamp workflow agent container, or use another language of preference - create an application or script that accesses the Vamp API and build it into a Docker container to be deployed by Vamp.

## Schedules

Workflows can be scheduled to run as a daemon, be triggered by specific events or rn according to a time schedule. See the examples for each below.

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
* Try the tutorial [Create a workflow that generates events](/documentation/tutorials/create-a-workflow/)
* Read about [Sticky sessions](/documentation/using-vamp/v0.9.3/sticky-sessions/)
* Check the [API documentation](/documentation/api/v0.9.3/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
