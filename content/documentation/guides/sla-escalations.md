---
title: 5. SLA and escalations
type: documentation
slug: /getting-started-tutorial/5-sla-escalations/
weight: 60
menu:
  main:
    parent: guides
---

# 5. SLA and escalations

Here we are going to demonstrate Vamp built-in SLA monitoring and escalations. Vamp can increase or decrease number of running instances based on: 

- response time
- external events

## Step 1: Vamp configuration

We are going to update default quick-start configuration.
Create a file `application.conf` and store it somewhere:

{{% copyable %}}
```yaml
# Let's change the default greeting.
# If this configuration is applied, new greeting will be displayed on the right side panel.
vamp.info.message = "Hi SLA!"

# Disabling default aggregation engine.
vamp.gateway-driver.aggregation.period = 0

# Checking very often for meeting SLA and escalation events.
vamp.operation {
  sla.period = 1 # seconds
  escalation.period = 1 # seconds
}
```
{{% /copyable %}}

Now we need to use this new configuration. This is done by mounting file directory to `/usr/local/vamp/conf`.
For instance on Mac OS X 10.8+ just replace `ABS_PATH_TO_FILE_DIR` to actual location of your new `application.conf` file:

```
docker run --net=host \
           -v /var/run/docker.sock:/var/run/docker.sock \
           -v $(which docker):/bin/docker \
           -v /sys/fs/cgroup:/sys/fs/cgroup \
           -v ABS_PATH_TO_FILE_DIR:/usr/local/vamp/conf \
           -e "DOCKER_HOST_IP=`docker-machine ip default`" \
           magneticio/vamp-docker:develop
```

Once Vamp is running you could check if greeting message is "Hi SLA!".

## Step 2: Deploying a blueprint

Create a new blueprint file `sla.yml`:

{{% copyable %}}
```yaml
---
name: sava

gateways:
  9050: sava/port

clusters:

  sava:
    breed:
      name: sava:1.0.0
      deployable: docker://magneticio/sava:1.0.0
      ports:
        port: 8080

    scale:
      cpu: 0.1
      memory: 128MB
      instances: 1

    sla:
      type: response_time_sliding_window
      threshold:
        upper: 1000
        lower: 100
      window:
        interval: 5
        cooldown: 0

      escalations:
        - 
          type: scale_instances
          minimum: 1
          maximum: 3
          scale_by: 1
```
{{% /copyable %}}

Let's deploy it using `sava` as a deployment name (instead of some random UUID):

{{% copyable %}}
```
curl -s \
     -X PUT \
     -H "Content-Type: application/x-yaml" \
     --data-binary @sla.yml \
     http://`docker-machine ip default`:8080/api/v1/deployments/sava
```
{{% /copyable %}}

## Step 3: Generating mock response time

We already disabled default Vamp response time aggregation and now we are going to insert mock data.
Simple way to do this is create Vamp events with specific tags, alternatively we could just send data to Elasticsearch directly.

Let's create a BASH script for this:

{{% copyable %}}
```bash
#!/usr/bin/env bash

# update the URL if docker-machine is not used
URL=http://`docker-machine ip default`:8080/api/v1/events

function event {
  curl -s -X POST -H "Content-Type: application/json" -d $1 ${URL} > /dev/null
}

function events {
  # to put something on the graph, not needed for SLA escalations
  event "{\"tags\":[\"gateways:sava_9050____\",\"metrics:rate\"],\"value\":100,\"type\":\"gateway-metrics\"}"
  event "{\"tags\":[\"gateways:sava_9050____\",\"metrics:responseTime\"],\"value\":$1,\"type\":\"gateway-metrics\"}"

  # SLA escalation is related to cluster level (inner cluster gateway) metrics
  event "{\"tags\":[\"gateways:sava_sava_port\",\"metrics:responseTime\"],\"value\":$1,\"type\":\"gateway-metrics\"}"

  # to have some service "sava:1.0.0" metrics, not needed for SLA escalations
  event "{\"tags\":[\"gateways:sava_sava_port\",\"services:sava:1.0.0\",\"metrics:rate\",\"service\"],\"value\":100,\"type\":\"gateway-metrics\"}"
  event "{\"tags\":[\"gateways:sava_sava_port\",\"services:sava:1.0.0\",\"metrics:responseTime\",\"service\"],\"value\":$1,\"type\":\"gateway-metrics\"}"
}

function loop {
  echo "setting response time to $1ms for 15 seconds"
  for i in $(seq 1 15);
  do
    events $1
    sleep 1
  done
}

while [ 1 ]
do
  loop 1100
  loop 50
done
```
{{% /copyable %}}

Mock response time will alternate between 1100ms and 50ms approximately every 15 seconds.
If you take a look at deployment (Vamp UI) this changes will visualized.
Also, this is important, number of service instance will cycle between 1 and 3.

## Step 3: Generating mock escalation events

What we have here are 2 processes: monitoring SLA and checking for escalation events.
In the background Vamp checks if SLA is met and if there should be a change in number of instances, new escalation event will be generated.
Then there is a second process that check only for events.
Now we are going to demonstrate generating these escalation event by an external script.

{{% copyable %}}
```bash
#!/usr/bin/env bash

# update the URL if docker-machine is not used
URL=http://`docker-machine ip default`:8080/api/v1/events

function event {
  curl -s -X POST -H "Content-Type: application/json" -d $1 ${URL} > /dev/null
}

function loop {
  echo "sending new escalation event: $1"
  for i in $(seq 1 3);
  do
    event "{\"tags\":[\"deployment:sava\",\"cluster:sava\",\"sla:$1\"],\"value\":\"$1\"}"
    sleep 10
  done
}

while [ 1 ]
do
  loop "escalate"
  loop "deescalate"
done
```
{{% /copyable %}}

If you run this script, number of service instance will cycle between 1 and 3 as in previous example.