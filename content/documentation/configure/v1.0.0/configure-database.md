---
date: 2018-08-06T09:00:00+00:00
title: Configure MySQL
menu:
  main:
    identifier: "configure-database-v100"
    parent: "Configuration"
    weight: 40
---

Vamp uses a relational database to persist the definitions and current states of the services, gateways and workflows. This database is also used to store the user role definitions and users.

Vamp recommends using MySQL as the relational database. Though it’s possible to use PostgreSQL or Microsoft SQL server, we don’t recommend it, and if you get stuck we’re going to suggest that you to use MySQL.

Vamp has been tested with:

* Cloud SQL for MySQL service on Google Cloud Platform
* The Amazon Relational Database Service MySQL engine
* Azure Database for MySQL service
* Standalone MySQL instances

## Database Models

Vamp's multi tenancy always uses separate schemas for each tenant. However, each tenant can also have multiple namespace.
We offer two options to handle these namespace at the database level:

- **Just one schema**. Each namespace is a table in the schema, we call this *table-per-namespace*
- **Multiple schemas**. One schema for each namespace: *database-schema-per-namespace*


### Table per Namespace
The *table-per-namespace* model offers the best performance and the lowest overhead.

In this model, each tenant is a separate database schema and each namespace is a table within that schema.

**Benefits**

* Clear ownership: one database schema for each tenant
* Security:
  * A different user id can be assigned to each tenant
  * Each tenant can use a different database server instance for added security
* Best performance: only one database connection is required for each tenant
* Lowest overheads: there are fewer schemas, users and database server instances to manage

**Drawbacks**

* Namespaces are more tightly coupled

### Schema per Namespace
The *database-schema-per-namespace* model offers the greatest flexibility but also has the highest overhead.

In this model, each namespace is mapped to a separate database schema. A minimum of two schemas are required for each tenant, one for the organization namespace and one for each environment.

**Benefits**

* Namespaces are loosely coupled: changes to the schema for one namespace does affect any other namespace
* Security:
  * A different user id can be assigned to each namespace
  * Each namespace can use a different database server instance for added security

**Drawbacks**

* Higher overheads: there are more schemas, users and potentially more database server instances to manage
* Lower performance : maintaining separate database connection pools for each schema has a small performance impact when scaling Vamp

## Security
Vamp supports a number of data at rest encryption strategies.

## Configuration

### Using the Vamp Lifter UI

#### Kubernetes
Open the Vamp Lifter UI in your web browser. Details of how to access the Vamp Lifter UI using `kubectl` can be found in the in the Vamp EE [Kubernetes quickstart](/documentation/installation/kubernetes).

#### DC/OS
In the DC/OS UI, click the icon next to the **vamp-ee-lifter** service name to open the Vamp Lifter UI in a new window
![](/images/screens/v100/dcos-vamp-lifteree.png)

**To edit the deafult organization configuration**:

1. Select **Configuration** from the left-hand menu
2. Select the **Admin Template**
  ![](/images/screens/v100/lifteree-configuration-admintemplate.png)
3. After making your changes, click the **Push to KV Store** button

**To edit the deafult organization configuration**:

1. Select **Configuration** from the left-hand menu
2. Select the **Operation Template**
  ![](/images/screens/v100/lifteree-configuration-operationtemplate.png)
3. After making your changes, click the **Push to KV Store** button

### Table per Namespace
The default configuration is table-per-namespace.

If you will be using use the same database server for all tenants, then you should configure this by editing the admin template and operation template. The database server host and port, username and password must be the same in both templates. You can override the username and password settings when you create the tenant (organization) and tenant environments.

If you will be using different database servers for each tenant, then you must configure each tenant (organization) and tenant environment separately.

**Organization (Admin template)**
```
vamp:
  persistence:
    database:
      sql:
        database: vamp-${namespace}
        url: jdbc:mysql://mysql.default.svc.cluster.local:3306/vamp-${namespace}?useSSL=false
        database-server-url: jdbc:mysql://mysql.default.svc.cluster.local:3306?useSSL=false
        user: root
        table: ${namespace}
        password: secret
      type: mysql
```
```
  model:
    resolvers:
      namespace:
      - io.vamp.ee.model.NamespaceValueResolver
```

**Environment (Operation template)**
```
vamp:
  persistence:
    database:
      sql:
        database: vamp-${parent}
        url: jdbc:mysql://mysql.default.svc.cluster.local:3306/vamp-${parent}?useSSL=false
        database-server-url: jdbc:mysql://mysql.default.svc.cluster.local:3306?useSSL=false
        user: root
        table: ${namespace}
        password: secret
      type: mysql
```
```
  model:
    resolvers:
      namespace:
      - io.vamp.ee.model.NamespaceValueResolver
```

### Schema per Namespace
To use the database-schema-per-namespace model, you need to replace the default configuration.

The key changes are:

1. Delete the `table: ${namespace}` line from the admin template
2. Delete the `table: ${namespace}` line from the operation template
3. Change `vamp.persistence.database.sql.database` to replace `${parent}` with `${namespace}` in the the operation template
4. Change `vamp.persistence.database.sql.url` to replace `${parent}` with `${namespace}` in the the operation template

If you will be using use the same database server for all tenants, then you should edit the admin template and operation template. The database server host and port, username and password must be the same in both templates. You can override the username and password settings when you create the tenant (organization) and tenant environments.

If you will be using different database servers for each tenant, then you must configure each tenant (organization) and tenant environment separately.

**Organization (Admin template)**
```
vamp:
  persistence:
    database:
      sql:
        database: vamp-${namespace}
        url: jdbc:mysql://mysql.default.svc.cluster.local:3306/vamp-${namespace}?useSSL=false
        database-server-url: jdbc:mysql://mysql.default.svc.cluster.local:3306?useSSL=false
        user: root
        password: secret
      type: mysql
```

**Environment (Operation template)**
```
vamp:
  persistence:
    database:
      sql:
        database: vamp-${namespace}
        url: jdbc:mysql://mysql.default.svc.cluster.local:3306/vamp-${namespace}?useSSL=false
        database-server-url: jdbc:mysql://mysql.default.svc.cluster.local:3306?useSSL=false
        user: root
        password: secret
      type: mysql
```
