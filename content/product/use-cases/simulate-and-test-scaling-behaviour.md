---
date: 2016-09-13T09:00:00+00:00
title: Simulate and test scaling behaviour
menu:
    main: 
        parent: "Use cases"
        weight: 50
---

> "How would our system react if... the number of users increased x10 ... the response time of a service increased with 20 seconds ... an entire tier of our application would be killed ..."  

Your company might dream of overnight success, but what if it actually happened? Stress tests rarely cater to extreme real world circumstances and usage patterns, and are often done on systems that are not identical to production environments. It's not uncommon the bottleneck sits in the system generating the load itself, so it's difficult to predict how your microservices would actually scale or to know if your planned responses will really help.

Why not find out for sure? Using Vamp you can test your services and applications against difficult to predict or simulate situations, mocking all kinds of metrics, and then validate and optimise the workflows that handle the responses, like for example auto up and down scaling. With the same workflows as would be running in production, on the same infrastructure, with the same settings.

1. __Mock required load:__ Vamp can simulate (mock) high-stress situations for any kind of metric your system needs to respond to, without actually having to generate real traffic.
2. __Optimise:__ You can optimise your resource allocation and autoscaling configurations based on real validated behaviour under stress.
3. __Iterate until you're certain:__ Vamp can repeat the tests until you're confident with the outcome. Then you can use the same scaling and optimising workflows in production.

{{< note title="What next?" >}}
* Read about using Vamp for [self healing and self optimising](/product/use-cases/self-healing-and-self-optimising/)
* See [how Vamp measures up](/product/vamp-compared-to/proxies-and-load-balancers/) to common platforms, tools and frameworks  
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}
