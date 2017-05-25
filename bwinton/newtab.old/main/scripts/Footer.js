;(function(){
  var Footer = function(){

    /* go to customizer on click */
    $('#settings').on('click', function(e){
      // e.preventDefault();
      // e.stopPropagation();
      // document.location.href = 'about:newtab-config';
      interesting('page-switch', 'newtab-config');
    });
  };

  /* export */
  window.Footer = Footer;

})();