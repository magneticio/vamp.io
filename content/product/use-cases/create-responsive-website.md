---
date: 2016-09-13T09:00:00+00:00
title: Canary test and release a responsive frontend
menu:
  main: 
    parent: "Use cases"
    name: "Create a responsive website"
    weight: 20
---

> “We need to upgrade our website frontend to make it responsive”
  
Developing a responsive web frontend is often a major undertaking, requiring a large investment of hours and extensive testing. Until you go live, it's difficult to predict how the upgrade will be received by users - will it actually improve important metrics, will it work on all browser, devices and resolutions, etc.?   

But why develop this new responsive frontend in one go, having to go for the dreaded and risky big-bang release? Using Vamp you can apply a canary release to introduce the new frontend to a selected cohort of users, browsers and/or devices. This would require a minimal investment of development and delivering real usage data:

1. __Start small:__ Build the new frontend for only one specific browser/resolution first to measure effectiveness. Vamp can deploy the new responsive frontend and route a percentage of supported users with this specific browser and screen-resolution there. All other users will continue to see the old version of your website.
2. __Optimise:__ With the new responsive frontend in the hands of real users with this specific browser/resolution, you can measure actual data and optimise accordingly without negatively affecting the majority of your users.
3. __Scale up:__ Once you are satisified with the performance of the new frontend, you can use Vamp to scale up the release, developing and canary releasing one browser/resolution at a time. Of course other cohort combinations are also possible, Vamp is open and supports all HAProxy ACL rules.

{{< note title="What next?" >}}
* Read about using Vamp to [resolve client-side incompatibilities after an upgrade](/product/use-cases/resolve-incompatibilities-after-upgrade/)
* See [how Vamp measures up](/product/vamp-compared-to/proxies-and-load-balancers/) to common platforms, tools and frameworks  
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}
