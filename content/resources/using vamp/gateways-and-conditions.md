---
date: 2016-09-13T09:00:00+00:00
title: Gateways and conditions
---

## Gateways

Gateways are dynmic runtime entities in the Vamp eco-system. They represent load balancer rules to deployment, cluster and service instances.

There are two types of gateways:

* **Internal gateways:** created automatically for each deployment cluster, updated using the gateway/deployment API
* **External gateways:** explicitly declared either in a deployment blueprint or using the gateway API

This is an example of automatically created gateway for deployment `vamp`, cluster `sava` and port `port`.
Cluster contains 2 services `sava:1.0.0` and `sava:1.1.0` with 2 running instances each. 
```yaml
---
name: vamp/sava/port           # name
port: 40000/http               # port, either http or tcp, assigned by Vamp
active: true                   # is it running - not in case of non (yet) existing routes
sticky: none
routes:                        # routes
  vamp/sava/sava:1.0.0/port:
    weight: 50%
    instances:
    - name: vamp_6fd83b1fd01f7dd9eb7f.cda3c376-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31463
    - name: vamp_6fd83b1fd01f7dd9eb7f.cda2d915-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31292
  vamp/sava/sava:1.1.0/port:
    weight: 50%
    instances:
    - name: vamp_2e2fc6ab8a1cdbe79dc3.caa3c9e4-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31634
    - name: vamp_2e2fc6ab8a1cdbe79dc3.caa37bc3-ae26-11e5-91fb-0242f7e42bf3
      host: default
      port: 31826
```

Gateway API allows programmable routing and having external gateways gives:

- entry point to clusters, e.g. specified (but not necessarily) in deployment blueprints
- canary release and A/B testing on cross deployment level.

**Example of A/B testing of 2 deployments**

Deployment 1: `PUT /api/v1/deployments/sava:1.0`

```yaml
---
name: sava:1.0
gateways:
  9050/http: sava/port
clusters:
  sava:
    services:
      -
        breed:
          name: sava:1.0.0
          deployable: magneticio/sava:1.0.0
          ports:
            port: 8080/http
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
```


Deployment 2: `PUT /api/v1/deployments/sava:1.1`

```yaml
---
name: sava:1.1
gateways:
  9060/http: sava/port
clusters:
  sava:
    services:
      -
        breed:
          name: sava:1.1.0
          deployable: magneticio/sava:1.1.0
          ports:
            port: 8080/http
            
        scale:
          cpu: 0.2
          memory: 256MB
          instances: 2
```


Gateway (90% / 10%): `POST /api/v1/gateways`

```yaml
---
name: sava
port: 9070/http
routes:
  sava:1.0/sava/port:
    weight: 90%          # condition can be used as well
  sava:1.1/sava/port:
    weight: 10%
```

This is similar to putting both `sava:1.0.0` and `sava:1.1.0` in the same cluster but that is just because this is a basic example.
It is easy to imagine having an older legacy application and the new one and doing full canary release (or A/B testing) in seamless way by using gateways like this.

### Gateway Usage

Gateways define a set of rules for routing traffic between different services within the same cluster.
Vamp allows you to determine this in following ways:

1. by setting a **weight** in the percentage of traffic.
2. by setting a **condition** condition to target specific traffic.
3. by setting a **condition strength** in the percentage of traffic matching the condition.

You can define gateways inline in a blueprint or store them separately under a unique name and just use that name to reference them from a blueprint.

Let's have a look at a simple inline gateway. This would be used directly inside a blueprint.

```yaml
---
condition_strength: 10%  # Amount of traffic for this service in percents.
condition: User-Agent = IOS
```

> **Notice:** we added a condition named `really_cool_condition` here. This condition is actually a reference to a separately stored condition definition we stored under a unique name on the `/conditions` endpoint.

### Defining weights, condition strength and basic weight rules

For each route, weight can be set regardless of any condition.
The basic rule is the following:

- find the first condition that matches request
- if route exists, send the request to it depending on condition strength
- if based on condition strength route **should not** follow that route then send request to one from all routes based on their weights.

When defining weights, please make sure the total weight of routes always adds up to 100%.
This means that when doing a straight three-way split you give one service 34% as `33%+33%+33%=99%`. Vamp has to account for all traffic and 1% can be a lot in high volume environments.


#### Example - Route all `Firefox` and only `Firefox` users to route `service_B`:

```yaml
service_A:
  weight: 100%
service_B:
  weight: 0%
  condition_strength: 100%
  condition: user-agent == Firefox
```

#### Example - Route half of `Firefox` users to `service_B`, other half to `service_A` (80%) or `service_B` (20%):
Non `Firefox` requests will be just sent to `service_A` (80%) or `service_B` (20%).
```yaml
service_A:
  weight: 80%
service_B:
  weight: 20%
  condition_strength: 50%
  condition: user-agent == Firefox
```

