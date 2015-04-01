---
title: Canary releases
type: documentation
weight: 30
series: "tuts"
draft: true
menu:
    main:
      parent: getting-started
    
---
    
# Example 1: Merging

Adding a new version to something that is already running

## prereqs:

- stable deployment
- a blueprint of a new thing

## high over:

merging clusters or parts of clusters
example: merge only the web parts, but not the database

## step 1

`PUT` the following JSON to the `/deployments/{deployment_id}` endpoint. The fields have the following meaning:

* `blueprint`: the source blueprint
* `clusters`: the target cluster inside the deployment. If it already exists, the blueprint will be merged.
If it doesn't already exist, a new cluster is created with the name "demo". The integer is the new weight assigned to the cluster.

<pre class="prettyprint lang-js">
{
 "blueprint" : "vamp:wordpress:1",
 "clusters" : [
   {
   "name": "demo",
   "weight": 10
   }
 ]
}
</pre>


<pre class="prettyprint lang-yml">
this_is_yaml: saafafaf

</pre>

During a merge, the merged cluster picks up the environment variables that were already in place in the already running cluster. This means, that a new version of your web frontend will, for instance, pick up the same database connections strings as the old version. This is a very common scenario.

# Example 2: Adding

If your not merging, but adding, you are effectively creating an new local view, with a new environment. In this environment you can provide a completely new set of variables to, for instance, connect to a new database or other service. Typically, you would use this to add completely new components to your architecture.