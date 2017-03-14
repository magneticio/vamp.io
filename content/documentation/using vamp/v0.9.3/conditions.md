---
date: 2016-09-13T09:00:00+00:00
title: Conditions
menu:
  main:
    identifier: "conditions-v093"
    parent: "Using Vamp"
    weight: 70
---

{{< note title="The information on this page is written for Vamp v0.9.3" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/conditions).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

Conditions are used by gateways to filter incoming traffic for routing between services in a cluster.
Read more about [gateway usage](/documentation/using-vamp/v0.9.3/gateways/#gateway-usage). You can define conditions inline in a blueprint or store them separately under a unique name on the `/conditions` endpoint and just use that name to reference them from a blueprint. 

#### Example - simple inline condition

This would be used directly inside a blueprint.

```yaml
---
condition_strength: 10%  # Amount of traffic for this service in percents.
condition: User-Agent = IOS
```

## Create a condition 

Creating conditions is quite easy. Checking Headers, Cookies, Hosts etc. is all possible.
Under the hood, Vamp uses Haproxy's ACL's ([cbonte.github.io/haproxy-dconv - 7.1 ACL basics](http://cbonte.github.io/haproxy-dconv/configuration-1.5.html#7.1)) and you can use the exact ACL definition right in the blueprint in the `condition` field of a condition.

However, ACL's can be somewhat opaque and cryptic. That's why Vamp has a set of convenient "short codes"
to address common use cases. Currently, we support the following:

| description           | syntax                       | example                  |
| ----------------------|:----------------------------:|:------------------------:|
| match user agent      | `user-agent ==` _value_          | `user-agent == Firefox`    |
| mismatch user agent   | `user-agent !=` _value_          | `user-agent != Firefox`    |
| match host            | `host ==` _value_                | `host == localhost`        |
| mismatch host         | `host !=` _value_                | `host != localhost`       |
| has cookie            | `has cookie` _value_             | `has cookie vamp`          |
| misses cookie         | `misses cookie` _value_          | `misses cookie vamp`       |
| has header            | `has header` _value_             | `has header ETag`          |
| misses header         | `misses header` _value_          | `misses header ETag`       |
| match cookie value    | `cookie` _name_ `has` _value_    | `cookie vamp has 12345`    |
| mismatch cookie value | `cookie` _name_ `misses` _value_ | `cookie vamp misses 12345` |
| header has value      | `header` _name_ `has` _value_   | `header vamp has 12345`    |
| header misses value   | `header` _name_ `misses` _value_ | `header vamp misses 12345` |

* Additional syntax examples: [github.com/magneticio/vamp - ConditionDefinitionParserSpec.scala](https://github.com/magneticio/vamp/blob/master/model/src/test/scala/io/vamp/model/parser/ConditionDefinitionParserSpec.scala).

Vamp is also quite flexible when it comes to the exact syntax. This means the following are all equivalent:

In order to specify plain HAProxy ACL, ACL needs to be between `{ }`:

```yaml
condition: "< hdr_sub(user-agent) Chrome >"
```

Having multiple conditions in a condition is perfectly possible. For example, the following condition would first check whether the string "Chrome" exists in the User-Agent header of a
request and then it would check whether the request has the header
"X-VAMP-MY-COOL-HEADER". So any request matching both conditions would go to this service.

```yaml
---
gateways:
  weight: 100%
  condition: "User-Agent = Chrome AND Has Header X-VAMP-MY-COOL-HEADER"
```

Using a tool like httpie ([github.com/jkbrzt/httpie](https://github.com/jakubroztocil/httpie)) makes testing this a breeze.

    http GET http://10.26.184.254:9050/ X-VAMP-MY-COOL-HEADER:stuff

### Boolean expression in conditions

Vamp supports `AND`, `OR`, negation `NOT` and grouping `( )`:

```yaml
---
gateways:
  weight: 100%
  condition: (User-Agent = Chrome OR User-Agent = Firefox) AND has cookie vamp
```

* Additional boolean expression examples: [github.com/magneticio/vamp - BooleanParserSpec.scala](https://github.com/magneticio/vamp/blob/master/model/src/test/scala/io/vamp/model/parser/BooleanParserSpec.scala).



{{< note title="What next?" >}}
* Read about [Vamp events](/documentation/using-vamp/v0.9.3/events/)
* Check the [API documentation](/documentation/api/v0.9.3/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}

