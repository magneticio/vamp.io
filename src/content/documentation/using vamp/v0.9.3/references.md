---
date: 2016-09-13T09:00:00+00:00
title: Referencing artifacts
menu:
  main:
    identifier: "referencing-artifacts-v093"
    parent: "Using Vamp"
    weight: 110
---

{{< note title="The information on this page is written for Vamp v0.9.3" >}}

* Switch to the [latest version of this page](/documentation/using-vamp/references).
* Read the [release notes](/documentation/release-notes/latest) for the latest Vamp release.
{{< /note >}}

With any artifact, Vamp allows you to either use an inline notation or reference the artifact by name. For references, you use the `reference` keyword or its shorter version `ref`. Think of it like either using actual values or pointers to a value. This has a big impact on how complex or simple you can make any blueprint, breed or deployment. It also impacts how much knowledge you need to have of all the different artifacts that are used in a typical deployment or blueprint.

Vamp assumes that referenced artifcats (the breed called `my_breed` in the example below) is available to load from its datastore at deploy time. This goes for all basic artifacts in Vamp: SLA's, gateways, conditions, escalations, etc.

#### Example - reference notation

**inline notation**

```yaml
---
name: my_blueprint
  clusters:
    my_cluster:
      services:
        breed:
          name: my_breed
          deployable: registry.example.com/app:1.0
        scale:
          cpu: 2
          memory: 1024MB
          instances: 4
```
**reference notation**

```yaml
---
name: my_blueprint
  clusters:
    my_cluster:
      services:
        breed:
          reference: my_breed
        scale:
          reference: medium  
```

## Working with references

When you begin to work with Vamp, you will probably start with inline artifacts. You have everything in one place and can directly see what properties each artifact has. Later, you can start specialising and basically build a library of often used architectural components. 

### Example use of references

* [Create a library of containers](/documentation/using-vamp/v0.9.3/references/#example-1)
* [Fix scales per environment](/documentation/using-vamp/v0.9.3/references/#example-2)
* [Reuse a complex condition](/documentation/using-vamp/v0.9.3/references/#example-3)


#### Example 1 
**Create a library of containers**

**Use case:** You have a Redis container you have tweaked and setup exactly the way you want it. You want to use that exact container in all your environments (dev, test, prod etc.). 

**Implementation:** Put all that info inside a breed and use either the Vamp UI or API to save it (below). Now you can just use the `ref: redis:1.0` notation anywhere in a blueprint.

`POST /api/v1/breeds`

```yaml
---
name: redis:1.0
deployable: redis
ports: 6379/tcp
```

#### Example 2
**Fix scales per environment**

**Use case:** You want to have a predetermined set of scales you can use per deployment per environment. For instance, a "medium_production" should be something else than a "medium_test".

**Implementation:** Put all that info inside a scale and use either the Vamp API to save it (below). Now you can use the `ref: medium_test` or `ref: medium_prod` notation anywhere a `scale` type is required.

`POST /api/v1/scales`

```yaml
---
name: medium_prod
cpu: 2
memory: 4096MB
instances: 3
```

```yaml
---
name: medium_test
cpu: 0.5
memory: 1024MB
instances: 1
```

#### Example 3
**Reuse a complex condition**

**Use case:** You have created a complex condition to target a specific part of your traffic. In this case users with a cookie that have a specific session variable set in that cookie. You want to use that condition now and then to do some testing. 

**Implementation:** Put all that info inside a condition and use either the Vamp API to save it (below). Now you can use the  `ref: condition_empty_shopping_cart` anywhere that `condition` is required.

```POST /api/v1/conditions```

```yaml
---
name: condition_empty_shopping_cart
condition: Cookie SHOPSESSION Contains shopping_basket_items=0 
```


{{< note title="What next?" >}}
* Read about [Vamp workflows](/documentation/using-vamp/v0.9.3/workflows/)
* Check the [API documentation](/documentation/api/v0.9.3/api-reference)
* [Try Vamp](/documentation/installation/hello-world)
{{< /note >}}
