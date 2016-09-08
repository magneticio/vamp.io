$(document).ready(documentReady);

var menuTree = {};

function documentReady() {
  getMenuFile(menuFileLoaded);
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
  //Set in localstorage
  menuTree = data;

  var pathname = window.location.pathname;
  var pathnameTrimmed = pathname.substring(1, pathname.length-1);
  path = pathnameTrimmed.split('/')[0];
  if (path && path !== '') {
    generateTopMenu(data);
    generateSideMenu(localStorage.getItem("vamp-mainSelected"));

    var track = [];

    console.log(track);
  }
}

function generateTopMenu(data) {
  var menuOrder = data.menuOrder;
  var menuItems = data.menuItems;

  menuOrder.forEach(function(orderItem) {
    var menuItem = menuItems[orderItem];
    var html = $.parseHTML('<a href="/' + menuItem.href + '" class="top-menu-item">' + menuItem.text + '</a>');
    $(html).data('menuId', orderItem);
    if(orderItem === localStorage.getItem('vamp-mainSelected')) {
      $(html).addClass('active');
    }

    $('#top-menu-items').append(html);
  });

};

function generateSideMenu(id) {
  console.log(id);
  console.log(menuTree.menuItems[id]);
  var subItems = menuTree.menuItems[id].items;
  if(!subItems) {
    return;
  }


  for (var subItemId in subItems) {
    var subItem = subItems[subItemId];
    var sideMenuItem = generateSideMenuItem(subItem.text, subItem.href, subItem);
    $(sideMenuItem).data('menuId', subItemId);

    $('#side-menu').append(sideMenuItem);
  }

}

function generateSideMenuItem(text, href, subItem) {
  var htmlString = '<div class="menu-item"> <div class="section"> <div class="bullet"> <img src="../img/icons/003-Small-icons/block-03.svg" alt=""> </div> <div class="section-title"> <a href="/'+href+'" class="text">'+text+'</a> </div> <div class="folding-indicator"> - </div> </div> </div>';
  for(var subSubItemName in subItem.items) {
    var subSubItem = subItem.items[subSubItemName];
    htmlString += '<a class="sub-menu-item text" href="/'+ subSubItem.href+ '">'+subSubItem.text+'</a>';
  }

  var parsedItem = $.parseHTML(htmlString);
  return parsedItem;
}


