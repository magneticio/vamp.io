# New vamp.io

This is the source for the new [vamp.io](http://vamp.io) site. 
## Setup HUGO
    
1. Clone this repo
    
        $ git clone https://github.com/magneticio/vamp.io.git
        
2. Download Hugo from [http://gohugo.io](http://gohugo.io) or install using Homebrew:
    
        $ brew update && brew install hugo

3. Run hugo in watch mode and start adding content under the `content/` tree

        $ hugo server --watch

    The site is server under `localhost:1313`

## Adding menuitems
### Top menu item
1. Go to the `config.toml` file
2. Go to the `# Top Menu Items` comment
3. Add a top menu item like this:

```
[[menu.main]]
    name = "Top menu name"      
    url = "/top/menu/subpage/"
    identifier = "unique-identifier"
    weight = 10
```
|Attribute  |Type   |Details                                            |
|-----------|-------|-------------------------------------------------- |
|name       |string |Name that will show up in the top menu.            |  
|url        |string |Explicit url to wich the page should point to.     |
|identifier |string |Should be **unique** for every item!               | 
|weight     |int    |For the order of menu items, lower is more on top  |

### Side Menu item
1. Go to the `config.toml` file
2. Go to the `# Side Menu Items` comment
3. Add a side menu item like this:

```
[[menu.main]]
    name = "Side menu name"      
    url = "/side/menu/subpage/"
    parent = "parent-identifier"
    identifier = "unique-sub-identifier"
    weight = 10
```
|Attribute  |Type   |Details                                            |
|-----------|-------|-------------------------------------------------- |
|name       |string |Name that will show up in the side menu.           |
|parent     |string |Identifier of the top menu item under wich this page resides|
|url        |string |Explicit url to wich the page should point to.     |
|identifier |string |Should be **unique** for every item!               | 
|weight     |int    |For the order of menu items, lower is more on top  |

### Side submenu item
1. Go to the page that should be added to the side menu in the `Content` folder.
2. At the top of the page add this to the parameter:
```
menu:
    main: 
        name: "Side menu name"
        parent: "unique-sub-identifier"
        weight: 20
```
|Attribute  |Type   |Details                                            |
|-----------|-------|-------------------------------------------------- |
|name       |string |Name that will show up in the sub menu.           |
|parent     |string |Identifier of the side menu item under wich this page resides|
|weight     |int    |For the order of menu items, lower is more on top  |

## Versioning
1. Go to the pages where you want subversioning on.
```
-api
--test1.md
--test2.md
```
2. Create subfolders for every version, and put copies of the files in them. **Every version subfolder should start with the letter v and an integer (v1.0.0, v23.43.bla)**
```
-api
--v1.0.0
---test1.md
---test2.md
--v2.0.0
---test1.md
---test2.md
```

3. Add them to the sidemenu like you would do with a normal file. **Don't forget to give every page a unique id and different weight. Weight will determain position in the dropdown menu**


##### Example:
**api/v1.0.0/test1.md**
```
menu:
    main: 
        name: "Test01"
        parent: "unique-sub-identifier"
        identifier: 'test01-v1' #Different from v2.0.0
        weight: 20 #Different from v2.0.0
```
**api/v2.0.0/test1/md**
```
menu:
    main: 
        name: "Test02"
        parent: "unique-sub-identifier"
        identifier: 'test01-v2' #Different from v1.0.0
        weight: 30 #Different from v1.0.0
```

## Adding Redirects for old content

This is done by adding the old URL (the one you want to redirect) as an alias to the new destination page.

##### Example:
```
date: 2016-09-13T09:00:00+00:00
title: Artifacts
menu:
    main:
        parent: "Using Vamp"
        weight: 10
aliases:
    - /using-vamp/
```


