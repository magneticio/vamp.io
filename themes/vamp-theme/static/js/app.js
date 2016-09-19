$(document).ready(documentReady);

var menuTree = {};
var topMenuItemTemplate;
var sideMenuItemTemplate;
var thePath;


//Side menu template
sideMenuItemTemplate = '';
sideMenuItemTemplate += '  <a href=\"\/{{path}}\" class=\"side-menu-item\">';
sideMenuItemTemplate += '   <div class=\"bullet\">';
sideMenuItemTemplate += '    <img src=\"\/img\/003-Small-icons\/block-03.svg\" alt=\"\">';
sideMenuItemTemplate += '   <\/div>';
sideMenuItemTemplate += '';
sideMenuItemTemplate += '   <div class=\"section-title\">';
sideMenuItemTemplate += '    <p class=\"text\">{{text}}<\/p>';
sideMenuItemTemplate += '   <\/div>';
sideMenuItemTemplate += '';
sideMenuItemTemplate += '   <div class=\"folding-indicator\">';
sideMenuItemTemplate += '     -';
sideMenuItemTemplate += '   <\/div>';
sideMenuItemTemplate += '  <\/a>';

//Top menu template
topMenuItemTemplate = '';
topMenuItemTemplate += '<a href=\"\/{{path}}\" id=\"top-menu-item-{{text}}\" class=\"top-menu-item\">{{text}}<\/a>';

function documentReady() {

  thePath = window.location.pathname;
  thePath = thePath.substring(1, thePath.length - 1);

  getMenuFile(menuFileLoaded);

  // Top menu color change
  $(window).on("scroll", function () {
    setColorMenu();
  });

  setColorMenu();
  function setColorMenu() {
    if ($(window).scrollTop() > 0) {
      $("#header").addClass("active");
      $('#logo').attr('src', '/img/005-vamp/Logo/logo-long-colour.svg');

    } else {
      //remove the background property so it comes transparent again (defined in your css)
      $("#header").removeClass("active");
      $('#logo').attr('src', '/img/005-vamp/Logo/logo-long-white.svg');
    }
  }

  if (thePath !== '/') {
    $("#header").addClass("always-active");
    $('.page').addClass('padding-fix');
  }


  //Set smoothscrolling

  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();

    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top - 100
    }, 350, 'swing', function () {
      // window.location.hash = target;
    });
  });

  // Set mobile menu
  $('#menu-toggle').on('click', function (e) {
    $('.top-menu-items').toggleClass('open');
  });

  $('top-menu-item').on('click', function(e) {
    $('.top-menu-items').removeClass('open');
  });

  // Set node icons

  $('.admonition').prepend('<div class="admonition-icon"><div class="admonition-icon-image"></div></div>');
}

function getMenuFile(callback) {
  $.getJSON('/menu.json', function (data) {
    callback(data);
  });


  $('#top-menu-items').on('click', 'a.top-menu-item', function (eventData) {
    var topMenuId = $(this).data().menuId;
    //Set in localstorage
    localStorage.setItem("vamp-mainSelected", topMenuId);
  });

  $('#side-menu').on('click', 'div.menu-item', function (eventData) {
    var sideMenuId = $(this).data().menuId;
    localStorage.setItem("vamp-sideSelected", sideMenuId);
  });

  // Set it all
  hljs.initHighlightingOnLoad();
}


function menuFileLoaded(data) {
  //Building top menu
  data.children.forEach(function (topMenuItem) {
    if (topMenuItem.visible) {
      var html = Mustache.render(topMenuItemTemplate, topMenuItem);
      var renderedTopMenuItem = $.parseHTML(html);

      if (thePath.search(topMenuItem.path) !== -1) {
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
  data.children.forEach(function (sideMenuItem) {
    if (sideMenuItem.visible) {
      var html = Mustache.render(sideMenuItemTemplate, sideMenuItem);
      var renderedSideMenuItem = $.parseHTML(html);
      $('#side-menu').append(renderedSideMenuItem);


      if (thePath.search(sideMenuItem.path) !== -1) {
        $(renderedSideMenuItem).addClass('active');
        sideMenuItem.children && buildSubSideMenu(sideMenuItem);
      }

    }
  })
}

function buildSubSideMenu(data) {
  console.log(data);
  console.log('test');
  data.children.forEach(function (subSideMenuItem) {
    if (subSideMenuItem.visible) {
      var html = Mustache.render('<a class="sub-menu-item" href="/{{path}}"><p class="text">{{text}}</p></a>', subSideMenuItem);
      var renderedSubSideMenuItem = $.parseHTML(html);

      if (thePath.search(subSideMenuItem.path) !== -1) {
        $(renderedSubSideMenuItem).addClass('active');
      }

      $('#side-menu').append(renderedSubSideMenuItem);
    }
  })
}




