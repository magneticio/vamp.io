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
sideMenuItemTemplate += '     ';
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
    if ($(window).scrollTop() > 0 || thePath !== '/') {
      $("#header").addClass("active");
      $('#logo').attr('src', '/img/005-vamp/Logo/logo-long-colour.svg');

    } else {
      //remove the background property so it comes transparent again (defined in your css)
      $("#header").removeClass("active");
      $('#logo').attr('src', '/img/005-vamp/Logo/logo-long-white.svg');
    }
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

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
}

function getMenuFile(callback) {
  $.getJSON('/menu.json', function (data) {
    callback(data);
  });


  //unsticky menu
  $(window).scroll(function () {
    var offsetTop = $('.footer').offset().top;
    var scrollBottom = $(window).scrollTop() + $(window).height();

    if(scrollBottom >= offsetTop) {
      $('.menu').css('position', 'absolute');
      $('.menu').css('bottom', '0');

    } else {
      console.log('not-sticky');
      $('.menu').css('position', 'fixed');
      $('.menu').css('bottom', '');
    }
  });

  // Set target="_blank" on external links
  $(document.links).filter(function() {
    return this.hostname != window.location.hostname;
  }).attr('target', '_blank');

}


function menuFileLoaded(data) {
  //parents are set
  setParents([], data.children);

  // Find path
  findPath(data.children, thePath, function(allActive){
    allActive.forEach(function(oneActive) {
      oneActive.active = true;
    });
  });



  data.children.forEach(function (topMenuItem) {
      var html = Mustache.render(topMenuItemTemplate, topMenuItem);
      var renderedTopMenuItem = $.parseHTML(html);
      if(topMenuItem.active) {
        $(renderedTopMenuItem).addClass('active');
        topMenuItem.children && buildSideMenu(topMenuItem);
      }
      topMenuItem.visible && $('#top-menu-items').append(renderedTopMenuItem);
  });



  console.log(data);
}

function setParents(parents, data) {
  // console.log('parents: ', parents);
  // console.log('data: ', data);

  data.forEach(function(dataPoint) {
    dataPoint.parents = parents.slice();
    // console.log('dataPoint: ', dataPoint);
    if(dataPoint.children) {
      var withSelfParents = dataPoint.parents.slice();
      withSelfParents.push(dataPoint);
      // console.log(withSelfParents);
      setParents(withSelfParents, dataPoint.children);
    }
  });
}

function findPath(data, path, callback) {
  data.forEach(function(dataPoint) {
    if(dataPoint.path === path){
      var copiedArray = dataPoint.parents.slice();
      copiedArray.push(dataPoint);
      callback(copiedArray);
    }

    if(dataPoint.children) {
      findPath(dataPoint.children, path, callback);
    }
  });
}

function buildSideMenu(data) {
  data.children.forEach(function (sideMenuItem) {
      var html = Mustache.render(sideMenuItemTemplate, sideMenuItem);
      var renderedSideMenuItem = $.parseHTML(html);
      sideMenuItem.visible && $('#side-menu').append(renderedSideMenuItem);

      if(sideMenuItem.active) {
        $(renderedSideMenuItem).addClass('active');
        sideMenuItem.children && buildSubSideMenu(sideMenuItem);
      }
  })
}

function buildSubSideMenu(data) {
  console.log(data);
  console.log('test');
  data.children.forEach(function (subSideMenuItem) {
      var html = Mustache.render('<a class="sub-menu-item" href="/{{path}}"><p class="text">{{text}}</p></a>', subSideMenuItem);
      var renderedSubSideMenuItem = $.parseHTML(html);

      if (subSideMenuItem.active) {
        $(renderedSubSideMenuItem).addClass('active');
      }

      subSideMenuItem.visible && $('#side-menu').append(renderedSubSideMenuItem);
  })
}




