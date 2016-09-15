+++
title = "Vamp 0.7.5: Archiving and redesigned environment variable DSL" 
tags = ["releases", "news"]
category = ["news"]
date = "2015-04-28"
type = "blog"
author = "Tim Nolet"
+++

We just tagged release 0.7.5 and I'm excited about what we achieved this sprint and managed to cram into Vamp 0.7.5. Some of the highlights are below, but you can check the [full release note on Github](https://github.com/magneticio/vamp/releases/tag/0.7.5). There are some breaking changes in this release,
so please update where necessary. We've updated our [getting started tutorial](/getting-started/) to reflect the latest changes.

## Archiving of everything

From 0.7.5 on, all CRUD actions on Vamp artifacts are fully archived to Vamp Pulse. Put in simple terms: You can track all edits, updates and deletes to your microservices architecture similar to a Git log. By tracking all actions performed on any part of your container driven architecture, we give you the ability to start using that data to track changes, solve problems and spot trends. 

In the screencast below you can see us create, update and delete a breed on Vamp core. After that we get the archive of all those actions from Vamp pulse, together with the orginal YAML version of the breed:

![](/img/screenshots/archiving.gif)

## Environment variables DSL in blueprints and breeds
In this release we focussed on redesigning our initial way of handling environment variables. Some
of our concerns were:

- how are variables used and declared in blueprints in breeds?
- how simple can we make it, without making it too simple?
- how can we allow inline variable interpolation?

From 0.7.5 onwards, we allow straightforward naming of variables and constants. We looked at different
use cases, like:

### 'Hard' set a variable

You want to "hard set" an environment variable, just like doing an `export MY_VAR=some_value` in a shell. This  variable could be some external dependency you have no direct control over: the endpoint of some service you use that is out of your control. 

You may also want to define a placeholder for a variable of which you do not know the actual value yet, but should be filled in when this breed is used in a blueprint: the following deployment will not run without it and you want Vamp to check that dependency. This placeholder is designated with a `~` character.

<pre class="prettyprint lang-yaml">
name: my_breed
deployable: repo/container:version

environment_variables:
    MY_ENV_VAR1: some_string_value  # hard set
    MY_ENV_VAR1: ~                  # placeholder
</pre>

### Resolve a reference at deploy time

You might want to resolve a reference and set it as the value for an environment variable. This reference can either be dynamically resolved at deploy-time, like ports and hosts names we don't know till a deployment is done, or be a reference to a hardcoded and published constant from some other part of the blueprint or breed, typically a dependency.

You would use this to hook up services at runtime based on host/port combinations or to use a hard dependency that never changes but should be provided by another breed. 

**Notice**: you use the `$` sign to reference other statements in a blueprint and you use the `constants` keyword
to create a list of constant values.

Have a look at this example blueprint. We are describing a frontend service that has a dependency on a backend service. We pick up the actual address of the backend service using references to variables in the blueprint that are filled in at runtime. However, we also want to pick up a value that is set by "us humans": the api path, in this case "/v2/api/customers".

<pre class="prettyprint lang-yaml">
name: my_blueprint
clusters:

  frontend:
    breed:
      name: frontend_service
    environment_variables:
        # resolves to a host and port at runtime
        BACKEND_URL: http://$backend.host:$backend.ports.port
        # resolves to the "published" constant value
        BACKEND_URI_PATH: $backend.constants.uri_path        
      dependencies:
        backend: my_other_breed
  backend:
    breed:
      name: my_other_breed
    constants:
      uri_path: /v2/api/customers   
</pre>


Find all downloadable packages at:  
https://bintray.com/magnetic-io/downloads


Closed issues:  
https://github.com/magneticio/vamp/issues?q=is%3Aissue+milestone%3A0.7.5+is%3Aclosed

Tim Nolet, CTO