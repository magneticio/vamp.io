
---
date: 2017-08-28T09:00:00+00:00
title: "Automated canary releasing with Jenkins on DC/OS with Vamp: Part 3"
platforms: ["DCOS","Mesosphere"]
series: ["CI","Jenkins"]
menu:
  main:
    parent: "Tutorials"
    name: "Automated canary releasing with Jenkins on DC/OS with Vamp: Part 3"
    weight: 110
---

In the [previous part of this series](/documentation/tutorials/vamp-jenkins-dcos-pt2) we concluded that some fairly 
simple curl commands and some pre-made yaml files could already give us a lot options when deploying applications from 
Jenkins to a Vamp-managed DC/OS cluster. However, we also found that **things could become hairy over longer periods of
 time**, with more deployments on a regular basis, paraphrased from the last instalment:

* Every new deploy needs to “know about” the old/current state of the target environment. This is cumbersome as it 
requires a back-and-forth between your code base, the target environment and your Jenkins setup.

* After the initial state, manual intervention is needed to fully migrate to the new version.

* Redundant containers are kept running, eating into the resources available in DC/OS. Removing them is a manual task.

In this third instalment we explore ways in tackling these last obstacles, what we called **sustainable canary releases** earlier.

Note: the following paragraphs are by **not specific to Jenkins**: you can apply the strategies in basically any other CI solution like Gitlab CI, Travis CI or Visual Studio Team Service.

## Strategy