## Conditions

Creating conditions is quite easy. Checking Headers, Cookies, Hosts etc. is all possible.
Under the hood, Vamp uses Haproxy's ACL's ([cbonte.github.io/haproxy-dconv - 7.1 ACL basics](http://cbonte.github.io/haproxy-dconv/configuration-1.5.html#7.1)) and you can use the exact ACL definition right in the blueprint in the `condition` field of a condition.

However, ACL's can be somewhat opaque and cryptic. That's why Vamp has a set of convenient "short codes"
to address common use cases. Currently, we support the following:

| description           | syntax                       | example                  |
| ----------------------|:----------------------------:|:------------------------:|
| match user agent      | `user-agent ==` _value_          | `user-agent == Firefox`    |
| mismatch user agent   | `user-agent !=` _value_          | `user-agent != Firefox`    |
| match host            | `host ==` _value_                | `host == localhost`        |
| mismatch host         | `host !=` _value_                | `host != localhost`       |
| has cookie            | `has cookie` _value_             | `has cookie vamp`          |
| misses cookie         | `misses cookie` _value_          | `misses cookie vamp`       |
| has header            | `has header` _value_             | `has header ETag`          |
| misses header         | `misses header` _value_          | `misses header ETag`       |
| match cookie value    | `cookie` _name_ `has` _value_    | `cookie vamp has 12345`    |
| mismatch cookie value | `cookie` _name_ `misses` _value_ | `cookie vamp misses 12345` |
| header has value      | `header` _name_ `has` _value_   | `header vamp has 12345`    |
| header misses value   | `header` _name_ `misses` _value_ | `header vamp misses 12345` |

* Additional syntax examples: [github.com/magneticio/vamp - ConditionDefinitionParserSpec.scala](https://github.com/magneticio/vamp/blob/master/model/src/test/scala/io/vamp/model/parser/ConditionDefinitionParserSpec.scala).

Vamp is also quite flexible when it comes to the exact syntax. This means the following are all equivalent:

In order to specify plain HAProxy ACL, ACL needs to be between `{ }`:

```yaml
condition: "< hdr_sub(user-agent) Chrome >"
```

Having multiple conditions in a condition is perfectly possible. For example, the following condition would first check whether the string "Chrome" exists in the User-Agent header of a
request and then it would check whether the request has the header
"X-VAMP-MY-COOL-HEADER". So any request matching both conditions would go to this service.

```yaml
---
gateways:
  weight: 100%
  condition: "User-Agent = Chrome AND Has Header X-VAMP-MY-COOL-HEADER"
```

Using a tool like httpie ([github.com/jkbrzt/httpie](https://github.com/jakubroztocil/httpie)) makes testing this a breeze.

    http GET http://10.26.184.254:9050/ X-VAMP-MY-COOL-HEADER:stuff

### Boolean expression in conditions

Vamp supports `AND`, `OR`, negation `NOT` and grouping `( )`:

```yaml
---
gateways:
  weight: 100%
  condition: (User-Agent = Chrome OR User-Agent = Firefox) AND has cookie vamp
```

* Additional boolean expression examples: [github.com/magneticio/vamp - BooleanParserSpec.scala](https://github.com/magneticio/vamp/blob/master/model/src/test/scala/io/vamp/model/parser/BooleanParserSpec.scala).

### URL path rewrite

Vamp also supports URL path rewrite which can be powerful solution in defining service APIs (e.g. RESTful) outside of application service.

```yaml
routes:
  web/port1:
    rewrites:
    - path: a if b
  web/port2:
    weight: 100%
```

Path rewrite is defined in format: `path: NEW_PATH if CONDITION`:

- `NEW_PATH` new path to be used; HAProxy variables are supported, e.g. `%[path]`
- `CONDITION` condition using HAProxy directives, e.g. matching path, method, headers etc.

### Vamp managed and external routes

Vamp managed routes are in the format:

- `gateway` - pointing to another gateway, e.g. it is possible to chain gateways
- `deployment/cluster` - pointing to deployment cluster, i.e. services are not 'visible'
- `deployment/cluster/service` - pointing to specific service within deployment cluster

All examples above cover only Vamp managed routes.
It is also possible to route traffic to specific IP or hostname and port.
In that case IP or hostname and port need to be specified between brackets, e.g. `[hostname:port]` (and double quotes due to Yaml syntax).

```yaml
name: mesos
port: 8080/http
sticky: route

routes:
  "[192.168.99.100:5050]":
    weight: 50%
  "[localhost:5050]":
    weight: 50%
```

## Where next?

* Read about [Events](/resources/using-vamp/events/)
* check the [API documentation](/resources/api-documentation/)
* [Try Vamp](/try-vamp)