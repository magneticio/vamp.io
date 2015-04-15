---
title: 3. Splitting into services
type: documentation
weight: 40
menu:
    main:
      parent: getting-started
    
---

# 3. Splitting the monolith into services

In the [previous part](/documentation/getting-started/canary-release/) of this getting started we
did some basic canary releasing on two version of a monolithic application. Very nice, but Vamp isn't
called the *Very Awesome Microservices Platform* for nothing. For that reason, we will be splitting
our Sava application into separate services.

## Step 1: Defining a new service topology

To prove our point, we are going to slightly "over-engineer" our services solution. This will also help
us demonstrate how we can later remove parts of our solution using Vamp. For now, we'll split the 
monolith into a topology of one frontend and two separate backend services. After our engineers
are done with coding, we can catch this new topology in the following blueprint. Please notice a couple 
of things:

1. We now have three `clusters`: `sava`, `backend1` and `backend2`. Each cluster could have multiple
services on which we could do separate canary releases and set separate filters.
2. The `sava` cluster has explicit dependencies on the two backends. Vamp will make sure these dependencies
are checked and rolled out in the right order.
3. Using `environment_variables` we connect the dynamically assigned ports and hostnames of the backend
services to the "customer facing" `sava` service. 
4. We've change the endpoint port to `9060` so it doesn't collide with the  monolithic deployment.

<pre class="prettyprint lang-yaml">
name: sava_fe_be_1_2

endpoints:
  sava.ports.port: 9060

clusters:

  sava:
    services:
      breed:
        name: sava_frontend_1_2
        deployable: magneticio/sava-1.2_frontend:0.7.0
        ports:
          name: port
          value: 80/http
          direction: OUT

        environment_variables:

          - name: backend1.host
            direction: IN
            alias: BACKEND_1_HOST

          - name: backend1.ports.port
            direction: IN
            alias: BACKEND_1_PORT

          - name: backend2.host
            direction: IN
            alias: BACKEND_2_HOST

          - name: backend2.ports.port
            direction: IN
            alias: BACKEND_2_PORT

        dependencies:
          backend1: sava_backend1_1_2
          backend2: sava_backend2_1_2

  backend1:
    services:
      breed:
        name: sava_backend1_1_2
        deployable: magneticio/sava-1.2_backend:0.7.0
        ports:
          name: port
          value: 80/http
          direction: OUT

  backend2:
    services:
      breed:
        name: sava_backend2_1_2
        deployable: magneticio/sava-1.2_backend:0.7.0
        ports:
          name: port
          value: 80/http
          direction: OUT
</pre>

Deploy this blueprint to the `/api/v1/deployments` endpoint with a `POST` request. Again, don't forget to set the header `Content-Type: application/x-yaml`.

Checking out the new topology in your browser (on port 9060 this time) should yield something similar to:

![](/img/screenshots/services_2backends.png)

## Step 2: Learning about environment variables & service discovery

If you were to check out the Marathon console, you would see the environment variables show up that
we defined as `alias` in the blueprint. Your service/app should pick up these variables to configure itself. Luckily, this is quite easy and common in almost all languages and frameworks.

![](/img/screenshots/services_envvars.png)

The YAML syntax for setting environment variables can be a little tricky (`IN`, `OUT`, `direction`,`alias` etc.) That's why we are currently changing this into something simpler but equally powerful. Expect updates
in the coming releases.

Good to know is that there is no "point-to-point" wiring: the exposed host and port are actually service
endpoints. The location, amount and version of containers running behind that service endpoint can vary.
Basiscally, this a simple form of service discovery without the need to change your code or run any other daemon or agent.

{{% alert warn %}}
**Note**: Vamp Router is the central hub for service discovery. For testing this is fine, but for serious production work you would want a multi-node setup. Currently, we are putting all things in place to handle this like Zookeeper support and probably support for other technologies like ETCD  and Consul.
{{% /alert %}}

Great! We just demonstrated that Vamp can handle dependencies between services and configuring these services with host and port information at runtime. Now let's do a [more complex migration to a new service based topology →](/documentation/getting-started/merge-delete/).