For our deployment scenario, we assume we are doing a **minor** **upgrade** of an existing **stateless** **service**, basically a drop in replacement. Much has been written about the [benefits of stateless apps and service](https://12factor.net/processes) and these benefits become really clear in continuous deployment scenarios.

Given this scenarios we can chop our canary release process into a couple of distinct phases:

### Preroll

1. Validate if our new service already exists in our target deployment. If so, abort and hand over control to a human.

1. Create a new blueprint for our new service, based on the previous version’s blueprint: this way we can retain all previously configured environment variables and dependencies, i.e. database credentials etc.

### Deploy

1. Deploy our new service next to the same service of a previous build. We will use **Vamp’s powerful merge function here.**

1. Validate the deployment finishes correctly and the service is running. If this is not the case, we will proceed to the **rollback** **phase** directly.

### Migrate

1. Adjust the configured **gateway** and apply an **initial** **condition** **or** **weight** adjustment, i.e. open up the traffic to our new version to users from a specific IP or to requests with specific headers, or just 10% of all traffic.

1. Update the gateway over a set time span to **fully** **migrate** from the old to the new version. This can be achieved by manipulating either the set of conditions applied earlier, or updating the weight to a full 0%-100% split.

### Cleanup

After a full and successful migration, undeploy the previous version of our service, **freeing** **up** **valuable** **resources on our DC/OS cluster**. Note that this is where the stateless design of our service is extremely helpful: we are not at risk of killing any user sessions or loosing instance specific data.

### Rollback

You roughly have two options here:

1. Either undeploy the misbehaving new service to leave your environment in a previously known correct state.

1. Leave the misbehaving service deployed without any traffic routed to it for triage / debugging / analysis purposes.

Each option has benefits and the desired option probably depends heavily on the state of test and staging environments and how suitable they are for debugging issues like these. Despite careful planning and testing, sometimes errors only show up on production environments. In this case option two will make finding what went wrong a lot easier.

## Vamp CLI to the rescue

Seeing the complexity of the commands we need to issue to Vamp we would need quite some curl , cat and sed wizardry to 
make this all work. However, the [Vamp Command Line Interface](/documentation/cli/using-the-cli/) (CLI) takes care of most of our scenario.

Add the vamp-cli package to the globally installed Node.JS packages in the NodeJS section your Jenkins Global Tool Configuration:

![](https://cdn-images-1.medium.com/max/2000/1*lXwXnZQXnBnGdMIiGL7gRA.png)

Having done this, you can now call any vamp CLI command in any of the your Jenkins Pipeline scripts.

### Preroll

First, we need to tell the CLI where our Vamp API lives. We do this by setting the VAMP_HOST environment variable to the DC/OS Vamp service endpoint
```
export VAMP_HOST=http://10.20.0.100:8080
```
Now we step through each command:

1. Is the new service already running?
```
vamp describe deployment simpleservice | grep simpleservice:1.1.0
```

2. Create a new breed. We use the generate command here. This command can be a bit tricky to master, but it just is a convenient way to reuse an existing breed (or blueprint) and replace just the key parts needed for a standard, no-frills deployment. [Read the docs](https://vamp.io/documentation/cli/cli-reference/#generate) for more details.
```
vamp generate breed --source simpleservice:1.0.0 --deployable magneticio/simpleservice:1.1.0 --target simpleservice:1.1.0 | vamp create breed --stdin
```
3. Create a new blueprint. Again, we use the generate command. This time we take the “old” blueprint and place the newly created breed in the right cluster. Notice how we pipe the output directly to the create command, instantly saving the new artifact to Vamp.
```
vamp generate blueprint --source simpleservice:1.0.0 --cluster simpleservice --breed simpleservice:1.1.0 --target simpleservice:1.1.0 | vamp create blueprint --stdin
```
### Deploy

1. Merge the new version of our service to the running deployment
```
vamp merge simpleservice:1.1.0 simpleservice
```
2. Validate the service is running by just grep for the right line in the deployment and grepping again to validate the status is ‘Done’.
```
vamp describe deployment simpleservice | grep simpleservice:1.1.0 | grep Done
```

### Migrate

Adjust the gateway in a set of steps, from 0% to 100%. We will put this command in a loop in our Jenkins Pipeline script. Read more about this handy command in [our docs](https://vamp.io/documentation/cli/cli-reference/#update-gateway).
```
vamp update-gateway simpleservice/simpleservice/web --weights simpleservice/simpleservice/simpleservice:1.0.0/web@90%,simpleservice/simpleservice/simpleservice:1.1.0/web@10%
```

### Cleanup

Remove the old service
```
vamp undeploy simpleservice --service simpleservice:1.0.0
```

## Vamp CLI command in the Jenkins Pipeline

Some of the above commands are synchronous and we can just execute them in the Jenkins Pipeline like the curl commands we had in the previous version of our pipeline. However, som commands need to check, wait or poll for statuses.

Luckily, Jenkins has some helpful built in steps for this. You can find the full script below.

{{< gist 46f76c52cfb2f4f57cc9da0d9c9dd53f >}}

* **To not repeat ourselves**, we added a couple of more variables to the top of our script. These are all values that should not change from deployment to deployment.

```
def vampGatewayName = "simpleservice/simpleservice/web"
def vampServiceName = "simpleservice"
env.VAMP_HOST = '[http://10.0.1.134:3232'](http://10.20.0.100:8080')
```

* **Bailing out if the new service is already running** is achieved with a simple if statement where we check the result from the describe command and explicitly failing the build.

* **Validating the service is running** can be easily done with a timeout and nested waitUntil. Jenkins will backoff the retry timer gradually, not overloading the Vamp REST endpoint.

```
+ grep Done
+ grep simpleservice:1.1.0
+ vamp describe deployment simpleservice
Will try again after 3.1 sec
+ grep Done
+ grep simpleservice:1.1.0
+ vamp describe deployment simpleservice
Will try again after 4.6 sec
...
Will try again after 5.5 sec
```

* **To gradually release the new service,** we use a piece of Groovy to take steps of 10% and execute the vamp update-gateway command. For demo purposes, we sleep for 10 seconds after each update.

```
for (i = 1; i <=10; i++) {
    def weightA = 100 - i*10
    def weightB = i*10 
    vamp update-gateway <parameters>
    sleep(10000)
}
```
* **Finally, we add an undeploy stage** to remove the old version and free up resources.

```
stage('Undeploy') {
  sh "vamp undeploy simpleservice --service simpleservice:1.0.0"      
}
```
Running the pipeline now should should result in the following overview

![Jenkins pipeline overview showing the correct executing of all build steps.](https://cdn-images-1.medium.com/max/2744/1*0_eN_ijXc2SpQg74q-1KNw.png)*Jenkins pipeline overview showing the correct executing of all build steps.*

## Wrap up and next steps

Combining Jenkins pipelines with Vamp and the Vamp CLI gives us a lot of control over the when, what and how we want to deploy. **Our Jenkins Pipeline script is just 86 lines, with generous indentation and comments!** In those lines it takes us through all the typical CI/CD steps, from checkout, through build and test to a smart canary release.
