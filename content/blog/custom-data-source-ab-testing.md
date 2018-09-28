---
date: 2018-09-28T09:00:00+00:00
title: "Custom data sources for A/B testing with Vamp Lamia and Istio 1.0.2"
author: "Alessandro Valcepina"
avatar: "alessandrov.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices", "AB Testing"]
publishdate: 2018-09-28
featured_image: "/images/blog/ab_testing.png"
---

![](/images/blog/ab_testing.png)

Welcome to our ongoing series of post on our experiences in using Istio during the development of Vamp Lamia.

In [our previous post](https://vamp.io/blog/welch-ttest-ab-testing-istio/), we presented Vamp Lamia's approach to A/B testing and then delved deeper into how Experiments use Welch's t-test to identify the test's winner in a statistically sound way.

In both scenarios, however, we relied solely on Elasticsearch to gather the necessary statistics to calculate the A/B test outcome. 
This begs the question: what if we wanted to use a different source?
In this post we will discuss the possibility of employing a custom data source, be it a different database or another application, deployed inside or outside the cluster.

<!--more-->

## Custom Data Source

Vamp Lamia has been developed with the clear goal of making it as modular as possible. For that reason its architecture is based on the usage of Drivers, that is components that can be easily replaced for each of the entities that Vamp Lamia is managing. 
In this specific case we want to replace the Driver responsible for gathering metrics from Elasticsearch with another one that can interface with a custom data source.
That can be very easily done, provided the data source meets some requirements. 
Let's see how that can be achieved.

First of all we have to figure out what to use as our source of data.
For the sake of simplicity we will rely on a simple nodejs webservice that will return random values at each requests.
Everything we require from this webservice is that it exposes a "/stats" endpoint that will respond to a request of the kind "/stats?subset=subset1" with the data pertaining to subset1 presented in json format. 
You can see below an example of such a json.

```
{
  average: 1.2,
  standardDeviation: 0.8,
  numberOfElements: 3875
}
```

In this sample the number of elements is the number of users that got to the landing page of the service we are testing, while the average and standard deviation are calculated over the number of successful interactions of each user, i.e. the interactions that reached the specified target. 
Of course it is also possible for those number to have a different meaning. There's nothing preventing us, for example, from calculating the required statistics over the amount of each order submitted on an e-commerce or the time spent on the target page by each user. 

Exposing the endpoint we just described is basically the only requirement a custom data source has to meet in order to be used as an Elasticsearch replacement for A/B testing with Vamp Lamia. 
There are however some more changes we have to make to the Experiment's configuration in order to specify which data source we want to use. 
To have a clearer idea of what these changes are are we will refer to the picture below.

![Experiment with custom data source configuration](/images/blog/custom-data-source.png)

If you have read our previous blog post, you will notice that the configuration we are using here is very similar to the one used back then. 
We are configuring the names of the Service and Gateway that the Experiment will use, the time interval of each update and the amount by which the routes weights should be shifted, and, finally, we are defining three Subsets, each one with its own tags or features. 
In addition to all that, however we are also providing, through the Data Source path field, the uri towards our mock data source. This will allow the Experiment to query it for data at each interval.

On its own, however, specifying this uri is not enough.  
As we said earlier, we also have to tell Vamp Lamia to use a different implementation for the Driver responsible for querying Elasticsearch. 
We are doing that by adding a new key, **complexmetricsdriver**, in the metadata section, with value **custom**. 
This tells Vamp Lamia to replace the default implementation of the Complex Metrics Driver with the predefined Custom Source implementation, which has the identifier **custom**. 
That is all.

Once the form is submitted the Experiment will start and perform the same operations as the previous example, but, this time, all the data will be collected from the mock source we deployed.

## Conclusions

Setting up this example was a useful test for us, because it proved that the goal we set for ourselves while first approaching Vamp Lamia development has been met, that is Vamp Lamia Drivers can be easily replaced in order to change its functionalities. 
In the future we plan to make use of this feature more and more in order to tackle specific requirements that our customers might have in the future.

If you are curious about Vamp Lamia and want to check out its features more in depth we invite you to take a look at our [Github repository](https://github.com/magneticio/vamp2setup) where you can find a more comprehensive tutorial and try it out on your own. 
And, of course, keep an eye on our blog for new updates!