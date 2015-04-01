---
title: Blueprints
weight: 30
menu:
  main:
    parent: reference
---
# Blueprints

> endpoint: /api/v1/blueprints

Bleuprint are execution plans - they describe how you system should look like at the runtime. 
All dependency availability and parameter values will be resolved at deployment time. 

<pre class="prettyprint lang-yaml">
name: nomadic-frostbite

# Endpoints are stable ports mapped to concrete breed ports.
# Breed ports are resolved to port values available during 
# the runtime. 
endpoints:
  notorious.ports.port: 8080

# Blueprint defines collection of clusters.
# Cluster is a group of different services which 
# will appear as a single service. Common use case 
# are service A and B in A/B testing - usually just deferent 
# versions of the same service (e.g. canary release).
clusters:
  notorious: # Custom cluster name.
    services: # List of service, at least a breed reference.
      -
        breed:
          name: nocturnal-viper
        # Scale for this service (breed).
        scale: large
        # Routing for this service.
        # Makes sense only with multiple service cluster.
        routing:
          weight: 95
          filters:
            - condition: User-Agent = Android
      -
        # Another service (breed) in the same cluster.
        breed: remote-venus
        scale: worthy

    # SLA (reference) defined on cluster level. 
    sla: strong-mountain 
              
# List of parameters.
# Actual values will be resolved at the runtime.
# "thorium" in this example is just a key to get a 
# concrete parameter value.
# By default dictionary will resolve value as being the 
# same as key provided. 
parameters:
  notorious.ports.aspect: thorium
</pre>
    