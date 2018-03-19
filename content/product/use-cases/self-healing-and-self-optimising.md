---
date: 2016-09-13T09:00:00+00:00
title: Self-healing and self-optimising
menu:
    main: 
        parent: "Use cases"
        weight: 60
---

> "Our website traffic can be unpredictable, it's hard to plan and dimension the exact resources we're going to need to run within SLA's"

Why overdimension your whole system? Using Vamp you can auto-scale individual services based on clearly defined SLAs (Service Level Agreements). It's also easy to create advanced workflows for up and down scaling, based on your application or business specific requirements. Vamp can also make sure that unhealthy and failing services are corrected based on clearly defined metrics and thresholds.

1. __Set SLAs:__ You can define SLA metrics, tresholds and escalation workflows. You can do this in Vamp YAML blueprints, modify our packaged workflows, or create your own workflow scripts for advanced use-cases.
2. __Optimise:__ Vamp workflows can automatically optimise your running system based on metrics that are relevant to your application or services.
3. __Sleep easy:__ Vamp will track troughs and spikes in activity and automatically scale services up and down to match your SLAs. All scaling events will be logged. Unhealthy services can be healed by Vamp.

{{< note title="What next?" >}}
* Read about using Vamp for [service discovery](/product/use-cases/service-discovery/)
* See [how Vamp measures up](/product/vamp-compared-to/proxies-and-load-balancers/) to common platforms, tools and frameworks  
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}
