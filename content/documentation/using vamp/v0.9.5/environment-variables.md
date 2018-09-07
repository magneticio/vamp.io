---
date: 2016-09-13T09:00:00+00:00
title: Environment variables
menu:
  main:
    identifier: "environment-variables-v095"
    parent: "Using Vamp"
    weight: 100

---

Breeds, blueprints and workflows can include a list of environment variables to be injected into the container at runtime. You set environment variables with the `environment_variables` keyword or its shorter version `env`, e.g. both examples below are equivalent.

```yaml
---
environment_variables:
  PORT: 8080
```

```yaml
---
env:
  PORT: 8080
```

## 'Hard' setting a variable

You want to "hard set" an environment variable, just like doing an `export MY_VAR=some_value` in a shell. This  variable could be some external dependency you have no direct control over: the endpoint of some service you use that is out of your control. It can also be some setting you want to tweak, like `JVM_HEAP_SIZE` or `AWS_REGION`.

```yaml
---
name: java_aws_app:1.2.1
deployable: acmecorp/tomcat:1.2.1

environment_variables:
  JVM_HEAP_SIZE: 1200
  AWS_REGION: 'eu-west-1'
```

## Place holders

Place holders can be used to separate responsibilities across a company where different roles are working on the same project. For example, developers can create place holders for variables to be filled in by operations.

Use the `~` character to define a place holder for a variable that should be filled in at runtime (i.e. when this breed actually gets deployed), but for which you do not yet know the actual value.


#### Example - `ORACLE_PASSWORD` designated as a place holder

```yaml
---
name: java_aws_app:1.2.1
deployable: acmecorp/tomcat:1.2.1
environment_variables:
  JVM_HEAP_SIZE: 1200
  AWS_REGION: 'eu-west-1'
  ORACLE_PASSWORD: ~
```

## Resolving variables

Use the `$` character to reference other statements in a breed/blueprint. This allows you to dynamically resolve ports and hosts names that we don't know until a deployment is done. You can also resolve to hard coded and published constants from some other part of the blueprint or breed, typically a dependency.

{{< note title="Note!" >}}
The `$` value is escaped by `$$`. A more strict notation is `${some_reference}`
{{< /note >}}

### Vamp host variable

Vamp provides just one *magic** variable: `host`. This resolves to the host or ip address of the referenced service. Strictly speaking, the `host` reference resolves to the gateway agent endpoint, but users do not need to concern themselves with this. Users can think of one-on-one connections where Vamp actually does server-side service discovery to decouple services.


#### Example - resolving variables from a dependency

```yaml
---
name: blueprint1
clusters:
  frontend:
    breed:
      name: frontend_app:1.0
      deployable: acmecorp/tomcat:1.2.1
    environment_variables:
      MYSQL_HOST: $backend.host        # resolves to a host at runtime
      MYSQL_PORT: $backend.ports.port  # resolves to a port at runtime
    dependencies:
      backend: mysql:1.0
  backend:
    breed: mysql:1.0
```


#### Example - resolving variables from a dependency's environment variables
What if the backend is configured through some environment variable, but the frontend also needs that information? For example, the encoding type for our database. We can just reference that environment variable using the exact same syntax.

```yaml
---
name: blueprint1
clusters:
  frontend:
    breed:
      name: frontend_app:1.0
      deployable: acmecorp/tomcat:1.2.1
    environment_variables:
      MYSQL_HOST: $backend.host
      MYSQL_PORT: $backend.ports.port
      BACKEND_ENCODING: $backend.environment_variables.ENCODING_TYPE
    dependencies:
      backend: mysql:1.0
  backend:
    breed: mysql:1.0
    environment_variables:
      ENCODING_TYPE: 'UTF8'   # injected into the backend MySQL container
```

You can do everything with `environment_variables` but `constants` (see below) allow you to just be a little bit cleaner with regard to what you want to expose and what not.

## Environment variable scope

Environment variables can live on different scopes and can be overridden by scopes higher in the scope hierarchy.
A scope is an area of your breed or blueprint definition that limits the visibility of variables and references inside that scope.

1. **Breed scope**: The scope used in all the above examples is the default scope. If you never define any `environment_variables` in any other place, this will be used.

2. **Cluster scope**: Will override the breed scope and is part of the blueprint artifact. Use this to override environment variables for all services that belong to a cluster.

3. **Service scope**: Will override breed scope and cluster scope, and is part of the blueprint artifact. Use this to override all environment variables for a specific service within a cluster.

{{< note title="Note!" >}}
Effective use of scope is completely dependent on your use case. The various scopes help to separate concerns when multiple people and/or teams work on Vamp artifacts and deployments and need to decouple their effort.
{{< /note >}}

### Examples of scope use

