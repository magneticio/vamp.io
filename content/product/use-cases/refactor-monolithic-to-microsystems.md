---
date: 2016-09-13T09:00:00+00:00
title: Move from monoliths and VM's to microservices
menu:
    main: 
        parent: "Use cases"
        name: "Refactor to microservices"
        weight: 40
---

> “We want to move to microservices, but we can’t upgrade all components at once and want to do a gradual migration”
  
Refactoring a monolithic application to a microservice architecture is a major project. A big bang style re-write to upgrade all components at once is a risky approach and requires a large investment in development, testing and refactoring.

Why not work incrementally? Using Vamp's routing you could introduce new services for specific application tiers like the frontend or business logic layers, and move traffic with specific conditions to these new services. These services in turn can connect to your legacy systems again, using Vamp's proxying. A typical example would be introducing an angular based frontend or node.js based API microservice. You can send 2% of your incoming traffic to this new microservice frontend, which in turn connects with the legacy backend system. This way you can test your new microservices in a small and controlled way and avoid a big bang release. You can introduce new services one by one, test them in production and increase traffic until you migrated your entire application from a monolith to microservices.

1. __Start small:__ You can build e.g. one new frontend component. Vamp will deploy this to run alongside the legacy monolithic system.
2. __Activate smart routing:__ Vamp can route traffic behind the scenes, so a small percentage of visitors is sent to the new frontend service, while the new frontend is routed by Vamp to the legacy backend. You can continue transferring components from the legacy monolithic system to new microservices and Vamp can adapt the routing as you go.
3. __Remove legacy components:__ Once all services have been transferred from the legacy monolith, you can start removing components from the legacy system.

{{< note title="What next?" >}}
* Read about using Vamp to [test and modernise architecture](/product/use-cases/modernise-architecture/)
* See [how Vamp measures up](/product/vamp-compared-to/proxies-and-load-balancers/) to common platforms, tools and frameworks  
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}
