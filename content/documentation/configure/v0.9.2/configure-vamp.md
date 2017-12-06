---
date: 2016-09-13T09:00:00+00:00
title: How to configure Vamp
menu:
  main:
    identifier: "configure-vamp-v092"
    parent: "Configuration"
    weight: 10
aliases:
    - /documentation/configure/v0.9.2/configure-vamp/
---

{{< note title="The information on this page applies to Vamp v0.9.2" >}}

* Switch to the [latest version of this page](/documentation/configure/configure-vamp).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}


Vamp configuration is held in a combination of the Vamp `application.conf` and `reference.conf` files following the HOCON file standard ([github.com/typesafehub - config](https://github.com/typesafehub/config)). You can override settings in the configuration files using Vamp environment variables or Java/JVM system properties. Vamp configuration is built in layers following this order:

1. `reference.conf` - part of the Vamp code. Contains generic, default settings. Not a full configuration.
2. `application.conf` - adds environment specifics to the generic `reference.conf` defaults.
3. Java system properties - advised for advanced use only.
4. Environment variables - override all other settings.

### On this page:

* [Override specific configuration parameters](/documentation/configure/v0.9.2/configure-vamp/#override-specific-configuration-parameters)
* [Use a custom application.conf file](/documentation/configure/v0.9.2/configure-vamp/#use-a-custom-application-conf-file)
* [Parameterize application.conf](/documentation/configure/v0.9.2/configure-vamp/#parameterize-application-conf)
* [Include configuration not intended for Vamp](/documentation/configure/v0.9.2/configure-vamp/#include-configuration-not-intended-for-vamp)
* [Access configuration parameters through the API](/documentation/configure/v0.9.2/configure-vamp/#access-configuration-parameters-through-the-api)

## Override specific configuration parameters
You can override specific parameters set in the `application.conf` and `reference.conf` configuration files using Vamp environment variables or Java/JVM system properties. It is advisable to use environment variables when overriding specific parameters.

### Environment variables
Environment variables override all other settings. Convert the configuration parameter name to upper case and replace all non-alphanumerics with an underscore `_`.  So, `vamp.gateway-driver.timeout` becomes `VAMP_GATEWAY_DRIVER_TIMEOUT`.  

For example, to change the vamp.info.message you would set the environment variable VAMP_INFO_MESSAGE :

```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v `docker-machine ssh default "which docker"`:/bin/docker \
           -v "/sys/fs/cgroup:/sys/fs/cgroup" \
           -e "DOCKER_HOST_IP=$(docker-machine ip default)" \
           -e "VAMP_INFO_MESSAGE=hey YOU! " \
           magneticio/vamp-docker:0.9.2
```

### Java system properties
Configuration by system properties is advised for advanced use only. Overriding specific settings can be best handled using environment variables. If you require extensive customisation, consider creating a new docker image with a custom application.conf file. For example:
```bash

export VAMP_INFO_MESSAGE=Hello # overriding Vamp info message (vamp.info.message)

java -Dvamp.gateway-driver.host=localhost \
     -Dlogback.configurationFile=logback.xml \
     -Dconfig.file=application.conf \
     -jar vamp.jar
```

## Use a custom application.conf file
For more extensive customisations, you can create a new Docker image, extending one of the provided Vamp images with a custom `application.conf` file. The below example explains the steps for creating a Docker image with a custom DCOS config, if you are using a different container management platform you should use the associated `application.conf` and adjust the Docker file accordingly.

1. Copy application.conf [(github.com/magneticio - Vamp DCOS application.conf)](https://github.com/magneticio/vamp-docker-images/blob/master/vamp-dcos/application.conf)
2. Adjust as required. Check the list of configuration settings (below) for details of the available optionsa
3. Create a Dockerfile with the lines:  
  `FROM magneticio/vamp-dcos:0.9.2`  
  `ADD application.conf /usr/local/vamp/conf/`
4. Build the image with `docker build --tag <username>/vamp`


## Parameterize application.conf

To avoid duplication of configuration and make it easier to overwrite specific settings you can define global variables outside the `vamp { }` stanza, at the top of `application.conf`. 

For example:
```
vamp_host = "localhost"    # Default value
vamp_host = ${?VAMP_HOST}  # If environment variable exists, use this value

vamp {
  info {
    message = "Hi, I'm Vamp! I'm running on: "${vamp_host}
    timeout = 3 seconds
  }  
}
```

This is as of 0.9.2 how [we configure our DC/OS Docker image]( https://github.com/magneticio/vamp-docker-images/blob/master/vamp-dcos/application.conf)

(Typesafe documentation on the topic covering system or env variable overrides)[https://github.com/typesafehub/config#optional-system-or-env-variable-overrides]

## Include configuration not intended for Vamp
It is possible to store configuration parameters not intended for use by Vamp itself in the Vamp `application.conf` file, such as configuration for Logstash or workflows. For example, you could chose to include the logstash URL in your custom `application.conf` file - Vamp would ignore the parameter, but it would be available to all workflows through the API. This is useful for storing shared local configuration parameters. Configuration specific to a single workflow is best set using environment variables or by hard coding the parameter.

## Access configuration parameters through the API
All configuration parameters can be retrieved from the Vamp API endpoint `config` or `configuration`. 

* Return all configuration parameters as a JSON object:  
  `GET` `/api/v1/config` .
  
* Return a single paramater:  
  `GET` `/api/v1/config/<configuration parameter name>`  

For example `GET` `<vamp url>/api/v1/config/vamp.info.message` 

Or, from a workflow using Vamp node.JS client ([github.com/magneticio - Vamp Node.js Client](https://github.com/magneticio/vamp-node-client)):

```
api.config().each(function (config) {
    _.log(config['vamp.info.message']);
});
```

{{< note title="What next?" >}}
* Check the [configuration reference](/documentation/configure/v0.9.2/configuration-reference)
* Look at some [example configurations](/documentation/configure/v0.9.2/example-configurations)
* Follow the [tutorials](/documentation/tutorials/)
* You can read in depth about [using Vamp](/documentation/using-vamp/artifacts/) or browse the [API reference](/documentation/api/api-reference/) or [CLI reference](/documentation/cli/cli-reference/) docs.
{{< /note >}}
