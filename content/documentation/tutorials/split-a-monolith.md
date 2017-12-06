---
date: 2016-09-13T09:00:00+00:00
title: Split a monolith
menu:
  main:
    parent: "Tutorials"
    weight: 40
---
In the [previous tutorial we did some basic canary releasing on two versions of a monolithic application](/documentation/tutorials/run-a-canary-release/). Very nice, but Vamp isn't
called the *Very Awesome Microservices Platform* for nothing. The next step is to split our monolithic Sava application into separate services. In this tutorial we will:

* define a new service topology
* learn about Vamp environment variables and service discovery

**Requirements:** Docker machine should have access to **at least 3GB memory**

## Define a new service topology

To prove our point, we are going to slightly "over-engineer" our services solution. This will also help us demonstrate how we can later remove parts of our solution using Vamp. For now, we'll split the monolith into a topology of one frontend and two separate backend services. After our engineers are done with coding, we can catch this new topology in the following blueprint. Please notice a couple of things:

* We now have three clusters: sava, backend1 and backend2. Each cluster can have multiple services for canary release and traffic filtering
* The sava cluster has explicit dependencies on the two backends. Vamp will make sure these dependencies are checked and rolled out in the right order
* We have used environment variables to connect the dynamically assigned ports and hostnames of the backend services to the "customer facing" sava service
* The gateway port has been changed to 9060 so it doesn't collide with the monolithic deployment

```yaml
name: sava:1.2
gateways:
  9060: sava/webport
clusters:
  sava:  # cluster 1
    services:
      breed:
        name: sava-frontend:1.2.0
        deployable: magneticio/sava-frontend:1.2.0
        ports:
          webport: 8080/http
        environment_variables:
          BACKEND_1: http://$backend1.host:$backend1.ports.webport/api/message
          BACKEND_2: http://$backend2.host:$backend2.ports.webport/api/message
        dependencies: # Vamp will check dependencies are available
          backend1: sava-backend1:1.2.0
          backend2: sava-backend2:1.2.0
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
      health_checks:
        initial_delay: 10s
        port: webport
        timeout: 5s
        interval: 10s
        failures: 10
  backend1:  # cluster 2
    services:
      breed:
        name: sava-backend1:1.2.0
        deployable: magneticio/sava-backend1:1.2.0
        ports:
          webport: 8080/http
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
  backend2:  # cluster 3
    services:
      breed:
        name: sava-backend2:1.2.0
        deployable: magneticio/sava-backend2:1.2.0
        ports:
          webport: 8080/http
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
```

Deploy this blueprint using either the UI or a REST call  - let's name it after the blueprint this time **sava-new**.
Once it's deployed, you can check out the new topology in the Vamp UI through the Gateways page or the Deployments page

![](/images/screens/v094/services_2backends.png)

You can also use Vamp as a reverse proxy to access the exposed gateways:

* `http://localhost:8080/proxy/gateways/sava-new%2F9060/`
* `http://localhost:8080/proxy/gateways/sava-new%2Fsava%2Fwebport/`

## Learn about environment variables and service discovery

If you were to check out the Docker containers using `docker inspect`, you would see the environment variables that we set in the blueprint.

```bash
> docker inspect 66e64bc1c8ca
...
"Env": [
    "BACKEND_1=http://192.168.65.2:33021/api/message",
    "BACKEND_2=http://192.168.65.2:33022/api/message",
    "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
],
...
```

Host names and ports are configured at runtime and injected in the right parts of your running deployment. Your service/app should pick up these variables to configure itself. Luckily, this is quite easy and common in almost all languages and frameworks.

Remember, there is no "point-to-point" wiring. The exposed host and port are actually service
endpoints. The location, amount and version of containers running behind that service endpoint can vary.
Learn more about [how Vamp does service discovery](/documentation/routing-and-loadbalancing//).

{{< note title="What next?" >}}
* Great! We just demonstrated that Vamp can handle dependencies between services and configure these services with host and port information at runtime. Now let's do a [more complex migration to a new service based topology →](/documentation/tutorials/merge-and-delete/).
{{< /note >}}

