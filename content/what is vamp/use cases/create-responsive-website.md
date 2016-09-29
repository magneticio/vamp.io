---
date: 2016-09-13T09:00:00+00:00
title: Create a responsive website
---

_“We need to upgrade the web frontend to make it responsive”_  
Developing a responsive web frontend is a major undertaking, requiring a large investment of hours and extensive testing. Until you go live, it's difficult to predict how the upgrade will be received by users - will it actually convert?   

Why develop the whole frontend in one go? Using Vamp you could use a canary release to introduce the new frontend to a selected cohort of users. This would require a minimal investment of hours and delivering real usage data:

1. __Start small:__ Build the new frontend for only one specific browser/resolution. Vamp can deploy the new responsive frontend and route a percentage of supported users there (all other users will continue to see the old version of your website).
2. __Optimise:__ With your new service in the hands of real users, you can measure actual data and optimise accordingly.
3. __Scale up:__ Once you are satisified, you can use Vamp to scale up the release, developing and deploying one browser/resolution at a time.
