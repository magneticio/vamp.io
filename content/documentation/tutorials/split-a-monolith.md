---
date: 2016-09-13T09:00:00+00:00
title: 3. Split a monolith
menu:
  main:
    parent: "Tutorials"
    weight: 40
---
In the [previous tutorial we did some basic canary releasing on two versions of a monolithic application](/documentation/tutorials/run-a-canary-release/). Very nice, but Vamp isn't
called the *Very Awesome Microservices Platform* for nothing. The next step is to split our monolithic Sava application into separate services. In this tutorial we will:

* define a new service topology
* learn about Vamp environment variables and service discovery

#### Requirements:
* A Kubernetes cluster with at least 4 nodes (8 vCPUs and 28GB memory); or
* A DC/OS cluster with at least 4 nodes (1 public agent, 16 vCPUs and 48GB memory)

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
        deployable: vampio/sava-frontend:1.2.0
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
        deployable: vampio/sava-backend1:1.2.0
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
        deployable: vampio/sava-backend2:1.2.0
        ports:
          webport: 8080/http
      scale:
        cpu: 0.2
        memory: 64MB
        instances: 1
```

Deploy this blueprint using the UI  - let's name it after the blueprint this time **sava-new**.

## Check out the deployed services 

Once it's deployed, you can check out the new topology in the Vamp UI through the Gateways page or the Deployments page

### From the Deployments page
Click on **sava-new** to open the deployment detail page, then click on **sava-frontend:1.2.0** to see all running instances of the sava-frontend service.

Click an instance name (we only have one instance running) to open it and then click the **webport** tab. If page looks in the webport tab, you can click the **Open in a new tab** button.

The **webport** tab provides a quick way of checking if an individual instance of a service is working as expected but it assumes that the servce responds to requests on `/`.

The **sava-backend1** and **sava-backend2** services only respond to requests for `/api/message`. So the **webport** tab for these services shows "404 page not found".

### From the Gateways page
Open the internal gateway (`sava-new/sava/webport`) or the external gateway (`sava/9060`) and click the **HOST - PORT/TYPE** link.

![](/images/screens/v100/tut3/vampee-environment-gateways-savanew-internal-fe2be.png)

### Via the Vamp Gateway Agent
You can also use the Vamp Gateway Agent (VGA) to access the **sava-frontend** using the virtual host name **9060.sava-new.vamp**.

```
curl -H "Host: 9060.sava-new.vamp" http://<vga-external-ip>/
```

During development, it can be useful to have direct access to the internal gateways. By default, Vamp creates virtual host names for the internal gateways, so you can use these to access the backend services via the VGA.

```
curl -H "Host: webport.backend1.sava-new.vamp" http://<vga-external-ip>/api/message
curl -H "Host: webport.backend2.sava-new.vamp" http://<vga-external-ip>/api/message
```

## Learn about environment variables and service discovery

If you check the environment variables passed to the **sava-frontend:1.2.0** containers, you will see the environment variables that we set in the blueprint.

### Kubernetes
Using `kubectl` and a label selector:

```bash
$ kubectl --namespace vampio-organization-environment describe pod -l io.vamp.service=sava-frontend_1.2.0
...
Containers:
  sava-new-...
    ...
    Environment:
      BACKEND_1:  http://10.55.246.121:40003/api/message
      BACKEND_2:  http://10.55.246.180:40001/api/message
...
```

### DC/OS
To use the `dcos` CLI, you first need to know the `app-id`.

To find the `app-id` of the frontend service:

1. Go to the **Deployments** page 
2. Click on **sava-new** to open the deployment detail page
3. Now click on **sava-frontend:1.2.0** to see all running instances
4. Click an instance name to open the detail page
5. Copy the first part of page title, before the dot (`.`)
  ![](/images/screens/v100/tut3/vampee-environment-deployments-savanew-frontend-instance.png)
6. Paste the copied text into your favourite text editor and replace `_deployment` with `/deployment`, the resulting text is the `app-id`

```bash
$ dcos marathon app show vampio-organization-environment/deployment-sava-new-service-e989b44b06a8ace5089411e4061bb0542d8dbfaa
...
  "env": {
    "BACKEND_1": "http://10.0.0.4:40004/api/message",
    "BACKEND_2": "http://10.0.0.4:40002/api/message"
  },
...
```

Host names and ports are configured at runtime and injected in the right parts of your running deployment. You can then use these variables as a simple means of service discovery.

Remember, there is no "point-to-point" wiring. **The injected host and port points to the internal gateway** which acts as a load balanced service endpoint for that service. This means you can canary release your internal services as well as your external (public) services.

Learn more about [how Vamp does service discovery](/documentation/routing-and-loadbalancing//).

{{< note title="What next?" >}}
* Great! We just demonstrated that Vamp can handle dependencies between services and configure these services with host and port information at runtime. Now let's do a [more complex migration to a new service based topology →](/documentation/tutorials/merge-and-delete/).
{{< /note >}}

