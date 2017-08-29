---
date: 2016-09-13T09:00:00+00:00
title: Debug
menu:
  main:
    parent: "API"
    identifier: "api-reference-debug-092"
    weight: 80
---

## Actions
 
 * [Force sync](/documentation/api/v0.9.2/api-debug/#force-sync)
 * [Force SLA check](/documentation/api/v0.9.2/api-debug/#force-sla-check)
 * [Force escalation](/documentation/api/v0.9.2/api-debug/#force-escalation) 

-------------------

### Force sync

Forces Vamp to perform a synchronization cycle, regardless of the configured default interval.

	GET /api/v1/sync
	
### Force SLA check	

Forces Vamp to perform an SLA check, regardless of the configured default interval.

	GET /api/v1/sla

### Force escalation	

Forces Vamp to perform an escalation check, regardless of the configured default interval.

	GET /api/v1/escalation
