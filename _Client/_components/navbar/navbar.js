$(document).ready( function() { navbarMain()

    function navbarMain()
    {
        // Add the key input listener for the article search
        jQuery( "#navbar-search-input" ).on( 'keyup', function(e) {
            if( e.keyCode == 13 && jQuery("#navbar-search-input").is(":focus") ) 
            { 
                onNavbarSearch( document.getElementById("navbar-search-input").value ) 
            } 
            return false
        })

        // Add the search button input listener for the article search
        jQuery( "#navbar-search-button" ).on( 'click', function() 
        {
            onNavbarSearch( document.getElementById("navbar-search-input").value ) 
            return false
        })
    }

    function onNavbarSearch( search )
    {
        if( search == "" ) return
        window.location.href = "/article?search="+search;
    }
})