$(document).ready( function() { indexMain()

    function indexMain()
    {
        // Add the key input listener for the article search
        jQuery( "#index-search-input" ).on( 'keyup', function(e) {
            if( e.keyCode == 13 && jQuery("#index-search-input").is(":focus") ) 
            { 
                onIndexSearch( document.getElementById("index-search-input").value ) 
            } 
            return false
        })

        // Add the search button input listener for the article search
        jQuery( "#index-search-button" ).on( 'click', function() 
        {
            onIndexSearch( document.getElementById("index-search-input").value ) 
            return false
        })
    }

    function onIndexSearch( search )
    {
        if( search == "" ) return
        window.location.href = "/article?search="+search;
    }
})