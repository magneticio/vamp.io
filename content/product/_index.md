---
date: 2016-09-13T09:00:00+00:00
title: Product
aliases:
    - /product/why-use-vamp-v2/
    - /why-use-vamp-v2/
    - /product/feature-list/
header:
    hero: "Intelligent canary-releasing, feature-testing and optimisation for cloud-native applications"
roles:
    list1:
        title: "For Developers"
        items:
            - "automated canary releasing with rollback and reporting on issues"
            - "self-service system for releasing and traffic routing"
            - "easy load balancing and flexible service-discovery"
            - "API gateway and orchestration features"
    list2:
        title: "For DevOps Engineers"
        items:
            - "customisable canary test, release and SLA-based performance optimization workflows"
            - "flexible integrated metrics and events system"
            - "multi-cloud, multi-scheduler, multi-environment features with Role Based Access Control (RBAC)"
            - "powerful installation and configuration management tools"
    list3:
        title: "For Product Owners"
        items:
            - "multi-stage feature releases (geo, device, time, customer-segments, manual checks)"
            - "feature A/B testing with configuration-based feature toggles/flags"
            - "integrate with external analytics, APM and business systems"
            - "rich dashboards and wizards for full insights, observability and control" 
features:
    -
        title: "Canary releasing workflows with smart rollbacks"
        description: "automatically trigger workflows to incrementally release your services while constantly measuring full application performance and health, and rollback on health issues to minimise blast-radius."
    -
        title: "Self-service PaaS-style deployments and releasing"
        description: " teams can deploy and release single services or full application topologies in a secure, unified and abstracted way using a rich GUI, CLI or API automation. RBAC features allow full granular control over roles and rights. All actions and events are logged for audits and analytics"
    -
        title: "Label-based service gateway creation"
        description: "based on labels set in deployments Vamp can automatically create and configure gateways to expose services with the conditions and percentage-weights that you define. This allows you to use your favourite means of deploying services onto your cluster, and have Vamp automatically setup the routing for your canary-releasing needs."        
    -
        title: "Flexible service routing and API orchestration"
        description: "Vamp service gateways allow you to handle service API orchestrations like conditional URL rewrites, combining multiple services behind API endpoints, and provide path-based routing to specific services and even versions of services. Vamp gateways can also integrate with external services and non-containerised applications, f.e. to apply strangler patterns for canary-migrations."
    -
        title: "Feature flagging/toggling"
        description: "using container configuration methods like environment variables, Vamp allows you to create A/B tests with feature-flags/toggles that can be exposed to specific segments and percentages of users, using the flexible routing of Vamp service gateways.Vamp’s integrated event and metrics and workflow-based automation system enables you to automate the release of features based on the outcome of these A/B tests, and you can even integrate business KPI’s from external system like analytics or APM systems."
    -
        title: "Intelligent SLA-based autoscaling"
        description: "Vamp provides rich configurable workflows that can use technical and business health and performance metrics to scale and optimise your services and applications health and performance, while keeping your costs in check. Scaling can be on both services and infrastructure levels, for full application-sensitive intelligence."
    -
        title: "Multi cloud/cluster/scheduler"
        description: "Vamp’s modular driver-based architecture supports multiple schedulers (DC/OS, K8s), multiple clusters (both hard and virtual clusters) over multiple clouds. You can mix and match to create the optimal balance between performance, security and cost. Especially dynamically created short-lived virtual clusters can be a huge cost-saver, compared to creating a seperate “hard” cluster for each environment or project."
    -
        title: "Installer and configuration manager"
        description: "Vamp has a full-blown API-driven installation and configuration manager, that supports industry-standards like Hashicorp’s Vault for secure configuration management. A first Vamp setup with full dependencies installed can be up and running in less than 5 minutes without any specialised knowledge."
    -
        title: "Event and metric system"
        description: "Vamp’s powerful event and metric system is used to aggregate technical and performance metrics and KPIs on several levels, stores historical time-based data, logs all events for auditing, and can be used to trigger automation workflows based on internal or external events and data, f.e. from an external APM system. Vamp uses industry standards like ElasticSearch."                                                
    -
        title: "Role Based Access Control"
        description: "Vamp’s multi-environment features support fine-grained role based access control"
    - 
        title: "Configuration and automation as code"
        description: "Vamp’s YAML API’s can be used to create environments, configurations and automation workflows using code."                                       
---
