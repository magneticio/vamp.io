---
date: 2017-08-28T09:00:00+00:00
title: "Automated canary releasing with Jenkins on DC/OS with Vamp: Part 1"
platforms: ["DCOS","Mesosphere"]
series: ["CI","Jenkins"]
menu:
  main:
    parent: "Tutorials"
    name: "Automated canary releasing with Jenkins on DCOS with Vamp: Part 1"
    weight: 90
---

In this series of articles we will dive into all the steps necessary to get a started with canary releasing in a typical Jenkins CI/CD pipeline

1. Set up a Jenkins instance on DC/OS to talk to Vamp.

1. Whip up a simple test application and push it to Github.

1. Wrap your apps in a Docker container

1. Create a Vamp “base” blueprint.

1. Build a script to call the correct Vamp REST endpoints.

1. Run build jobs to iterate on our app and release them “à la canary”.

1. Perform complex, multi-version deployments.

## Prerequisites

To get started, you need to have a **DC/OS** cluster. There are many ways to go about this, but we like and use the following options:

* The great [cloud installation guides](https://dcos.io/docs/1.9/installing/cloud/) from **Mesosphere** that help you setup a cluster on **AWS** or **GCE**.

* A fully hosted solution based on [Azure Container Services](https://docs.microsoft.com/en-us/azure/container-service/dcos-swarm/container-service-dcos-quickstart) on **Microsoft Azure.**

Next up, install **Vamp** on DC/OS using [the available Universe package](http://vamp.io/documentation/installation/v0.9.5/dcos/#universe-package) or follow our [installation guides](http://vamp.io/documentation/installation/dcos/#custom-install) for a manual setup. At the end, you should have Vamp running as a DC/OS service and you can access the Vamp UI by clicking on the link in the service overview.

![](https://cdn-images-1.medium.com/max/2800/1*0iQP0iwLTQM2fcYMHZLJPQ.png)

Finally, install **Jenkins**, also available as a Universe package, and pin it to a specific host so we don’t have to worry about shared storage.

![](https://cdn-images-1.medium.com/max/2000/1*1f1AQFt6sUYW2-PidESZOA.png)

## Building an application with Jenkins

For demo purposes we will use the (extremely) simple [https://github.com/magneticio/simpleservice](https://github.com/magneticio/simpleservice), a one page Node.js “app” that allows us to explore multiple deployment scenarios.

* **Fork** the repo [https://github.com/magneticio/simpleservice](https://github.com/magneticio/simpleservice) into your own account and then **clone** a local copy to your machine.

* Install the **Jenkins NodeJs** and **docker-build-step plugins** from the Manage Jenkins tab. After installing, your plugin tab should have the following entries:

![](https://cdn-images-1.medium.com/max/2000/1*9YMHXszFV-M_AplssktXpA.png)

![](https://cdn-images-1.medium.com/max/2000/1*m2mj1WvWu8O9ip2S7hkR2A.png)

* Configure both plugins so the **latest** **Node.Js** version and **Docker** **versions** are installed. The configuration tabs should look as follows:

![](https://cdn-images-1.medium.com/max/2140/1*J2tk5da0vk9NuauIdNYR2w.png)

* As we will be pushing Docker containers, add your credentials for your Docker hub repo on the **Credentials** tab, accessible from the dashboard. Give the credential set a descriptive ID, like “docker-hub-login”

![](https://cdn-images-1.medium.com/max/2074/1*Ql5aUb0MwYZ_Y3fFaetSsg.png)

The next step is to create a [**Jenkins Pipeline**](https://jenkins.io/doc/book/pipeline/) that will execute all our build, test and deploy steps. Jenkins pipelines allow you to script discrete steps in the CI/CD pipeline and commit this to a Jenkinsfile and store it in your Git repo. Let’s start:

* Create a new **Pipeline project** from the dashboard, just call it “simple service pipeline”.

* Set the Pipeline Definition to **“Pipeline script”** and paste in the following Groovy script. Be careful to replace the variables gitRepo dockerHub dockerHubCreds dockerRepo and dockerImageName with your own settings.

{{< gist 3f4a3cfe82d883980e787746ba51045d >}}

The above script defines all the **stages** in our pipeline, from checkout, via install and test, to building & pushing the resulting Docker image and performing some cleanup.

Important to notice here is that we tag our Docker image based on the value of version in the package.json .We store that value in appVersion and use it to push our Docker image. This will become important later when we need to devise a **versioning strategy** for canary releasing new versions onto existing versions.

You should now be all set to **trigger a first build** by clicking the **Build Now** button. If everything your pipeline’s dashboard will light up green and the **console output** of the build job should be similar to the shortened version that is listed below.

![Jenkins pipeline project stage view](https://cdn-images-1.medium.com/max/2328/1*9avIcICZSryFS3dWprpGdA.png)*Jenkins pipeline project stage view*

    [Pipeline] {
    [Pipeline] tool
    Unpacking [https://nodejs.org/dist/v8.3.0/node-v8.3.0-linux-x64.tar.gz](https://nodejs.org/dist/v8.3.0/node-v8.3.0-linux-x64.tar.gz)
    [Pipeline] { (Checkout)
    [Pipeline] git
    Cloning the remote Git repository
    ...
    [Pipeline] { (Install)
    + npm install
    added 256 packages in 9.27s
    ...
    [Pipeline] { (Test)
    + npm test
    1 tests complete
    Test duration: 290 ms
    ...
    [Pipeline] { (Build Docker image)
    + docker build -t magneticio/simpleservice .
    Successfully built d602da61bbe7
    ...
    [Pipeline] { (Push Docker image)
    + docker push registry.hub.docker.com/magneticio/simpleservice:e899d4
    + docker push registry.hub.docker.com/magneticio/simpleservice:latest
    [Pipeline] { (Cleanup)
    + rm node_modules -rf
    [Pipeline] End of Pipeline
    Finished: SUCCESS

## Deploying to Vamp

Great! We are now building containers based on our source code and pushing them to Docker hub. Let’s **start** **deploying** our freshly backed Docker container to our Vamp instance. But before we continue, some observations about our build pipeline:

1. We’re not triggering builds yet on commit, but this is trivial to add later.

1. We’re using Node.Js, but you can of course use any language and/or platform. The build artefacts just need to be shipped in a Docker container.

With that out of the way, we need to get Jenkins talking to Vamp, for this we need to get the **Vamp** **service** **endpoint** in the DC/OS network. Grab it from the service configuration tab. In my case this is **10.20.0.100:8080**

![](https://cdn-images-1.medium.com/max/2000/1*x4NmnxQUVqlWog78tXfxsw.png)

Using this endpoint, we can talk to Vamp inside the DC/OS cluster, without having to provide any credentials. That is exactly what we are doing in this additional stage to our pipeline script.

 {{< gist 8795f5e3ce86c1a3fb4275259650a96b >}}

This script does the following:

1. Sets the vampHost and vampDeploymentName **variables**.

1. Adds the **Deploy** stage to the set of stages.

1. **POST** the vamp_blueprint.yml **blueprint** file from our repo to Vamp. This blueprint is the initial starting point for our application. [Read more](http://vamp.io/documentation/using-vamp/blueprints/) about what blueprints are an how they work.

1. It creates a **deployment** based on this blueprint using a PUT

Update the pipeline script with the new stage (here is a link the [full version of the new pipeline script](https://gist.github.com/tnolet/78b7c9f54020ada56dd4f1ceac6cd9d1)) and run the build again. You should find a newly added blueprint and deployment in your Vamp UI.

![Vamp showing the initial deployment](https://cdn-images-1.medium.com/max/2212/1*aJ-gMfLA2RL9WESOl-tttA.png)*Vamp showing the initial deployment*

Also, you should find an additional stage added to the Stage view dashboard, giving you a nice, semi real-time, overview of all stages in the full CI/CD pipeline.

![](https://cdn-images-1.medium.com/max/2614/1*F9H9vQ2iFrVf0cPKPoA69w.png)

In the Vamp UI, go to the simpleservice **gateway** **marked** **as** **“external”** (Gateways → simpleservice/simpleservice/web) and click on the host/port link. This should pull out a sidebox that shows the output of port 3000 of our app: a single, blue HTML page with a short message and the current version number.

![](https://cdn-images-1.medium.com/max/2740/1*G363jKVbMm72UjVXgF70rw.png)

## Wrap up

Congratulations! You’ve worked through all of the tedious installation and setup stuff and are now ready to *really* start fleshing out this CI/CD pipeline and explore some of the rather cool functions Vamp offers in conjunction with DC/OS and Jenkins.

{{< note title="What's next?" >}}
* [Proceed to part 2 of this guide](/documentation/tutorials/vamp-jenkins-dcos-pt2)
* Dive into one of our other [tutorials](/documentation/tutorials/)
{{< /note >}}
