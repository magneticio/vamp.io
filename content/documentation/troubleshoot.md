---
date: 2017-01-09T09:00:00+00:00
title: Troubleshooting
menu:
  main:
    parent: "Documentation"
    name: "Troubleshoot"
    weight: 50
draft: true
---

The pointers in this article will help you troubleshoot and resolve common issues in case Vamp is not running or not behaving as expected.

* [Troubleshoot a full Vamp installation](/documentation/troubleshoot/#troubleshoot-a-full-vamp-installation)
* [Troubleshoot the Vamp hello world quickstart](/documentation/troubleshoot/#troubleshoot-the-vamp-hello-world-quickstart)
* [Troubleshooting tips for using Vamp](/documentation/troubleshoot/#troubleshooting-tips-for-using-vamp)
* [Report an issue](/documentation/troubleshoot/#report-an-issue)

If you find some of the instructions not clear enough or lacking information, please [raise an issue on GitHub](https://github.com/magneticio/vamp.io/issues/new).

## Troubleshoot a full Vamp installation
The steps below will help you debug problems encountered when following our full install instructions. 

1. Does your install follow the instructions for your specific container scheduler? 
  - Check the relevant Vamp installation instructions: [DC/OS](/documentation/installation/dcos/), [Mesos/Marathon](/documentation/installation/mesos-marathon/), [Kubernetes](/documentation/installation/kubernetes/), [Rancher](/documentation/installation/rancher/) or [Docker](/documentation/installation/docker/). 
- Check the information panel in the UI (click the i-icon in the top right corner) to see if all fields have a proper value and are not empty. If some fields are empty this is often an indication of an invalid configuration. 
- Can Vamp connect to Elasticsearch?  
  Vamp uses Elasticsearch to store haproxy logs and calculated metrics from its event system. First check if you see a logstash index in your Elasticsearch cluster. If you don’t see any indices at all please check if the Vamp Gateway Agent (or your custom HAproxy) stores it’s logs in the expected format (https://github.com/magneticio/vamp-gateway-agent/blob/master/haproxy.basic.cfg for HAproxy 1.7.1 format). Vamp up to version 0.9.2 uses logstash (included in the custom Vamp Elasticsearch docker container) to send HAproxy logs to Elasticsearch. Make sure your logstash is configured correctly (https://github.com/magneticio/vamp-gateway-agent and scroll down to “Logstash example configuration” and that your logstash can read from the HAproxy logs and connect to your Elasticsearch cluster.
  If you do see a logstash index in Elasticsearch, but no health or metrics indices this probably means that the default Vamp health and metrics workflows cannot access the Elasticsearch cluster or your Vamp API. Make sure that the Vamp Workflow Agent containers can access the Elasticsearch cluster and the Vamp API. This can be done f.e. by SSH’ing into a workflow agent container and trying to telnet the Elasticsearch address and the Vamp API that you configured in your configuration settings. You can check these using /api/v1/info or /api/v1/config or take a look into the Vamp UI workflows menu by opening a workflow and checking the environment variables that point to Elasticsearch and Vamp API there. If the Vamp Workflow Agent containers can access your Elasticsearch cluster and the Vamp API on the address in the workflow environment variables, and there is a logstash index in ES, the workflows should start generating the metrics and health indices when running correctly.
  
  - Check the Elasticsearch indices required by the Vamp UI have been created:  
    `GET <elasticsearch url>/_cat/indices?v`  
      HAProxy logs: _logstash-{date}_     
      Health workflow events: _vamp-pulse-health-{date}_  
      Metrics workflow events: _vamp-pulse-metrics-{date}_   
- Are all Vamp components installed and running?
  - Check that the `vamp` and `vamp-gateway-agent` docker containers are running using `docker ps`. 
  - Check the logs `docker logs {container ID}`  
    Any errors here should be clear, in case they aren't [report the issue](/documentation/troubleshoot/#report-an-issue).
- Can Vamp connect to the configured key value store?  
  - Check the key value store reports as connected in Vamp info `GET <vamp url>/api/v1/info`  
  If not, correct the configuration in `application.conf`
  - Check you can communicate with the configured key value store from where Vamp is running.  
  Zookeeper:  
  Consul:  
  etcd:  
- Are you running supported versions of all components?
- Are the workflow containers running or restarting?
  - Check that the three default workflow containers are there using `docker ps`  
  - Check the logs for each `vamp-workflow-agent` container using `docker logs {container ID}`  
    If a `failure` is reported, the workflow may not be able to talk to Elasticsearch - check the Elasticsearch configuration in `application.conf`.  
    Any errors here should be clear, in case they aren't [report the issue](/documentation/troubleshoot/#report-an-issue).
- Check the [Vamp release notes](/documentation/release-notes/latest) for known issues and breaking changes.
- If you see time-out errors on the Vamp UI make sure your web socket connections to the Vamp API are open and stable.
  - check in your configuration that you’re using http:// in front of TCP/HTTP addresses, but not in front of UDP connections. Also make sure there are no double ports (ie 9200:9200) popping up in your configuration when looking into /api/v1/config
  - when deploying a blueprint and the deployment keeps on hanging in “deploying” make sure that there are enough resources (CPU and memory) available in your container cluster. Also make sure that your key-value store is accessible by the Vamp Gateway Agent and that you’ve used the correct address in your configuration.
- If you're still hitting problems, please [report the issue](/documentation/troubleshoot/#report-an-issue).

Did this help? If you find some of the instructions not clear enough or lacking information, please [raise an issue on GitHub](https://github.com/magneticio/vamp.io/issues/new).

## Troubleshoot the Vamp Hello world quickstart
The Vamp hello world quickstart is a self contained testing package. If you run into problems or unexpected behaviour, we advise that you clear everything out and reinstall.

1. Stop all running containers - for example using `docker ps | awk '{print $1}' | xargs docker stop 2>/dev/null`
- Clean up  your docker environment (remove stopped containers, dangling images and volumes). A script to do this: 
        
        docker rmi -f $(docker images -q -f dangling=true) 2>/dev/null
        
        echo "removing exited docker containers..."
        docker ps -a | grep 'Exited' | awk '{print $1}' | xargs docker rm
        docker ps -a | grep 'Created' | awk '{print $1}' | xargs docker rm
        
        echo "removing dangling docker volumes..."
        docker volume rm $(docker volume ls -qf dangling=true) 2>/dev/null `
- Restart docker machine using `docker-machine restart`.
- Reinstall [Vamp hello world](/documentation/installation/hello-world/).
- If everything is installed ok and you're running into problems using Vamp, check the [troubleshooting tips for using Vamp](/documentation/troubleshoot/#troubleshooting-tips-for-using-vamp).

Did this help? If you find some of the instructions not clear enough or lacking information, please [raise an issue on GitHub](https://github.com/magneticio/vamp.io/issues/new).

## Troubleshooting tips for using Vamp
If you encounter problems running services on an installed version of Vamp, check the following: 

1. Confirm that everything is installed ok:
  - Check the Vamp info (using `GET <vamp url>/api/v1/info` or in the info pane of the Vamp UI).  
    If a component is not listed or reported as `not connected`, check the instructions to [troubleshoot a full Vamp installation](/documentation/troubleshoot/#troubleshoot-a-full-vamp-installation) or [troubleshoot the Vamp Hello world quickstart](/documentation/troubleshoot/#troubleshoot-the-vamp-hello-world-quickstart).
- Take some time to read through the [documentation](/documentation/using-vamp/blueprints/) and [tutorials](/documentation/tutorials/overview/).
- Ask us on gitter ([gitter.im - magneticio/vamp](https://gitter.im/magneticio/vamp))
- Still not working? [Report an issue](/documentation/troubleshoot/#report-an-issue).

Did this help? If you find some of the instructions not clear enough or lacking information, please [raise an issue on GitHub](https://github.com/magneticio/vamp.io/issues/new).

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
