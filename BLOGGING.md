# How to create and publish a blog post

## Boilerplate

1. Create a `.md` markdown file in `content/blog/` or copy paste an existing one.
2. Make sure to update the frontmatter with the relevant data. An example:

```yaml
title: "Welch's t-test for A/B testing with Vamp Lamia and Istio 1.0.2" // the title shown
author: "Alessandro Valcepina" // The name of the authpr
avatar: "alessandrov.jpg" // name of a avatar picture stored in themes/vamp/static/img/avatars
tags: ["Kubernetes", "Istio" ,"Microservices", "AB Testing"] // labels around the topic
publishdate: 2018-09-19 // the publishing date. Important as used for sorting.
featured_image: "/images/blog/ab_testing.png" // A link to an image to be shown in Twitter, Linkedin etc. previews
```

Adding `draft: true` makes the post a draft, i.e. it will not show up when published.

## Write

1. Use any valid markdown syntax.
2. Adding the `<!--more-->` divider create a preview description shown on the blog list page and in the Twitter and Linkedin previews.
3. Store images in `static/images/blog/`

## Publish

1. Commit the markdown file and any relevant images.
2. Git push and the site will be updated.

- Commits and pushes on the **develop** branch go to `http://staging.vamp.io`
- Commits and pushes on the **master** branch directly go to `https://vamp.io`
