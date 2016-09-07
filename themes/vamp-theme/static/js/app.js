$(document).ready(documentReady);

function documentReady() {
  getMenuFile(menuFileLoaded);
}

function getMenuFile(callback) {
  $.getJSON( '/menu.json', function(data) {
    callback(data);
  });
}

function menuFileLoaded(data) {
  var pathname = window.location.pathname;
  var pathnameTrimmed = pathname.substring(1, pathname.length-1);
  path = pathnameTrimmed.split('/')[0];
  if (path && path !== '') {
    setActive(data, path);
    generateTopMenu(data, path);
    generateSideMenu(data, path);
  }
}

function generateTopMenu(data, path) {
  console.log(data);
  data.forEach(function(topMenuItem) {
    var html = $.parseHTML('<a class="top-menu-item" href="/' + topMenuItem.href+ '">' + topMenuItem.text + '</a>');

    if(isPath(topMenuItem, path) || (topMenuItem.items && childrenHasPath(topMenuItem.items, path))) {
      topMenuItem.active = true;
      $(html).addClass('active');
    }
    $('#top-menu-items').append(html);
  });
}

function setActive(data, path) {
  console.log(childrenHasPath(data, path));
}

function isPath(data, path) {
  return data.href === path;
}

function childrenHasPath(data, path) {
  for (var i = 0; i < data.length; i++) {
    var child = data[i];
    if(child.href === path) {
      return true;
    } else {
      if(child.items && childrenHasPath(child.items, path)) {
        return true;
      }
    }
  }
  return false;
}

function generateSideMenu(data) {

  var menuItem = _.find(data, {active: true});

  if(menuItem && menuItem.items) {
    menuItem.items.forEach(function (subItem) {
      var sideMenuItem = generateSideMenuItem(subItem.text, subItem.href);
      isPath(data, path) && $(sideMenuItem).addClass('active');
      $('#side-menu').append(sideMenuItem);
    });
  }
}



function generateSideMenuItem(text, href) {
  var htmlString = '<div class="menu-item"> <div class="section"> <div class="bullet"> <img src="../img/icons/003-Small-icons/block-03.svg" alt=""> </div> <div class="section-title"> <a href="/'+href+'" class="text">'+text+'</a> </div> <div class="folding-indicator"> - </div> </div> </div>';
  var parsedItem = $.parseHTML(htmlString);
  return parsedItem;
}