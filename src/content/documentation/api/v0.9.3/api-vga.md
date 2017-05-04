---
date: 2016-09-13T09:00:00+00:00
title: VGA
menu:
  main:
    parent: "API"
    identifier: "api-reference-vga-093"
    weight: 205
---

You can retrieve Vamp gateway driver marshaller configurations and templates using the Vamp API.

## Actions

* [Get configuration](/documentation/api/v0.9.3/api-vga/#get-configuration) - view the current VGA configuration for a specified marshaller
* [Get template](/documentation/api/v0.9.3/api-vga/#get-template) - view a stored configuration template
* [Update template](/documentation/api/v0.9.3/api-vga/#update-template) - update a stored configuration template


## Get configuration
Return the current VGA configuration for the specified marshaller. 

### Request

* `GET`
* `api/v1/vga/{type}/{name}/configuration`  
  for example ` GET <vamp url>/api/v1/vga/haproxy/1.7/configuration`
* The request body should be empty.

### Response
Will return the current VGA configuration. If there is no current configuration for the specified marshaller, the response will be empty.


## Get template

### Request

* `GET`
* `api/v1/vga/{type}/{name}/template`  
  for example ` GET <vamp url>/api/v1/vga/haproxy/1.7/template`
* The request body should be empty.

### Response
Will return the configuration template for the specified marshaller. If no template is available, the response will be empty.

## Update template
Update the stored configuration template for the specified marshaller.

### Request

* `PUT`
* `api/v1/vga/{type}/{name}/template`  
  for example `PUT <vamp url>/api/v1/vga/haproxy/1.7/template`
* The request body should contain the complete, new template. 

### Response
If successful, the key value store response wil be returned. 



