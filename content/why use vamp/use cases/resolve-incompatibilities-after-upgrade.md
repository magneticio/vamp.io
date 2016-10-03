---
date: 2016-09-13T09:00:00+00:00
title: Resolve incompatibilities after an upgrade
---

_“We upgraded the portal, our biggest client is running an unsupported browser”_  
Leaving an important client unable to access your services after a major upgrade is a big and potentially costly problem. The traditional response would be to rollback the upgrade asap - if possible.  

Why rollback? Using Vamp's smart routing you could send specific users/clients to the old portal while others to enjoy the benefits of your new upgraded portal.

1. __Re-deploy:__ Vamp can redeploy a (containerised) compatible version of your portal to run side-by-side with the upgraded version.
2. __Activate smart routing:__ Vamp can route all users with e.g. a specific IP, browser or location to a compatible version of the portal. Other clients will continue to see the new upgraded portal.
3. __Resolve the incompatibility:__ Once the client upgrades to a compatible browser Vamp can route them to the new portal, alternatively you could add in support for their browser.
