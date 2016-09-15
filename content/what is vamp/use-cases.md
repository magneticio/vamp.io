---
date: 2016-09-13T09:00:00+00:00
title: use cases
---

How will you use Vamp? We've described some typical implementations of Vamp to give you some ideas of how Vamp

Use Vamp to optimise major projects:

* [A different approach to creating a responsive website](#a-different-approach-to-creating-a-responsive-website)
* [Resolving incompatibilities after a (major) portal upgrade](#resolving-incompatibilities-after-a-major-portal-upgrade)
* [Move legacy monolithic systems with VMs to microservices](#move-legacy-monolithic-systems-with-vms-to-microservices)
* [Modernise services, e.g. move to noSQL DB](#modernise-services-e-g-move-to-nosql-db)

Use Vamp to increase system reliability:

* [What would happen if...... Simulate and test scaling behaviour](#what-would-happen-if-simulate-and-test-scaling-behaviour)
* [Self-healing and self-optimising](#self-healing-and-self-optimising)


## A different approach to creating a responsive website
_“We need to upgrade the web frontend to make it responsive”_  
Developing a responsive web frontend is a major undertaking, requiring a large investment of hours and extensive testing. Until you go live, it's difficult to predict how the upgrade will be received by users - will it actually convert?   

### Vamp offers a smart alternative   
Why develop the whole frontend in one go? Using Vamp you could use a canary release to introduce the new frontend to a selected cohort of users. This would require a minimal investment of hours and delivering real usage data:

1. __Start small:__ Build the new frontend for only one specific browser/resolution. Vamp can deploy the new responsive frontend and route a percentage of supported users there (all other users will continue to see the old version of your website).
2. __Optimise:__ With your new service in the hands of real users, you can measure actual data and optimise accordingly.
3. __Scale up:__ Once you are satisified, you can use Vamp to scale up the release, developing and deploying one browser/resolution at a time.


## Resolving incompatibilities after a (major) portal upgrade
_“We upgraded the portal, our biggest client is running an unsupported browser”_  
Leaving an important client unable to access your services after a major upgrade is a big and potentially costly problem. The traditional response would be to rollback the upgrade asap - if possible.  

### Vamp offers a stress-free alternative
Why rollback? Using Vamp's smart routing you could send specific users/clients to the old portal while others to enjoy the benefits of your new upgraded portal.

1. __Re-deploy:__ Vamp can redeploy a (containerised) compatible version of your portal to run side-by-side with the upgraded version.
2. __Activate smart routing:__ Vamp can route all users with e.g. a specific IP, browser or location to a compatible version of the portal. Other clients will continue to see the new upgraded portal.
3. __Resolve the incompatibility:__ Once the client upgrades to a compatible browser Vamp can route them to the new portal, alternatively you could add in support for their browser.


## Move legacy monolithic systems with VMs to microservices
_“We want to move to microservices, but can’t upgrade all components at once”_  
Refactoring a monolithic apllication to a microservice architecture is a major project. A big bang style re-write to upgrade all components at once is a risky approach and would require a large investment of hours in development and testing.

### Vamp offers a managable alternative  
Why not work incramentally? Using Vamp's smart routing behind the scenes you could upgrade individual components, working step by step with no impact on running services.

1. __Start small:__ You can build e.g. one new frontend component. Vamp will deploy this to run alongside the legacy monolithic system.
2. __Activate smart routing:__ Vamp can route traffic behind the scenes, so the new frontend will start speaking to the legacy backend. You can continue transferring components from the legacy monolithic system to new microservices and Vamp will adapt the routing as you go.
3. __Remove legacy components:__ Once all services have been transferred from the legacy monolith, you can start removing components from the legacy system.

## Modernise services, e.g. move to noSQL DB  
_"We want to switch to a noSQL database, but don't know which solution will run fastest"_  
With multiple database options available, it's hard to know which is the best fit for your specific circumstances. You can try things out in a test lab, but the real test comes when you go live with production load.

### Vamp offers a real world alternative.  
Why guess? Using Vamp you could A/B test the full architecture, in production, and then use real data to make an informed decision.   

1. __Deploy two versions:__ Vamp can deploy multiple versions of your architecture, each with a different database solution, then distribute incoming traffic across each.
2. __Stress test:__ Use the metrics reported by Vamp to measure which option performs best in production.
3. __Keep the best performing option:__ Once you have made your decision, Vamp can route all traffic to your chosen architecture. Services from the alternative options will be drained to ensure customer experience is not impacted by the test.


## What would happen if......Simulate and test scaling behaviour
_"How would our system react if... the number of users increased x10 ... the latency of a new service dropped by 20 seconds ... an entire tier of our application would be killed ..."_  
Your company might dream of overnight success, but what if it actually happened? Stress tests rarely cater to extreme circumstances, and are often done on systems that are not identical to production environments. Oftentimes the bottleneck sits in the system simulating the load itself, so it's difficult to predict what would actually happen or to know if your planned responses will really help.

### Vamp offers a guessswork-free alternative
Why not find out for sure? Using Vamp you can test your services and applications against seemingly impossible situations, and then validate and optimise the scripted responses. With the same workflows as would be running in production, on the same infrastructure, with the same settings.

1. __Mock required load:__ Vamp can simulate (mock) high-stress situations for any kind of metric your system needs to respond to, without actually having to generate real traffic.
2. __Optimise:__ You can optimise your resource allocation and autoscaling configurations based on real validated behaviour under stress.
3. __Iterate until you're certain:__ Vamp can repeat the tests until you're confident with the outcome. Then you can use the same scaling and optimising workflows in production.

## Self-healing and self-optimising

_"Our website traffic can be unpredictable, it's hard to plan and dimension the exact resources we're going to need to run within SLA's"_


### Vamp offers an easy and flexible way to dynamically scale resources and correct unhealthy behaviour
Why overdimension your whole system? Using Vamp you can auto-scale individual services based on clearly defined SLAs. It's also easy to create advanced workflows for up and down scaling, based on your application or business specific requirements. Vamp can also make sure that unhealthy and failing services are corrected based on clearly defined metrics and treshholds.

1. __Set SLAs:__ You can define SLA metrics, tresholds and escalation workflows. You can do this in Vamp blueprints, or create your own workflows for advanced use-cases.
2. __Optimise:__ Vamp workflows can automically optimise your running system based on metrics that are relevant to your application or services.
3. __Sleep easy:__ Vamp will track troughs and spikes in activity and automatically scale services to match your SLAs. All scaling events will be logged. Unhealthy services can be healed by Vamp.
