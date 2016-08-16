---
date: 2016-03-09T19:56:50+01:00
title: use cases
menu:
  main:
    parent: WHAT IS VAMP?
    identifier: use cases
    weight: 10
---
{{< warning title="DRAFT" >}}
{{< /warning >}}

Vamp lets you tackle big projects with confidence:

* [Create a responsive website](#create-a-responsive-website)
* [Resolve incompatibilities after a (major) portal upgrade](#resolve-incompatibilities-after-a-major-portal-upgrade) 
* [Move legacy monolithic systems with VMs to microservices](#move-legacy-monolithic-systems-with-vms-to-microservices)
* [Modernise services, e.g. move to noSQL DB](#modernise-services-e-g-move-to-nosql-db) 

Running services can be tested and optimised to increase reliability:

* [Test for the impossible](#test-for-the-impossible)
* [Automatically react](#automatically-react-to-spiky-traffic-load)


## Create a responsive website
_“We need to upgrade the web frontend to make it responsive”_  
Developing a responsive web frontend is a major undertaking, traditionally requiring a large investment of hours. Even with extensive testing, it's hard to predict how your users will respond until you go live - will it actually convert?   

Vamp offers a smart alternative.   
Use a canary release to introduce the new frontend to a selected cohort of users, requiring a minimal investment of hours and delivering real usage data.

1. __Start small:__ Build the new frontend for only one specific browser/resolution. Vamp can deploy the new responsive frontend and route a percentage of supported users there (all other users will continue to see the old version of your website).
2. __Optimise:__ With your new service in the hands of real users, you can measure actual data and optimise accordingly.
3. __Scale up:__ Once you are satisified, you can use Vamp to scale up the release, developing and deploying one browser/resolution at a time. 


## Resolve incompatibilities after a (major) portal upgrade
_“We upgraded the portal, our biggest client is running an unsupported browser”_  
Leaving an important client unable to access your services after a major release is a _big problem_. The traditional response would be to rollback the upgrade asap - if possible.  

Vamp offers a stress-free alternative.   
Use smart routing to reslolve compatibility issues for specific users/clients while others enjoy the benefits of your upgraded portal.

1. __Re-deploy:__ Vamp can redeploy the (containerised) previous version of your portal to run side by side with the upgraded version.
2. __Activate smart routing:__ Vamp can route all users with a specific IP (or browser) to the previous version of the portal. Other clients will continue to see the upgraded portal.
3. __Resolve the incompatibility:__ Once the client upgrades to a compatible browser Vamp can route them to the new portal, alternatively you could add in support for their browser.


## Move legacy monolithic systems with VMs to microservices
_“We want to move to microservices, but can’t upgrade all components at once”_  
Switching from a monolithic to a microservice architecture is a major undertaking.

Vamp offers a managable alternative.  
Use smart routing behind the scenes to upgrade individual components step by step with no impact on running services.

1. __Start small:__ You can build e.g. one new frontend component. Vamp will deploy this to run alongside the legacy monolithic system.
2. __Activate smart routing:__ Vamp can route traffic so the new frontend starts speaking to the legacy backend. You can continue transferring components from the legacy monolithic system to new microservices and Vamp will adapt the routing as you go.
3. __Remove legacy components:__ Once all has been transferred to the new frontend, you can start removing components from the legacy system.

## Modernise services, e.g. move to noSQL DB  
A/B test architecture before you jump

## Test for the impossible

## Automatically react to spiky traffic/load 
Take action on a granular level
