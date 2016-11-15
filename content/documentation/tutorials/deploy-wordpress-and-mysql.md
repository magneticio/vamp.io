
---
date: 2016-09-13T09:00:00+00:00
title: Deploy Wordpress from the Docker hub
draft: true
---

In this tutorial we're going to use Vamp to deploy Wordpress together with mySQL. We will work with official images from the Docker hub to demonstrate how Vamp can easily initiate deployments, manage gateways and load balance  traffic across services and deployments. We are going to set up our deployment as individual artifacts (breeds, blueprint and gateways) using the Vamp UI, but you could just as easily use the Vamp API. In this tutorial we will:

1. Take a look at how Vamp structures deployments 
* Create breeds to describe the mySQL and Wordpress services
* Create a blueprint that references our two breeds and deploy them
* Add a stable endpoint to access our running Wordpress deployment
* Deploy a second instance of mySQL and Wordpress
* Use a gateway to load balance traffic between the two deployments

### Requirements

* A running version of Vamp (this tutorial has been tested on the [Vamp hello world set up](documentation/installation/hello-world))
* Access to the Docker hub

## How Vamp structures deployments
Deployments managed by Vamp are described in blueprints using the Vamp DSL (Domain Specific Language). Each blueprint describes the services to deploy (breeds) and groups them into clusters for load balancing. Gateways allow access to running services from both within the deployment (internal gateways) and at stable endpoints from outside the deployment (external gateways).  

Let's start by creating breeds that describe the mySQL and Wordpress services.

## Create breeds to describe our services
Services to be deployed by Vamp must first be described in a breed. You can describe breeds inline as part of a blueprint or you can store them separately as individual artifacts that can be referenced from blueprints. Breeds define the deployable to run and the internal gateway(s) to expose for a single service. Settings can be specified in a breed and passed to the service at runtime, this is done using environment variables.  
[Read more about environment variables...](documentation/using-vamp/environment-variables)

For our deployment, we will need to create two breeds - one for the mySQL database and one for Wordpress. We can use environment variables to specify the login credentials for the database and add some Vamp magic to tell Wordpress where it can find the as-yet-undeployed mySQL database. The Vamp variable `host` will resolve to the host or IP address of a referenced service at runtime. Finally, we can declare the mySQL database as a dependency for the Wordpress service so Vamp will wait until the database is available before it deploys Wordpress and all environment variables can be resolved.

