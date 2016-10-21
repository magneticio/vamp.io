'use strict';
const dirTree = require('directory-tree');
const fs = require('fs');
const lunr = require('lunr');
const removeMd = require('remove-markdown');


//Get content map
const tree = dirTree('./content');

const base = './themes/vamp-theme/static/';

//Prototypes
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };


var allDocuments = [];
transverseTree(tree.children);
setIds(allDocuments);
writeFile('pages.json', base, JSON.stringify(allDocuments));
var searchIndex = buildIndex(allDocuments);
writeFile('searchIndex.json', base, JSON.stringify(searchIndex));

function transverseTree(tree) {
  tree.forEach(treeItem => {
    if(isDirectory(treeItem)) {
      transverseTree(treeItem.children);
    } else {
      var fileContent = readFile('./' + treeItem.path);
      var thePath = removeContentFromUri(treeItem.path);
      thePath = removeExtentionFromUri(thePath, treeItem.extension);      
      thePath = removeIndex(thePath);

      let aDocument = {
        path: thePath
      }

      Object.assign(aDocument, parseContent(fileContent));
      if(!aDocument.path.contains('news') && !aDocument.path.contains('draft')) {
        allDocuments.push(aDocument);
      }
    }
  });
}

function setIds(data) {
  data.forEach((dataPoint, i) => {
    dataPoint.id = i;
  });
}

function buildIndex(data) {
  var idx = lunr(function () {
    this.ref('id')

    this.field('title', { boost: 10 })
    this.field('path', { boost: 20})
    this.field('content')
  })

  data.forEach(function (page) {
      idx.add(page)
  })

  return idx;
}

function removeContentFromUri(uri) {
  if(uri.substring(0, 7) === 'content') {
    return uri.substring(7, uri.length);
  } else {    
    return uri;
  }
}

function removeExtentionFromUri(uri, extension) {
    return uri.substring(0, uri.length - extension.length);
}

function isDirectory(obj) {
  return obj.children ? true : false;
}

function removeIndex(path) {
  if(path.substring(path.length-5, path.length) === 'index') {
    return path.substring(0, path.length - 5)
  } else {
    return path
  }
}

function parseContent(content) {
  let parsedContent = {};
  //split on three dashes and newline
  let contentSplitted = content.split('---\n');
  if(contentSplitted[1] && contentSplitted[2]) {
    let dataBar = newLinesToJsObject(contentSplitted[1]);
    let contentBar = contentSplitted.slice(2).join();
    Object.assign(parsedContent, dataBar);
    Object.assign(parsedContent, {content: removeMd(contentBar)});
  } else {
    parsedContent = {title: '', date: '', content: content};
  }

  return parsedContent;
}

function newLinesToJsObject(text) {
  let endObject = {};

  let lines = text.split('\n');
  lines.forEach(function(line) {
    let key = line.substr(0,line.indexOf(':'));
    let value = line.substr(line.indexOf(' ')+1);
    if(key) { endObject[key] = value };
  });

  return endObject;
}

function readFile(path) {
  return fs.readFileSync(path, 'utf8');
}
function writeFile(name, path, data) {
  fs.writeFile(path + name, data, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log(name + ' file was saved!');
  }); 
}


