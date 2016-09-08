---
title: System & Debug
weight: 1000
menu:
  main:
    parent: api-reference
---

# System

Vamp provides a set of API endpoints that help with getting general health/configuration status.

## Get runtime info

Lists information about Vamp's JVM environment and runtime status. 
Also lists info for configured persistence layer and container driver status.

	GET /api/v1/info
	
Sections are `jvm`, `persistence`, `key_value`, `pulse`, `gateway_driver`, `container_driver` and `workflow_driver`:

```yaml
{
    "message": "...",
    "version": "...",
    "uuid": "...",
    "running_since": "...",
    "jvm": {...},
    "persistence": {...},
    "key_value": {...},
    "pulse": {...},
    "gateway_driver": {...},
    "container_driver": {...},
    "workflow_driver": {...}
}
```

Explicitly requesting only some sections (e.g. `jvm` and `persistence`) using parameter(s) `on`:

	GET /api/v1/info?on=jvm&on=persistence

## Get Vamp configuration

	GET /api/v1/config

## Get HAProxy configuration

	GET /api/v1/haproxy

# Debug 

## Force sync

Forces Vamp to perform a synchronization cycle, regardless of the configured default interval.

	GET /api/v1/sync
	
## Force SLA check	

Forces Vamp to perform an SLA check, regardless of the configured default interval.

	GET /api/v1/sla

## Force escalation	

Forces Vamp to perform an escalation check, regardless of the configured default interval.

	GET /api/v1/escalation
