/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true, esnext:true */

/*global xtag:true */

"use strict";

xtag.register("history", {
  onCreate: function () {
    var self = $(this);

    var icon = 'http://g.etfv.co/' + self.attr('url');
    if (self.attr('img')) {
      icon = self.attr('img');
    }

    self.html('<div class="media">' +
        '<div class="img"><img src="' +
          icon + '"></div>' +
        '<div class="bd">' +
            '<div class="title">' + self.text() + '</div>' +
            '<div class="url">' + self.attr('url') + '</div>' +
        '</div>' +
    '</div>');
  }
});

xtag.register("site", {
  onCreate: function () {
    var self = $(this);

    if (self.attr('url')) {
      var thumb = 'moz-page-thumb://thumbnail?url=' + encodeURIComponent(self.attr('url'));
      if (self.attr('img')) {
        thumb = self.attr('img');
        if (!thumb.contains(':')) {
          thumb = 'http://people.mozilla.com/~bwinton/newtab/images/' + thumb + '.png';
        }
      }
      var title = self.text();
      var titleAttr = self.text() + '\n' + self.attr('url');
      if (!self.text()) {
        title = self.attr('url');
        titleAttr = self.attr('url');
      }
      self.html('<div class="newtab-link"  ' +
          'style="background-image: url(' + thumb + ');"' +
          'title="' + titleAttr + '" ' +
          'href="' + self.attr('url') + '">' +
        '<div class="newtab-thumbnail"></div>' +
        '<div class="newtab-title">' + title + '</div>' +
      '</div>');
    } else {
      self.html('<div class="newtab-link blank">' +
        '<div class="newtab-thumbnail"></div>' +
        '<div class="newtab-title"></div>' +
      '</div>');
    }
  }
});
