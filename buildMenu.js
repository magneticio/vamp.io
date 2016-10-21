var url = './themes/vamp-theme/static/menu.json';
var fs = require('fs')
var path = require('path');
var dirTree = require('directory-tree');
var colors = require('colors');

console.log('Reading filetree'.magenta);
var tree = dirTree('content/', ['.md']);

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

console.log('Parsing filetree'.magenta);
parseTree(tree);
console.log('Parsing tree succeeded'.green);
console.log('Generating json file.'.magenta);
var data = JSON.stringify({children: tree.children}, null, 2);


fs.writeFile(url, data, function(err)  {
  if(err) return console.log(err.red);
  console.log(('menu.json has been generated at: ' + url.underline).green);
})

function parseTree(data) {
  data.children.forEach(function(child) {

    if(child.path) {
      //Replace spaces to -
      child.path = child.path.replace(/\s+/g, '-');
      //remove content/ from path
      //child.path = child.path.substring(child.path.indexOf("/") + 1);
      //Remove extention from file
      child.path = removeExtention(child.path);
    }

    if(child.name) {
      child.text = removeExtention(child.name).capitalizeFirstLetter();
      delete child.name;

    }

    delete child.size;
    delete child.extension;

    child.visible = child.text !== 'Index' && child.text !== 'Index.json';

    child.path && (child.path = child.path.substring(child.path.indexOf("/") + 1));

    child.children && parseTree(child);

  })
}

function removeExtention(string) {
  var temp = string.split('.');
  if (temp[temp.length - 1] === 'md') {
    temp.pop();
  }
  return temp.join('.');
}