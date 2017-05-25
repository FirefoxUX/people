/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true, esnext:true */

/*global loadSnippets:true, CustomEvent: true */

"use strict";

const WEATHER_URL = 'http://openweathermap.org/data/2.1/find/city?lat={LAT}&lon={LON}&cnt=1&callback=?';
const GOOGLE_IMAGE = 'data:image/png;base64,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';

$(function () {

  /* When we click on things in the middle, open them up in this window. */
  $('#middle').on('click', 'history, site', function site_click(e) {
    var url = $(this).attr('url');
    if (url) {
      window.location = url;
    }
  });

  /* When we click on the disclosure arrow, hide the top sites. */
  $('#middle > .next').click(function (e) {
    $('#topsites').toggleClass('collapsed');
    $(this).toggleClass('collapsed');
    localStorage['expanded'] = $('#topsites').hasClass('collapsed') ? 'true' : 'false';
  });

  if (localStorage['expanded'] === 'true') {
    $('#middle > .next').click();
  }

  /* Handle the telemetry snippet. */
  $('#snippets').on('click', 'span[class^="telemetry-button-"]', function (event) {
    event.preventDefault();
    var type = $(this).attr('class').slice(17);
    var current = $(this).parents('div[class^="telemetry-note-"]').attr('class').slice(15);
    $(this).parents('div[class^="telemetry-note-"]').toggle();
    if (type === 'sure') {
      $('.telemetry-note-2').toggle();
      $('#telemetry-icon-1').hide();
      $('#telemetry-icon-2').show();
      localStorage['telemetry-prompted'] = 'sure';
    } else if (type === 'no') {
      $('.telemetry-note-3').toggle();
      $('#telemetry-icon-1').show();
      $('#telemetry-icon-2').hide();
      localStorage['telemetry-prompted'] = 'no';
    } else if (type === 'maybe') {
      $(this).parents('div[class^="telemetry-note-"]').toggle();
      window.open('https://www.mozilla.org/en-US/legal/privacy/firefox.html#telemetry');
    } else if (type === 'undo') {
      $('.telemetry-note-1').toggle();
      $('#telemetry-icon-1').show();
      $('#telemetry-icon-2').hide();
      delete localStorage['telemetry-prompted'];
    }

    interesting('telemetry', {'type': type, 'current': current});
  });

  /* Handle the search form. */
  $('#searchForm').submit(function onSearchSubmit(aEvent) {
    let searchTerms = document.getElementById('searchText').value;
    let searchURL = document.documentElement.getAttribute('searchEngineURL');
    if (searchURL && searchTerms.length > 0) {
      const SEARCH_TOKENS = {
        '_searchTerms_': encodeURIComponent(searchTerms)
      };
      for (let key in SEARCH_TOKENS) {
        searchURL = searchURL.replace(key, SEARCH_TOKENS[key]);
      }
      window.location.href = searchURL;
    }
    aEvent.preventDefault();
  });

  $('#clickjack').click(function () {
    toggleMenu();
  });

  var toggleMenu = function toggleMenu(engine) {
    logo.toggleClass('expanded');
    $('#searchEngineContainer').slideToggle();
    if (engine !== undefined) {
      setSearch(engine.data('engine'));
      interesting('searchChanged', engine.data('engine'));
    }
    $('#clickjack').toggle();
  };
  var logo = $('#searchEngineLogo');
  logo.click(function () {
    toggleMenu();
  });
  var engineElems = $('#searchEngines');
  engineElems.on('click', 'div.engine', function (e) {
    toggleMenu($(this));
  });

  /* Set the user's search engine. */
  var setSearch = function setSearch(defaultEngine, engines) {
    document.documentElement.setAttribute("searchEngineName", defaultEngine.name);
    document.documentElement.setAttribute("searchEngineURL", defaultEngine.searchURL);
    logo.attr('alt', defaultEngine.name);
    logo.attr('src', 'http://people.mozilla.com/~bwinton/newtab/images/SearchEngines/' + defaultEngine.image + '.png');
    if (engines !== undefined) {
      engineElems.empty();
      $.each(engines, function (i, engine) {
        var engineElem = $('<div class="engine">' +
          '<img alt="' + engine.name + '" src="http://people.mozilla.com/~bwinton/newtab/images/SearchEngines/' + engine.image +
          '.png">' + engine.name + '</div>\n');
        engineElem.data('engine', engine);
        engineElems.append(engineElem);
      });
      engineElems.append('<div class="manage engine">Manage Search Engines</div>');
    }
  };

  /* Set the default search engine. */
  setSearch({'name': 'Google', 'image': 'google', 'searchURL': 'https://www.google.com/search?q=_searchTerms_&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:unofficial&client=firefox-a&channel=np&source=hp'}, [
    {'name': 'Demo Google', 'image': 'google', 'searchURL': 'https://www.google.com/search?q=_searchTerms_&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:unofficial&client=firefox-a&channel=np&source=hp'},
    {'name': 'Demo Yahoo', 'image': 'yahoo', 'searchURL': 'http://search.yahoo.com/search?p=_searchTerms_&ei=UTF-8&fr='},
    {'name': 'Demo Bing', 'image': 'bing', 'searchURL': 'http://www.bing.com/search?q=_searchTerms_'},
    {'name': 'Demo Amazon.com', 'image': 'amazon', 'searchURL': 'http://www.amazon.com/exec/obidos/external-search/?field-keywords=_searchTerms_&mode=blended&tag=mozilla-20&sourceid=Mozilla-search'},
    {'name': 'Demo eBay', 'image': 'ebay', 'searchURL': 'http://rover.ebay.com/rover/1/711-47294-18009-3/4?mpre=http://shop.ebay.com/?_nkw=_searchTerms_'},
    {'name': 'Demo Twitter', 'image': 'twitter', 'searchURL': 'https://twitter.com/search?q=_searchTerms_&partner=Firefox&source=desktop-search'},
    {'name': 'Demo Wikipedia (en)', 'image': 'wikipedia', 'searchURL': 'http://en.wikipedia.org/wiki/Special:Search?search=_searchTerms_&sourceid=Mozilla-search'}
  ]);

  /* Handle the list of recently-viewed sites. */
  var addSites = function addSites(links) {
    //We can get the links here.
    var container = $('#topsites');
    container.children().not('h3').remove();
    for (var i = 0; i < 9; i++) {
      var site = '<site></site>';
      if (i < links.length) {
        site = '<site url="';
        site += links[i].url;
        if (links[i].img) {
          site += '" img="' + links[i].img;
        }
        site += '">' + (links[i].title || '') + '</site>';
      }
      container.append($(site));
    }
  };

  /* Add the default list of sites. */
  addSites([
    {'url': 'http://www.weatheroffice.gc.ca/city/pages/on-143_metric_e.html',
     'title': 'Toronto, Ontario - 7 Day Forecast',
     'img': 'aboutpixels'},
    {'url': 'https://bugzilla.mozilla.org/request.cgi?action=queue&requestee=bwinton@mozilla.com',
     'title': 'Request Queue',
     'img': 'chromaticpixel'},
    {'url': 'https://people.mozilla.com/~bwinton/australis/customization/mac/',
     'title': 'Home',
     'img': 'firefox'},
    {'url': 'https://mail.mozilla.com/zimbra/#1',
     'title': 'Zimbra: Inbox',
     'img': 'isitmfbt'},
    {'url': 'http://www.hulu.com/',
     'title': 'Hulu',
     'img': 'hulu'},
  ]);

  var addLinkList = function addLinkList(container, links) {
    container.children().remove();
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var site = '';
      if (link.type === 'tab' && link.url) {
        site += '<history url="';
        site += link.url;
        if (link.icon) {
          if (link.icon.startsWith('moz-anno:favicon:')) {
            link.icon = link.icon.substr(17);
          }
          site += '" img="' + link.icon;
        }
        site += '">' + link.title + '</history>';
      } else if (link.type === 'tab') {
        if (!link.title) {
          continue;
        }
        site += '<h3>' + link.title + '</h3>';
      } else {
        if (!link.clientName) {
          continue;
        }
        site += '<h3>' + link.clientName + '</h3>';
      }
      container.append($(site));
    }
  };

  /* Handle the list of tabs from other computers. */
  var addOtherTabs = function addOtherTabs(links) {
    addLinkList($('#tabsList > .scrollingContainer'), links);
  };

  /* Add the default list of tabs. */
  addOtherTabs([
    {'type': 'client', 'clientName': 'Demo Data…'},
    {'type': 'tab', 'title': 'Dropbox', 'url': 'https://www.dropbox.com/',
     'icon': 'https://www.dropbox.com/static/images/favicon-vfl7PByQm.ico'},
    {'type': 'tab', 'title': 'Yelp', 'url': 'http://yelp.com/'},
    {'type': 'tab', 'title': 'Amazon', 'url': 'http://amazon.com/'},
    {'type': 'tab', 'title': 'NPR', 'url': 'http://www.npr.org/'},
  ]);


  /* Handle the reading list. */
  var addReadingList = function addReadingList(links) {
    addLinkList($('#readingList > .scrollingContainer'), links);
  };

  /* Add the default reading list. */
  addReadingList([
    {'type': 'client', 'clientName': 'Demo Data…'},
    {'type': 'tab', 'title': 'Approaching git from svn | Pen and Pants',
     'url': 'http://penandpants.com/2013/02/13/approaching-git-from-svn/'},
    {'type': 'tab', 'title': 'Dropbox', 'url': 'https://www.dropbox.com/',
     'icon': 'https://www.dropbox.com/static/images/favicon-vfl7PByQm.ico'},
  ]);


  /* Handle the bookmarks. */
  var addBookmarks = function addBookmarks(links) {
    addLinkList($('#bookmarkList > .scrollingContainer'), links);
  };

  /* Add the default bookmarks. */
  addBookmarks([
    {'type': 'client', 'clientName': 'Demo Data…'},
    {'type': 'tab', 'title': 'Approaching git from svn | Pen and Pants',
     'url': 'http://penandpants.com/2013/02/13/approaching-git-from-svn/'},
    {'type': 'tab', 'title': 'Dropbox', 'url': 'https://www.dropbox.com/',
     'icon': 'https://www.dropbox.com/static/images/favicon-vfl7PByQm.ico'},
  ]);


  /* Handle the history. */
  var addHistory = function addHistory(links) {
    addLinkList($('#historyList > .scrollingContainer'), links);
  };

  /* Add the default history. */
  addHistory([
    {'type': 'client', 'clientName': 'Demo Data…'},
    {'type': 'tab', 'title': 'Approaching git from svn | Pen and Pants',
     'url': 'http://penandpants.com/2013/02/13/approaching-git-from-svn/'},
    {'type': 'tab', 'title': 'Dropbox', 'url': 'https://www.dropbox.com/',
     'icon': 'https://www.dropbox.com/static/images/favicon-vfl7PByQm.ico'},
  ]);

  /* Load the snippets. */
  loadSnippets();


  /* Handle the weather */
  function locationError(error) {
    switch (error.code) {
    case error.TIMEOUT:
      showError('A timeout occured! Please try again!');
      break;
    case error.POSITION_UNAVAILABLE:
      showError('We can’t detect your location. Sorry!');
      break;
    case error.PERMISSION_DENIED:
      showError('Please allow geolocation access for this to work.');
      break;
    case error.UNKNOWN_ERROR:
      showError('An unknown error occured!');
      break;
    }
  }

  function showError(msg) {
    $('#weather').addClass('error').text(msg);
  }

  function locationSuccess(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    $('#weather img').attr('src', '');
    $('#weather .temperature').text('Getting weather for…');
    $('#weather .city').text(lat.toFixed(2) + ', ' + lon.toFixed(1));
    $.getJSON(WEATHER_URL.replace('{LAT}', lat).replace('{LON}', lon), function (data) {
      var city = data.list[0];
      $('#weather .temperature').text((city.main.temp - 273.15).toFixed(1) + 'ºC');
      $('#weather .city').text(city.name);
      $('#weather img').attr('src', 'http://openweathermap.org/img/w/' + city.weather[0].icon + '.png')
                       .attr('title', city.weather[0].description);
    });
  }

  if ($('#weather').length) {
    /* Load the default weather. */
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
  }


  /* Send a message to the add-on. */
  var interesting = function (type, detail) {
    var event = new CustomEvent('tpemit', {'detail': {'type': type, 'detail': detail}});
    document.dispatchEvent(event);
  };

  /* Receive a message from the add-on. */
  window.addEventListener('message', function (event) {
    var data = event.data;
    if (data.type === 'sites') {
      addSites(data.sites);
    } else if (data.type === 'tabs') {
      addOtherTabs(data.tabs);
    } else if (data.type === 'readinglist') {
      addReadingList(data.list);
    } else if (data.type === 'bookmarklist') {
      addBookmarks(data.list);
    } else if (data.type === 'historylist') {
      addHistory(data.list);
    } else if (data.type === 'geolocation') {
      locationSuccess(data.position);
    } else if (data.type === 'search') {
      setSearch(data.defaultEngine, data.engines);
    }
  }, false);

  /* And let the add-on know that we're done initializing. */
  interesting('initialized');
});