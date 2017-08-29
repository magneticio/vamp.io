---
date: 2016-09-13T09:00:00+00:00
title: Config
menu:
  main:
    parent: "API"
    identifier: "api-reference-config-093"
    weight: 70
---

Vamp's parameters can be retrieved from the `/config` APi endpoint. Read more about [Vamp configuration](/documentation/configure/configure-vamp)
	
## Actions
 
 * [List](/documentation/api/v0.9.3/api-config/#list-config) - returns a full list of all config parameters.
 * [Get](/documentation/api/v0.9.3/api-config/#get-specific-config-parameter) - explicitly request a specific config parameter.

## Config parameters
Config parameters are described in detail in the [configuration reference](/documentation/configure/configuration-reference).  
The example below is in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.3/using-the-api) for details on how to set this. 

```
vamp.container-driver.rancher.workflow-name-prefix: {...}
vamp.workflow-driver.workflow.scale.cpu: {...}
vamp.http-api.ui.index: {...}
vamp.stats.timeout: {...}
vamp.operation.synchronization.period: {...}
vamp.workflow-driver.type: {...}
vamp.common.http.client.tls-check: {...}
vamp.http-api.response-timeout: {...}
vamp.workflow-driver.workflow.deployables."application/javascript".type: {...}
vamp.lifter.artifact.files:
- {...}
- {...}
vamp.gateway-driver.elasticsearch.metrics.type: {...}
vamp.container-driver.rancher.environment.deployment.name-prefix: {...}
vamp.lifter.pulse.enabled: {...}
vamp.operation.deployment.scale.instances: {...}
vamp.persistence.key-value-store.consul.url: {...}
vamp.container-driver.mesos.url: {...}
vamp.operation.gateway.virtual-hosts.formats.deployment-cluster-port: {...}
vamp.lifter.artifact.override: {...}
vamp.persistence.key-value-store.zookeeper.servers: {...}
vamp.workflow-driver.workflow.command: {...}
vamp.container-driver.marathon.password: {...}
vamp.gateway-driver.elasticsearch.metrics.index: {...}
vamp.container-driver.marathon.user: {...}
vamp.container-driver.type: {...}
vamp.persistence.database.key-value.caching: {...}
vamp.container-driver.marathon.sse: {...}
vamp.workflow-driver.workflow.network: {...}
vamp.container-driver.kubernetes.create-services: {...}
vamp.operation.gateway.response-timeout: {...}
vamp.container-driver.rancher.environment.name: {...}
vamp.operation.sla.period: {...}
vamp.container-driver.marathon.workflow-name-prefix: {...}
vamp.workflow-driver.workflow.scale.instances: {...}
vamp.gateway-driver.haproxy.virtual-hosts.ip: {...}
vamp.operation.synchronization.check.cpu: {...}
vamp.workflow-driver.workflow.arguments: {...}
vamp.gateway-driver.haproxy.template: {...}
vamp.model.default-deployable-type: {...}
vamp.persistence.database.elasticsearch.response-timeout: {...}
vamp.http-api.port: {...}
vamp.container-driver.kubernetes.url: {...}
vamp.operation.escalation.period: {...}
vamp.container-driver.marathon.url: {...}
vamp.persistence.key-value-store.zookeeper.connect-timeout: {...}
vamp.pulse.elasticsearch.index.name: {...}
vamp.container-driver.docker.repository.password: {...}
vamp.persistence.database.elasticsearch.url: {...}
vamp.container-driver.rancher.user: {...}
vamp.workflow-driver.workflow.environment-variables:
- VAMP_URL={...}
- VAMP_KEY_VALUE_STORE_PATH={...}
- VAMP_KEY_VALUE_STORE_TYPE={...}
- VAMP_KEY_VALUE_STORE_CONNECTION={...}
- VAMP_WORKFLOW_EXECUTION_PERIOD={...}
- VAMP_WORKFLOW_EXECUTION_TIMEOUT={...}
vamp.container-driver.kubernetes.bearer: {...}
vamp.gateway-driver.response-timeout: {...}
vamp.gateway-driver.haproxy.http-log-format: {...}
vamp.operation.metrics.window: {...}
vamp.persistence.database.type: {...}
vamp.http-api.ui.directory: {...}
vamp.lifter.artifact.postpone: {...}
vamp.operation.synchronization.check.instances: {...}
vamp.pulse.elasticsearch.url: {...}
vamp.container-driver.kubernetes.token: {...}
vamp.operation.gateway.virtual-hosts.enabled: {...}
vamp.http-api.strip-path-segments: {...}
vamp.container-driver.rancher.password: {...}
vamp.operation.deployment.scale.memory: {...}
vamp.info.timeout: {...}
vamp.gateway-driver.haproxy.virtual-hosts.port: {...}
vamp.operation.synchronization.initial-delay: {...}
vamp.operation.deployment.arguments:
- privileged={...}
vamp.persistence.key-value-store.base-path: {...}
vamp.workflow-driver.chronos.url: {...}
vamp.operation.check.memory: {...}
vamp.container-driver.rancher.url: {...}
vamp.operation.synchronization.mailbox.mailbox-capacity: {...}
vamp.persistence.key-value-store.type: {...}
vamp.workflow-driver.workflow.scale.memory: {...}
vamp.lifter.artifact.enabled: {...}
vamp.pulse.response-timeout: {...}
vamp.operation.synchronization.mailbox.mailbox-type: {...}
vamp.http-api.sse.keep-alive-timeout: {...}
vamp.gateway-driver.haproxy.tcp-log-format: {...}
vamp.pulse.type: {...}
vamp.operation.health.window: {...}
vamp.container-driver.docker.repository.username: {...}
vamp.workflow-driver.workflow.deployables."application/javascript".definition: {...}
vamp.operation.synchronization.check.memory: {...}
vamp.persistence.key-value-store.zookeeper.session-timeout: {...}
vamp.operation.gateway.virtual-hosts.formats.deployment-port: {...}
vamp.container-driver.kubernetes.service-type: {...}
vamp.container-driver.kubernetes.vamp-gateway-agent-id: {...}
vamp.operation.synchronization.timeout.ready-for-undeployment: {...}
vamp.container-driver.docker.workflow-name-prefix: {...}
vamp.container-driver.kubernetes.workflow-name-prefix: {...}
vamp.persistence.key-value-store.etcd.url: {...}
vamp.gateway-driver.host: {...}
vamp.operation.gateway.virtual-hosts.formats.gateway: {...}
vamp.container-driver.docker.repository.server-address: {...}
vamp.http-api.host: {...}
vamp.lifter.artifact.resources: {...}
vamp.lifter.persistence.enabled: {...}
vamp.workflow-driver.response-timeout: {...}
vamp.gateway-driver.haproxy.socket-path: {...}
vamp.operation.check.instances: {...}
vamp.info.message: {...}
vamp.gateway-driver.haproxy.ip: {...}
vamp.gateway-driver.haproxy.version: {...}
vamp.persistence.database.elasticsearch.index: {...}
vamp.operation.check.cpu: {...}
vamp.operation.gateway.port-range: {...}
vamp.http-api.interface: {...}
vamp.container-driver.docker.repository.email: {...}
vamp.persistence.response-timeout: {...}
vamp.operation.deployment.scale.cpu: {...}
vamp.pulse.elasticsearch.index.time-format.event: {...}
vamp.operation.synchronization.timeout.ready-for-deployment: {...}
```

------------------

## List config

Return the applied backend Vamp configuration. 

### Request

* `GET`
* `/api/v1/config`
* The request body should be empty.

### Response
If successful, will return a list of [all config parameters](/documentation/api/v0.9.3/api-config/#config-parameters). Parameters are described in detail in the [configuration reference](/documentation/configure/configuration-reference).  

------------------

## Get specific config parameter

Return a specific config parameter. 

### Request

* `GET` 
* `/api/v1/config/{paramater_name}`
* The request body should be empty.

### Response
If successful, will return the specified [config parameter](/documentation/api/v0.9.3/api-config/#config-parameters). 

### Errors
* **empty response body** - the named config parameter does not exist.


#### Example - explicitly request the configured Vamp info message
Request:

	GET <vamp url>/api/v1/config/vamp.info.message
	
Response:

```
!!map 'Hi, I''m Vamp! How are you?'
```

------------------
