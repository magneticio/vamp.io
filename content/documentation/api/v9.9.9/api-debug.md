---
date: 2016-09-13T09:00:00+00:00
title: API - Debug
menu:
  main:
    parent: "API"
    identifier: "api-reference-debug"
    weight: 120
draft: true
---

## Actions
 
 * [Force sync](/documentation/api/v9.9.9/api-debug/#force-sync)
 * [Force SLA check](/documentation/api/v9.9.9/api-debug/#force-sla-check)
 * [Force escalation](/documentation/api/v9.9.9/api-debug/#force-escalation) 

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