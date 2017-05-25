/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, curly:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global self:true, addon:true, Backbone: true, _: true */

"use strict";

// we don't want the default sync methods, just display
Backbone.sync = function (method, model, options) {};

if (! window.nativeBrowser) {
  var nativeBrowser = {
    onClickSuggestion: function fake_onClickSuggestion(arg0, arg1) {
      console.log(arg0, arg1);
    },
    log: function fake_log(arg) {
      console.log(arg);
    },
    getHistory: function fake_getHistory() {
      return "";
    }
  };
}


var HistoryItem = Backbone.Model.extend({
});
var SuggestionItem = Backbone.Model.extend({
});

var HistoryList = Backbone.Collection.extend({
  model: HistoryItem
});

// history list data
var hl = new HistoryList();

var HistoryListView = Backbone.View.extend({
  template : _.template($("#history-template").html()),
  className : "results history",
  events : {
    "click li" : "onClickHistory"
  },
  initialize: function () {
    this.collection.on("reset", this.render, this);
  },
  render : function render() {
    $(this.el).empty();
    if (this.collection.models.length === 0) {
      $(this.el).text("No history available.");
    }
    _.each(this.collection.models, function (model) {
      $(this.el).append(this.template(model));
    }, this);
    return this;
  },
  onClickHistory : function onClickHistory(ev) {
    nativeBrowser.log("Got History!!!  " + $(ev.target).find("div.url").text());
    nativeBrowser.onClickHistory($(ev.target).find("div.url").text());
  }

});

var SuggestionItems = Backbone.Collection.extend({
  model: SuggestionItem
});

var SuggestionEngine = Backbone.Model.extend({
  idAttribute : "url",
  isDefault : function () {
    return (this.id.indexOf("google.com") >= 0);
  },
  initialize: function () {
    this.items = new SuggestionItems();
    this.items.on("reset", function () { this.trigger("reset"); }.bind(this), this);
  },
  // call this to reset the suggestions for this engine
  setSuggestions : function setSuggestions(suggestions) {
    // reduce suggestions to 1 if this isn't the default engine
    if (!this.isDefault()) {
      suggestions = [_.first(suggestions)];
    }
    this.items.reset(suggestions.map(function (item) {
      return new SuggestionItem({ value : item });
    }));
  }
});

var SuggestionList = Backbone.Collection.extend({
  model: SuggestionEngine,
  initialize: function () {
  },
  getDefaultEngine : function getDefaultEngine() {
    return _.find(this.models, function (engine) {
      return engine.isDefault();
    });
  },
  getEngineById : function getEngineById(id) {
    return _.find(this.models, function (engine) {
      return engine.id === id;
    });
  }
});

var SuggestionView = Backbone.View.extend({
  className : "media",
  initialize: function () {
    this.model.on("all", this.render, this);
  },
  events : {
    "click .item" : "onClickSuggestion"
  },
  render : function () {
    $(this.el).html(this.template(this.model));
    if (this.model.items.models.length === 0) {
      $(this.el).html("Waiting…");
    }
    return this;
  }
});
var SuggestionDefaultView = SuggestionView.extend({
  template : _.template($("#suggestion-default-template").html()),
  className : "suggestions defaults",
  tagName : "li",
  onClickSuggestion : function onClickSuggestion(ev) {
    nativeBrowser.onClickSuggestion(this.model.id, $(ev.target).text());
  }
});
var SuggestionEngineView = SuggestionView.extend({
  template : _.template($("#suggestion-engine-template").html()),
  onClickSuggestion : function onClickSuggestion(ev) {
    nativeBrowser.onClickSuggestion(this.model.id, this.model.items.models[0].get("value"));
  }
});

// suggestion engines with suggestions list data
// usage: sl.getEngineById('http://www.google.com/').setSuggestions(['bryan', 'clark']);
var sl = new SuggestionList();

var SuggestionListView = Backbone.View.extend({
  template : _.template($("#suggestion-others-template").html()),
  tagName : "li",
  className : "results",
  initialize: function () {
    this.collection.on("all", this.render, this);
  },
  render : function render() {
    $(this.el).empty();
    var def = this.collection.getDefaultEngine();
    if (def) {
      $(this.el).append((new SuggestionDefaultView({model: def})).render().el);
    }
    var others = $(this.template());
    $(this.el).append(others);
    _.each(this.collection.models, function (model) {
      if (!model.isDefault()) {
        $(others).append((new SuggestionEngineView({model: model})).render().el);
      }
    }, this);
    return this;
  }
});

