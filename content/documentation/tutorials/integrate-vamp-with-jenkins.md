---
date: 2016-09-13T09:00:00+00:00
title: Jenkins integration
draft: true
---
## Overview

Vamp can be integrated with a Jenkins pipeline will take you from CI to CD, enabling automated deployment and service monitoring for Jenkins-delivered artifacts. The basic setup described here uses two, dependent Jenkins jobs to build Scala/Java projects and push them to Vamp for deployment by canary release.

#### Tested against
* Vamp 0.7.9

#### Requirements

You should have the following systems in place:

* A running Vamp instance
* A GitHub repo with a buildable project
* A file repository for storing & retrieving artefacts (a simple webserver with FTP is OK)
* A running Jenkins instance
* A Vamp CLI instance installed on the Jenkins host
* Jenkins should be provided with the following plugins:
  * GIT client : [http://wiki.jenkins-ci.org/display/JENKINS/Git+Client+Plugin](http://wiki.jenkins-ci.org/display/JENKINS/Git+Client+Plugin)
  * Git : [http://wiki.jenkins-ci.org/display/JENKINS/Git+Plugin](http://wiki.jenkins-ci.org/display/JENKINS/Git+Plugin)
  * GitHub API : [https://wiki.jenkins-ci.org/display/JENKINS/GitHub+API+Plugin](https://wiki.jenkins-ci.org/display/JENKINS/GitHub+API+Plugin)
  * GitHub : [http://wiki.jenkins-ci.org/display/JENKINS/Github+Plugin](http://wiki.jenkins-ci.org/display/JENKINS/Github+Plugin)
  * SCM API : [http://wiki.jenkins-ci.org/display/JENKINS/SCM+API+Plugin](http://wiki.jenkins-ci.org/display/JENKINS/SCM+API+Plugin)
  * Maven project: [http://wiki.jenkins-ci.org/display/JENKINS/Maven+Project+Plugin](http://wiki.jenkins-ci.org/display/JENKINS/Maven+Project+Plugin)
  * Publish over FTP: [https://wiki.jenkins-ci.org/display/JENKINS/Publish+Over](https://wiki.jenkins-ci.org/display/JENKINS/Publish+Over)

## In depth

### Step 1: Create Jenkins jobs

We are going to create two, dependent jobs in Jenkins:

* The first job builds the project(s) and pushes a finished, runnable artefact (an executable JAR file or Docker container) to a private registry. Template file: `config_build_project.xml`
* The second job gets started when the first one successfully finishes. It create all required Vamp artifacts and deploy the Jenkins-delivered artefact by canary release using the Vamp CLI. Template file: `config_push_to_vamp.xml`

Rename the provided XML files to `config.xml` and use them as starter templates. Create two new jobs in the Jenkins dashboard, then overwrite the created `config.xml` files on disk with the template XML files. Reload the Jenkins config using `Manage Jenkins` -> `Reload Configuration from Disk`.


#### build project job
A generic job, just like any other project:

* Github trigger
* Build pom.xml
* Push built artefact to repository

#### Push to Vamp job
This job will be triggered when the build project job finishes successfully. The Vamp CLI handles the communication with Vamp:

* First, we generate a new Vamp breed based on the previous breed. This is handy as we can inherit all necessary settings from the previous breed. The new breed is stored in Vamp:
```
vamp inspect breed <PREVIOUS_BREED_NAME> | \
vamp generate breed <NEW_BREED_NAME> --deployable <NEW_DEPLOYABLE_NAME> --stdin | \
vamp create breed --stdin
```

* Now we merge the new breed into an existing target deployment, for example the deployment with UUID 050acd4e-0629-4ebf-bd88-4fdda77de98c.


* and generate a new (templated) Vamp blueprint 
* Merge the new blueprint with the existing blueprint of the deployment
* Deploy the new artefact by updating the target deployment with the merged blueprint

###### Templates

The job will need have access to a blueprint template and a breed template, these should be provided in the repo. The example below is based on the simple Vamp _monarch_ blueprint using Docker containers: 

* Initial deployment _monarch_ blueprint
```
name: monarchs:1.0
endpoints:
  frontend.port: 9050
clusters:
  frontend:
    services:
      -
        breed:
          name: monarch_front:0.1
          deployable: magneticio/monarch:0.1
          ports:
            port: 8080/http
          dependencies:
            backend: monarch_backend:0.3
          environment_variables:
           MONARCH_DEPENDS_ON_HOST: $backend.host
           MONARCH_DEPENDS_ON_PORT: $backend.ports.jdbc
        routing:
          weight: 100
        scale:
          cpu: 0.1
          memory: 256
          instances: 1
  backend:
    services:
      breed:
        name: monarch_backend:0.3
        deployable: magneticio/monarch:0.3
        ports:
          jdbc: 8080/http
```

* `blueprint_template.yaml`
```
name: monarchs:1.0
clusters:
  frontend:
    services:
      breed: <BREED>
```

* `breed_template.yaml`
```
name: ${BREED_NAME}:${VERSION}
deployable: docker://magneticio/monarch:${VERSION}
ports:
  port: 8080/http
environment_variables:
  MONARCH_DEPENDS_ON_HOST: $backend.host
  MONARCH_DEPENDS_ON_PORT: $backend.ports.jdbc
dependencies:
  backend:
    name: monarch_backend:0.3
```

###### Scripts

The Jenkins script will work as follows, you can use piping for most CLI commands to do a merge deploy:

```
export VERSION=BUILD_TAG
export DEPLOYMENT=1f0e1166-d8c8-4bde-a634-3f2bc20a7a36
export BREED_NAME=monarch_front

# prep the template
sed -i -- 's/{VERSION}/'$VERSION'/g' breed_template.yaml
sed -i -- 's/{BREED_NAME}/'$BREED_NAME'/g' breed_template.yaml

# create all artefacts and perform merge deploy
vamp create breed --file breed_template.yaml && \ 
vamp generate blueprint --file blueprint_template.yaml --cluster frontend --breed $BREED_NAME:$VERSION | \
vamp merge --deployment $DEPLOYMENT --stdin | \
vamp deploy --deployment $DEPLOYMENT --stdin
```

### Step 3: Deploying a new version of app

Each commit to the github repo will trigger the build project job in Jenkins. Let's assume that all ran to plan - your project built successfully and the Push to Vamp job was triggered. All required Vamp artifacts have been created (breed, new blueprint, merged blueprint, deployment). The new updated deployable will be deployed automatically 




      
{{< note title="What next?" >}}
* Check the Vamp reference documentation [CLI reference](/documentation/cli/cli-reference) and [API reference](/documentation/api/api-reference)
{{< /note >}}