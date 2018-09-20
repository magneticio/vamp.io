---
date: 2018-09-19T09:00:00+00:00
title: "Welch's t-test for A/B testing with Vamp Lamia and Istio 1.0.2"
author: "Alessandro Valcepina"
avatar: "alessandrov.jpg"
tags: ["Kubernetes", "Istio" ,"Microservices", "AB Testing"]
publishdate: 2018-09-19
featured_image: "/images/blog/ab_testing.png"
---

![](/images/blog/ab_testing.png)

Welcome back to our ongoing series on the development of Vamp Lamia and our experiences in using Istio for traffic routing on Kubernetes.
In [one of our previous posts](https://vamp.io/blog/ab-testing-istio/), we presented our approach to A/B testing with Vamp Lamia through the use of Experiments, which enable the user to quickly create a complex Virtual Service configuration and set up a Policy that will redirect the traffic based on the users' behaviour, for example moving all visitors to the winning variant of an Experiment.
As we stated at the end of the post, however, our implementation was, at that time, pretty simple. 
Since then, we made quite a few improvements and we are now ready to share them.

<!--more-->

## Welch's t-test

In our initial implementation the outcome of the A/B test was calculated by comparing the ratios of users that would land on a certain target page over the number of users that got to the landing page only. The Subset that achieved the highest ratio would benefit from a progressive increase in the traffic redirected to it until it finally reached 100%

While this is a sensible approach, it is far from being ideal. 
Differences in the statistical distributions of the two (or more) sets of user interactions could in fact lead to erroneous results.

For this reason we decided to use a different method: Welch's t-test.  
Welch's t-test, also known as unequal variances test, is, as the name implies, a statistical test widely employed to verify the hypothesis that two populations of different size and with different variances have equal, or close enough, averages.
In order to verify this hypothesis we have to calculate two values.
First is the statistic t, obtained through the formula

![](/images/blog/welch1.png)

Where X is the average of the population, while s and N are its variance and the number of its elements.
Secondly, we need the degrees of freedom, defined as

![](/images/blog/welch2.png)

Once we have these two values we can then use them with the t-distribution in order to verify that the averages are close enough.

This scenario is however a bit simplistic, especially because it compares only two populations. 
In our case, instead, we might typically find ourselves comparing three or more versions of a given service at the same time and, on top of that, some of these versions might share common features which should be considered individually in the outcome of the test.

For example we might have three versions of an e-commerce frontend where the first version has a blue background and white text, the second has a white background and red text and the third one has a blue background and black text. Let's say at the end of the A/B testing the second version is the winner, that means white background and red text is the best combination, however both the first and the third version had a blue background, so their combined results over this feature might actually show that the blue background is overall better than the white background regardless of the color of the text. Our goal is to be able to detect this.

In order to better showcase how Welch's t-test is used to implement Experiments in Vamp Lamia, let's create a simple example and look more closely at how the A/B testing winner will be determined.

For this example we deployed a nodejs webservice exposing two endpoints that simply acknowledge all requests. We have three different versions of this webservice and thus a separate subset for each version. 
As already shown in the previous blog post we also set up a Service, Destination Rule and Gateway to allow access to our webservice.
After doing all that we can now create the Experiment itself as shown in the image below.

![Experiment configuration](/images/blog/experiment_configuration.png)

Once the experiment has been created and the first minute has expired a running instance of Elasticsearch will be queried for the metrics of each subset and the data thus gathered will be used to calculate the Welch's test result.

More specifically these are the steps that will take place:

- Number of elements, average and variance get gathered from Elasticsearch
- For each Tag the Welch t-test hypothesis gets evaluated against the aggregated values of the other tags.
- If the averages are comparable the highest average gets identified.
- The results of the test are aggregated per Subset based on the tags associated with each subset.
- Subsets that obtained a positive score get a weight increase, while all others get a weight decrease.
- The new routing weights thus obtained are normalised so that their sum doesn't exceed 100%.

This, in short, is how the Experiment will calculate statistically relevant result to identify the best Subset among those configured for our service.

## Conclusions

This new way of handling A/B testing in Vamp Lamia can, of course, still be improved, for example by providing more details about the test outcome and about how each of the features actually performed. 
In addition to that, we are also planning to add more configuration options and make the creation of Experiments more intuitive and straightforward.
Nonetheless we believe this shows the potential in using Istio in combination with Vamp Lamia to handle complex A/B testing scenarios.
We hope the example we presented piqued your interest and, if that's the case, we invite you to visit our [Github repository](https://github.com/magneticio/vamp2setup), download Vamp Lamia test version and take a look at the extensive readme to try it out for yourselves . 
If you have any suggestions or feedback, please let us know. We look forward to hearing what you think.
See you soon with a new blog post!