window.onSuggestions = function (value) {
  var engine = value.engine,
      results = value.results,
      terms = value.terms;

  var suggestengine = sl.get(engine.siteURL);
  if (typeof suggestengine === "undefined") {
    suggestengine = sl.create({ url : engine.siteURL, favicon : engine.icon });
  }
  suggestengine.setSuggestions(results);
};

window.onHistoryChanged = function (herstory) {
  nativeBrowser.log("Got onHistoryChanged!!! ");
  _.each(herstory, function (stories) {
    _.each(stories, function (story, term) {
      hl.reset(story.map(function (item) { return new HistoryItem(item); }));
    });
  });
};

(function ($) {
    $.fn.disableSelection = function () {
        return this.attr('unselectable', 'on')
                   .css('user-select', 'none')
                   .on('selectstart', false);
      };
  }($)
);

$(document).ready(function () {
  var options = {};
  if (window.location.search) {
    try {
      options = JSON.parse(decodeURI(window.location.search.substr(1)));
    } catch (e) {
      nativeBrowser.log(e);
    }
  }
  nativeBrowser.log("Options = " + JSON.stringify(options));
  nativeBrowser.log(window.onHistoryChanged);

  $(".results").disableSelection();
  // sets up the suggestions list view
  var slv = new SuggestionListView({collection: sl, el: $(".results.search")});
  // sets up the history list view
  var hlv = new HistoryListView({collection: hl, el: $(".results.history")});

  if (options.testing) {
    // This is all for local testing
    sl.reset([
      new SuggestionEngine({ url: "http://www.google.com/", favicon: "http://g.etfv.co/http://www.google.com/" }),
      new SuggestionEngine({ url: "http://www.yelp.com/", favicon: "http://s3-media4.ak.yelpcdn.com/assets/2/www/img/1273e7149fc0/ico/favicon_multi.ico" }),
      new SuggestionEngine({ url: "http://www.amazon.com/", favicon: "http://g.etfv.co/http://www.amazon.com/" }),
      new SuggestionEngine({ url: "http://www.npr.org/", favicon: "http://g.etfv.co/http://www.npr.org/" }),
      new SuggestionEngine({ url: "http://en.wikipedia.com/", favicon: "http://g.etfv.co/http://en.wikipedia.com/" })
    ]);
    sl.each(function (engine, i) {
      if (engine.id === "http://www.google.com") {
        engine.setSuggestions(["news stories with", "long amounts", "of text that won't wrap"]);
      } else {
        engine.setSuggestions(["news stories with", "long amounts", "of text that won't wrap"].slice(i % 3));
      }
    });
    window.onSuggestions({engine: { siteURL: "https://www.google.com/", icon: "http://g.etfv.co/http://www.google.com/" },
                          terms: "news",
                          results: ["more news", "with and", "going stuff"]});
    window.onSuggestions({engine: {siteURL: "https://www.google.com/", icon: "http://g.etfv.co/http://www.google.com/" },
                          terms: "new",
                          results: ["news", "and", "stuff"]});
    hl.reset([
      new HistoryItem({ url: "https://www.dropbox.com/", favicon: "https://www.dropbox.com/static/images/favicon-vfl7PByQm.ico", "title": "Dropbox" }),
      new HistoryItem({ url: "http://www.yelp.com/", favicon: "http://g.etfv.co/http://www.cbc.ca/", "title": "Yelp" }),
      new HistoryItem({ url: "http://www.amazon.com/", favicon: "http://g.etfv.co/http://www.cnn.com/", "title": "Amazon" }),
      new HistoryItem({ url: "http://www.npr.org/", favicon: "http://g.etfv.co/http://www.npr.org/", "title": "NPR" })
    ]);
  } else {
    slv.render();
    hlv.render();
    window.onHistoryChanged(JSON.parse(nativeBrowser.getHistory()));
    nativeBrowser.log("BWINTON  - Done Rendering!!!");
  }

});