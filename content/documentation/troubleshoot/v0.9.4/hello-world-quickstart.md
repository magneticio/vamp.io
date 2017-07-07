---
date: 2017-01-09T09:00:00+00:00
title: Troubleshoot - hello world quickstart
menu:
  main:
    identifier: "ts-hello-world-quickstart-v094"
    parent: "Troubleshooting"
    weight: 30
    name: Hello world quickstart
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}}
* Switch to the [latest version of this page](/documentation/troubleshoot/hello-world-quickstart).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}


## Try this first

The Vamp hello world quickstart is a self contained testing package. If you run into problems or unexpected behaviour, we advise that you clear everything out and reinstall.

1. Stop all running containers - for example using `docker stop $( docker ps --quiet ) `
- The Docker machine should have access to **at least 3GB memory**, make sure this has been set correctly.
- Clean up  your docker environment (remove stopped containers, dangling images and volumes). A script to do this: 
        
        docker rmi -f $(docker images -q -f dangling=true) 2>/dev/null
        
        echo "removing exited docker containers..."
        docker rm $( docker ps --filter status=exited --quiet )
        docker rm $( docker ps --filter status=created --quiet )

        echo "removing dangling docker volumes..."
        docker volume rm $( docker volume ls --filter dangling=true --quiet ) 2>/dev/null `
- Restart docker machine using `docker-machine restart`.
- Reinstall [Vamp hello world](/documentation/installation/v0.9.4/hello-world/).
- If everything is installed ok and you're running into problems using Vamp, check the [troubleshooting tips for using Vamp](/documentation/troubleshoot/v0.9.4/tips-for-using-vamp).


## Report an issue

If you've tried the above steps and are still stuck, then let us know. We accept bug reports and pull requests on the GitHub repo for each project ([github.com - magneticio](https://github.com/magneticio)).

{{< note >}}                                  
* **Questions about how to use Vamp?** Please [check the documentation first](/documentation/).
* To suggest a change or new feature, [create a GitHub issue](https://github.com/magneticio/vamp/issues) and tag it with "feature proposal"
{{< /note >}}

When reporting issues, please include the following details:

- Description of issue.
- Vamp info, from the API: `GET <vamp url>/api/v1/info`
- Vamp config, from the API; `GET <vamp url>/api/v1/config`
- Reproduction steps.
- Which orchestrator are you using, DC/OS, Kubernetes, Rancher, etc.
- Log output from Vamp and it's various components. You can get these from the `docker logs` command on the relevant containers.
- Any other information that you might consider important.

---------------

## Did this help? 

If you find some of the instructions not clear enough or lacking information, please [raise an issue on GitHub](https://github.com/magneticio/vamp.io/issues/new).
