$(document).ready( function() { articleMain()

    // region Article webpage initialization.

    function articleMain()
    {
        // obtain the query from the url
        var query = getQuery()
        if( query == null ) return;

        // mux depending on the query values
        if     ( query["title"]  ) requestArticle( query["title"] )
        else if( query["search"] ) requestSearchResult( query["search"] )
    }

    function getQuery()
    {
        var queryString  = window.location.search.substring(1)
        if( queryString == undefined || queryString == null ) return null
        var pairs = queryString.split( "&" )
        var pQuery = {}
        pairs.forEach( e => {
            var tmp = e.split("=")
            pQuery[ tmp[0] ] = tmp[1]
        });
        return pQuery
    }

    // endregion

    // region Request an article

    function requestArticle( title )
    {
        // send ajax request to obtain the article
        $.ajax({
            url: "/article/read?title="+title,
            method: "GET",
            success: onArticleReadSuccess,
            error: onArticleReadError,
        })
    }
    
    function onArticleReadError( jqXHR, status, error )
    {
        console.log( status )
        console.log( error )
    }
    
    function onArticleReadSuccess( data, status, jqXHR )
    {
        $( "#article-search-results" ).hide()

        $( "#article-main-header"  ).remove()
        $( '#article-border'       ).remove()
        $( "#article-main-content" ).remove()
        for( var key in data ) { if( data.hasOwnProperty(key) ) {
            var value = data[key]
            $( "#article-main-read" ).append(
                "<h4 id='article-main-header'>"+key+"</h4>                                                      \n" +
                "<hr id='article-border' style='height:2px;border:none;color:#333;background-color:#333;'></hr> \n" + 
                "<p id='article-main-content'>"+value+"</p>                                                     \n" 
            )
        }}
        $( "#article-main-read" ).show()
    }

    // endregion

    // region Request a search result

    function requestSearchResult( search )
    {
        // send ajax request to obtain the search results
        $.ajax({
            url: "/article/search?search="+search,
            method: "GET",
            success: onArticleSearchSuccess,
            error: onArticleSearchError,
        })
    }

    function onArticleSearchError( jqXHR, status, error )
    {
        console.log( status )
        console.log( error )
    }
    
    function onArticleSearchSuccess( data, status, jqXHR )
    {
        // hide the read article.
        $( "#article-main-read" ).hide()

        // write the new entries.
        $( ".article-search-item" ).remove()
        for( var key in data ) { if( data.hasOwnProperty(key) ) {
            var value = data[key]
            // strip html
            value = jQuery( "<p>" + value + "</p>" ).text()
            $( "#article-search-results" ).append(
                "<li class='list-group-item article-search-item' id="+key+"> \n" + 
                "   <a href='/article?title="+key+"'>"+key+"</a>             \n" +
                "   <p>"+value+"</p>                                         \n" +
                "</li>                                                       \n" 
            )
        }}
        // show the search result.
        $( "#article-search-results" ).show()
    }

    // endregion

})