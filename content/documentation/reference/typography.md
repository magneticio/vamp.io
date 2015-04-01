---
title: typography
url: /typography
---
# Header 1

Use links, like this one to [YAML](http://en.wikipedia.org/wiki/YAML).  

To alert people to stuff, or show exceptions or other things that deviate from the ordinary use the
alert classes. Use the following syntax in your markdown files, where the "bla" is left out: 

```
{{bla% alert info %}}
my important message
{{bla% /alert %}}
```
{{% alert info %}}
This is a "info" alert
{{% /alert %}}

{{% alert warn %}}
This is a "warn" alert
{{% /alert %}}




## Header 2

Some Yaml code, pretty printed with the following classes `<pre class="prettyprint lang-yaml">`

<pre class="prettyprint lang-yaml">
## Unique designator (name) consist of group, artifact and version.
group: tutum
artifact: mysql
version: 5.5

# Traits (parameters) of the breed (input/output).
traits:
  -
    ## Name of the trait.
    name: port
    value: 3306
    ## PORT, VOLUME, VARIABLE
    type: PORT
    ## IN, OUT
    direction: OUT
  -
    name: password
    type: VARIABLE
    direction: IN
    ## Alias is the trait name expected by the breed.
    ## This is very common if we deal with 3rd party breed.
    ## In this example with an existing docker image
    ## from public Docker repository.
    alias: MYSQL_PASS
</pre>

If you don't want any code highlighting, just use `<pre>` tags without any extra classes.

<pre>
$ java -version
$ java -DMem=20001 -jar ../mesk/havav-war
</pre>

You can also add a copy-to-clipboard button when you have some code people will need to copy & paste.
This is handy in tutorials and examples. Just wrap a standard `<pre>` tag with `{{bla% copyable %}}`
short codes. Of course, leave out the "bla":

{{% copyable %}}
<pre>
java --version
</pre>
{{% /copyable %}}

### Header 3

We have some straight inline code `like this`

## Blueprints

Bleuprint are execution plans - they describe how you system should look like at the runtime. All dependency availability and parameter values will be resolved at the deployment time. 

{{% copyable %}}
<pre class="prettyprint lang-yaml">
group: vamp
artifact: wordpress_stackable
version: 1

## Gates between the blueprint and the rest of the world.
## Could be specified by URI, for example: vamp://<custom>
## $PORT is shortened for default vamp assigned IO port.
gates:
  demo.port: $PORT
  
## Setting up all environment variables (all traits: ports, volumes etc.)
environment:
  ## In general value can be provided by URI, with predefined or 
  ## custom resolver implementation: vamp://<custom>
  db.password: secret

filials:

  # Application/services.
  demo:
    breed: tutum:wordpress-stackable:latest
    
    ## Available 'space' for the service: 
    ## cpu & memory per instance and total number of deployed instances.
    ## Could be specified by URI, for example: vamp://computing/large
    ## Based on the schema, system will resolved the actual 
    ## niche at deployment time.
    niche:
      cpu: 1
      memory: 1024
      instances: 2

  ## Database.
  db:
    breed: tutum:mysql:5.5

    niche:
      cpu: 1
      memory: 1024
      instances: 1
</pre>
{{% /copyable %}}


### Images

You reference the image using the following code in your
markdown file: `![](/img/scaling_poc.png)`. The actual file should be in the `/static/img/` directory.
![](/img/service_chain.png)



And here is some Json:

<pre class="prettyprint lang-js">
    {
        "key" : "value",
        "key1" : 132
    } 
</pre>

Here is some Scala code

<pre class="prettyprint lang-scala">

package io.magnetic.vamp_core.rest_api

import io.magnetic.vamp_core.model.Artifact
import io.magnetic.vamp_core.rest_api.notification.{InconsistentResourceName, RestApiNotificationProvider}
import io.magnetic.vamp_core.rest_api.util.ExecutionContextProvider

import scala.collection.mutable
import scala.concurrent.Future

trait ResourceStoreProvider {

  val resourceStore: ResourceStore

  trait ResourceStore {

    def all: Future[List[Artifact]]

    def find(name: String): Future[Option[Artifact]]

    def create(resource: Artifact): Future[Option[Artifact]]

    def update(name: String, resource: Artifact): Future[Option[Artifact]]

    def delete(name: String): Future[Option[Artifact]]
  }

}

trait InMemoryResourceStoreProvider extends ResourceStoreProvider with RestApiNotificationProvider {
  this: ExecutionContextProvider =>

  val resourceStore: ResourceStore = new InMemoryResourceStore()

  private class InMemoryResourceStore extends ResourceStore {

    val store: mutable.Map[String, Artifact] = new mutable.HashMap()

    def all: Future[List[Artifact]] = Future {
      store.values.toList
    }

    def find(name: String): Future[Option[Artifact]] = Future {
      store.get(name)
    }

    def create(resource: Artifact): Future[Option[Artifact]] = Future {
      store.put(resource.name, resource)
      Some(resource)
    }

    def update(name: String, resource: Artifact): Future[Option[Artifact]] = Future {
      if (name != resource.name)
        error(InconsistentResourceName(name, resource.name))

      store.put(resource.name, resource)
    }

    def delete(name: String): Future[Option[Artifact]] = Future {
      store.remove(name)
    }
  }

}
</pre>