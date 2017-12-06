---
date: 2017-01-09T09:00:00+00:00
title: Troubleshoot - tips for using Vamp
menu:
  main:
    identifier: "ts-tips-for-using-vamp-v094"
    parent: "Troubleshooting"
    weight: 40
    name: Tips for using Vamp
---

{{< note title="The information on this page is written for Vamp v0.9.4" >}}
* Switch to the [latest version of this page](/documentation/troubleshoot/tips-for-using-vamp).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

## Try this first

If you encounter problems running services on an installed version of Vamp, check the following:

1. Confirm that everything is installed ok:
  - Check the Vamp info (using `GET <vamp url>/api/v1/info` or in the info pane of the Vamp UI).
    If a component is not listed or reported as **not connected**, check the instructions to [troubleshoot a full Vamp installation](/documentation/troubleshoot/v0.9.4/full-vamp-installation) or [troubleshoot the Vamp Hello world quickstart](/documentation/troubleshoot/v0.9.4/hello-world-quickstart).
- Time-out errors in the Vamp UI? Check that the WebSocket connections to the Vamp API are open and stable
- Deployments hanging on status "deploying"? Make sure that there are enough resources (CPU and memory) available in your container cluster and that your key-value store is accessible by the Vamp Gateway Agent.
- Take some time to read through the [documentation](/documentation/using-vamp/blueprints/) and [tutorials](/documentation/tutorials//).
- Ask us on gitter ([gitter.im - magneticio/vamp](https://gitter.im/magneticio/vamp))
- Still not working? [Report an issue](/documentation/troubleshoot/v0.9.4/tips-for-using-vamp/#report-an-issue).



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

If you find some of the instructions not clear enough or lacking information, please [raise an issue on GitHub](https://github.com/magneticio/vamp.io/issues/new).- Any other information that you might consider important.
