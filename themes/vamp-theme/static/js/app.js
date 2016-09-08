$(document).ready(documentReady);

var menuTree = {};
var topMenuItemTemplate;
var sideMenuItemTemplate;
var thePath;


function documentReady() {
  thePath = window.location.pathname;
  thePath = thePath.substring(1, thePath.length -1);
  console.log(thePath);

  $.get('/templates/topMenuItem.tpl', function(data) {
    topMenuItemTemplate = data;

    $.get('/templates/sideMenuItem.tpl', function(data) {
      sideMenuItemTemplate = data;
    });

    getMenuFile(menuFileLoaded);
  })



}




function getMenuFile(callback) {
  $.getJSON( '/menu.json', function(data) {
    callback(data);
  });


  $('#top-menu-items').on('click', 'a.top-menu-item', function(eventData) {
    var topMenuId = $(this).data().menuId;
    //Set in localstorage
    localStorage.setItem("vamp-mainSelected", topMenuId);
  });

  $('#side-menu').on('click', 'div.menu-item', function(eventData) {
    var sideMenuId = $(this).data().menuId;
    localStorage.setItem("vamp-sideSelected", sideMenuId);
  });
}


function menuFileLoaded(data) {
  //Building top menu
  data.children.forEach(function(topMenuItem) {
    if (topMenuItem.visible) {
      var html = Mustache.render(topMenuItemTemplate, topMenuItem);
      var renderedTopMenuItem = $.parseHTML(html);

      if(thePath.search(topMenuItem.path) !== -1) {
        $(renderedTopMenuItem).addClass('active');
        console.log(topMenuItem.children);
        topMenuItem.children && buildSideMenu(topMenuItem);
      }

      $('#top-menu-items').append(renderedTopMenuItem);
    }
  });
}

function buildSideMenu(data) {
  console.log(data);
  data.children.forEach(function(sideMenuItem) {
    if (sideMenuItem.visible) {
      var html = Mustache.render(sideMenuItemTemplate, sideMenuItem);
      var renderedSideMenuItem = $.parseHTML(html);
      $('#side-menu').append(renderedSideMenuItem);


      if(thePath.search(sideMenuItem.path) !== -1) {
        $(renderedSideMenuItem).addClass('active');
        sideMenuItem.children && buildSubSideMenu(sideMenuItem);
      }

    }
  })
}

function buildSubSideMenu(data) {
  console.log(data);
  console.log('test');
  data.children.forEach(function(subSideMenuItem) {
    if (subSideMenuItem.visible) {
      var html = Mustache.render('<a class="sub-menu-item" href="/{{path}}"><p class="text">{{text}}</p></a>', subSideMenuItem);
      var renderedSubSideMenuItem = $.parseHTML(html);

      if(thePath.search(subSideMenuItem.path) !== -1) {
        $(renderedSubSideMenuItem).addClass('active');
      }

      $('#side-menu').append(renderedSubSideMenuItem);
    }
  })
}





