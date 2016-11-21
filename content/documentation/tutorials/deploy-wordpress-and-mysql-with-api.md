
---
date: 2016-09-13T09:00:00+00:00
title: Run a Wordpress deployment and use gateways to control access (API)
draft: true
---
Ths tutorial will demonstrate how Vamp builds deployments from artifacts and works with gateways. We'll do this by deploying Wordpress together with mySQL using official images from the Docker hub and setting up a gateway to run a canary release. 

**We are going to breeze through this using the Vamp API, but if you prefer can follow [the same tutorial using the Vamp UI](documentation/tutorials/deploy-wordpress-and-mysql).** 

In this tutorial we will:

1. [Create a Wordpress blueprint and deploy it](documentation/tutorials/deploy-wordpress-and-mysql/#create-a-wordpress-blueprint-and-deploy-it)  
  * Create breeds to describe the mySQL and Wordpress deployables and their requirements
  * Create a scale to specify the resources to be assigned at runtime
  * Deploy two instances of mySQL and Wordpress using a blueprint
2. [Use gateways to control access to the deployments](documentation/tutorials/deploy-wordpress-and-mysql/#use-gateways-to-control-access-to-the-deployments) 
  * Add stable endpoints to access the running Wordpress deployments
  * Control traffic distribution between the two deployments 
  * Run a canary release

### Requirements

* A running version of Vamp (this tutorial has been tested on the [Vamp hello world set up](documentation/installation/hello-world))
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp)
* Note that if you run on Docker machine you will need to switch `localhost` for docker-machine ip default.
  
## Create a Wordpress blueprint and deploy it
Deployments to be initiated by Vamp are described in blueprints using the Vamp DSL (Domain Specific Language). A Vamp blueprint combines breed and scale artifacts to make scalable services, then groups these services into clusters for traffic distribution. 
A blueprint can reference individually stored artifacts, or everything can be described inline in the blueprint. We are going to create individual breed and scale artifacts, then reference these from our blueprint.

### Create breeds
Services to be deployed by Vamp must first be described in a breed. Breeds define the deployable to run and the internal gateway(s) to create for a single service. Settings can be specified in a breed and passed to the service at runtime, this is done using environment variables.  
[Read more about environment variables...](documentation/using-vamp/environment-variables)

For our deployment, we will need to create two breeds - one for the mySQL database and one for Wordpress. We can use environment variables to specify the login credentials for the database and add some Vamp magic to tell Wordpress where it can find the as-yet-undeployed mySQL database. The Vamp variable `host` will resolve to the host or IP address of a referenced service at runtime. Finally, we can declare the mySQL database as a dependency for the Wordpress service so Vamp will wait until the database is available before it deploys Wordpress and all environment variables can be resolved.

* **The mySQL breed**  
We will use mySQL as the Wordpress database, but you could try another database if you prefer. A quick check of the official documentation on the Docker hub tells us that the official mySQL container ([hub.docker.com - mySQL](https://hub.docker.com/_/mysql/)) exposes the standard mySQL port (3306). We can create a database and set up some user accounts with the variables `MYSQL_DATABASE`, `MYSQL_ROOT_PASSWORD`, `MYSQL_USER` and `MYSQL_PASSWORD`. That's all the details we need to create a breed for the mySQL service. 

###### YAML
`POST` `localhost:8080/api/v1/breeds` `Content-Type: application/x-yaml`
```
name: mysql                    # name of our breed
deployable: mysql:latest       # the publicly available Docker image
ports:
  mysql_port: 3306/tcp         # internal gateway - the default mySQL port (tcp) 
environment_variables:         # required settings
  MYSQL_ROOT_PASSWORD: "root_password"
  MYSQL_DATABASE: "wordpress"
  MYSQL_USER: "wordpress_user"
  MYSQL_PASSWORD: "wordpress_password"
```
###### JSON
`POST` `localhost:8080/api/v1/breeds` `Content-Type: application/json`

```
{
  "name": "mysql",
  "deployable": "mysql:latest",
  "ports": {
    "mysql_port": "3306/tcp"
  },
  "environment_variables": {
    "MYSQL_ROOT_PASSWORD": "root_password",
    "MYSQL_DATABASE": "wordpress",
    "MYSQL_USER": "wordpress_user",
    "MYSQL_PASSWORD": "wordpress_password"
  }
}
```
* **The Wordpress breed**  
Now let's do the same for our Wordpress service. The official Wordpress container ([hub.docker.com - wordpress](https://hub.docker.com/_/wordpress/)) runs apache on port 80. We can specify an external database using the variables `WORDPRESS_DB_HOST`, `WORDPRESS_DB_USER` and `WORDPRESS_DB_PASSWORD`. 

###### YAML
`POST` `localhost:8080/api/v1/breeds` `Content-Type: application/x-yaml`

```
name: wp:1.0.0                 # name of our Wordpress service
deployable: wordpress:latest   # publicly available Docker image        
ports:
  webport: 80/http             # internal gateway - the default apache port
environment_variables:         
  WORDPRESS_DB_HOST: $db.host:$db.ports.mysql_port
  WORDPRESS_DB_USER: "wordpress_user"
  WORDPRESS_DB_PASSWORD: "wordpress_password"
dependencies:                  # required for the Wordpress service to run
  db: mysql                    # the mysql service from the db cluster
```

###### JSON
`POST` `localhost:8080/api/v1/breeds` `Content-Type: application/json`

```
{
  "name": "wp:1.0.0",
  "deployable": "wordpress:latest",
  "ports": {
    "webport": "80/http"
  },
  "environment_variables": {
    "WORDPRESS_DB_HOST": "$db.host:$db.ports.mysql_port",
    "WORDPRESS_DB_USER": "wordpress_user",
    "WORDPRESS_DB_PASSWORD": "wordpress_password"
  },
  "dependencies": {
    "db": "mysql"
  }
}
```

Nothing has been deployed yet, but you can see the breeds listed with `GET` `/api/v1/breeds` 

### Create a scale
Scales define the resources to assign to a service, that is the number of instances (servers) and allocated CPU and memory. We are going to create one scale, which will be used by both of our breeds.

###### YAML
`POST` `localhost:8080/api/v1/scales` `Content-Type: application/x-yaml`
```
name: demo
instances: 1
cpu: 0.2
memory: 380MB  
```

###### JSON
`POST` `localhost:8080/api/v1/scales` `Content-Type: application/json`

```
{
  "name": "demo",
  "instances": 1,
  "cpu": 0.2,
  "memory": "380MB"
}
```

### Deploy a blueprint
Now we can reference our artifacts from a simple blueprint and use this to deploy Wordpress and mySQL. A Vamp blueprint creates scalable services by joining togehter breed descriptions and a scale. Services are grouped into clusters to allow easy distribution of incoming traffic - more on this later. 

Our blueprint will use two clusters - one for the database service and one for the Wordpress service. As we're using the API, we can send this straight to the deployments endpoint and give it a unique name (`wp_demo_1`).

###### YAML
`POST` `localhost:8080/api/v1/deployments/wp_demo_1` `Content-Type: application/x-yaml`
```
name: wp_demo            # name of our blueprint
clusters:
  db:                    # name of our database cluster
    services:
      breed: mysql       # the mySQL breed we created
      scale: demo        # the scale we created
  wp:                    # name of our Wordpress cluster
    services:
      breed: wp:1.0.0    # the Wordpress breed we created
      scale: demo        # the scale we created
```

###### JSON
`POST` `localhost:8080/api/v1/deployments/wp_demo_1` `Content-Type: application/json`

```
{
  "name": "wp_demo",
  "clusters": {
    "db": {
      "services": {
        "breed": "mysql",
        "scale": "demo"
      }
    },
    "wp": {
      "services": {
        "breed": "wp:1.0.0",
        "scale": "demo"
      }
    }
  }
}
```

Vamp will initiate the deployment. You can see the deployment details listed with `GET` `localhost:8080/api/v1/deployments`

### Deploy the blueprint again
We can now quickly deploy a second instance of Wordpress and mySQL using our existing artifacts. Vamp breeds, scales and blueprints can be re-used to initiate as many deployments as you like. Each deployment will be treated as an individual entity and Vamp will manage all the internal gateways and routing, so you don't need to worry about creating conflicts with other running services or deployments - more on this later. 

Let's run a second deployment, we'll call it `wp_demo_2` this time.

###### YAML
`POST` `localhost:8080/api/v1/deployments/wp_demo_2` `Content-Type: application/x-yaml`
```
name: wp_demo            # name of our blueprint
clusters:
  db:                    # name of our database cluster
    services:
      breed: mysql       # the mySQL breed we created
      scale: demo        # the scale we created
  wp:                    # name of our Wordpress cluster
    services:
      breed: wp:1.0.0    # the Wordpress breed we created
      scale: demo        # the scale we created
```

###### JSON
`POST` `localhost:8080/api/v1/deployments/wp_demo_2` `Content-Type: application/json`

```
{
  "name": "wp_demo",
  "clusters": {
    "db": {
      "services": {
        "breed": "mysql",
        "scale": "demo"
      }
    },
    "wp": {
      "services": {
        "breed": "wp:1.0.0",
        "scale": "demo"
      }
    }
  }
}
```

We now have two separate Wordpress deployments running, they should see them both listed with `GET` `localhost:8080/api/v1/deployments`

## Use gateways to control access to the deployments
Vamp exposes internal and external gateways to allow access to clusters of services. Internal gateways are automatically created dynamic endpoints, external gateways are declared stable endpoints. Weights and conditions can be applied to gateways to control the traffic distribution across multiple potential routes. For example, internal gateways can control traffic distribution across the services deployed in a cluster, whereas external gateways might control traffic distribution across routes not managed by Vamp.  
[Read more about gateway usage](documentation/using-vamp/gateways/#gateway-usage)

To get back to our demonstration, we currently have two separate deployments running. In each of our deployments, Wordpress is connected to its own instance of mySQL via a `mysql_port` internal gateway. At deployment time, Vamp automatically creates new internal gateways for all the `ports` defined in the breed(s) deployed. This means that we have exposed a `mysql_port` and a `webport` internal gateway for each of our deployments. You can see all currently exposed gateways with `GET` `localhost:8080/api/v1/gateways` 

### Add stable endpoints
We could use the internal gateway ports to access our deployments if we wanted (go ahead and connect to the assigned `<deployment>/wp/webport` ports, you should see your running Wordpress services). The ports assigned to internal gateways are, however, unpredictable, so it makes much more sense to declare external gateways and access the services through stable endpoints. 

We can quickly add a new stable endpoint that maps to one of our existing `webport` internal gateways.

###### YAML
`POST` `localhost:8080/api/v1/gateways` `Content-Type: application/x-yaml`

```
name: wp_demo_1_gateway   # name of our gateway
port: 9050/http           # external gateway to expose
routes:
  wp_demo_1/wp/webport:   # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```

###### JSON
`POST` `localhost:8080/api/v1/gateways` `Content-Type: application/json`

```
{
  "name": "wp_demo_1_gateway",
  "port": "9050/http",
  "routes": {
    "wp_demo_1/wp/webport": {
      "weight": "100%"
    }
  }
}
```


The gateway will be exposed and you can directly - and forever - access your Wordpress service at the specified 9050 port. 

![](images/screens/v091/wordpress.png)

Hello Wordpress! Go ahead and finish the installation - I hear it's very quick - then you can check out your new site.

![](images/screens/v091/wordpress_wp_demo_1.png)

### Let's do that again
As we are running two deployments, we also need two external gateways - one for each instance of Wordpress. Let's add a second external gateway to give our other Wordpress service a stable endpoint, this time we'll need to expose a different port.

###### YAML
`POST` `localhost:8080/api/v1/gateways` `Content-Type: application/x-yaml`

```
---
name: wp_demo_2_gateway   # name of our gateway
port: 9060/http           # external gateway to expose
routes:
  wp_demo_2/wp/webport:   # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```

###### JSON
`POST` `localhost:8080/api/v1/gateways` `Content-Type: application/json`

```
{
  "name": "wp_demo_2_gateway",
  "port": "9060/http",
  "routes": {
    "wp_demo_2/wp/webport": {
      "weight": "100%"
    }
  }
}
```


The new gateway will be created and you can access your second Wordpress site on the newly exposed 9060 port (the old Wordpress site will still be available at port 9050). Complete this second Wordpress installation and make some changes to the site - select a different theme or add some content to help you easily tell the two deployments apart.  

![](images/screens/v091/wordpress_wp_demo_2.png)

### Use a gateway to distribute incoming traffic
Well that was fun, but Vamp can do so much more! We can use our deployments to demonstrate some of Vamp's traffic distribution features and show how these can be used to run a canary release.

Vamp distributes traffic between services at shared gateways. If our Wordpress services had been running in the same deployment and cluster with a shared internal gateway, we could have adjusted the weights on that internal gateway to distribute traffic between them. As we are working with two separate deployments, we first need to create a shared external gateway that to distribute the traffic. This is much the same as exposing a simple gateway, only this time we will add two routes and use the `weight` setting to split traffic between them. You can add as many routes as you like to a gateway, just remember that _the total weight must always add up to 100%_. 

###### YAML
`POST` `localhost:8080/api/v1/gateways` `Content-Type: application/x-yaml`

```
name: wordpress_distribution_gateway
port: 9070/http
routes:
  wp_demo_1_gateway:
    weight: 50%     # send 50% of all traffic to this route
  wp_demo_2_gateway:
    weight: 50%     # send 50% of all traffic to this route
```

###### JSON
`POST` `localhost:8080/api/v1/gateways` `Content-Type: application/json`

```
{
  "name": "wordpress_distribution_gateway",
  "port": "9070/http",
  "routes": {
    "wp_demo_1_gateway": {
      "weight": "50%"
    },
    "wp_demo_2_gateway": {
      "weight": "50%"
    }
  }
}
```

The gateway wil be created. Go to port 9070 and see which Wordpress install you are sent to. 

{{< note title="Note!" >}}
You might notice that the URL in your browser switched to either :9060 or :9050 and that subsequent visits to the 9070 endpoint consistently send you back to the same port/Wordpress. So what's going on with our gateway? Visits to 9070 should be split 50% / 50% between our two Wordpress instances! Here's where things get sticky, but that's not down to Vamp.  

* On your first visit via 9070, Wordpress picked up that you had been redirected and sent out the HTTP response 301, which means "permanently moved"
* Your browser cached this 301 redirect and is now automatically sending every subsequent attempt to visit 9070 to the same destination 
  
Simply disabling the cache won't help, but you can get around this by adding, for example, a `?` to the end of the URL (e.g. `192.168.99.100:9070?`). If you prefer a more eloquent solution, you could install a Wordpress plugin to prevent the 301 from happening in the first place ([wordpress.org - Permalink Fix & Disable Canonical Redirects](https://wordpress.org/plugins/permalink-fix-disable-canonical-redirects-pack/) will do the trick), just remember to install it on both of your Wordpress deployments.
{{< /note >}}

Once you do make it back to the Vamp external gateway at 9070 you will see that everything is working as expected and you will be sent to 9050 or 9060 alternately. Thanks Wordpress.

### Run a canary release  
Now we have an external gateway set up with two routes, we can adjust the distribution of traffic between them. This will allow us to canary release our new Wordpress site to users by adjusting the weight assigned to each route. This lets us introduce a new service slowly and quickly switching back if it doesn't performing as planned. Conditions can also be added to each route in the gateway, so we could target specific user groups to send to each version.  
[Read more about using conditions](documentation/using-vamp/conditions)

You can adjust  the weights on active gateways by:

1. `GET` `localhost:8080/api/v1/gateways`
* Adjust the weights accordingly (remember they must always add up to 100%)
* `POST` the updated gateway back to `localhost:8080/api/v1/gateways` (remember to specify the content type)

## Summing up
You should now understand a bit more about how Vamp builds deployments from the various artifacts, resolves variables and handles internal routing. Obviously, this is not a production grade setup. The database is running in a containerised mySQL instance with no data persistence. If you're running in the Vamp hello world setup, you're also likely to hit resource problems pretty quickly. If things aren't working as expected you can try increasing the memory of Docker VirtualBox VM (3GB should be enough for this demo).

## Looking for more of a challenge?
Just for fun, you could try these:

* Can you rewrite the Wordpress and mySQL deployment as a single blueprint (define artifacts inline)?
* Try adding a condition to the 9070 external gateway - for example, to send all Firefox users to one version of your site and everyone else to the other
  * Read about [using conditions](documentation/using-vamp/conditions)
* Could you set up external gateways for the mySQL deployments and connect Wordpress to the mySQL server running in the other deployment?

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
{{< /note >}}

