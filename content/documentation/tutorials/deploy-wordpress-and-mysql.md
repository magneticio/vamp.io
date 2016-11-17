
---
date: 2016-09-13T09:00:00+00:00
title: Deploy Wordpress from the Docker hub
draft: true
---
Ths tutorial will demonstrate how Vamp builds deployments and works with gateways. We'll do this by deploying Wordpress together with mySQL using official images from the Docker hub. We are going to work with the Vamp UI, but you could just as easily perform all the described actions using the Vamp API.  

In this tutorial we will:

1. [Build a deployment from Vamp artifacts](documentation/tutorials/deploy-wordpress-and-mysql/#build-a-deployment-from-vamp-artifacts)  
  * Create breeds to describe the mySQL and Wordpress deployables and their requirements
  * Create a scale to specify the resources to be assigned at runtime
  * Create a blueprint that combines breeds with scales 
  * Deploy two instances of mySQL and Wordpress
2. [Work with Vamp gateways](documentation/tutorials/deploy-wordpress-and-mysql/#work-with-vamp-gateways) 
  * Add stable endpoints to access the running Wordpress deployments
  * Create a gateway to control traffic distribution between the two deployments and run a canary release
  * Connect Wordpress to the mySQL service using an external gateway
  
  

### Requirements

* A running version of Vamp (this tutorial has been tested on the [Vamp hello world set up](documentation/installation/hello-world))
* Access to the Docker hub

## Build a deployment from Vamp artifacts
Deployments to be initiated by Vamp are described in blueprints using the Vamp DSL (Domain Specific Language). A Vamp blueprint combines breed and scale artifacts to make scalable services, then groups these services into clusters for traffic distribution. 
A blueprint can reference individually stored artifacts, or they can be described inline. We are going to create individual breed and scale artifacts, then reference these from our blueprint.

### Create breeds
Services to be deployed by Vamp must first be described in a breed. Breeds define the deployable to run and the internal gateway(s) to create for a single service. Settings can be specified in a breed and passed to the service at runtime, this is done using environment variables.  
[Read more about environment variables...](documentation/using-vamp/environment-variables)

For our deployment, we will need to create two breeds - one for the mySQL database and one for Wordpress. We can use environment variables to specify the login credentials for the database and add some Vamp magic to tell Wordpress where it can find the as-yet-undeployed mySQL database. The Vamp variable `host` will resolve to the host or IP address of a referenced service at runtime. Finally, we can declare the mySQL database as a dependency for the Wordpress service so Vamp will wait until the database is available before it deploys Wordpress and all environment variables can be resolved.

* **The mySQL breed**  
We will use mySQL as the Wordpress database, but you could try another database if you prefer. A quick check of the official documentation on the Docker hub tells us that the official mySQL container ([hub.docker.com - mySQL](https://hub.docker.com/_/mysql/)) exposes the standard mySQL port (3306). We can create a database and set up some user accounts with the variables `MYSQL_DATABASE`, `MYSQL_ROOT_PASSWORD`, `MYSQL_USER` and `MYSQL_PASSWORD`. That's all the details we need to create a breed for the mySQL service. 

  1. Go the BREEDS tab in the Vamp UI
  * Click ADD
  * Paste in the below breed YAML and click SAVE

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

* **The Wordpress breed**  
Now let's do the same for our Wordpress service. The official Wordpress container ([hub.docker.com - wordpress](https://hub.docker.com/_/wordpress/)) runs apache on port 80. We can specify an external database using the variables `WORDPRESS_DB_HOST`, `WORDPRESS_DB_USER` and `WORDPRESS_DB_PASSWORD`. 

  1. Go the BREEDS tab in the Vamp UI
  * Click ADD
  * Paste in the below breed YAML and click SAVE

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


Nothing has been deployed yet, but you will be able to see the two new breeds listed in the Vamp UI under the BREEDS tab:

![](images/screens/v091/wordpress_breeds.jpg)

### Create a scale
Scales define the resources to assign to a service- the number of instances (servers) and allocated CPU and memory. We are going to create one scale, which will be used by both of our breeds.

  1. Go the SCALES tab in the Vamp UI
  * Click ADD
  * Paste in the below scale YAML and click SAVE

```
name: demo
instances: 1
cpu: 0.2
memory: 380MB  
```
### Create a blueprint
We can now create a simple blueprint that references our artifacts ready for deployment. The Vamp blueprint creates scalable services by joining the breed descriptions with a scale. Services are grouped into clusters to allow easy distribution of incoming traffic - more on this later. 

Our blueprint will use two clusters - one for the database service and one for the Wordpress service.

1. Go to the BLUEPRINTS tab in the Vamp UI 
* Click ADD (top right)
* Paste in the below blueprint YAML and press SAVE

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

Vamp will store the blueprint and make it available for deployment. You can see it listed under the BLUEPRINTS tab.

![](images/screens/v091/wordpress_blueprints.jpg)

### Deploy the blueprint

1. Click DEPLOY AS
* You will be prompted to give your deployment a name, let’s call it `wp_demo_1`
* Click DEPLOY to initiate the deployment

Vamp will now run the deployment. This might take some time, especially if the images need to be pulled from the Docker hub. You can track the status of the deployed clusters and their services under the DEPLOYMENTS tab by opening the `wp_demo_1` deployment. Once a deployment has successfully completed, you will see the service name highlighted in grey (on the left), the IP of the deployed instance(s) and any environment variables passed to the service. Note how Wordpress won't start deploying until mySQL has fully deployed.

![](images/screens/v091/wordpress_deployment_1.jpg)

### Deploy the blueprint again
We can deploy a second instance of Wordpress and mySQL quickly using our existing artifacts. You can re-use Vamp breeds, scales and blueprints to initiate as many deployments as you like. Each deployment will be treated as an individual entity and Vamp will manage all the internal gateways, so you don't need to worry about creating conflicts with other running services or deployments (more on this later). 

1. Go to the BLUEPRINTS tab 
* Click DEPLOY AS on the `wp_demo` blueprint
* You’ll be prompted to give the deployment a name, let’s call it `wp_demo_2` this time
* Click DEPLOY to initiate the deployment

Both our deployments should now be listed under the DEPLOYMENTS tab:

![](images/screens/v091/wordpress_deployment_2.jpg)

## Work with Vamp gateways
Vamp exposes gateways to allow access to service clusters. Vamp gateways are either dynamic, automatically created endpoints (internal gateways) or stable, declared endpoints (external gateways). Weights and conditions can be applied to gateways to control traffic distribution across multiple (defined) routes - for example, across the services in a cluster or even routes not managed by Vamp.  
[Read more about gateway usage](documentation/using-vamp/gateways/#gateway-usage)

We currently have two separate deployments running. In each of our deployments, Wordpress is connected to its own instance of mySQL database at a `mysql_port` internal gateway. Internal gateways are created using the `ports` defined in a breed. Vamp will automatically create a new `mysql_port` internal gateway each time our mySQL breed is deployed. You can see all exposed gateways listed under the GATEWAYS tab in the Vamp UI, they are described in the format `deployment/cluster/port`. 

![](images/screens/v091/wordpress_internal_gateways.jpg)

### Add stable endpoints
We could use the assigned Wordpress internal gateways to access our Wordpress deployments (go ahead and connect to the `<deployment>/wp/webport` ports listed under GATEWAYS). The ports assigned to internal gateways are, however, unpredictable. Vamp allows us to set up stable endpoints by adding external gateways that point to defined, exposed internal gateways. 

We can easily update the running deployment to include new external gateways mapped directly to the internal gateways of our running Wordpress services.   

1. Go to the GATEWAYS tab in the Vamp UI
* Click ADD (top right)
* Paste in the below gateway YAML and click SAVE

```
---
name: wp_demo_1_gateway   # name of our gateway
port: 9050/http           # external gateway to expose
routes:
  wp_demo_1/wp/webport:   # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```


The gateway will be exposed and we can directly access our running Wordpress service at the port specified (9050). 

![](images/screens/v091/wordpress.png)

Hello Wordpress! Go ahead and finish the installation - I hear it's very quick - then you can check out your new site.

### Let's do that again
As we are running two deployments, we also need to create two external gateways to access them.  

1. Go to the GATEWAYS tab again and click ADD (top right)
* Paste in the below gateway YAML and click SAVE

```
---
name: wp_demo_2_gateway   # name of our gateway
port: 9060/http           # external gateway to expose
routes:
  wp_demo_2/wp/webport:   # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```
Notice that we specified a different port for this external gateway - port 9050 is in use by the external gateway we already created earlier to point to the `wp_demo_1` deployment.



The gateway will be created and we will be able to access the second Wordpress site on the newly exposed 9060 port (the old Wordpress install should still be available at port 9050). Complete the new Wordpress installation and make some changes to this site - select a different theme or add some content so you can easily tell the two deployments apart.


-------

### Use a gateway to distribute incoming traffic
Well that was fun, but Vamp can do so much more. Let's use our deployment to demonstrate some of Vamp's traffic distribution features and show how these can be used to run a canary release. We'll start by spinning up a second, separate deployment of Wordpress and mySQL - we want to avoid hitting issues with content synchronisation.  

Now we have two entirely separate Wordpress deployments up and running, each with their own external gateway.  
If we had been running our services from a single deployment, we could have directly used the WEIGHT slider in the Vamp UI to distribute traffic across the services in each cluster. As we are working with two separate deployments, we will need to do something a bit more cunning first - the perfect oppertunity to demonstrate just how versatile Vamp gateways can be.

### Create a new external gateway with two routes
We are going to create a new external gateway and use it to distribute incoming traffic between our two deployments. We do this in much the same way as we created our other external gateways, just this time we will add two routes and use the weight setting to distribute traffic between them. You can add as many routes as you like to a gateway, just remember that **the total weight must add up to 100%**. 

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

1. Go to the GATEWAYS tab in the Vamp UI
* Click ADD (top right)
* Paste in the above gateway YAML
* Click SAVE

The gateway wil be created. Now going to port 9070 should send you to either your old Wordpress install or your new Wordpress install. You will notice that the URL in your browser has switched to either 9060 or 9050 and subsequent visits to the 9070 gateway consistently send you back to the same port/Wordpress. So what's going on with our gateway? Our visits to 9070 should be split 50% / 50% between the old and new Wordpress instances! Here's where things get sticky, but that's not down to Vamp. On your first visit via 9070, Wordpress will pick up that you were redirected and send the HTTP response 301. For those not well versed in HTTP response codes, 301 means _permanently moved_. Your browser will cache this 301 redirect and automatically redirect every subsequent attempt to visit 9070 the same way - our distribution gateway didn't stand a chance.
  
You can get around this by adding a `?` to the end of the URI (e.g. `192.168.99.100:9070?`). This will send you to the Vamp external gateway at 9070 and you will alternately be sent to 9050 or 9060.
If you prefer a more eloquent solution, you can install a Wordpress plugin to prevent it happening in the first place ([wordpress.org - Permalink Fix & Disable Canonical Redirects](https://wordpress.org/plugins/permalink-fix-disable-canonical-redirects-pack/) will do the trick), just remember to install it on both your Wordpress deployments.
  
  
[Read more about using conditions...](documentation/using-vamp/conditions)

## Summing up
You should now understand a bit more about how Vamp builds deployments from the various artifacts, resolves variables and handles internal routing. Obviously, this is not a production grade setup. The database is running in a containerised mySQL instance with no data persistence - if the container crashes you lose all your data and settings. If you're running in the Vamp hello world setup, you're also likely to hit resource problems pretty quickly. If things aren't working as expected you can try increasing the memory of Docker VirtualBox VM (3GB should be enough for this demo).

## Try for yourself
Looking for more of a challenge?

* Can you rewrite the Wordpress and mySQL deployment as a single blueprint?
* Can you run this full deployment using the Vamp API?
  * 
  * 
* Is it possible to set up the same deployment with data persistence?
* Add a condition to the gateway
* Connect to an externally deployed mySQL server (requires use of IP)

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
{{< /note >}}

