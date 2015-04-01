# grunt-asset-cachebuster

> Cachebust images, scripts and other assets in your HTML & CSS files.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-asset-cachebuster --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-asset-cachebuster');
```

## The `asset_cachebuster` task

### Overview
In your project's Gruntfile, add a section named `asset_cachebuster` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  asset_cachebuster: {
    options: {
      buster: Date.now(),
      ignore: [],
      htmlExtension: 'html'
    },
    your_target: {
      // Target-specific file lists and/or options go here.
      // make sure you have separate file lists for your CSS and HTML files
    }
  }
})
```

### Options

#### options.buster
Type: `String | Function`
Default value: `'123456'`

A string value that is used to append to the url of your assets.
If it is a function, the function is called with the url and the extension of a file to cachebust as parameters, and it must return a string.
Generally, you want this to be a timestamp or the version number of your app.

#### options.htmlExtension
Type: `String`
Default value: `'html'`

The extension of html assets. This is useful if you use a templating language
for your html where you want to cachebust assets, i.e. `'handlebars'`

#### options.ignore
Type: `Array`
Default value: `[]`

Array of strings that if found in the url are **not** busted. This is useful if
you have some assets on CDNs or in a particular folder that are never changed
and hence should not be cachebusted.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  asset_cachebuster: {
    options: {},
    build: {
      files: {
        'dest/default_options.css': ['src/testing.css'],
        'dest/default_options.html': ['src/testing.html']
      }
    }
  }
})
```

In this example, the default options are used to cachebust html and css files.
So if the `testing.css` or `testing.html` files have content such as 

```css
h1 {
  background-image: url('testing.png');
}
```
or
```html
<script src="testing.js"></src>
<link href="testing.css" rel="stylesheet">
<img src="testing.png">
```
the generated result would be

```css
h1 {
  background-image: url('testing.png?v=123456');
}
```
or
```html
<script src="testing.js?v=123456"></src>
<link href="testing.css?v=123456" rel="stylesheet">
<img src="testing.png?v=123456">
```


#### Custom Options
```js
grunt.initConfig({
  asset_cachebuster: {
    options: {
      buster: '0.1.0',
      ignore: [
        '//my.cdn.example.com'
      ],
      htmlExtension: 'htm'
    },
    build: {
      files: {
        'dest/default_options.css': ['src/testing.css'],
        'dest/default_options.htm': ['src/testing.htm']
      }
    }
  }
})
```

In this example, custom options are used to cachebust htm and css files. URLs
that contain `//my.cdn.example.com` are *not* cachebusted.
So if the `testing.css` or `testing.htm` files have content such as 

```css
h1 {
  background-image: url('testing.png');
}
h2 {
  background-image: url('//my.cdn.example.com/testing.png');
}
```
or
```html
<script src="testing.js"></src>
<script src="//my.cdn.example.com/testing.js"></src>
<link href="testing.css" rel="stylesheet">
<img src="testing.png">
```
the generated result would be

```css
h1 {
  background-image: url('testing.png?v=0.1.0');
}
h2 {
  background-image: url('//my.cdn.example.com/testing.png');
}
```
or
```html
<script src="testing.js?v=0.1.0"></src>
<script src="//my.cdn.example.com/testing.js"></src>
<link href="testing.css?v=0.1.0" rel="stylesheet">
<img src="testing.png?v=0.1.0">
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 * 2014-05-01   v0.3.1   fix: images in HTML other than png were not busted
 * 2014-01-08   v0.3.0   allow a function as a buster. Contributed by @tleruitte
 * 2013-12-01   v0.2.0   add support for ignoring urls based on strings
 * 2013-11-07   v0.1.1   fix documentation
 * 2013-10-07   v0.1.0   initial release
