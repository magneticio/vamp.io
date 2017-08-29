---
date: 2016-09-13T09:00:00+00:00
title: HAProxy
menu:
  main:
    parent: "API"
    identifier: "api-reference-haproxy-094"
    weight: 150
---

Details of Vamp's HAProxy configuration. 
	
## Actions

 * [Get](/documentation/api/v0.9.4/api-haproxy/#get-haproxy-configuration) - get the HAProxy configuration for a version.

## HAProxy config parameters

The example below is in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.4/using-the-api) for details on how to set this. 

```
# HAProxy 1.6, Frontends & Backends managed by Vamp

# Virtual hosts

frontend virtual_hosts

  bind 0.0.0.0:80
  mode http

  option httplog
  log-format {\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tq\":%Tq,\"Tw\":%Tw,\"Tc\":%Tc,\"Tr\":%Tr,\"Tt\":%Tt,\"ST\":%ST,\"B\":%B,\"CC\":\"%CC\",\"CS\":\"%CS\",\"tsc\":\"%tsc\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq,\"hr\":\"%hr\",\"hs\":\"%hs\",\"r\":%{+Q}r}
  
  # destination: sava:1.0/sava/web
  acl 210709510c3942c9 hdr(host) -i web.sava.sava-1-0.vamp
  use_backend 271118ac3851077c564ceb0e75f9c05f28e1acdd  if 210709510c3942c9  
  
# backend: sava:1.0/sava/web
backend 271118ac3851077c564ceb0e75f9c05f28e1acdd

  balance roundrobin
  mode http

  option forwardfor
  http-request set-header X-Forwarded-Port %[dst_port]
  
  # server: sava:1.0/sava/web
  server 271118ac3851077c564ceb0e75f9c05f28e1acdd 127.0.0.1:40000
  
# Port mapping

# frontend: sava:1.0/sava/web
frontend 271118ac3851077c564ceb0e75f9c05f28e1acdd
  
  bind 0.0.0.0:40000
  
  option httplog
  log-format {\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tq\":%Tq,\"Tw\":%Tw,\"Tc\":%Tc,\"Tr\":%Tr,\"Tt\":%Tt,\"ST\":%ST,\"B\":%B,\"CC\":\"%CC\",\"CS\":\"%CS\",\"tsc\":\"%tsc\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq,\"hr\":\"%hr\",\"hs\":\"%hs\",\"r\":%{+Q}r}
  mode http

  # backend: other sava:1.0/sava/web
  default_backend o_271118ac3851077c564ceb0e75f9c05f28e1acdd

# frontend: other sava:1.0/sava/web
frontend o_271118ac3851077c564ceb0e75f9c05f28e1acdd
  
  option httplog
  log-format {\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tq\":%Tq,\"Tw\":%Tw,\"Tc\":%Tc,\"Tr\":%Tr,\"Tt\":%Tt,\"ST\":%ST,\"B\":%B,\"CC\":\"%CC\",\"CS\":\"%CS\",\"tsc\":\"%tsc\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq,\"hr\":\"%hr\",\"hs\":\"%hs\",\"r\":%{+Q}r}
  
  bind unix@/usr/local/vamp/o_271118ac3851077c564ceb0e75f9c05f28e1acdd.sock accept-proxy
  mode http

  # backend: other sava:1.0/sava/web
  default_backend o_271118ac3851077c564ceb0e75f9c05f28e1acdd

# frontend: sava:1.0/sava/web//sava:1.0/sava/sava:1.0/web
frontend 1f2c9bf68395805af6ecd4c389c061dfdd24d62d
  
  option httplog
  log-format {\"ci\":\"%ci\",\"cp\":%cp,\"t\":\"%t\",\"ft\":\"%ft\",\"b\":\"%b\",\"s\":\"%s\",\"Tq\":%Tq,\"Tw\":%Tw,\"Tc\":%Tc,\"Tr\":%Tr,\"Tt\":%Tt,\"ST\":%ST,\"B\":%B,\"CC\":\"%CC\",\"CS\":\"%CS\",\"tsc\":\"%tsc\",\"ac\":%ac,\"fc\":%fc,\"bc\":%bc,\"sc\":%sc,\"rc\":%rc,\"sq\":%sq,\"bq\":%bq,\"hr\":\"%hr\",\"hs\":\"%hs\",\"r\":%{+Q}r}
  
  bind unix@/usr/local/vamp/1f2c9bf68395805af6ecd4c389c061dfdd24d62d.sock accept-proxy
  mode http

  # backend: sava:1.0/sava/web//sava:1.0/sava/sava:1.0/web
  default_backend 1f2c9bf68395805af6ecd4c389c061dfdd24d62d

# backend: other sava:1.0/sava/web
backend o_271118ac3851077c564ceb0e75f9c05f28e1acdd

  mode http
  balance roundrobin
  
  # server: sava:1.0/sava/web//sava:1.0/sava/sava:1.0/web
  server 1f2c9bf68395805af6ecd4c389c061dfdd24d62d unix@/usr/local/vamp/1f2c9bf68395805af6ecd4c389c061dfdd24d62d.sock send-proxy weight 100 check 
  
# backend: sava:1.0/sava/web//sava:1.0/sava/sava:1.0/web
backend 1f2c9bf68395805af6ecd4c389c061dfdd24d62d

  mode http
  balance roundrobin
  
  option forwardfor
  # server: e0fac2d5bb3be249d937_sava-1-0-e0fac2d5bb3be249d937.f8de60da-dbdc-11e6-bdac-0242846bb8a0
  server cd48eaba831ec9ef2ea951c3d273e0fb06dac84f 192.168.99.100:31610 cookie cd48eaba831ec9ef2ea951c3d273e0fb06dac84f weight 100 check  
  
  # server: e0fac2d5bb3be249d937_sava-1-0-e0fac2d5bb3be249d937.f8da6938-dbdc-11e6-bdac-0242846bb8a0
  server 3a62d05fca87ce3d018d0020f778e05923d1b8eb 192.168.99.100:31727 cookie 3a62d05fca87ce3d018d0020f778e05923d1b8eb weight 100 check  
  
  # server: e0fac2d5bb3be249d937_sava-1-0-e0fac2d5bb3be249d937.f8e083bb-dbdc-11e6-bdac-0242846bb8a0
  server fff8c1fbb50c35d619b3d4cf2fdd4f4c73e2ce9d 192.168.99.100:31134 cookie fff8c1fbb50c35d619b3d4cf2fdd4f4c73e2ce9d weight 100 check  
  
  # server: e0fac2d5bb3be249d937_sava-1-0-e0fac2d5bb3be249d937.f8dd2859-dbdc-11e6-bdac-0242846bb8a0
  server 10f3595fedfdd135af60e06d738c802cbd23564a 192.168.99.100:31473 cookie 10f3595fedfdd135af60e06d738c802cbd23564a weight 100 check  
```

------------------

## Get HAProxy configuration

Return the configuration for the specified HAProxy version,

### Request

* `GET` 
* `/api/v1/haproxy/{version_number}`
* The request body should be empty.

### Response
If successful, will return the [HA proxy configuration](/documentation/api/v0.9.4/api-haproxy/#haproxy-config-parameters) for the HAProxy `version_number` specified in the request path. 

### Errors
* **blank response** - There is no configuration available for the specified HAProxy version number.

------------------
