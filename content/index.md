---
date: 2016-08-01T12:53:48+02:00
title: Revamp
type: index
weight: 0
---

## Adding content to an existing section (menu)

Let's create our first content file for your documentation. 
Open a terminal and add the following command for each new file you want to add. 
Replace `<section-name>` with a general term that describes your document in detail.

```sh
hugo new <section-name>/filename.md
```

Visitors of your website will find the final document under `www.example.com/<section-name>/filename/`.

To be properly added to the menu, file should contains `menu` section, e.g.:

```
menu:
  main:
    parent: Examples
    identifier: Example 1
    weight: 10
```

Check out content of `Examples`.

## Creating section (menu)

Open `config.toml` file and append new section (menu) definition.
Let's add `Getting started` submenu. Add the following after the `Examples` definition (end of the file):

```
[[menu.main]]
	name   = "Getting started"
	url    = "getting-started/"
	weight = 20
```

Fields:
- `name` - displayed name
- `url` - section URL, should be the same as directory name
- `weight` - order of the submenu

Now let's add the `index` page:

```sh
hugo new getting-started/index.md
```

## Table of contents

You maybe noticed that the menu on the left contains a small table of contents of the current page. All `<h2>` tags (`## Headline` in Markdown) will be added automatically.

## Admonitions

Admonition is a handy feature that adds block-styled side content to your documentation, for example hints, notes or warnings. It can be enabled by using the corresponding [shortcodes](http://gohugo.io/extras/shortcodes/) inside your content:

```go
{{</* note title="Note" */>}}
Nothing to see here, move along.
{{</* /note */>}}
```

This will print the following block:

{{< note title="Note" >}}
Nothing to see here, move along.
{{< /note >}}

The shortcode adds a neutral color for the note class and a red color for the warning class. You can also add a custom title:

```go
{{</* warning title="Don't try this at home" */>}}
Nothing to see here, move along.
{{</* /warning */>}}
```

This will print the following block:

{{< warning title="Don't try this at home" >}}
Nothing to see here, move along.
{{< /warning >}}