### Create the mySQL breed
We are using mySQL as the Wordpress database, but you could try another database if you prefer. A quick check of the official documentation on the Docker hub tells us that the official mySQL container ([hub.docker.com - mySQL](https://hub.docker.com/_/mysql/)) exposes the standard mySQL port (3306). We can create a database and set up some user accounts with the variables `MYSQL_DATABASE`, `MYSQL_ROOT_PASSWORD`, `MYSQL_USER` and `MYSQL_PASSWORD`. That's all the details we need to create a breed for the mySQL service. 

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

1. Go the BREEDS tab in the Vamp UI
* Click ADD
* Paste in the above breed YAML
* Click SAVE

### Create the Wordpress breed
Now let's do the same for our Wordpress service. The official Wordpress container ([hub.docker.com - wordpress](https://hub.docker.com/_/wordpress/)) runs apache on port 80. We can specify an external database using the variables `WORDPRESS_DB_HOST`, `WORDPRESS_DB_USER` and `WORDPRESS_DB_PASSWORD`. 

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

1. Go the BREEDS tab in the Vamp UI
* Click ADD
* Paste in the above breed YAML
* Click SAVE

Nothing has been deployed yet, but you will be able to see the two breeds we have created listed in the Vamp UI:

![](images/screens/v091/wordpress_breeds.jpg)


## Create a blueprint to deploy our services
We can now combine our breeds in a simple blueprint ready for deployment. Vamp groups services (breeds) in clusters that are used as load balancing units to allow easy distribution of incoming traffic - more on this later. The blueprint also specifies other runtime information, such as resources which should be assigned to each service (the scale).  

### Create the blueprint 
Our blueprint will use two clusters - one for the database service and one for the Wordpress service.

```
name: wp_demo            # name of our blueprint
clusters:
  db:                    # name of our database cluster
    services:
      breed: mysql       # the mySQL breed we created
      scale:
        instances: 1
        cpu: 0.3
        memory: 380MB              
  wp:                    # name of our Wordpress cluster
    services:
      breed: wp:1.0.0    # the Wordpress breed we created
      scale:
        cpu: 0.2
        memory: 380MB
        instances: 1
```
1. Go to the BLUEPRINTS tab in the Vamp UI 
* Click ADD (top right)
* Paste in the above blueprint YAML
* Press SAVE. 

Vamp will store the blueprint and make it available for deployment. 

![](images/screens/v091/wordpress_blueprints.jpg)

### Deploy the blueprint

1. Click DEPLOY AS
* You’ll be prompted to give your deployment a name, let’s call it `wp_demo_1`
* Click DEPLOY to initiate the deployment

Vamp will now run the deployment. This might take some time, especially if the images still need to be pulled from the Docker hub. You can track the status of the deployed clusters and their services under the DEPLOYMENTS by opening the `wp_demo_1` deployment. Once a deployment has successfully completed you will see the service name highlighted in grey (on the left), the IP of the deployed instance(s) and the environment variables passed to the service. Note how the Wordpress deployment doesn't start until mySQL has fully deployed.

![](images/screens/v091/wordpress_deployment_1.jpg)
## Access Wordpress from outside the deployment

Vamp treats the clusters of services in a blueprint as a single "black box" deployment. Each service exposes internal gateways that are accessible to other services from within the same deployment. Internal gateways are defined as `ports` in a breed and come in two flavours - tcp and http ([read more about ports](documentation/using-vamp/breeds/#ports)). To access a service at a stable endpoint from outside the deployment, an external gateway must also be exposed.  

Our deployment currently only exposes internal gateways - you can see these listed under the GATEWAYS tab in the Vamp UI.  

![](images/screens/v091/wordpress_internal_gateways.jpg)

### Create an external gateway
If we had wanted to easily access our Wordpress instance from outside the deployment, we should have also exposed an external gateway. Oops. Luckily, Vamp makes it easy for us to update the running deployment. This means we can create a new external gateway and map it directly to the internal gateway of our running Wordpress service.   

```
---
name: wp_demo_1           # name of our gateway
port: 9050/http           # external gateway to expose
routes:
  wp_demo/wp/webport:     # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```
1. Go to the GATEWAYS tab in the Vamp UI
* Click ADD (top right)
* Paste in the above gateway YAML
* Click SAVE

The gateway will be exposed and we can directly access our running Wordpress service at the port specified (9050). 

![](images/screens/v091/wordpress.png)

Hello Wordpress! Go ahead and finish the installation - I hear it's very quick - then you can check out your new site.

## Let's do it all again

Well that was fun, but Vamp can do so much more. It would be good to use our deployment to demonstrate some of Vamp's load balancing features and show how these can be used to run a canary release. The easiest way to demonstrate this is by spinning up a second, separate deployment of Wordpress and mySQL - we want to avoid hitting issues with content synchronisation.  

### Deploy Wordpress and mySQL #2

This will be quick because we can re-use our existing Vamp breeds and blueprint. Vamp can use breeds and blueprints to initiate as many deployments as you like. Each deployment is treated like an island and Vamp manages the exposed internal gateways, so you don't need to worry about creating conflicts with other running services or deployments. 

1. Go to the BLUEPRINTS tab 
* Click DEPLOY AS on the `wp_demo` blueprint
* You’ll be prompted to give the deployment a name, let’s call it `wp_demo_2` this time
* Click DEPLOY to initiate the deployment

### Create external gateweay #2
As before, we will need to create an external gateway to give us a stable endpoint to access the deployment. Notice that we've specified a different port for this external gateway. This was necesary as port 9050 is in use by the external gateway we created earlier to point to the `wp_demo_1` deployment.

```
---
name: wp_demo_2           # name of our gateway
port: 9060/http           # external gateway to expose
routes:
  wp_demo_2/wp/webport:   # the internal gateway exposed by the Wordpress breed
    weight: 100%          # all traffic will be sent here
```
1. Go to the GATEWAYS tab in the Vamp UI
* Click ADD (top right)
* Paste in the above gateway YAML
* Click SAVE

The gateway will be created and we will be able to access the second Wordpress site on the newly exposed 9060 port (the old Wordpress install should still be available at port 9050). Complete the new Wordpress installation and make some changes to this site - select a different theme or add some content so you can easily tell the two deployments apart.

## Use a gateway to load balance incoming traffic
Now we have two entirely separate Wordpress deployments up and running, each with their own external gateway.  

If we were working with a single deployment, we could distribute traffic between the services in each cluster using the weight slider in the Vamp UI. We are, however, working with two separate deployments so we will need to do something a bit more cunning. Luckily this also allows us to demonstrate the versatility of Vamp gateways.


```
---
name: wordpress_canary_demo
port: 9070/http
routes:
  wp_demo_1:
    weight: 50%           # you could also use a condition here
  wp_demo_2:
    weight: 50%
```
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

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
{{< /note >}}

