---
title: "Going native - building native packages for Vamp"
date: "2015-08-05"
tags: ["articles", "sbt-native-packager","vamp","debian","homebrew"] 
category: ["articles"] 
author: "Matthijs Dekker" 
type: blog 
description: "Improving you experience using Vamp starts with how you install Vamp. We decided to create native packages, which will make your life easier, without complicating ours (to much). In this technical write up we tell you how we did it."
---

To give you a better experience installing Vamp, we decided to create native installers for the most common used platforms.

![](/img/packaging.png)

Okay, we already did the hard part: We designed and created the software, performed the tests, made a zip file, put the zip file on the website and wrote some documentation.

Only thing you had to do, is download the file, unzip it, put it contents in the correct directory, change the configuration files and write some startup scripts. And repeat these steps for every Vamp module. Easy as eating pie, right?

We didn't think so either. 

Time to go native.
<!--more--> 

## Targeting platforms

The Vamp modules will be typically installed on a server, with the exception of Vamp CLI, which is likely to be installed on desktop/laptop environments also. For servers, we'll create native installers for the [most widely used Linux flavors](http://www.serverwatch.com/columns/article.php/3900711/The-Top-10-Linux-Server-Distributions.htm); for the desktop we'll also include OSX, since thats what we are using ourself. And even for the platforms we don't target directly, we can make things a bit easier, by creating a universal install package.

## SBT Native Packager

