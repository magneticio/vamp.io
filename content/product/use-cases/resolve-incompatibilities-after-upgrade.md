---
date: 2016-09-13T09:00:00+00:00
title: Resolve client-side incompatibilities after an upgrade
menu:
    main: 
        parent: "Use cases"
        name: "Resolve incompatibilities"
        weight: 30
---

> “We upgraded our website self-management portal, but our biggest client is running an unsupported old browser version”
  
Leaving an important client unable to access your services after a major upgrade is a big and potentially costly problem. The traditional response would be to rollback the upgrade asap - if that's even possible.  

Why rollback? Using Vamp's smart conditional routing you could send specific clients or browser-versions to an older version of your portal while others can enjoy the benefits of your new upgraded portal. Because Vamp supports SLA based autoscaling for (Docker) containers, you can deploy the old version on the same infrastructure as the new version is running on. This also avoids having to provision costly over dimensioned DTAP environments for only a small user-base, leveraging your existing infrastructure efficiently.

1. __Re-deploy:__ Vamp can (re)deploy a (containerised) compatible version of your portal to run side-by-side with the upgraded version.
2. __Activate smart routing:__ Vamp can route all users with e.g. a specific IP, browser or location to a compatible version of the portal. Other clients will continue to see the new upgraded portal.
3. __Resolve the incompatibility:__ Once the client upgrades to a compatible browser Vamp can automatically route them to the new portal version.

{{< note title="What next?" >}}
* Read about using Vamp to [move from monoliths and VMs to microservices](/product/use-cases/refactor-monolithic-to-microsystems/)
* See [how Vamp measures up](/product/vamp-compared-to/proxies-and-load-balancers/) to common platforms, tools and frameworks  
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}
