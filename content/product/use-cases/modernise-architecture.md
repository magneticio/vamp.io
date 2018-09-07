---
date: 2016-09-13T09:00:00+00:00
title: Test and modernise architecture
menu:
    main: 
      parent: "Use cases"
      weight: 40
      name: "Modernising your architecture"
---

> "We want to switch to a NoSQL database for our microservices, but don't know which solution will run best for our purposes"

With multiple NoSQL database options available, it's hard to know which is the best fit for your specific circumstances. You can try things out in a test lab, but the real test comes when you go live with production load.

Why guess? Using Vamp you could A/B test different versions of your services with different NoSQL backends, in production, and then use real data to make an informed and data-driven decision.   

1. __Deploy two versions:__ Vamp can deploy multiple versions of your architecture, each with a different database solution (or other configuration settings), then distribute incoming traffic across each.
2. __Stress test:__ Use the metrics reported by Vamp to measure which option performs best in production.
3. __Keep the best performing option:__ Once you have made your decision, Vamp can route all traffic to your chosen architecture. Services from the alternative options will be drained to ensure customer experience is not impacted by the test.

{{< note title="What next?" >}}
* Read about using Vamp to [simulate and test scaling behaviour](/product/use-cases/simulate-and-test-scaling-behaviour/)
* See [how Vamp measures up](/product/vamp-compared-to/proxies-and-load-balancers/) to common platforms, tools and frameworks  
* Find out [how Vamp works](/documentation/how-vamp-works/architecture-and-components)
{{< /note >}}
