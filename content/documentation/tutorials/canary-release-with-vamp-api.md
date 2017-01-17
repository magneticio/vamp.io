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

### Initiate deployment

`PUT /api/v1/deployments/sava`

```
---
name: sava:1.0
gateways:
  9050/http: sava/port
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

### Merge new service

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

### Distribute traffic

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


## Summing up


## Looking for more of a challenge?
Just for fun, you could try these:

* 

{{< note title="What next?" >}}
* What would you like to see for our next tutorial? [let us know](mailto:info@magnetic.io)
* Find our more about [using Vamp](documentation/using-vamp/artifacts)
* Read more about the [Vamp API](documentation/api/api-reference)
{{< /note >}}

