---
title: Docker compose
menu:
  main:
    parent: "API"
    identifier: "api-reference-docker-compose-094"
    weight: 45
draft: true
---

The docker-compose API endpoint can be used to import Docker compose files and convert these to Vamp blueprints.

## Resources
The resource examples shown below are in YAML format. Vamp API requests and responses can be in JSON (default) or YAML format, see [common parameters](/documentation/api/v0.9.4/using-the-api) for details on how to set this. 

### Minimum Docker compose resource

### API return resource
The API will return a [blueprint API returun resource](/documentation/api/api-blueprints/#api-return-resource)

version: '2'

services:
   db:
     image: mysql:5.6
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: wordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:4.6-php7.0-apache
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_PASSWORD: wordpress
volumes:
    db_data:
