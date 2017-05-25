;(function(){
    var Header = function(){

      /* 
      DATA
      */
      this.data = {
        searchProviders: [],
        searchProvider: undefined,
        expanded: false
      };

      this.init();


      /* 
      EVENTS
      */

      /* Handle the search form. */
      $('#searchForm').submit(searchSubmit.bind(this));

      /* click on search provider logo */
      $('#searchEngineLogo').click(this.toggleMenu.bind(this));

      /* retract menu if click anywhere else */
      $(document).on("click keydown", clickjack.bind(this));

    };

    Header.prototype = {
      init: function(){

        /* setup search providers */
        var searchProviders =  [
          {'name': 'Google', 'image': 'google_larger', 'searchURL': 'https://www.google.com/search?q=_searchTerms_&ie=utf-8&oe=utf-8&aq=t&rls=org.mozilla:en-US:unofficial&client=firefox-a&channel=np&source=hp'},
          {'name': 'Yahoo', 'image': 'yahoo', 'searchURL': 'http://search.yahoo.com/search?p=_searchTerms_&ei=UTF-8&fr='},
          {'name': 'Bing', 'image': 'bing', 'searchURL': 'http://www.bing.com/search?q=_searchTerms_'},
          {'name': 'Amazon.com', 'image': 'amazon', 'searchURL': 'http://www.amazon.com/exec/obidos/external-search/?field-keywords=_searchTerms_&mode=blended&tag=mozilla-20&sourceid=Mozilla-search'},
          {'name': 'eBay', 'image': 'ebay', 'searchURL': 'http://rover.ebay.com/rover/1/711-47294-18009-3/4?mpre=http://shop.ebay.com/?_nkw=_searchTerms_'},
          {'name': 'Twitter', 'image': 'twitter', 'searchURL': 'https://twitter.com/search?q=_searchTerms_&partner=Firefox&source=desktop-search'},
          {'name': 'Wikipedia (en)', 'image': 'wikipedia', 'searchURL': 'http://en.wikipedia.org/wiki/Special:Search?search=_searchTerms_&sourceid=Mozilla-search'}
        ];

        $.each(searchProviders, function(i, provider){
          this.addSearchProvider(provider);
        }.bind(this));

        this.setSearch(0); /* sets the search provider to Google */

        /* hide engines */
        $("#searchEngineContainer").hide();
      },

      /* sets the search provider */
      setSearch: function(index){
        /* index is an index into data.searchProviders */
        this.data.searchProvider = index;

        var searchProvider = this.data.searchProviders[index];
        var $logo = $("#searchEngineLogo");

        /* set logo etc */
        $logo.attr('alt', searchProvider.name + " Demo");
        $logo.attr('src', getRealImageLoc(searchProvider.image));

        interesting('searchChanged', searchProvider );

        /* set filler text in search input */

      },

      /* adds information about a search provider to the app */
      addSearchProvider: function(provider){
        /* add to data.searchProviders */
        this.data.searchProviders.push(provider);
        /* rerender search box */
        var providers = this.data.searchProviders;
        var $enginesContainer = $("#searchEngines").empty();
        $.each(providers, function(i, provider){
          $("<div>").addClass("engine").append(
            $("<img>")
            .attr("src", getRealImageLoc(provider.image))
            .attr("alt", provider.name + " Demo")
          )
          .click(function(e){
            this.setSearch(i);
            this.toggleMenu();
          }.bind(this))
          .appendTo($enginesContainer);
        }.bind(this));
      },

      toggleMenu: function(){
        this.data.expanded = !this.data.expanded;
        $("#searchEngineLogo").toggleClass("expanded");
        $("#searchEngineContainer").slideToggle({duration: 200});
      }

    };


    /* private helpers */

    function searchSubmit(aEvent) {
      var searchTerms = $("#searchText").val();
      var searchURL = this.data.searchProviders[this.data.searchProvider].searchURL;
      if (searchURL && searchTerms.length > 0) {
        var SEARCH_TOKENS = {
          '_searchTerms_': encodeURIComponent(searchTerms)
        };
        for (var key in SEARCH_TOKENS) {
          searchURL = searchURL.replace(key, SEARCH_TOKENS[key]);
        }
        window.location.href = searchURL;
      }
      aEvent.preventDefault();
    }

    function clickjack(e) {
        if( $(e.target).attr("id") !== "searchEngineLogo" &&
        this.data.expanded === true)
          this.toggleMenu();
    }

    function getRealImageLoc(imageName){
      return "/shared/images/SearchEngines/" +imageName+".png";
      // return "http://jackm321.github.io/newtab/images/SearchEngines/" +imageName+".png";
    }

    /* export */
    window.Header = Header;

})();