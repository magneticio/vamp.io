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

# Example of time trigger:
period: P1Y2M3DT4H5M6S
startTime: 2007-12-03T10:15:30+02:00 # optional, if not set then it's now
repeatCount: 3 # optional, if not specified then it's indefinite

# Event based trigger - if any Vamp event matches specified tags, 
# workflow will be triggered.
tags:
- deployment
- cluster

# Either reference to the workflow (by name)
workflow: logger
# or embedded script if no workflow is referenced.
script: |
  log.debug("hi there!")

```
      
Time trigger period is in [ISO8601](http://en.wikipedia.org/wiki/ISO_8601) repeating interval notation.
For further reference check also [Vamp Workflow Agent](https://github.com/magneticio/vamp-workflow-agent) project.
