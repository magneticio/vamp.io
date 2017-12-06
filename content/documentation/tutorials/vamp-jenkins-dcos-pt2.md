---
date: 2017-08-28T09:00:00+00:00
title: "Automated canary releasing with Jenkins on DC/OS with Vamp: Part 2"
platforms: ["DCOS","Mesosphere"]
series: ["CI","Jenkins"]
menu:
  main:
    parent: "Tutorials"
    name: "Automated canary releasing with Jenkins on DC/OS with Vamp: Part 2"
    weight: 100
---

In [the first part of this series](/documentation/tutorials/vamp-jenkins-dcos-pt1) we setup our Vamp and Jenkins environments on DC/OS and did our first deploy. If you want to follow along and try out the code examples. You can however also read this part to get a general impression of how canary releasing can work for you.

In this part of our series we will create our initial actual canary release using the combined the power of DC/OS and Vamp, all triggered from a Jenkins CI/CD pipeline. Let’s jump in!

## **Determining a versioning strategy**

We need to adopt a versioning strategy to determine what we will deploy and when. For now, we will go for a somewhat simple strategy that mimics “real life”:

1. Everything in the **Master branch** is ready for deployment.

1. New versions are developed in a **branch** **with** **the** **version** as name, i.e. “1.1.0” and “2.0.0”. This allows us to completely prep a release and then merge it to master.

1. The version in the **package.json** file is leading for tagging Docker containers and Vamp artefacts; not the git commit hash or a git tag, although these are also viable options.

1. **Bumping** the version after code changes is the responsibility of the developer.

1. Builds are only for demo purposes **triggered manually. In a more advanced scenario a good strategy would to tag the master branch** with the version number and have Jenkins only **build & deploy with each new tag.**

1. When deploying to development and testing environments, you could also use **git** **commit** **hashes**, where each code push is wrapped in a Docker container and deployed. A downside of this is the possibly very large amount containers in your Docker repo and the need for a strict “cleanup policy” to retire and undeploy no longer relevant containers.

## About merging and gateways

Our current [pipeline script](https://gist.github.com/tnolet/78b7c9f54020ada56dd4f1ceac6cd9d1) pushes every new version of our app to the public Docker Hub, the Vamp blueprints endpoint and to the Vamp deployment named “simpleservice”. When pushing a new version to an existing deployment, something interesting happens.

* Vamp **instructs DC/OS to schedule the new Docker container** on the cluster, according to the specs given in the blueprint.

* Internally, Vamp merges the deployments and a **new route in the deployments internal gateway** is created. The external gateway remains unchanged.

So if we bump master branch to version 1.1.0 and run our pipeline a Docker container is created, the blueprint is pushed and the deployment is merged. If you GET the YAML version of Vamp’s API endpoint, you would get something very similar to this

* one gateway, with naming scheme *deployment*/*cluster/gateway.*

* two routes, with naming scheme *deployment/cluster/service/port *with weights of 100% and 0% respectively.

    name: simpleservice/simpleservice/web
    routes:
      simpleservice/simpleservice/simpleservice:1.0.0/web:
        weight: 100%
      simpleservice/simpleservice/simpleservice:1.1.0/web:
        weight: 0%

The only thing we are left with is to manipulate the weight of each route to gradually release version 1.1.0 of our web app.

## An initial canary release with 50/50% traffic

For our first deploy will hard code the desired outcome of our routing scheme: a 50/50 split between our old and new version. This is reflected in the new gateway.yml [file in our 1.1.0 branch](https://github.com/magneticio/simpleservice/blob/1.1.0/gateway.yml). We only need to add one call to Vamp to update the gateway api endpoint according to this spec as you can see in the snippet below.

{{< gist 6e52e97c1ffde1a05d98010d56b3617c >}}

Either copy the snippet above and replace the stage in your existing pipeline script or just copy and paste [the full version from here](https://gist.github.com/tnolet/628285638fcc7dc959a702cd4c4513ad). Then perform the following steps:

* Merge the already prepared 1.1.0 branch to master and push it.

    git checkout master
    git merge 1.1.0
    git push

* After the push finished, hit the “Build Now” button in Jenkins and you should see the following in your Vamp UI.

![](https://cdn-images-1.medium.com/max/2000/1*M0LEWgQPLN7BEmAlhtFhBw.png)

Right after that last PUT of the gateway file, your traffic will be split between each version of our service on each request. You can use the pencil icon to pull up the sliders and migrate version 1.1.0 to 100% at your own leisure.

## A second canary release with an IP / Browser filter

The initial 50/50 release instantly exposes all users to our new version. What if we want to have stricter control over who sees what and when? This is exactly what [Vamp’s conditions](/documentation/using-vamp/conditions/) are for.

Conditions are basically **smart** **routing** **filters** that allow you to easily dice up traffic using all kinds of request paramaters. Conditions are also actual Vamp artefacts that can be stored, referenced and deleted just like blueprints. This is very handy in a CI/CD context as we can **separate the what is deployed from the how it is deployed.** This is makes deploys more repeatable and predictable.

Let’s create a simple condition named **only_firefox** by going to the Vamp UI and adding the following YAML snippet:

    name: only_firefox
    condition: User-Agent = Firefox

![](https://cdn-images-1.medium.com/max/2648/1*ivm2GfStNSRACruAY_Qyug.png)

Now, in our code base we update the gateway.yml and add a reference to the condition as shown below. Don’t forget to commit and push this change.

{{< gist 3aba22d80ca81f20beab7a6bb9321c5e >}}

After re-running our pipeline in Jenkins, you will see that all our traffic goes to 1.1.0 except when you are using a Firefox browser (or strictly speaking when your request’s User-Agent header contains the word “Firefox”).

Hopefully you can see how can start building a comprehensive set of reusable conditions that we can put to use on each release we do.

## Towards sustainable canary releases

We’ve already gotten quite some automation potential from using Vamp with Jenkins and DC/OS, but as you might have noticed this setup is not ideal; here are some things that will bite you in the proverbial once you start exercising this pipeline on a regular basis:

* Every deploy needs a tailor made gateway.yml that describes an exact starting state. This means with every new version you must update this file to reflect the old situation and the desired new situation.

* After the initial state, manual intervention is needed to fully migrate to the new version.

* Redundant containers are kept running, eating into the resources available in DC/OS. Removing them is a manual task.

Ergo, some things are still manual instead of automated! So how do we leverage the automation potential of Vamp, Jenkins and DC/OS so we can have hands-off, zero downtime canary releases?

Stay tuned for the **third part of our series** where we will dive into [Vamp’s workflows](/documentation/using-vamp/workflows/) and create a truly sustainable canary release pipeline on Jenkins and DC/OS.


{{< note title="What's next?" >}}
* [Proceed to part 2 of this guide](/documentation/how-vamp-works/architecture-and-components/)
* Dive into one of our other [tutorials](/documentation/tutorials/)
{{< /note >}}
