// $(window).on('load', documentReady);
$(document).ready(function() {
  documentReady();
});

var thePath;


function documentReady() {
  thePath = window.location.pathname;
  setSideMenu();

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
    codeText = codeText.split('\'').join('&#39');
    codeText = codeText.split('"').join('&quot');
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

  //unsticky menu
  $(window).scroll(function () {
    var offsetTop = $('.footer').offset().top;
    var scrollBottom = $(window).scrollTop() + $(window).height();

    if(scrollBottom >= offsetTop) {
      $('#side-menu').css('position', 'absolute');
      $('#side-menu').css('bottom', '0');

    } else {
      $('#side-menu').css('position', 'fixed');
      $('#side-menu').css('bottom', '');
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


  //Dropdown functionality
  $('.dropdown').click(function () {
    $(this).toggleClass('dropdown__active');
  });

  $('#versions-dropdown .dropdown__item').click(function() {
    var goToUrl = $(this).data('url');
    console.log('goToUrl: ', goToUrl);
    window.location = goToUrl;
  })


  $('#mobile-menu li').click(function() {
    $(this).toggleClass('active');
    $(this).next('ul').toggleClass('show');
  });

  $('#mobile-header .hamburger').click(function() {
    $('#mobile-menu').toggleClass('show');
  });

}

// Set side menu 
function setSideMenu() {
  var firstPartUrl = thePath.split('/')[1];
  $('.side-menu-list').each(function () {
    var parentUrl = $(this).data('parenturl');
    var firstPartUrlMenu = parentUrl.split('/')[1];
    if (firstPartUrl === firstPartUrlMenu) {
      $(this).css('display', 'block');
    }
  });

  $('.top-menu-item').each(function () {
    var parentUrl = $(this).data('parenturl');
    var firstPartUrlMenu = parentUrl.split('/')[1];
    $(this).removeClass('active');
    if (firstPartUrl === firstPartUrlMenu) {
      $(this).addClass('active');
    }
  });

  var urlInfo = getInfoFromUrl(window.location.pathname);

  if (urlInfo) {
    $('.side-menu__sub__item__text').each(function (element) {
      var elementUrlInfo = getInfoFromUrl($(this).data('url'));
      var isCurrent = '';

      if (elementUrlInfo.version === urlInfo.version) {
        isCurrent = 'selected';
        $(this).css('display', 'block');
      }

      if (elementUrlInfo.pageName === urlInfo.pageName) {
        // $('#versions-dropdown .dropdown__items').append('<option value="' + $(this).attr('href') + '"'+isCurrent+'>' + elementUrlInfo.version + '</option>')
        $('#versions-dropdown .dropdown__items').append('<div data-url="' +$(this).attr('href')+ '" class="dropdown__item '+ isCurrent +'"><i class="fa fa-check" aria-hidden="true"></i>' + elementUrlInfo.version + '</div>');
        $('#versions-dropdown .dropdown__selected').html(urlInfo.version);
      }
    });

    $('#versions-dropdown').css('display', 'block');
  } else {
    $('.side-menu__sub__item__text').each(function () {
      $(this).css('display', 'block');
    });
  }


  function getInfoFromUrl(url) {
    var splittedUrl = url.split('/').slice(1,-1);
    var urlInfo =  {
      pageName: splittedUrl[splittedUrl.length-1],
      version: splittedUrl[splittedUrl.length-2]
    }

    return urlInfo && urlInfo.version &&  urlInfo.version.substring(0,1) === 'v' && !isNaN(urlInfo.version.substring(1,2)) ? urlInfo : false;
  }

}

// Search function
function buildSearch() {
  var self = this;
  self.theIndex = {};

  $.getJSON(theBaseUrl + 'pages.json', function (data) {
    self.pages = data;
    $.getJSON(theBaseUrl + 'searchIndex.json', function (indexData) {
      console.log(indexData);
      self.suggestionList = indexData.corpusTokens;
      self.theIndex = lunr.Index.load(indexData);
      onSearchPage();
    }, function(error){
      console.log(error);
    });
  }, function(error) {
    console.log(error);
  });


    var selectedSuggestionIndex = 0;
    var suggestions = [];


    //when key is pressed
    $('.search-bar__input input').keydown($.debounce(250, function(event) {
        if(event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 9) {
          return;
        }
        suggestions = [];
        selectedSuggestionIndex = 0;

        var currentValue = $(this).val();
        for (var i = 0; i < self.suggestionList.length;i++) {
          if(suggestions.length > 4) {
            break;
          }

          var possibleSuggestion = self.suggestionList[i];

          if(possibleSuggestion.indexOf(currentValue) == 0 && currentValue.length > 0) {
            suggestions.push(self.suggestionList[i]);
          }
        }

        if(suggestions.length > 0) {
            $('.suggestions').addClass('active');
        } else {
            $('.suggestions').removeClass('active');
        }

        $('.suggestions ul').empty();

        suggestions.forEach(function(suggestion, suggestionIndex) {
          var suggestionHtml = suggestion.slice(0, currentValue.length) + '<b>' + suggestion.slice(currentValue.length) + '</b>';

          activeString = '';
          if(suggestionIndex === selectedSuggestionIndex) {
            activeString = 'selected';
          }

          $('.suggestions ul').append('<li class="' +activeString+ '">' + suggestionHtml + '</li>');
        });
    }));




  //
  // $('.search-bar__input').keydown($.debounce(250, function( event ) {
  //   if ( event.which == 13 ) {
  //     event.preventDefault();
  //   }
  //   console.log();
  //   var searchResults = self.theIndex.search($(this).val());
  //   console.log(searchResults);
  //   $('.search-results ul').empty();
  //
  //
  //   for (var sri = 0; sri < searchResults.length; sri++) {
  //     if(searchResults[sri]) {
  //       var parsedResult = self.pages[searchResults[sri].ref];
  //       var goToUrl = theBaseUrl + ((parsedResult.path.split(' ').join('-')).substring(1, parsedResult.path.length));
  //       $('.search-results ul').append('<li><a href="' + goToUrl + '"><h2>' + parsedResult.title + '</h2><p class="url">' + parsedResult.path.split(' ').join('-') + '</p><p class="the-content">' + parsedResult.content + '</p></li>');
  //     }
  //   }
  //
  // }));

  
  $('.search-button').click(function(event) {
    $('.search-bar').toggleClass('active');
    $('.search-bar__input input').focus();
  });

  $('.search-bar__exit').click(function(event) {
    console.log('test');
    exitSearch(event);
  });


  //Key presses
  $('.search-bar__input input').keyup(function(e) {
      //escape key
      if (e.keyCode == 27) {
          exitSearch(e);
      }

      //enter key
      if (e.keyCode == 13) {
        // Get latest suggestion
          var selectedSuggestion = suggestions[selectedSuggestionIndex];
          if(selectedSuggestion) {
              window.location.href = '/search?s=' + selectedSuggestion;
          } else {
              window.location.href = '/search?s=' + $(this).val();
          }
      }

      //up arrow
      if (e.keyCode == 38) {
          selectPrevious();
      }

      //down arrow or tab
      if (e.keyCode == 40 || e.keyCode == 9) {
          selectNext();
      }
  });

  function selectNext() {
      selectedSuggestionIndex  = (selectedSuggestionIndex+1) % suggestions.length;
      setSelected(selectedSuggestionIndex);
  }

  function selectPrevious() {
      if(selectedSuggestionIndex === 0) {
        selectedSuggestionIndex = suggestions.length -1;
      } else {
          selectedSuggestionIndex  = (selectedSuggestionIndex-1) % suggestions.length;
      }

      setSelected(selectedSuggestionIndex);
  }

  function setSelected(index) {
    $('.suggestions ul li').each(function(i) {
      $(this).removeClass('selected');
      if(index === i) {
        $(this).addClass('selected');
      }
    });
  }


  function exitSearch(event) {
    event && event.preventDefault();
    event && event.stopPropagation();
    $('.search-bar__input input').val('');
    $('.search-bar__input input').focusout();
    $('.search-bar').toggleClass('active');
  }

  //Let's get all the url parameters
  var queries = {};
  $.each(document.location.search.substr(1).split('&'), function(c,q){
      var i = q.split('=');

      i[0] && i[1] && (queries[i[0].toString()] = i[1].toString());
  });



  function buildSearchItemHtml(title, path, content) {
      return '<div class=\"search-result-item\">\r\n<h2>' + title + '<\/h2>\r\n<p class=\"text\">'+ content +'<\/p>\r\n<a href=\"' + path + '" class=\"\">Read more &nbsp;<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"><\/i>\r\n<\/a>\r\n<\/div>'
  }

  function onSearchPage() {
      // If query string is there, try to search
      var searchText = queries['s'];
      if (searchText) {
          $('#searchtext').text(searchText);
          var searchResults = self.theIndex.search(searchText);
          searchResults.forEach(function(searchResult){
              var page = self.pages[searchResult.ref];
              page.path = page.path.replace(/\s+/g, '-');
              page.content = getTextSample(page.content, searchText);
              $('.search-result-items').append(buildSearchItemHtml(page.title, page.path, page.content));

          });

      }
  }

  function getTextSample(wholeText, word) {
    var splittedText = wholeText.split(word.toLowerCase());

    var returnText = wholeText.split(' ').slice(0, 40).join(' ');

    if(splittedText[0] && splittedText[1]) {
        var firstPart = splittedText[0].split(' ').slice(-20).join(' ');
        var lastPart = splittedText[1].split(' ').slice(0,20).join(' ');
        returnText = firstPart + '<b>' + word + '</b>' + lastPart;
    }
    return returnText;
  }


}






