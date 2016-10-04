---
date: 2016-09-13T09:00:00+00:00
title: Mac OS X
---

## Install the Vamp CLI

We have Homebrew support to install the Vamp CLI on MacOS X.

### Prerequisites

Before installing, make sure your system has the required software installed:

* Java 8  
Vamp needs an OpenJDK or Oracle Java version of 1.8.0_40 or higher. Check the version with `java -version`.

### Installation

1. Use Homebrew to install the Vamp CLI. Simply add a brew tap and install:
```bash
brew tap magneticio/vamp
brew install vamp
```


2. Type `vamp version` to check if Vamp Cli has been properly installed. 
3. Export the location of the Vamp host and check if the CLI can talk to Vamp:
```bash
export VAMP_HOST=http://localhost:8080
vamp info
```


