---
date: 2016-09-13T09:00:00+00:00
title: Get started
menu:
  main:
    parent: "why-use-vamp-top"
    weight: 70
---

## Try Vamp
To make the most of your 'my first Vamp' experience, we suggest you start by installing our single, all-in-one [Vamp Docker Hello World package](documentation/installation/hello-world/). This will set up everything you need to play around with Vamp on a local or remote dev machine - the container package includes Mesos/Marathon and Elastic Stack (ELK), as well as all the necessary Vamp components. We have some nice [tutorials](documentation/tutorials/overview) to get a feel for the supernatural powers of Vamp.

## Install a production-grade Vamp setup
Of course our Hello World package is no production-grade setup. We suggest your next step should be to understand the [Vamp architecture](documentation/how-vamp-works/architecture-and-components) and then find the Vamp version for your favorite container scheduler. We support most common container schedulers, so you should be able to find one to your liking in our [installation docs](documentation/installation/overview). If you're still not sure which container scheduler to work with, our ['what to choose' guide](documentation/how-vamp-works/which-container-scheduler/) can help you make an informed decision.


## Fine tune and integrate
After you've successfully installed a production-grade Vamp on your preferred container-cluster manager/scheduler (if you need help here, find us in our [public Gitter channel](https://gitter.im/magneticio/vamp)), it's time to either dive into the ways you can [use Vamp](documentation/using-vamp/artifacts/) or investigate how you can [configure and fine-tune Vamp](documentation/installation/configure-vamp) to match your specific requirements. It might also be interesting to integrate Vamp into your CI pipeline to create a CD pipeline with Vamp's canary-releasing features. You can check out our [CLI](documentation/cli/cli-reference/) and [REST API](documentation/api/api-reference/) documentation for integrations.

## Get your teeth into the fun stuff!
At this point you've become a real Vamp guru. The next step could be to start playing around with our [Vamp Runner tool](https://github.com/magneticio/vamp-runner/) to investigate typical recipes, such as automated canary-releasing, auto-scaling and more. You can use the JavaScript-based workflows in the recipes as a reference to create your own recipes and workflows. Once you've created some cool workflows and recipes we would of course like to hear from you!

{{< note title="What next?" >}}
* Try the [Vamp Docker Hello World package](documentation/installation/hello-world/) and [tutorials](documentation/tutorials/overview)
* Read about the [Vamp architecture](documentation/how-vamp-works/architecture-and-components)
* Check the [installation docs](documentation/installation/overview)
{{< /note >}}