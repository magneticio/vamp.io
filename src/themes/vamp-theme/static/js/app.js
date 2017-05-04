/* @flow */

// $(window).on('load', documentReady);
$(document).ready(function() {
  documentReady();
});

var thePath;


function documentReady() {
  thePath = window.location.pathname;
  setSideMenu();

  // Set anchors on all h2
  $('.documentation h2, h3, h4').each(function() {
    $(this).append('<a class="anchor-hover" href="'+ window.location.pathname +'#'+$(this).attr('id')+'"><i class="fa fa-link" aria-hidden="true"></i></a>');

  });



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

  // Create codeblocks when this code is present
  $('pre code').each(function(i, block) {
    var codeText = $(this).text();
    codeText = codeText.split('\'').join('&#39;');
    codeText = codeText.split('"').join('&quot;');

    hljs.highlightBlock(block);

    $(this).append('<button class="copy-button" data-clipboard-text="'+codeText+'"><p class="copy"><i class="fa fa-lg fa-paperclip" aria-hidden="true"></i>&nbsp;&nbsp;Copy</p><p class="copied"><i class="fa fa-lg fa-check" aria-hidden="true"></i>&nbsp;&nbsp;Copied to clipboard</p></button>');
    var heightOfCodeblock = $(this).height();
    if (heightOfCodeblock > 325) {
      $(this).height(365);
      $(this).css('overflow', 'hidden');
      $(this).append('<button class="expand-code-block-button"><p>Read more</p></button>');
    }
  });

  $('.expand-code-block-button').click(function() {
      if($(this).parent().height() > 446) {
        $(this).parent().height(365);
        $(this).find('p').text('Read More');
      } else {
        $(this).parent().height('');
        $(this).find('p').text('Collapse');
      }
  });

  new Clipboard('.copy-button');

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


  // Dropdown functionality
    $('html').click(function() {
        $('.dropdown').removeClass('dropdown__active');
    });

  $('.dropdown').click(function (e) {
    $(this).toggleClass('dropdown__active');
    e.stopPropagation();
  });

  $('#versions-dropdown .dropdown__item').click(function(e) {
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

    return urlInfo && urlInfo.version && (((urlInfo.version.substring(0,1) === 'v') && !isNaN(urlInfo.version.substring(1,2))) || urlInfo.version === 'katana') ? urlInfo : false;
  }

}

// Search function
function buildSearch() {
  var self = this;
  self.theIndex = {};

  $.getJSON(theBaseUrl + 'pages.json', function (data) {
    self.pages = data;
    self.ionList = createionsList(data);
    $.getJSON(theBaseUrl + 'searchIndex.json', function (indexData) {
      //self.ionList = indexData.corpusTokens;

      self.theIndex = lunr.Index.load(indexData);
      onSearchPage();
    }, function(error){
      console.log(error);
    });
  }, function(error) {
    console.log(error);
  });

  function isFirstChar(string, chars) {
    for(var i = 0; i < chars.length; i++) {
        var theChar = chars[i];
        if (string.charAt(0) === theChar || string.charAt(string.length - 1) === theChar || string.includes('--')) {
            return true;
        }
    }

    return false;
  }
  var keyValueWords = {};
  function createionsList(contentArray) {
      var keyValueWords = {};
      for (var i = 0; i < contentArray.length; i++){
        var theContent = contentArray[i].content;
        var theWords = theContent.split(' ');
        theWords.forEach(function(theWord) {
            var lowerCaseWord = theWord.toLowerCase();
            if(lowerCaseWord.length > 3 && isNaN(lowerCaseWord.charAt(0)) && !isFirstChar(lowerCaseWord, ['"', '#', '\'', '$', '%', '(', ')', '*', '-', '.', ',', ':', '.'])) {
                keyValueWords[lowerCaseWord] = lowerCaseWord;
            }
        });
      }

      return Object.keys(keyValueWords).map(function (key) {
          return keyValueWords[key];
      });
  }

    var selectedInlineResultIndex = -1;
    var inlineSearchResults = [];

    function buildInlineSearchItem(title, text, url) {
        return '<li><a href="'+url+'"><h3 class="title">'+title+'</h3><p class="text">'+text+'</p></a></li>'
    }


    //when key is pressed
    $('.search-bar__input input').keydown($.debounce(250, function(event) {
        if(event.keyCode == 27 || event.keyCode == 13 || event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 9) {
          return;
        }

        selectedInlineResultIndex = -1;
        var currentValue = $(this).val();

        //Find inline searchresults
        if(getSearchResults(currentValue).length > 0) {
            $('.inline-search-results').addClass('active');
            $('.inline-search-results ul').empty();
            inlineSearchResults = getSearchResults(currentValue).slice(0, 5);
            inlineSearchResults.forEach(function (searchResult) {
                var inlineItemHtml = buildInlineSearchItem(searchResult.title, searchResult.content, searchResult.path);
                $('.inline-search-results ul').append(inlineItemHtml);
            });
        } else {
            $('.inline-search-results').removeClass('active');
        }
    }));

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
          console.log(selectedInlineResultIndex);
          if(selectedInlineResultIndex < 0) {
              exitSearch(e);
          } else {
              selectedInlineResultIndex = -1;
              $('.inline-search-results ul li').each(function(i) {
                  $(this).removeClass('selected');
              });
          }
      }

      //enter key
      if (e.keyCode == 13) {
          if(selectedInlineResultIndex < 0) {
              window.location.href = '/search?s=' + $(this).val();
          } else {
              window.location.href = inlineSearchResults[selectedInlineResultIndex].path;
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
      selectedInlineResultIndex  = (selectedInlineResultIndex+1) % inlineSearchResults.length;
      setSelected(selectedInlineResultIndex);
  }

  function selectPrevious() {
      if(selectedInlineResultIndex === 0) {
        selectedInlineResultIndex = inlineSearchResults.length -1;
      } else {
          selectedInlineResultIndex  = (selectedInlineResultIndex-1) % inlineSearchResults.length;
      }

      setSelected(selectedInlineResultIndex);
  }

  function setSelected(index) {
    $('.inline-search-results ul li').each(function(i) {
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
    inlineSearchResults = [];
    $('.inline-search-results ul').empty();
    $('.search-bar').toggleClass('active');
  }

  //Let's get all the url parameters
  var queries = {};
  $.each(document.location.search.substr(1).split('&'), function(c,q){
      var i = q.split('=');

      i[0] && i[1] && (queries[i[0].toString()] = i[1].toString());
  });



  function buildSearchItemHtml(title, path, content) {
      return '<div class=\"search-result-item\">\r\n<h2>' + title + '<\/h2>\r\n<p class=\"path\">'+ path +'</p><p class=\"text\">'+ content +'<\/p>\r\n<a href=\"' + path + '" class=\"\">Read more &nbsp;<i class=\"fa fa-arrow-right\" aria-hidden=\"true\"><\/i>\r\n<\/a>\r\n<\/div>'
  }

  function onSearchPage() {
      // If query string is there, try to search
      var searchText = queries['s'];
      $('#searchtext').text(searchText);
      getSearchResults(searchText).forEach(function(searchResult) {
          $('.search-result-items').append(buildSearchItemHtml(searchResult.title, searchResult.path, searchResult.content));
      });
  }



  function getSearchResults(searchText) {
      var pageResults = [];
      if (searchText) {
          var searchResults = self.theIndex.search(searchText);
          searchResults.forEach(function(searchResult){
              var page = jQuery.extend(true, {}, self.pages[searchResult.ref]);
              page.path = page.path.replace(/\s+/g, '-');
              page.content = getTextSample(page.content, searchText);
              pageResults.push(page);
          });
      }

      return pageResults;
  }

  function getTextSample(wholeText, word) {
      // First get the subsets of the words.
      var subsetWord;


      for(var i = 0; i < word.length; i++) {
          // Get specific subset
          var subWord = word.substr(0, i + 1);
          // Look if this subset is present in the text
          var subsetPosition = wholeText.search(subWord);
          if(subsetPosition !== -1) {
              subsetWord = subWord;
          }
      }
      var splittedText = wholeText.split(subsetWord);
      var firstPart = splittedText[0].split(' ').slice(-20).join(' ');
      var lastPart = splittedText.slice(1).join(subsetWord).split(' ').slice(0, 20).join(' ');

      var whole = firstPart + '<b>' + subsetWord + '</b>' + lastPart;

    return whole;
  }
}






