---
date: 2016-09-13T09:00:00+00:00
title: Requirements
---
To run Vamp, you will need:

#### Elastic Search
Vamp uses Elastic Search for persistence and for aggregating the metrics used by Vamp workflows and the Vamp UI.

#### Logstash  
Logstash formats raw data from HAproxy logs and running applications to store in Elastic Search.

#### HAproxy  
Each Vamp Gateway Agent (VGA) requires an instance of HAproxy.

#### Container scheduler  
Vamp talks directly to your choice of container scheduler.

#### Docker

#### a Docker repository