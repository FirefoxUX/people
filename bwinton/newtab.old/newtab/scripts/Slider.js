/**
 * The object that controls the sliding frames
 */


;(function(){

  /* define the object */
  var Slider = function(NewTab, apps_data){

    /*
    DATA
     */

    /* number of pixels the slider div is currently shifted by */

    this.submods = {
      panels: []
    };

    this.parent = NewTab;
    // this.$drag_src;
    this.data = {
      current_panel: 0, /* the number of the currently view panel */
      current_shift: 0, /* the current shift amount in positive pixels */
      apps_data: apps_data, /* JSONic data about the apps on the slider */
      transition_on: false
    };

    this.init();

    /* 
    EVENTS
    */

    /* window resize */
    this.$els.window.resize(function(e) {
      this.remove_transition();
      this.fix_size();
    }.bind(this));

    /* click prev button */
    this.$els.prev_button.click(function() {
      this.prev();
    }.bind(this));

    /* click next button */
    this.$els.next_button.click(function() {
      this.next();
    }.bind(this));

    this.$els.window.on("keydown", function(e){
      var keyCode = e.keyCode;
      /* only slide if not in search box */
      switch(keyCode){
        case 39: /* right */
          if($(e.target).attr("id") !== "searchText"){
            this.next();
            e.preventDefault();
          }
          break;
        case 37: /* left */
          if($(e.target).attr("id") !== "searchText"){
            this.prev();
            e.preventDefault();
          }
          break;
      }
    }.bind(this));


  };

  Slider.prototype = {
    
    /*
    Main functions
     */

    init: function(){
      /* hide prev button */
      $("#prev_button").hide();

      /* find elements */
      this.$els = {
        prev_button: $("#prev_button"),
        next_button: $("#next_button"),
        slider_div: $("#slider_div"),
        header: $("#header"),
        footer: $("#footer"),
        window: $(window)
      };

      this.create_panels(this.data.apps_data);

      /* hide next button if needed */
      if(this.submods.panels.length < 2) $("#next_button").hide();

      /* init sizes */
      this.fix_size();

    },

    /* create panel objects for each panel
    on the page */
    create_panels: function(){
      $.each(this.data.apps_data, function(i, panel_data){
        /* creae div */
        var $panel_div = $("<div>").addClass('slider_panel')
        .append(
          $("<div>").addClass("app_group")
        );

        this.$els.slider_div.append($panel_div);
        /* create Panel object and push it into submods */
        this.submods.panels.push(
          new Panel(this, $panel_div, panel_data)
        );
      }.bind(this));

      /* create a jquery object containing all panels */
      this.$els.panel_divs = $('.slider_panel');
      this.$els.app_group_divs = $('.app_group');

    },

    /*
    Secondary functions
     */

    /* go to prev panel */
    prev: function(){
      if(this.data.current_panel<=0) return;
      this.data.current_panel--;

      this.add_transition();
      this.do_shift();

      /* manage buttons */
      this.$els.next_button.show();
      if(this.data.current_panel === 0) this.$els.prev_button.hide();
    },

    /* go to next panel */
    next: function(){
      // alert("next");
      if(this.data.current_panel >= this.submods.panels.length - 1) return;
      this.data.current_panel++;

      this.add_transition();
      this.do_shift();

      /* manage buttons */
      this.$els.prev_button.show();
      if(this.data.current_panel === this.submods.panels.length - 1) this.$els.next_button.hide();
    },

    /* looks at the current shift amount and updates
    the css to reflect this */
    do_shift: function(is_resize){
      this.data.current_shift = this.data.current_panel * $(window).innerWidth();
      var transTime;
      this.$els.slider_div.css({
        "transform": "translate3d(-"+this.data.current_shift+"px,0,0)"
      });
    },

    // todo: delete this
    fix_size: function(){
      /* fix width for each panel */
      var width = $(window).innerWidth();
      this.$els.panel_divs.css("width", width);

      /* fix app_group width (slightly less than panel) */
      var app_group_width = width - 100;
      this.$els.app_group_divs.css("width", app_group_width);

      /* shift the slider to accomodate new sizes */
      this.do_shift(true);
    },

    /* removes the panel slide transition */
    remove_transition: function(){
      // if(this.data.transition_on === false) return;

      this.data.transition_on = false;
      this.$els.slider_div.css("transition","");

    },

    /* adds the panel slide transition */
    add_transition: function(){
      // if(this.data.transition_on === true) return;

      this.data.transition_on = true;
      this.$els.slider_div.css("transition","transform 250ms ease-in-out");
    }

  };

  /*
  Helpers
   */

  function move_container($c1, $c2){
    /* make sure theres a target */
    if(!$c2) return;

    /* if target is after source */

    if($c1.index() > $c2.index())
      $c2.before($c1.clone(true, true));
    else
      $c2.after($c1.clone(true, true));

    $c1.remove();
  }

  /* export */
  window.Slider = Slider;

})();