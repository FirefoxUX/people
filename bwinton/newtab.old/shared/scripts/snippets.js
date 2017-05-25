/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true, esnext:true */

/*global addon:true */

"use strict";

/* Code yoinked from chrome://browser/content/abouthome/aboutHome.js */

const DEFAULT_SNIPPETS_URLS = [
  "http://www.mozilla.com/firefox/features/?WT.mc_ID=default1",
  "https://addons.mozilla.org/firefox/?src=snippet&WT.mc_ID=default2"
];

const SNIPPETS_UPDATE_INTERVAL_MS = 86400000; // 1 Day.

var ls = {};
try {
  ls = localStorage["snippets-last-update"];
  ls = localStorage;
} catch (e) {
  console.log("Couldn't get localStorage, using fallback.\n");
}

function loadSnippets()
{
  // Check last snippets update.
  let lastUpdate = ls["snippets-last-update"];
  let updateURL = document.documentElement.getAttribute("snippetsURL");
  if (updateURL && (!lastUpdate ||
                    Date.now() - lastUpdate > SNIPPETS_UPDATE_INTERVAL_MS)) {
    // Try to update from network.
    let xhr = new XMLHttpRequest();
    try {
      xhr.open("GET", updateURL, true);
    } catch (ex) {
      showSnippets();
      return;
    }
    // Even if fetching should fail we don't want to spam the server, thus
    // set the last update time regardless its results.  Will retry tomorrow.
    ls["snippets-last-update"] = Date.now();
    xhr.onerror = function (event) {
      showSnippets();
    };
    xhr.onload = function (event)
    {
      if (xhr.status === 200) {
        ls["snippets"] = xhr.responseText;
      }
      showSnippets();
    };
    xhr.send(null);
  } else {
    showSnippets();
  }
}

function showSnippets()
{
  let snippetsElt = document.getElementById("snippets");
  let snippets = ls["snippets"];
  // If there are remotely fetched snippets, try to to show them.
  if (snippets) {
    // Injecting snippets can throw if they're invalid XML.
    try {
      snippetsElt.innerHTML = snippets;
      // Scripts injected by innerHTML are inactive, so we have to relocate them
      // through DOM manipulation to activate their contents.
      Array.forEach(snippetsElt.getElementsByTagName("script"), function (elt) {
        let relocatedScript = document.createElement("script");
        relocatedScript.type = "text/javascript;version=1.8";
        relocatedScript.text = elt.text;
        elt.parentNode.replaceChild(relocatedScript, elt);
      });

      // If we've already prompted the user, remove the telemetry snippet.
      if (ls['telemetry-prompted']) {
        $('#telemetry-icon-1').parent().parent().remove();
      }

      // Otherwise, put the buttons into a div of their own.
      var list = $(snippetsElt).find('div[class^="telemetry"]');
      list.append('<div class="buttons"></div>');
      list.each(function (i, e) {
        $(e).children('span').appendTo($(e).children('.buttons'));
      });

      return;
    } catch (ex) {
      // Bad content, continue to show default snippets.
    }
  }

  // Show default snippets otherwise.
  let defaultSnippetsElt = document.getElementById("defaultSnippets");
  let entries = defaultSnippetsElt.querySelectorAll("span");
  // Choose a random snippet.  Assume there is always at least one.
  let randIndex = Math.floor(Math.random() * entries.length);
  let entry = entries[randIndex];
  // Inject url in the eventual link.
  if (DEFAULT_SNIPPETS_URLS[randIndex]) {
    let links = entry.getElementsByTagName("a");
    // Default snippets can have only one link, otherwise something is messed
    // up in the translation.
    if (links.length === 1) {
      links[0].href = DEFAULT_SNIPPETS_URLS[randIndex];
    }
  }
  // Move the default snippet to the snippets element.
  snippetsElt.appendChild(entry);
}
