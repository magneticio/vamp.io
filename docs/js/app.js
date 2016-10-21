$(window).on('load', documentReady);

var menuTree = {};
var topMenuItemTemplate;
var sideMenuItemTemplate;
var thePath;


//Side menu template
sideMenuItemTemplate = '';
sideMenuItemTemplate += '  <a href=\"'+theBaseUrl+'{{path}}/" class=\"side-menu-item\">';
sideMenuItemTemplate += '   <div class=\"bullet\">';
sideMenuItemTemplate += '    <img src=\"'+theBaseUrl+'img\/003-Small-icons\/block-03.svg\" alt=\"\">';
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
topMenuItemTemplate += '<a href=\"'+theBaseUrl+'{{path}}/\" id=\"top-menu-item-{{text}}\" class=\"top-menu-item\">{{text}}<\/a>';

function documentReady() {
  thePath = window.location.href.substring(theBaseUrl.length-1, window.location.href.length).split('#')[0];
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
    } else {
      //remove the background property so it comes transparent again (defined in your css)
      $("#header").removeClass("active");
    }
  }

  // Set mobile menu
  $('#menu-toggle').on('click', function (e) {
    $('.top-menu-items').toggleClass('open');
  });

  $('top-menu-item').on('click', function(e) {
    $('.top-menu-items').removeClass('open');
  });



  $('pre code').each(function(i, block) {
    var codeText = $(this).text();
    hljs.highlightBlock(block);

    $(this).append('<button class="copy-button" data-clipboard-text=\''+codeText+'\'><p class="copy"><i class="fa fa-lg fa-paperclip" aria-hidden="true"></i>&nbsp;&nbsp;Copy</p><p class="copied"><i class="fa fa-lg fa-check" aria-hidden="true"></i>&nbsp;&nbsp;Copied to clipboard</p></button>');
  });

  var client = new ZeroClipboard( $('.copy-button') );


  $('.copy-button').click(function() {
    var self = this;
    $(self).addClass('clicked');

    window.setTimeout(function () {
      $(self).removeClass('clicked');
    }, 5000);

  });



}

function getMenuFile(callback) {
  $.getJSON(theBaseUrl + '/menu.json', function (data) {
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
      $('.menu').css('position', 'fixed');
      $('.menu').css('bottom', '');
    }
  });

  // Set target="_blank" on external links
  $(document.links).filter(function() {
    return this.hostname != window.location.hostname;
  }).attr('target', '_blank');

  //check if emails are correct
  var inputfields = $('#mc-embedded-subscribe-form input');

  $('#mc-embedded-subscribe-form input').on('change paste keyup', function () {
    var emailValue = $(this).val();


    //
    if(isEmail(emailValue) && (emailValue !== '')) {
      $(this).parent().find('.button').removeClass('not-active');
    } else {
      $(this).parent().find('.button').addClass('not-active');
    }

  });

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  
  buildSearch();
}


function menuFileLoaded(data) {
  //Init slicknav

  buildMobileMenu(data);

  var slickNavConfig = {
    label: '',
    allowParentLinks: false,
    closedSymbol: '&#xf105;',
    openedSymbol: '&#xf107;',
    brand: '<a href="'+theBaseUrl+'/"><img id="logo" class="logo" src="'+theBaseUrl+'/img/005-vamp/Logo/logo-long-colour.svg" alt=""></a>'
  }

  $(function(){
    $('#mobile-menu').slicknav(slickNavConfig);
  });

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


  //build mobile menu

}

function buildMobileMenu(data) {
  data.children.forEach(function(menuItem) {
    var mobileListItemTop = createMobileListItem(menuItem.path, menuItem.text);

    var secondLevelUl = $.parseHTML('<ul></ul>');
    menuItem.children && menuItem.children.forEach(function(menuItemSecond) {
      if(menuItemSecond.visible) {
        var mobileSecondListItem = createMobileListItem(menuItemSecond.path, menuItemSecond.text);
        $(secondLevelUl).append(mobileSecondListItem);

        var thirdLevelUl = $.parseHTML('<ul></ul>');
        menuItemSecond.children && menuItemSecond.children.forEach(function (menuItemThird) {
          if(menuItemThird.visible) {
            var mobileThirdListItem = createMobileListItem(menuItemThird.path, menuItemThird.text);
            $(thirdLevelUl).append(mobileThirdListItem);
          }
        });
        menuItemSecond.children && $(mobileSecondListItem).append(thirdLevelUl);
        }
    });
    menuItem.children && $(mobileListItemTop).append(secondLevelUl);
    menuItem.visible && $('#mobile-menu').append(mobileListItemTop);
  });
}

function createMobileListItem(href, text) {
  var html = '<li><a href="'+theBaseUrl+href+'">'+text+'</a></li>';
  return $.parseHTML(html);
}



function setParents(parents, data) {
  //
  //

  data.forEach(function(dataPoint) {
    dataPoint.parents = parents.slice();
    //
    if(dataPoint.children) {
      var withSelfParents = dataPoint.parents.slice();
      withSelfParents.push(dataPoint);
      //
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
  data.children.forEach(function (subSideMenuItem) {
      var html = Mustache.render('<a class="sub-menu-item" href="'+theBaseUrl+'{{path}}/"><p class="text">{{text}}</p></a>', subSideMenuItem);
      var renderedSubSideMenuItem = $.parseHTML(html);

      if (subSideMenuItem.active) {
        $(renderedSubSideMenuItem).addClass('active');
      }

      subSideMenuItem.visible && $('#side-menu').append(renderedSubSideMenuItem);
  })
}

// Search function
function buildSearch() {
  var self = this;
  self.theIndex = {};

  $.getJSON(theBaseUrl + 'pages.json', function (data) {
    self.pages = data;
    $.getJSON(theBaseUrl + 'searchIndex.json', function (indexData) {
      self.theIndex = lunr.Index.load(indexData);
    }, function(error){
      console.log(error);
    });
  }, function(error) {
    console.log(error);
  });

  
  $('.search-bar__input').keydown($.debounce(250, function( event ) {
    if ( event.which == 13 ) {
      event.preventDefault();
    }
    console.log();
    var searchResults = self.theIndex.search($(this).val());
    console.log(searchResults);
    $('.search-results ul').empty();


    for (var sri = 0; sri < searchResults.length; sri++) {
      if(searchResults[sri]) {
        var parsedResult = self.pages[searchResults[sri].ref];
        var goToUrl = theBaseUrl + ((parsedResult.path.split(' ').join('-')).substring(1, parsedResult.path.length));
        $('.search-results ul').append('<li><a href="' + goToUrl + '"><h2>' + parsedResult.title + '</h2><p class="url">' + parsedResult.path.split(' ').join('-') + '</p><p class="the-content">' + parsedResult.content + '</p></li>');
      }
    }

  }));

  
  $('.search-button').click(function(event) {
    $('#search').toggleClass('active');
    $('.search-bar__input').focus();
    event.preventDefault();
    event.stopPropagation();
  });

  $('.search-bar__back').click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    exitSearch(event);
  });

  //escape key
  $('.search-bar__input').keyup(function(e) {
    //escape key
    if (e.keyCode == 27) {
      exitSearch(e);
    }
    //enter key
    if (e.keyCode == 13) {

    }
  
  });

  function exitSearch(event) {
    event && event.preventDefault();
    event && event.stopPropagation();
    $('.search-bar__input').val('');
    $('.search-bar__input').focusout();
    $('#search').toggleClass('active');

  }
}






