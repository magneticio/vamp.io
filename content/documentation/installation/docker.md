---
date: 2016-09-30T12:00:00+00:00
title: Docker
---
## Vamp docker image
A Vamp Docker image is available on the Docker hub ([hub.docker.com - magneticio Vamp](https://hub.docker.com/r/magneticio/vamp/)).
The default Vamp configuration used in the image is here ([github.com/magneticio - Vamp docker conf](https://github.com/magneticio/vamp-docker/tree/master/vamp/conf)) - this `application.conf` is a subset of the full configuration ([github.com/magneticio - reference.conf](https://github.com/magneticio/vamp/blob/master/bootstrap/src/main/resources/reference.conf)).
A few parameters still need to be provided, for example:

```
java -Dvamp.persistence.key-value-store.zookeeper.servers="192.168.99.100:2181" \
     -Dvamp.container-driver.url="http://192.168.99.100:9090" \
     -Dvamp.gateway-driver.host="192.168.99.100" \
     -Dvamp.pulse.elasticsearch.url="http://192.168.99.100:9200" \
     -Dlogback.configurationFile=/usr/local/vamp/logback.xml \
     -Dconfig.file=/usr/local/vamp/application.conf \
     -jar /usr/local/vamp/vamp.jar
```

Alternatively using volumes:
 
```
docker run --net=host -v PATH_TO_LOCAL_CONFIG_DIR:/usr/local/vamp/conf magneticio/vamp:0.9.0
```

## Container driver configuration
Vamp can talk directly to a Docker daemon and its driver is configured by default. This is useful for local testing.
Vamp can even run inside Docker while deploying to Docker.

{{< note title="Note!" >}}
* As of release 0.8.0 Vamp has been tested against Docker 1.9.x and Docker Machine 0.5.x. 
* For release 0.7.9, Vamp's Docker driver only supports Docker 1.7+. Please refer to the Github issue in Docker's repo on why this is necessary. ([github.com/docker - issues: "Drop support for RHEL6/CentOS6"](https://github.com/docker/docker/issues/14365)).
{{< /note >}}

1. Install Docker as per Docker's installation manual ([docs.docker.com - install Docker engine](https://docs.docker.com/installation/))
2. Check the `DOCKER_*` environment variables Vamp uses to connect to Docker, i.e.

    ```
    DOCKER_HOST=tcp://192.168.99.100:2376
    export DOCKER_MACHINE_NAME=default
    DOCKER_TLS_VERIFY=1
    DOCKER_CERT_PATH=/Users/tim/.docker/machine/machines/default
    ```

3. If Vamp can't find these environment variables, it falls back to using the `unix:///var/run/docker.sock` Unix socket for communicating with Docker.
4. Update the container-driver section in Vamp's config file. If you use a package installer like `yum` or `apt-get` you can find this file in `/usr/share/vamp/conf/application.conf`:

    ```
    ...
    container-driver {
      type = "docker"
      response-timeout = 30 # seconds, timeout for container operations
    }
    ...
    ```
    See [Vamp configuration](/documentation/installation/vamp-configuration/) for details of the the Vamp `application.conf` file
5. (Re)start Vamp by restarting the Java process by hand.   

