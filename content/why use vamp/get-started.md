---
date: 2016-09-13T09:00:00+00:00
title: Get started
---

To make the most of your 'my first Vamp' experience we suggest starting with installing our single "all in one" [Vamp Docker Quickstart](documentation/installation/hello-world/). This will setup everything you need to play around with Vamp on a dev machine (this package includes Mesos/Marathon and ELK besides all necessary Vamp components). We have some nice [tutorials](documentation/tutorials) to get a feel for the supernatural powers of Vamp.

Of course this is no production-grade setup, so the next step would be to understand [Vamp's architecture](documentation/how-vamp-works/architecture-and-components) and then find the Vamp version for your favorite container scheduler. We do support most common container schedulers, so you should be able to find one of your liking in our [installation docs](documentation/installation/)! If you're not sure what container scheduler to pick to run Vamp with, we have a [guide](documentation/how-vamp-works/what-to-choose/) to help you choose and make an informed decision.

After you've successfully installed Vamp on your preferred container-cluster manager/scheduler (if you need help here, find us in our [public Gitter channel](https://gitter.im/magneticio/vamp)) it's time to either dive into the ways to [use Vamp](documentation/using-vamp/artifacts/), or investigate on how to [configure and fine-tune Vamp](documentation/installation/configure-vamp) for your personal preferences.

Now you have Vamp running on your favorite container cluster manager/scheduler. It might be interesting to integrate Vamp into your CI pipeline to create a CD pipeline with Vamp's canary-releasing features. You can check out our [CLI](documentation/cli/cli-reference/) and [REST API](documentation/api/api-reference/) for integrations.

Now you're probably a real Vamp guru. The next step could be to start playing around with our [Vamp Runner tool](https://github.com/magneticio/vamp-runner/) to investigate typical "recipes" for f.e. automated canary-releasing, auto-scaling and more. You can use the javascript-based workflows in the recipes as a reference to create your own recipes and workflows. If you have created some cool workflows and recipes we would of course like to hear from you! 

## Try Vamp
We’ve created some quick setups, demo applications and tutorials so you can [try Vamp out for yourself](/documentation/installation/hello-world).

## Vamp components

Before you get Vamp up and running on your architecture, it is helpful to understand [how vamp works](/documentation/how-vamp-works/architecture-and-components) and the role of each component in typical architectures.

## Run Vamp

Set Vamp up to run on your architecture in a [production-grade custom set up](/documentation/installation/).

## Need help?

Check the [Vamp documentation](/documentation/using-vamp/artifacts) or find us on [Gitter](https://gitter.im/magneticio/vamp)
