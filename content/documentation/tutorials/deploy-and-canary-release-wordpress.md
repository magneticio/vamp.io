
---
date: 2016-09-13T09:00:00+00:00
title: Deploy and canary release Wordpress
menu:
  main:
    parent: "Tutorials"
    name: "Deploy and canary release Wordpress"
    weight: 60
aliases:
    - /documentation/tutorials/deploy-wordpress-and-mysql/
---
Ths tutorial will demonstrate how Vamp builds deployments from artifacts and works with gateways. We'll do this by deploying Wordpress together with mySQL using official /images from the Docker hub and setting up a gateway to run a canary release. We are going to use the Vamp UI, but you could just as easily perform all the described actions using the Vamp API.

{{< note title="Tested with Vamp v0.9.3" >}}
This tutorial has been tested on [Vamp hello world v0.9.3](/documentation/installation/v0.9.3/hello-world) running with Docker toolbox.
{{< /note >}}

In this tutorial we will:

1. [Create a Wordpress blueprint and deploy it](/documentation/tutorials/deploy-and-canary-release-wordpress/#create-a-wordpress-blueprint-and-deploy-it)
  * Create breeds to describe the mySQL and Wordpress deployables and their requirements
  * Create a scale to specify the resources to be assigned at runtime
  * Create a blueprint that combines breeds with scales
  * Deploy two instances of mySQL and Wordpress
2. [Canary release the deployments using gateways](/documentation/tutorials/deploy-and-canary-release-wordpress/#canary-release-the-deployments-using-gateways)
  * Add stable endpoints to access the running Wordpress deployments
  * Control traffic distribution between the two deployments
  * Run a canary release

### Requirements

* A running version of Vamp (this tutorial has been tested on [Vamp hello world v0.9.3](/documentation/installation/v0.9.3/hello-world) running with Docker toolbox)
* Docker machine should have access to **at least 3GB memory**
* Access to the Docker hub
* You might run into issues if your firewall is set to block connections in the ranges 31000-32000 (required by Mesos) or 40000-45000 (required by Vamp)

## Create a Wordpress blueprint and deploy it
Deployments to be initiated by Vamp are described in blueprints using the Vamp DSL (Domain Specific Language). A Vamp blueprint combines breed and scale artifacts to make scalable services, then groups these services into clusters for traffic distribution.
A blueprint can reference individually stored artifacts, or everything can be described inline in the blueprint. We are going to create individual breed and scale artifacts, then reference these from our blueprint.

### Create breeds
Services to be deployed by Vamp must first be described in a breed. Breeds define the deployable to run and the internal gateway(s) to create for a single service. Settings can be specified in a breed and passed to the service at runtime, this is done using environment variables.
[Read more about environment variables...](/documentation/using-vamp/environment-variables)

For our deployment, we will need to create two breeds - one for the mySQL database and one for Wordpress. We can use environment variables to specify the login credentials for the database and add some Vamp magic to tell Wordpress where it can find the as-yet-undeployed mySQL database. The Vamp variable `host` will resolve to the host or IP address of a referenced service at runtime. Finally, we can declare the mySQL database as a dependency for the Wordpress service so Vamp will wait until the database is available before it deploys Wordpress and all environment variables can be resolved.

* **The mySQL breed**
We will use mySQL as the Wordpress database, but you could try another database if you prefer. A quick check of the official documentation on the Docker hub tells us that the official mySQL container ([hub.docker.com - mySQL](https://hub.docker.com/_/mysql/)) exposes the standard mySQL port (3306). We can create a database and set up some user accounts with the variables `MYSQL_DATABASE`, `MYSQL_ROOT_PASSWORD`, `MYSQL_USER` and `MYSQL_PASSWORD`. That's all the details we need to create a breed for the mySQL service.

  1. In the Vamp UI, go the **Breeds** page
  * Click **Add new**
  * Paste in the below breed YAML and click **Save**

```
name: mysql                    # name of our breed
deployable: mysql:5.6          # publicly available Docker image
ports:
  mysql_port: 3306/tcp         # internal gateway - the default mySQL port (tcp)
environment_variables:         # required settings
  MYSQL_ROOT_PASSWORD: "root_password"
  MYSQL_DATABASE: "wordpress"
  MYSQL_USER: "wordpress_user"
  MYSQL_PASSWORD: "wordpress_password"
```

* **The Wordpress breed**
Now let's do the same for our Wordpress service. The official Wordpress container ([hub.docker.com - wordpress](https://hub.docker.com/_/wordpress/)) runs apache on port 80. We can specify an external database using the variables `WORDPRESS_DB_HOST`, `WORDPRESS_DB_USER` and `WORDPRESS_DB_PASSWORD`.

  1.  In the Vamp UI, go the **Breeds** page
  * Click **Add new**
  * Paste in the below breed YAML and click **Save**

```
name: wp:1.0.0                          # name of our Wordpress service
deployable: wordpress:4.6-php7.0-apache # publicly available Docker image
ports:
  webport: 80/http                      # internal gateway - the default apache port
environment_variables:
  WORDPRESS_DB_HOST: $db.host:$db.ports.mysql_port
  WORDPRESS_DB_USER: "wordpress_user"
  WORDPRESS_DB_PASSWORD: "wordpress_password"
dependencies:                           # required for the Wordpress service to run
  db: mysql                             # the mysql service from the db cluster
```


Nothing has been deployed yet, but you will be able to see the two new breeds listed in the Vamp UI on the **Breeds** page:

![](/images/screens/v093/wordpress_breeds.png)

### Create a scale
Scales define the resources to assign to a service, that is the number of instances (servers) and allocated CPU and memory. We are going to create one scale, which will be used by both of our breeds.

  1. Go the **Scales** page
  * Click **Add new**
  * Paste in the below scale YAML and click **Save**

```
name: demo
instances: 1
cpu: 0.2
memory: 380MB
```
### Create a blueprint
Now we can create a simple blueprint that references our artifacts ready for deployment. A Vamp blueprint creates scalable services by joining togehter breed descriptions and a scale. Blueprints group services into clusters to allow easy distribution of incoming traffic - more on this later.

Our blueprint will use two clusters - one for the database service and one for the Wordpress service.

1. Go to the **Blueprints** page
* Click **Add new**
* Paste in the below blueprint YAML and click **Save**

```
name: wp_demo            # name of our blueprint
clusters:
  db:                    # name of our database cluster
    services:
      breed: mysql       # reference to our mySQL breed
      scale: demo        # reference to our stored scale
  wp:                    # name of our Wordpress cluster
    services:
      breed: wp:1.0.0    # reference to our Wordpress breed
      scale: demo        # reference to our stored scale
```

Vamp will store the blueprint and make it available for deployment. You will see it listed on the **Blueprints** page.

![](/images/screens/v093/wordpress_blueprints.png)

### Deploy the blueprint
Now it's a simple click to deploy mySQL and Wordpress.

1. From the **Blueprints** page, click **Deploy as** on the **wp_demo** blueprint
* You will be prompted to give your deployment a name, let’s call it **wp_demo_1**
* Click **Deploy** to initiate the deployment

Vamp will now run the deployment. This might take some time, especially if the /images need to be pulled from the Docker hub. You can track the status of the deployed clusters and their services on the **Deployments** page by clicking on the **wp_demo_1** deployment.

![](/images/screens/v093/wordpress_deployment_1.png)

Services are grouped by cluster, with successfully deployed services highlighted in grey. The IP address of the deployed instance(s) and any environment variables passed to the service are also listed. Note that Vamp won't start to deploy Wordpress until mySQL has fully deployed, as we named the mySQL service as a dependency in the Wordpress breed.

### Deploy the blueprint again
We can quickly deploy a second instance of Wordpress and mySQL using our existing artifacts. Vamp breeds, scales and blueprints can be re-used to initiate as many deployments as you like. Each deployment will be treated as an individual entity and Vamp will manage all the internal gateways and routing, so you don't need to worry about creating conflicts with other running services or deployments - more on this later.

1. Go to the **Blueprints** page
* Click **Deploy as** on the **wp_demo** blueprint
* Name the deployment **wp_demo_2**
* Click **Deploy** to initiate the deployment

We now have two separate Wordpress deployments running, they should both be listed on the **Deployments** page:

![](/images/screens/v093/wordpress_deployments.png)

## Canary release the deployments using gateways
Vamp exposes internal and external gateways to allow access to clusters of services. Internal gateways are automatically created dynamic endpoints, external gateways are declared stable endpoints. Weights and conditions can be applied to gateways to control the traffic distribution across multiple potential routes. For example, internal gateways can control traffic distribution across the services deployed in a cluster, whereas external gateways might control traffic distribution across routes not managed by Vamp.
[Read more about gateway usage](/documentation/using-vamp/gateways/#gateway-usage)

To get back to our demonstration, we currently have two separate deployments running. In each of our deployments, Wordpress is connected to its own instance of mySQL via a **mysql_port** internal gateway. At deployment time, Vamp automatically creates new internal gateways for all the ports defined in the breed(s) deployed. This means that we have exposed a **mysql_port** and a **webport** internal gateway for each of our deployments. You can see all current exposed gateways on the **Gateways** page, they are labelled in the format `deployment/cluster/port`.

![](/images/screens/v093/wordpress_internal_gateways.png)

...or in list view...

![](/images/screens/v093/wordpress_internal_gateways_list.png)

### Add stable endpoints
We could use the internal gateway ports to access our deployments if we wanted (go ahead and connect to the assigned ports for the **wp_demo_1/wp/webport** and **wp_demo_2/wp/webport** internal gateways, you should see your running Wordpress services). The ports assigned to internal gateways are, however, unpredictable, so it makes much more sense to declare stable endpoints ()external gateways) and access the services through these.

We can quickly add a new stable endpoint that maps to one of the existing Wordpress (webport) internal gateways.

1. Go to the **Gateways** page
* Click **Add new**
* Paste in the below gateway YAML and click **Save**

```
---
name: wp_demo_1_gateway   # name of our gateway
port: 9050/http           # external gateway to expose
routes:
  wp_demo_1/wp/webport:   # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```


The gateway will be exposed and you can directly - and forever - access your Wordpress service at the specified 9050 port.

![](/images/screens/v091/wordpress.png)

Hello Wordpress! Go ahead and finish the installation - I hear it's very quick - then you can check out your new site.

![](/images/screens/v091/wordpress_wp_demo_1.png)

### Let's do that again
As we are running two deployments, we also need two external gateways - one for each instance of Wordpress. Let's add a second external gateway to give our other Wordpress service a stable endpoint, this time we'll need to expose a different port.

1. Go to the **Gateways** page again
* Click **Add new**
* Paste in the below gateway YAML and click **Save**

```
---
name: wp_demo_2_gateway   # name of our gateway
port: 9060/http           # external gateway to expose
routes:
  wp_demo_2/wp/webport:   # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```
The new gateway will be listed on the **Gateways** page and you can access your second Wordpress site on the newly exposed 9060 port (the old Wordpress site will still be available at port 9050). Complete this second Wordpress installation and make some changes to the site - select a different theme or add some content to help you easily tell the two deployments apart.

![](/images/screens/v091/wordpress_wp_demo_2.png)

### Use a gateway to distribute incoming traffic
Well that was fun, but Vamp can do so much more! We can use our deployments to demonstrate some of Vamp's traffic distribution features and show how these can be used to run a canary release.

Vamp distributes traffic between services at shared gateways. If our Wordpress services had been running in the same deployment and cluster with a shared internal gateway, we could have used the shared internal gateway's WEIGHT slider to distribute traffic between them. As we are working with two separate deployments, we need to create a shared external gateway first. This is much the same as exposing a stable endpoint, only this time we will add two routes to the gateway and use the **weight** setting to distribute traffic between them. You can add as many routes as you like to a gateway, just remember that _the total weight must always add up to 100%_.

1. Go to the **Gateways** page again
* Click **Add new**
* Paste in the below gateway YAML and click **Save**

```
---
name: wordpress_distribution_gateway
port: 9070/http
routes:
  wp_demo_1_gateway:
    weight: 50%     # send 50% of all traffic to this route
  wp_demo_2_gateway:
    weight: 50%     # send 50% of all traffic to this route
```

The gateway wil be created. Go to port 9070 and see which Wordpress install you are sent to.

{{< note title="Note!" >}}
You might notice that the URL in your browser switched to either :9060 or :9050 and that subsequent visits to the 9070 endpoint consistently send you back to the same port/Wordpress. So what's going on with our gateway? Visits to 9070 should be split 50% / 50% between our two Wordpress instances! Here's where things get sticky, but that's not down to Vamp.

* On your first visit via 9070, Wordpress picked up that you had been redirected and sent out the HTTP response 301, which means "permanently moved"
* Your browser cached this 301 redirect and is now automatically sending every subsequent attempt to visit 9070 to the same destination

Simply disabling the cache won't help, but you can get around this by adding, for example, a `?` to the end of the URL (e.g. `192.168.99.100:9070?`). If you prefer a more eloquent solution, you could install a Wordpress plugin to prevent the 301 from happening in the first place ([wordpress.org - Permalink Fix & Disable Canonical Redirects](https://wordpress.org/plugins/permalink-fix-disable-canonical-redirects-pack/) will do the trick), just remember to install it on both of your Wordpress deployments.
{{< /note >}}

Once you do make it back to the Vamp external gateway at 9070 you will see that everything is working as expected and you will be sent to 9050 or 9060 alternately. Thankyou Wordpress.

### Run a canary release
Now we have an external gateway set up with two routes, we can use the WEIGHT slider on the **wordpress_distribution_gateway** page to adjust the distribution of traffic between them. This will allow us to canary release our new Wordpress site to users, introducing it gradually and quickly switching back if it doesn't perform as planned. Conditions can also be added to each route in the gateway to target specific user groups and route them to a specific version version.
[Read more about using conditions](/documentation/using-vamp/conditions)

![](/images/screens/v093/wordpress_gateways_weight_slider.png)


## Summing up
You should now understand a bit more about how Vamp builds deployments from the various artifacts, resolves variables and handles internal routing. Obviously, this is not a production grade setup. The database is running in a containerised mySQL instance with no data persistence. If you're running in the Vamp hello world setup, you're also likely to hit resource problems pretty quickly. If things aren't working as expected you can try increasing the memory of Docker VirtualBox VM (3GB should be enough for this demo).

## Looking for more of a challenge?
Just for fun, you could try these:

* Can you rewrite the Wordpress and mySQL deployment as a single blueprint (define artifacts inline)?
* Can you run this deployment using the Vamp API?
  * There are full instructions in [deploy your first blueprint - using the API](/documentation/tutorials/deploy-your-first-blueprint/#deploy-a-monolith) or you can check the [API reference](/documentation/api/api-reference)
* Try adding a condition to the 9070 external gateway - for example, to send all Firefox users to one version of your site and everyone else to the other
  * Read about [using conditions](/documentation/using-vamp/conditions)
* Could you set up external gateways for the mySQL deployments and connect Wordpress to the mySQL server running in the other deployment?

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@vamp.io)
* Find our more about [using Vamp](/documentation/using-vamp/artifacts)
{{< /note >}}

