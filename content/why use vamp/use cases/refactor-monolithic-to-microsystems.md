---
date: 2016-09-13T09:00:00+00:00
title: Move legacy monolithic systems with VMs to microservices
---

_“We want to move to microservices, but can’t upgrade all components at once”_  
Refactoring a monolithic apllication to a microservice architecture is a major project. A big bang style re-write to upgrade all components at once is a risky approach and would require a large investment of hours in development and testing.

Why not work incramentally? Using Vamp's smart routing behind the scenes you could upgrade individual components, working step by step with no impact on running services.

1. __Start small:__ You can build e.g. one new frontend component. Vamp will deploy this to run alongside the legacy monolithic system.
2. __Activate smart routing:__ Vamp can route traffic behind the scenes, so the new frontend will start speaking to the legacy backend. You can continue transferring components from the legacy monolithic system to new microservices and Vamp will adapt the routing as you go.
3. __Remove legacy components:__ Once all services have been transferred from the legacy monolith, you can start removing components from the legacy system.