Where a Java developer uses Maven, a Scala developer uses SBT as its build system. The SBT ecosystem is quite vibrant and there a some real nice plugins available. One of them is the [SBT native packager plugin](http://www.scala-sbt.org/sbt-native-packager/), which promisses to package your software to run anywhere.

We created a [separate project](http://github.com/magneticio/vamp-dist) for the distribution aspect of Vamp, which contains a directory for each module we want to publish. Out of the box, sbt-native-packager has the ability to create a so called 'Universal' package. This is a zip file in which you'll find a bin directory and a lib directory. To use a universal package, all you have to do is unzip the file and add the bin directory to your PATH statement. That is already a huge improvement.

## Universal customization

Having a closer look at the Universal package, there are somethings we'd like to change.
First of, the contents of the lib directory. It contains all the jar files our application needs, which are quite a few file. Lets change that, by wrapping the files into one single big jar file. With the help of the [sbt-assembly](https://github.com/sbt/sbt-assembly) plugin this can be done quite easy, as the excerpt from the CLI   [build.sbt](https://github.com/magneticio/vamp-dist/blob/master/cli/build.sbt) file shows:

```scala
//Make a fat jar
assemblyJarName in assembly := "vamp-cli.jar"

// removes all jar mappings in universal and appends the fat jar
mappings in Universal := {
 val universalMappings = (mappings in Universal).value
 val fatJar = (assembly in Compile).value
 // removing means filtering
 val filtered = universalMappings filter {
   case (file, fileName) =>  ! fileName.endsWith(".jar")
 }
 // add the fat jar
 filtered :+ (fatJar -> ("lib/" + fatJar.getName))
}

// the bash scripts classpath only needs the fat jar
scriptClasspath := Seq( (assemblyJarName in assembly).value )
```

The second thing we want to change in the CLI package, is the contents of the bin directory. The scripts in the bin directory are automatically generated when the package is being build and there are methods of adding or overriding functionality. For Vamp CLI, we want the name of the executable script to be `vamp` instead of `vamp-cli` and we'd like to include scripting to verify the installed Java version. For this, we had to add some lines to the [build.sbt](https://github.com/magneticio/vamp-dist/blob/master/cli/build.sbt).

```scala
executableScriptName := "vamp"

// Add check for Java 8 (not for windows)
bashScriptExtraDefines ++= IO.readLines(baseDirectory.value / "scripts" / "java_check.sh")
```

## Standard Linux

For Linux, we'd like to support Ubtuntu / Debian & Red Hat / CentOS. This means, we need to create .deb and .rpm packages. To do this, we specify some values in the build.sbt, to be included in the package mata information. For .deb packages, we've added:

```scala
description := "This is the command line interface for VAMP"
packageDescription := "CLI for the Very Awesome Microservices Platform"
packageSummary := "The Vamp CLI"
maintainer :=  "Matthijs Dekker <matthijs@magnetic.io>"
```
For the .rpm package, we've added:

```scala
rpmVendor := "Magnetic.io"
rpmUrl := Some("http://vamp.io")
rpmLicense := Some("Apache 2")
```
And that's it. Now we can create Linux packages just by executing the sbt tasks `debian:packageBin` and `rpm:packageBin`

Well not quite ...

## The init problem

The .deb package for Vamp CLI was easy to setup, but for our other components, things got a little more complex. The [Linux 'civil war'](http://www.zdnet.com/article/after-linux-civil-war-ubuntu-to-adopt-systemd/), which was all about which system to use for startup and shutdown routines, left a fragmented Linux world. Ubuntu 14.04 LTS uses `Upstart`, Debian 7 uses `SystemV` and Debian 8 and Ubuntu 15.04 `Systemd`. Since we want to support all 4 releases, this means we have to create 3 different .deb packages, one for each init system.

Luckily, sbt-native-packager has support for all three init systems and by specifying the `serverLoading` system, you can tell it which one to use.
For example, to use `SystemV` you would use:

```scala
serverLoading in Debian := com.typesafe.sbt.packager.archetypes.ServerLoader.SystemV
```

With some SBT trickery, defining a new task 'packageDebianAll', we can create packages for all three init systems.
For full details, see the [build.sbt](https://github.com/magneticio/vamp-dist/blob/master/core/build.sbt) file for Vamp Core.

## Configuration & data

Our server applications require configuration files and need to write data to disk. By adding `mappings`, we can include files into the package.

```scala
mappings in Universal <+= (packageBin in Compile, sourceDirectory ) map { (_, src) =>
  val conf = src / "main" / "resources" / "reference.conf"
  conf -> "conf/application.conf"
}
```

This will create a `conf` directoy in our package, with a file called `application.conf`.

To have the configuration file picked up by the startup script, we add it to the `bashScriptExtraDefines`.

```scala
bashScriptExtraDefines += """addJava "-Dconfig.file=${app_home}/../conf/application.conf""""
```

We have configured our application to write data in a `data` directory, which we need to create when installing the software:

```scala
// Add an empty folder to mappings
linuxPackageMappings += packageTemplateMapping(s"/usr/share/${name.value}/data")() withUser(name.value) withGroup(name.value)
```

And that's it for Vamp.

## Lets GO all the way

One Vamp module got left out, [Vamp Router](https://github.com/magneticio/vamp-router). While the other Vamp modules are all written in Scala, Vamp Router is a [Go](https://golang.org/) application and has it's own build process. This build process creates .zip files, based on the hardware platform it can run on. Linux .deb & .rpm packages are however not created by this build, and we came up with a way to use sbt-native-packager for this purpose.

First, we'll pull the vamp-router zip file from our Bintray download site in a `resourceGenerator`:

```scala
val vampRouterVersion = "0.7.9"

val platform = "amd64"

resourceGenerators in Compile += Def.task {
  val location = url(s"https://bintray.com/artifact/download/magnetic-io/downloads/vamp-router/vamp-router_${vampRouterVersion}_linux_$platform.zip")
  IO.unzipURL(location, target.value / platform).toSeq
}.taskValue

```

Next we create mappings, to include the files we've extracted from the zip file.

```scala
// copy vamp-router from the extracted bintray zip
linuxPackageMappings += packageMapping( (target.value / platform / "vamp-router",  "/usr/share/vamp-router/vamp-router") ) withPerms "755"

// Add the config files
mappings in Universal <+= (packageBin in Compile, target ) map { (_, target) =>
  val conf = target / platform / "configuration" / "error_pages"  / "500rate.http"
  conf -> "configuration/error_pages/500rate.http"
}

mappings in Universal <+= (packageBin in Compile, target ) map { (_, target) =>
  val conf = target / platform / "configuration" / "templates" / "haproxy_config.template"
  conf -> "configuration/templates/haproxy_config.template"
}

mappings in Universal <+= (packageBin in Compile, target ) map { (_, target) =>
  val conf = target / platform / "examples" / "example1.json"
  conf -> "examples/example1.json"
}
```

We add our own start up script, since the generated one would not work for us:

```scala
// Add the script file to which starts vamp-router
mappings in Universal <+= (packageBin in Compile, sourceDirectory ) map { (_, src) =>
  val bin = src / "templates" / "bash-template"
  bin -> "bin/vamp-router"
}
```

And we remove the generated jar file, since there isn't actually anything in there.

```scala
// removes all jar mappings in universal
mappings in Universal := {
  val universalMappings = (mappings in Universal).value
  val filtered = universalMappings filter {
    case (file, fileName) =>  ! fileName.endsWith(".jar")
  }
  filtered
}
```

Since the packages we are creating have dependencies and are not architecture independent, we need to add some additional statements to reflect this in the meta data of the packages


```scala
val rpmArchitecture="x86_64"
val debianArchitecture = "amd64"

debianPackageDependencies in Debian ++= Seq("haproxy", "bash (>= 2.05a-11)")
packageArchitecture in Debian := debianArchitecture
debianSection in Debian := "net"

packageArchitecture in Rpm := rpmArchitecture
```

With this done, we can create packages by running `sbt rpm:packageBin` and `sbt packageDebianAll`. This will create the debian `amd64` and the rpm `x86_64` packages. For the Debian `i386` packages, we needed to repeat the trick, which we've done by simple duplicating the whole [router-amd64](https://github.com/magneticio/vamp-dist/tree/master/router-amd64) directory.

And that wraps up all Linux packaging.

## Brewing our first OSX package

A popular method of installing software on OSX is using [homebrew](http://brew.sh/). It allows you to install software from the command line, without the hassle of the Apple App Store. Creating a `brew` package is not that hard. We setup an additional github repository, [homebrew-vamp](https://github.com/magneticio/homebrew-vamp), here we could store our `formula`.

Our forumula uses the Vamp CLI Universal package as a basis. For the brew package, we add an [additional script](https://github.com/magneticio/vamp-dist/blob/master/cli/src/scripts/brew_vamp) to the Universal package

The complete formula is just a couple of lines of Ruby

```ruby
require "formula"

class Vamp < Formula
  homepage "http://vamp.io"
  version "0.7.9"
  url "https://bintray.com/artifact/download/magnetic-io/downloads/vamp-cli/vamp-cli-#{version}.zip"
  # generate the sha256 hash on your mac with the command: shasum -a 256 <filename>
  sha256 "c6385ceff1200c1f990bf133f5189270eca4a174ceedacb4a8e9915eda3b02ca"

  def install
      inreplace "brew/vamp", "##PREFIX##", "#{prefix}"
      prefix.install "lib/vamp-cli.jar"
      bin.install "brew/vamp"
  end
end
```
When we release a new version of Vamp, we need to update our formula, with the latest version number and an updated sha256 hash.

## Fire and forget

With everything setup to create packages, the next step was automating it, so we can publish all packages with the push of a button. For every release, we update the version number the build.sbt files and update the library dependencies. Once, we push these changes to [Github](https://github.com/magneticio/vamp-dist), Travis CI will start building the packages and with the help of some custom bash scripts, push it all to [Bintray](https://bintray.com/magnetic-io/).

The final step is to update the brew formula on Github and we've done another release!