* [Run two of the same services with different configurations](/documentation/using-vamp/v0.9.5/environment-variables/#example-1)
* [Override the JVM_HEAP_SIZE in production](/documentation/using-vamp/v0.9.5/environment-variables/#example-2)
* [Use a place holder](/documentation/using-vamp/v0.9.5/environment-variables/#example-3)
* Just for fun - [combine all scopes and references](/documentation/using-vamp/v0.9.5/environment-variables/#example-4)

#### Example 1
**Run two of the same services with different configurations**

**Use case:** As a devOps-er you want to test one service configured in two different ways at the same time. Your service is configurable using environment variables. In this case we are testing a connection pool setting.


**Implementation:** In the below blueprint we just use the breed level environment variables. The traffic is split into a 50/50 divide between both services.

```yaml
---
name: production_deployment:1.0
gateways:
  9050: frontend/port
clusters:
  frontend:
    services:
      -
        breed:
          name: frontend_app:1.0-a
          deployable: acmecorp/tomcat:1.2.1
          ports:
            port: 8080/http
          environment_variables:
            CONNECTION_POOL: 30
      -
        breed:
          name: frontend_app:1.0-b              # different breed name, same deployable
          deployable: acmecorp/tomcat:1.2.1
          ports:
            port: 8080/http
          environment_variables:
            CONNECTION_POOL: 60                 # different pool size

  gateways:
    frontend_app:1.0-a:
      weight: 50%
    frontend_app:1.0-b:
      weight: 50%
```


#### Example 2
**Override the JVM_HEAP_SIZE in production**

**Use case:** As a developer, you created your service with a default heap size you use on your development laptop and maybe on a test environment. Once your service goes "live", an ops guy/gal should be able to override this setting.

**Implementation:** In the below blueprint we override the variable `JVM_HEAP_SIZE` for the whole `frontend` cluster by specifically marking it with .dot-notation `cluster.variable`

```yaml
---
name: production_deployment:1.0
gateways:
  9050: frontend/port
environment_variables:                  # cluster level variable
  frontend.JVM_HEAP_SIZE: 2800          # overrides the breed level
clusters:
  frontend:
    services:
      -
        breed:
          name: frontend_app:1.0
          deployable: acmecorp/tomcat:1.2.1
          ports:
            port: 8080/http
          environment_variables:
            JVM_HEAP_SIZE: 1200         # will be overridden by deployment level: 2800
```

#### Example 3
**Use a place holder**

**Use case:** As a developer, you might not know some value your service needs at runtime, say the Google Anaytics ID your company uses. However, your Node.js frontend needs it!

**Implementation:** In the below blueprint the `~` place holder is used to explicitly demand that a variable is set by a higher scope. When this variable is NOT provided, Vamp will report an error at deploy time.

```yaml
---
name: production_deployment:1.0
gateways:
  9050: frontend/port
environment_variables:                            # cluster level variable
  frontend.GOOGLE_ANALYTICS_KEY: 'UA-53758816-1'  # overrides the breed level
clusters:
  frontend:
    services:
      -
        breed:
          name: frontend_app:1.0
          deployable: acmecorp/node_express:1.0
          ports:
            port: 8080/http
          environment_variables:
            GOOGLE_ANALYTICS_KEY: ~               # If not provided at higher scope,
                                                  # Vamp reports error.
```

#### Example 4
**Combine all scopes and references**

As a final example, let's combine some of the examples above and include referenced breeds. In this case, we have two breed artifacts already stored in Vamp and include them by using the `ref` keyword.

In the below blueprint:

* we override all breed scope `JVM_HEAP_SIZE` variables with cluster scope `environment_variables`
* to further tweak the `JVM_HEAP_SIZE` for the service `frontend_app:1.0-b`, we also add service scope `environment_variables` for that service.

```yaml
---
name: production_deployment:1.0
gateways:
  9050: frontend/port
environment_variables:                            # cluster level variable
  frontend.JVM_HEAP_SIZE: 2400                    # overrides the breed level
clusters:
  frontend:
    services:
      - breed:
          ref: frontend_app:1.0-a
      - breed:
          ref: frontend_app:1.0-b
        environment_variables:
          JVM_HEAP_SIZE: 1800               # overrides the breed level AND cluster level

  gateways:
    frontend_app:1.0-a:
      weight: 50%
    frontend_app:1.0-b:
      weight: 50%
```



## Constants

Sometimes you just want configuration information to be available in a breed or blueprint. You don't need that information to be directly exposed as an environment variable. As a convenience, Vamp allows you to set `constants`.
These are values that cannot be changed during deploy time.

You can do everything with `environment_variables` but `constants` allow you to just be a little bit cleaner with regard to what you want to expose and what not.

#### Exammple - using constants

```yaml
---
clusters:
  frontend:
    breed:
      name: frontend_app:1.0
      environment_variables:
        MYSQL_HOST: $backend.host
        MYSQL_PORT: $backend.ports.port
        BACKEND_ENCODING: $backend.environment_variables.ENCODING_TYPE
        SCHEMA: $backend.constants.SCHEMA_NAME
      dependencies:
        backend: mysql:1.0
  backend:
    breed:
      name: mysql:1.0
      environment_variables:
        ENCODING_TYPE: 'UTF8'
      constants:
        SCHEMA_NAME: 'customers'    # NOT injected into the backend MySQL container
```


{{< note title="What next?" >}}
* Read about [Vamp escalations](/documentation/using-vamp/v0.9.5/escalations/)
* Check the [API documentation](/documentation/api/v0.9.5/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
