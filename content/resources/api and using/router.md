---
title: Vamp Router
weight: 900
draft: true
menu:
  main:
    parent: api-reference
---
# Router API

For more information on how to use the Vamp Router REST API check [the Github repo (https://github.com/magneticio/vamp-router)

**Routes**
```
- get all             : GET    /v1/routes
- create new          : POST   /v1/routes
- get by name         : GET    /v1/routes/{route_name}
- update by name      : PUT    /v1/routes/{route_name}
- delete by name      : DELETE /v1/routes/{route_name}
```

**Services**
```
- get all             : GET    /v1/routes/{route_name}/services
- create new          : POST   /v1/routes/{route_name}/services
- get by name         : GET    /v1/routes/{route_name}/services/{service_name}
- update by name      : PUT    /v1/routes/{route_name}/services/{service_name}
- delete by name      : DELETE /v1/routes/{route_name}/services/{service_name}
```

**Servers**
```
- get all             : GET    /v1/routes/{route_name}/services/{service_name}/servers
- create new          : POST   /v1/routes/{route_name}/services/{service_name}/servers
- get by name         : GET    /v1/routes/{route_name}/services/{service_name}/servers/{server_name}
- update by name      : PUT    /v1/routes/{route_name}/services/{service_name}/servers/{server_name}
- delete by name      : DELETE /v1/routes/{route_name}/services/{service_name}/servers/{server_name}
```

**Full configuration**
```
- get                 : GET    /v1/config
- update              : POST   /v1/config
```

**Debug Routes**
```
- runtime info        : GET   /v1/info
- stats reset         : GET   /v1/debug/reset
```