---
title: Breeds
weight: 20
menu:
  main:
    parent: reference
---
# Breeds

Breeds are applications and services available for deployment. Each breed is described by the DSL in YAML notation or JSON, whatever you like. This description includes name, version, available parameters, dependencies etc.
To a certain degree, you could compare a breed to a Maven artefact.

Let's start with a some examples. First a simple one, with no dependencies. Please read the inline comments carefully.

<pre class="prettyprint lang-yaml">
name: monarch                         # Unique designator (name).
deployable: magneticio/monarch:latest # Deployable, by default a Docker image.
                                      
# Map of available ports.
ports:
  web: 8080/http    # Notice the custom port name "web"
                    # Number together with type http or tcp. 
                    # If not specified, tcp is the default.

# Map of environment variables.
environment_variables:
  password[DB_HOST]: ~  # An alias is defined between brackets.
                        # This alias is used when it's passed to a deployable  
                        # (e.g. Docker).
                        # Aliases are optional.
                        # ~ means no value (null, as per YAML spec).
  MY_VAR: "any"         # This is just basic key/value pair. 
                        # It gets passed into a container's environment as is.

# Map of constants.
constants:
  username: SA          # Constants are traits which may be required
                        # by other breeds but are not configurable.
                        # In other words, a constant may be used
                        # inside the container as a hard-coded value 
                        # and it's exposed to any other breed as is.
                        # This will come in handy when we start composing blueprints.
</pre>

Now, let's look at a breed with dependencies:

<pre class="prettyprint lang-yaml"> 
name: monarch
deployable: magneticio/monarch:latest

ports:
  port: 8080/http

environment_variables:
  DB_HOST: $db.host # Any value starting with $ will be interpolated  
    # to a specific value at runtime. 
    # In general, the notation is:
    # 1) $cluster.[ports|environment_variables|constants].name
    # 2) $local (environment variable or constant)
    # 3) $cluster.host
    # In this example "host" is provided by the system and 
    # is not specified by a user.
    # $ value is escaped by $$
    # More strict notation is ${some_reference}

  DB_PORT: $db.ports.port # References to the "db" dependency 
    # and its port with the name "port". 
    # The variable will get the provided value automatically 
    # at runtime either by Vamp or the user.

  URL: jdbc://$db.host:$db.ports.port/schema/foo
    # Example of a value that will be interpolated before deployment.
      
dependencies:

  db: mysql # This is shortened for db: name: mysql. 
    # Here we could have an inline dependency definition. 
    # "mysql" needs to exist during deployment. 
    # "db" is a custom name just in this scope. 
    # For instance if there is a need for 2 databases 
    # someone could use db1 & db2, or XX & XY etc.
</pre>

The above examples should give you an example of what is possible using breeds.