---
date: 2016-03-09T19:56:50+01:00
title: Vamp compared to (old)...
---
{{< warning title="DRAFT" >}}
{{< /warning >}}  
Vamp offers a unique approach to the deployment and management of critical and complex services. 

## Linkerd
## Spinnaker
_Spinnaker is the open source continuous delivery platform from the Netflix suite. It provides a deployment pipeline and cluster management tool to build and deploy software. 
Vamp is platform independent and works with all types of deployable containers, providing an interface to define user groups and control traffic flow to different versions of a product/application/service._
## LaunchDarkly
Vamp routes specified users to separate containerised instances of your application. The LaunchDarkly feature flag management tool restricts access to functionality based on if/else statements added to your code.
By running on an architecture level, Vamp keeps your code clean and opens up new possibilities for deployment control.   
"Release Toggles allow incomplete and un-tested codepaths to be shipped to production as latent code which may never be turned on." http://martinfowler.com/articles/feature-toggles.html
## Docker, DC/OS, Mesos/Marathon
Standard blue/green releases can be implemented directly from common container platforms and potentially customised to create your own solution.
Vamp has been developed by industry specialists to provide all the features of a customised tool out of the box. Vamp is also platform agnostic, so you keep the flexibility to adjust your architecture in the future.
