---
title: Routing & filters
weight: 50
menu:
  main:
    parent: using-vamp
---
# Routing & Filters

A routing defines a set of rules for routing traffic between different services within the same cluster.
Vamp allows you to determine this in two ways:

1. by setting a **weight** in the percentage of traffic.
2. by setting a **filter** condition to target specific traffic.

You can define routings inline in a blueprint or store them separately under a unique name and just use that name to reference them from a blueprint. 

Let's have a look at a simple, inline, routing. This would be used directly inside a blueprint. 

```yaml
---           
weight: 10%  # Amount of traffic for this service in percents.
filters:    
  - condition: User-Agent = IOS
```

The example above could be reused by just giving it a name and storing it by using a `POST` request to the `/routings` endpoint.

```yaml
name: cool_routing   # Custom name, can be referenced later on.
weight: 10%
filters: 
  - condition: user-agent = ios
  - really_cool_filter
```

> **Notice:** we added a filter named `really_cool_filter` here. This filter is actually a reference to a separately stored filter definition we stored under a unique name on the `/filters` endpoint.

## Defining weights and basic weight rules

We can divide all routes in 2 groups:

- routes with filters (conditions)
- routes without filters or **other** routes

For each route, weight can be set regardless of any filter.
If **weight** is set on route with filters, then the weight represent the percentage of traffic that will 'follow' that route, and rest (100% - **weight**) will go to **other** (no filter) routes.

Route all `Firefox` users to route `service_B`:

```yaml
service_A: 
  weight: 100%
service_B:
  weight: 100%
  filters:
  - user-agent == Firefox
```

Route half of `Firefox` users to route `service_B`, other half to `service_A`:

```yaml
service_A: 
  weight: 100%
service_B:
  weight: 50%
  filters:
  - user-agent == Firefox
```


When defining weights, please make sure the total weight of no filter routes always adds up to 100%. 
This means that when doing a straight three-way split you give one service 34% as `33+33+34=100`. 
Vamp has to account for all traffic and 1% can be a lot in high volume environments.

## Defining filters

Creating filters is quite easy. Checking Headers, Cookies, Hosts etc. is all possible. 
Under the hood, Vamp uses [Haproxy's ACL's](http://cbonte.github.io/haproxy-dconv/configuration-1.5.html#7.1) and you can use the exact ACL definition right in the blueprint in the `condition` field of a filter.

However, ACL's can be somewhat opaque and cryptic. That's why Vamp has a set of convenient "short codes"
to address common use cases. Currently, we support the following:

| description               | syntax                           | example                  |
| --------------------------|:--------------------------------:|:------------------------:| 
| **match user agent**      | user-agent == **value**          | user-agent == Firefox    | 
| **mismatch user agent**   | user-agent != **value**          | user-agent != Firefox    | 
| **match host**            | host == **value**                | host == localhost        | 
| **mismatch host**         | host != **value**                | host != localhost        | 
| **has cookie**            | has cookie **value**             | has cookie vamp          | 
| **misses cookie**         | misses cookie **value**          | misses cookie vamp       |
| **has header**            | has header **value**             | has header ETag          | 
| **misses header**         | misses header **value**          | misses header ETag       |
| **match cookie value**    | cookie **name** has **value**    | cookie vamp has 12345    | 
| **mismatch cookie value** | cookie **name** misses **value** | cookie vamp misses 12345 |  
| **header has value**      | header **name** has **value**    | header vamp has 12345    | 
| **header misses value**   | header **name** misses **value** | header vamp misses 12345 |  

Additional syntax examples can be found [here](https://github.com/magneticio/vamp/blob/master/model/src/test/scala/io/vamp/model/parser/FilterConditionParserSpec.scala).
Vamp is also quite flexible when it comes to the exact syntax. This means the following are all equivalent:

In order to specify plain HAProxy ACL, ACL needs to be between `{ }`:

```yaml
filters: 
  - condition: { hdr_sub(user-agent) Chrome }
```

Having multiple conditions in a filter is perfectly possible. In this case all filters are implicitly
"AND"-ed together. For example, the following filter would first check whether the string "Chrome" exists in the User-Agent header of a
request and then it would check whether the request has the header 
"X-VAMP-MY-COOL-HEADER". So any request matching both conditions would go to this service.

```yaml
---
routing:
  weight: 100%
  filters:
    - condition: User-Agent = Chrome
    - condition: Has Header X-VAMP-MY-COOL-HEADER
```

Using a tool like [httpie](https://github.com/jakubroztocil/httpie) makes testing this a breeze.

    http GET http://10.26.184.254:9050/ X-VAMP-MY-COOL-HEADER:stuff

## Boolean expression in filters

Vamp supports `AND`, `OR`, negation `NOT` and grouping `( )`:

```yaml
---
routing:
  weight: 100%
  filters:
    - condition: (User-Agent = Chrome OR User-Agent = Firefox) AND has cookie vamp 
```

Additional boolean expression examples can be found [here](https://github.com/magneticio/vamp/blob/master/model/src/test/scala/io/vamp/model/parser/BooleanParserSpec.scala).

## URL path rewrite

Vamp also supports URL path rewrite which can be powerful solution in defining service API's (e.g. RESTful) outside of application service.
Rewrites are specified in the similar way as filters:
 
```yaml
routes:
  web/port1:
    filters: [] # an empty list, can be ommited
    rewrites:
    - path: a if b
  web/port2:
    weight: 100%
```

Path rewrite is defined in format: `path: NEW_PATH if CONDITION`:

- `NEW_PATH` new path to be used; HAProxy variables are supported, e.g. `%[path]`
- `CONDITION` condition using HAProxy directives, e.g. matching path, method, headers etc.
