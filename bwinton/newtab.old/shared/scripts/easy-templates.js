(function ( $ ) {
  $.fn.render = function(mods) {

    /* deep clone $new_el with data and events */
    var $new_el = this.clone(true, true);

    if(mods){
      switch(typeof(mods)){

        /* if mods is and object then apply modifications to 
        sub elements of the $new_el */
        case('object'):
          $.each(mods, function(selector, mod) {
            /* find the sub element referenced by the key */
            var $sub_el = find_sub($new_el, selector);
            /* apply the change based on the type of the mod */
            switch(typeof(mod)){
              case('function'):
                mod.call($sub_el.get(0), $sub_el.get(0));
                break;

              /* if mod is a number, string, function, etc then
              call the jQuery html function with mod as the arg */
              default:
                $sub_el.each(function(){$(this).html(mod);});

            }
          });
          break;

        /* replace all of the contents of the template by
        calling the jQuery html function */
        default:
          mods.call($new_el.get(0), $new_el.get(0));
      }
    }
    return $new_el;
  };

  /* helpers */

  /* find elements inside of the given element that match
  the query string or have a class with the same name
  as the query string */
  function find_sub($el, query){
    var $first_result;
    var $sub;

    /* check to see the query finds anything by itself */
    $first_result = $sub = $el.find(query);
    if($sub.length > 0) return $sub;

    /* try again by adding . before it */
    $sub = $el.find('.'+query);
    if($sub.length > 0) return $sub;

    return $first_result;

  }

}( jQuery ));