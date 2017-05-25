;(function(){
    var NewTab = function(){

      this.submods = {
        panels: []
      };
      this.data = {};

      this.init();

    };

    NewTab.prototype.init = function(){
        /* setup header and footer */
        this.submods.header = new Header();
        this.submods.footer = new Footer();

        /* listen for the apps_layout event */
        window.addEventListener('message', function (event){
          var data = event.data;
          console.log('data: ');
          console.log(data);
          if (data.type === 'apps') {
            this.submods.slider = new Slider(this, data.data);
          }
        });

        /* emit init event */
        interesting('initialized');

    };


    /* local helpers */

    /* Send a message to the add-on. */
    window.interesting = function interesting (type, detail) {
      var event = new CustomEvent('tpemit', {'detail': {'type': type, 'detail': detail}});
      // console.log("emit message:");
      // console.log(type, detail);
      document.dispatchEvent(event);
    };

    /* run */
    $(function(){
      new NewTab();
    });

})();