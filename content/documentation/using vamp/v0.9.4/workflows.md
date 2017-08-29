---
date: 2016-09-13T09:00:00+00:00
title: Workflows
menu:
  main:
    identifier: "workflows-v094"
    parent: "Using Vamp"
    weight: 40
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/workflows).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Vamp workflows are a convenient way to run Node JS based scripts that access the Vamp API to monitor and interact with running services. JavaScript workflows run in Vamp workflow agent containers ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)) and are managed just like any other container inside your cluster, making them robust, scalable and dynamic. Workflows can be scheduled to run as a daemon, be triggered by Vamp events or to run at specified times. 

Vamp ships with four default workflows:

* Health  - checks and stores the status of running services. Events stored by the health workflow are used by the Vamp UI.
* Metrics - stores metrics on running services. Events stored by the metrics workflow are used by the Vamp UI.
* Kibana - supports the easy creation of Kibana dashboards.
* Allocation - calculates resource usage (CPU, memory)

{{< note title="System breeds" >}}
The following breeds are required by system workflows and should not be deleted: allocation, health, kibana, metrics, vamp-workflow-javascript
{{< /note >}}

### On this page:
- [Track running workflows](/documentation/using-vamp/v0.9.4/workflows/#track-running-workflows)
- [Create a workflow](/documentation/using-vamp/v0.9.4/workflows/#create-a-workflow)
  * [Workflow schedules](/documentation/using-vamp/v0.9.4/workflows/#workflow-schedules)
  * [Workflow dialects](/documentation/using-vamp/v0.9.4/workflows/#workflow-dialects)
- [JavaScript workflows](/documentation/using-vamp/v0.9.4/workflows/#javascript-workflows)

## Track running workflows

You can track executions of a running workflow in the Vamp UI. From the **Workflows** page, click on a workflow port to open the execution list. Click on a specific execution to open its log.

![](/images/screens/v094/workflow_execution_list.png)

## Create a workflow

Workflows can be created using Node JS based scripts running inside a Vamp workflow agent container, or use another language of preference - create an application or script that accesses the Vamp API and build it into a Docker container to be deployed by Vamp.  
Vamp tracks all revisions made to workflows and breeds, so you can check back and compare the current version against a previous version.

Try it yourself: [Create a workflow that generates events](/documentation/tutorials/create-a-workflow/)

### Workflow schedules

You can schedule a workflow to run as a daemon, be triggered by specific events or run according to a time schedule. See the examples for each below.

* **Scheduled as a daemon**  
A workflow scheduled as a daemon will run continuously.

  ```
  schedule: daemon
  ```

* **Triggered by events**  

```  
schedule:
  event: # event with following tags will trigger the workflow
  - deployments:sava
  - cluster:runner

schedule:  # shortened notation in case of single event (still array can be used as above)
  event: archive:bluprints
```

* **Scheduled by time**  
`period`, `start` (optional, by default starts now) and `repeat` (optional, by default runs forever). The time schedule period is in [ISO8601](http://en.wikipedia.org/wiki/ISO_8601) repeating interval notation.   
  For example:  

```
schedule:
  time:
    period: P1Y2M3DT4H5M6S
    start: now # or e.g. start: 2016-12-03T08:15:30Z
    repeat: 10
```

### Workflow dialects
You can use dialects to specify native commands for the underlying container platform in a workflow.  
[Read more about Vamp dialects](/documentation/using-vamp/v0.9.4/dialects/)

## JavaScript workflows
JavaScript workflows are executed by Vamp Workflow Agent ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)).  The system breed **vamp-workflow-javascript** is used to apply the standard enviroment variables, health checks and exposed ports.   
Instructions for using JavaScript to access the Vamp API can be found in the Vamp Node Client project ([github.com/magneticio - Vamp node client](https://github.com/magneticio/vamp-node-client)).

### Example: Metrics workflow and breed
The below examples show a JavaScript workflow with a separately stored JavaScript breed. All additional environment variables, health checks, ports and scale will be added from the **vamp-workflow-javascript** breed.
```
name    : metrics
breed   : metrics
schedule: daemon
environment_variables:
  VAMP_WORKFLOW_EXECUTION_PERIOD:  5
  VAMP_WORKFLOW_EXECUTION_TIMEOUT: 7
```

The JavaScript breed referenced in the metrics workflow will be executed by Vamp Workflow Agent ([github.com/magneticio - Vamp workflow agent](https://github.com/magneticio/vamp-workflow-agent)).  
You could create a Javascript breed by sending the required JavaScript directly to the API to store as a breed:

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
* Read about [Vamp Blueprints](/documentation/using-vamp/v0.9.4/blueprints/)
* Check the [API documentation](/documentation/api/v0.9.4/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
