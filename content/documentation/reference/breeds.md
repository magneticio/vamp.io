---
title: Breeds
weight: 20
menu:
  main:
    parent: reference
---
# Breeds

> endpoint: /api/v1/breeds

Breeds are applications and services available for deployment. Each breed is described by the DSL. 
This description includes name, version, available parameters, dependencies etc.

Let's start with a simple example, no dependencies:

<pre class="prettyprint lang-yaml">
name: monarch                         # Unique name.
deployable: magneticio/monarch:latest # Deployable, 
                                      # by default a Docker image.
    
# List of available ports.
ports:
  -
    name: web         # Custom port name.
    value: 8080/http  # Number together with protocol type: http or tcp. 
                      # If not specified, tcp by default.
    direction: OUT    # IN/OUT: either value needs to be provided (IN)
                      # or it's a read-only (OUT).

# List of environment variables.
environment_variables:
  -
    name: password
    direction: IN
    alias: DB_HOST    # Alias used when it's passed to deployable  
                      # (e.g. Docker), applicable for port as well.
  - name: my_var      
    value: "some_text" # you can also provide basic key/value pairs
    direction: OUT
    alias: MY_VAR

</pre>
And a breed with dependencies:

<pre class="prettyprint lang-yaml">
name: monarch
deployable: magneticio/monarch:latest

# Port list: shortened notation, 
# single object will be converted to a single element list. 
ports:
  name: port 
  value: 8080/http
  direction: OUT

environment_variables:
  - 
    name: db.host # Name starts with dependency name and will be linked 
    # to specific value at the runtime. 
    # In general notation is scope.[ports|environment_variables].name, 
    # in this example "host" is provided by the system and 
    # it's not specified by a user.
    direction: IN
    alias: DB_HOST
  -
    name: db.ports.port # References to the "db" dependency, 
    # its port with the name "port". 
    # The variable will get the provided value automatically 
    # at the runtime either by a system/user 
    # (defined as IN in the dependency) or dependency itself
    # (defined as OUT in the dependency). 
    direction: IN
    alias: DB_PORT
      
dependencies:

    db: mysql # This is shortened for db: name: mysql. 
    # Here we could have an inline dependency definition. 
    # "mysql" needs to exist during deployment. 
    # "db" is a custom name just in this scope. 
    # For instance if there is a need for 2 databases 
    # someone could use db1 & db2, or XX & XY etc.
</pre>

## Scale

> endpoint: /api/v1/scales

Scale is the "size" of a deployed service. Usually that means the number of instances (servers) 
and allocated cpu and memory.


<pre class="prettyprint lang-yaml">
name: small   # Custom name.

cpu: 2        # Number of CPUs per instance.
memory: 2048  # Memory in MB per instance.
instances: 2  # Number of instances.
</pre>

## Routing

> endpoint: /api/v1/routings

Routing defines a set of rules for routing the traffic between different services within the same cluster.
For instance 90% of traffic to old version and 10% to the new.

<pre class="prettyprint lang-yaml">
name: my_route  # Custom name, can be referenced later on.
                # Amount of traffic for this service in percents.
weight: 10
                # Custom filters.
filters:        # Anonymous with condition.
  - condition: user.agent != ios
</pre>