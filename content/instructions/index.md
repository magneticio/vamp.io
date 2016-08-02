---
date: 2016-08-01T12:53:48+02:00
title: Instructions for creating content
weight: 10
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

## Adding a new API version

API section (menu) is specific because of custom rendering.
In order to ad a new API version docs, go to `/content/api` and copy (branch) one of the existing versions.
For instance let's copy `0.9.0` to `0.9.1` directory.

```sh
$ tree content/api

content/api
├── 0.8.5
│   ├── example1.md
│   └── index.md
├── 0.9.0
│   ├── example2.md
│   └── index.md
├── 0.9.1
│   ├── example2.md
│   └── index.md
└── master
    ├── example1.md
    ├── example2.md
    └── index.md
```

Now change all `0.9.0` occurrences in `0.9.1` files to `0.9.1`. 
This will also prevent Hugo to complain about duplicate page identifiers.
If you check `API` menu, `0.9.1` version should also appear (you may need to rerun `hugo serve --watch`).

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