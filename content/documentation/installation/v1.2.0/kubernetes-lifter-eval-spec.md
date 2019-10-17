---
date: 2018-08-31T14:00:00+00:00
title: Vamp Enterprise Edition Trial for Kubernetes 
platforms: ["Kubernetes"]
---

{{< note title="Vamp Enterprise for Kubernetes" >}}
Thank you for your interest in Vamp Enterprise! To start using Vamp Enterprise you need to setup and configure some dependencies and environments. To make this really easy we've created Vamp Lifter, our setup and configuration tool. You can read more about Vamp components, including Lifter [here.] (/documentation/how-vamp-works/v1.0.0/concepts-and-components/#vamp-components)
{{< /note >}}

If you’re new to Vamp Enterprise Edition and you want a quick way to evaluate it, copy the Vamp Lifter application specification below and save it as file named **lifter-standalone.yml**. Then follow the [Kubernetes Quickstart](/documentation/installation/kubernetes) guide. 

```yaml
apiVersion: v1
kind: Service
metadata:
  name: lifter
spec:
  ports:
  - port: 8081
    protocol: TCP
    targetPort: 8081
  selector:
    app: lifter

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lifter
spec:
  selector:
    matchLabels:
      app: lifter
  replicas: 1
  template:
    metadata:
      labels:
        app: lifter
      name: lifter
    spec:
      containers:
      - name: lifter
        image: vampio/vamp-ee-lifter:latest-kubernetes-evaluation
        ports:
        - containerPort: 8081
          protocol: TCP
        env:
        - name: VAMP_EE_NAMESPACE
          value: vampio
        - name: VAMP_EE_METADATA_NAMESPACE_TITLE
          value: vamp.io
        - name: VAMP_PERSISTENCE_KEY_VALUE_STORE_TYPE
          value: vault
        - name: VAMP_PERSISTENCE_KEY_VALUE_STORE_BASE_PATH
          value: /secret/vamp
        - name: VAMP_EE_PERSISTENCE_KEY_VALUE_STORE_BASE_PATH
          value: /secret/vamp
        - name: VAMP_PERSISTENCE_KEY_VALUE_STORE_VAULT_TOKEN
          value: vamp
        - name: VAMP_PERSISTENCE_KEY_VALUE_STORE_VAULT_URL
          value: http://vault.default.svc.cluster.local:8200
        resources:
          requests:
            cpu: 0.2
            memory: 1024
        securityContext:
          privileged: false
```
{{< note title="What next?" >}}

* If you want to evaluate Vamp, follow the [Kubernetes Quickstart guide →](/documentation/installation/kubernetes)
* If you’re curious how Vamp works, take a look at the Vamp [Concepts and Components](/documentation/how-vamp-works/).

{{< /note >}}
