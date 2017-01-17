---
date: 2016-09-13T09:00:00+00:00
title: Canary release with the Vamp API
menu:
  main:
    parent: "Tutorials"
    name: "Canary release with the Vamp API"
    weight: 90
draft: true
---



### Requirements
* 


## API calls

### 1) Initiate deployment

* Create a deployment `sava` with a cluster `sava` containing the service `sava:1.0.0`.  
* Create an internal gateway `sava/sava/port`, containing the route `sava/sava/sava:1.0.0/port`

`PUT /api/v1/deployments/sava`

```
---
name: sava:1.0
clusters:
  sava:
    services:
      -
        breed:
          name: sava:1.0.0
          deployable: magneticio/sava:1.0.0
          ports:
            port: 8080/http
```

### 2) Merge new service

* Add the service `sava:1.1.0` to the deployment `sava` inside the cluster `sava`.  
* Add the route `sava/sava/sava:1.1.0/port` to the internal gateway `sava/sava/port`

`PUT /api/v1/deployments/sava`

```
---
name: sava:1.1
clusters:
  sava:
    services:
      -
        breed:
          name: sava:1.1.0
          deployable: magneticio/sava:1.1.0
          ports:
            port: 8080/http
```

### 3) Distribute traffic

* Add the stable endpoint `9050` to the internal gateway `sava/sava/port`  
* Set a weight for the routes `sava/sava/sava:1.0.0/port` and `sava/sava/sava:1.1.0/port` to distribute traffic between the services.

`PUT /api/v1/gateways/sava/sava/port` 

```
name: sava/sava/port
port: 9050/http
routes:
  sava/sava/sava:1.0.0/port:
    weight: 90%          
  sava/sava/sava:1.1.0/port:
    weight: 10%
```

### 4) Remove old service
 
First, set the route weight on the `sava:1.0.0` service to 0%.

* Remove the service `sava:1.0.0` from the `sava` cluster of the `sava` deployment
* Remove the route `sava/sava/sava:1.0.0/port` from the gateway `sava/sava/port`

`DELETE /api/v1/deployments/sava`

```
---
name: sava:1.0
clusters:
  sava:
    services:
      - breed: sava:1.0.0
```


## Summing up


## Looking for more of a challenge?
Just for fun, you could try these:

* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

