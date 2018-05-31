$(document).ready( function() { editorMain()

    var currentTitle = ""
    var tmpContent   = ""

    const STATUS_EDIT = "Status: Edit Article"
    const STATUS_NEW  = "Status: New Article"

    // region Main initialization region

    function editorMain()
    {
        // set up the default min height of the froala editor
        jQuery( '#froala-editor' ).froalaEditor( { heightMin: 450 } )

        // add the enter key input listener for the article title modifier
        jQuery("#article-title").on('keyup', function (e) {
            if (e.keyCode == 13) { onTitleChange() } } );

        // Add the event listeners to the article buttons and inputs
        jQuery("#article-title").blur( onTitleChange )
        jQuery("#article-submit").on( "click", onArticleSubmit )
        jQuery("#article-delete").on( "click", onArticleDelete )
        
        // obtain the query from the url
        var query = getQuery()
        if( query == null ) return;

        // mux depending on the query values
        if( query["title"]  ) requestArticle( query["title"] )
    }

    function requestArticle( title )
    {
        // send ajax request to submit the article
        jQuery.ajax(
            {
                url: "/editor/verify?title="+title,
                method: "GET",
                success: function( data, status, jqXHR  )
                {
                    if   ( data == "" ) $( "#editor-state" )[0].innerHTML = STATUS_NEW
                    else                $( "#editor-state" )[0].innerHTML = STATUS_EDIT

                    jQuery( "#article-title" )[0].value = title
                    jQuery( 'div#froala-editor').froalaEditor( 'html.set', data )
                },
                error: function( jqXHR, status, error )
                {
                    jQuery('div#froala-editor').froalaEditor( 'html.set', "" )
                },
            }
        )
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

    // region Article Title and State Management

    // Upon changing a title, verify with the server if there exists an article.
    function onTitleChange()
    {
        var modifiedTitle = $( "#article-title" )[0].value
        if( currentTitle == modifiedTitle ) return
        currentTitle = modifiedTitle
        if( currentTitle == "" )
            visualState( STATUS_NEW )
        else( onArticleVerify( currentTitle ) )
    }

    // notify whether an article exists or not.
    function onArticleVerify( title )
    {
        // send ajax request to submit the article
        jQuery.ajax(
            {
                url: "/editor/verify?title="+title,
                method: "GET",
                success: function( data, status, jqXHR  ) 
                { 
                    if( data == "" ) visualState( STATUS_NEW, "" )
                    else visualState( STATUS_EDIT, data )
                    
                },
                error:   function( jqXHR, status, error ) { visualState( STATUS_EDIT, data ) },
            }
        )
    }

    // simple visual notification for now.
    function visualState( newState, content )
    {
        // save content into a global variable
        tmpContent = content

        // resolve jQuery conflicts.
        jQuery.noConflict()
        
        // Change the editor state on the webpage
        $( "#editor-state" )[0].innerHTML = newState

        // Change the string values to fit the required modal text.
        if( newState == STATUS_EDIT )
        {
            editModalHeader ( "Editing Existing Article" )
            editModalContent( "Would you like to <b>LOAD</b> the existing article?" )
            onModalYes = editorModalLoad
        }
        else if( newState == STATUS_NEW )
        {
            editModalHeader ( "Creating New Article" )
            editModalContent( "Would you like to <b>CLEAR</b> your current article?" )
            onModalYes = editorModalClear

            var content = jQuery('div#froala-editor').froalaEditor('html.get')
            content = jQuery( content ).html( content ).text()
            if( content === "" ) return
        }
        else
        {
            editModalHeader ( "Unknown Error" )
            editModalContent( "" )
            onModalYes = editorModalNo
        }
        onModalNo = editorModalNo

        showModal()
    }

    var editorModalLoad = function()
    {
        jQuery('div#froala-editor').froalaEditor('html.set', tmpContent )
        hideModal()
    }

    var editorModalClear = function()
    {
        jQuery('div#froala-editor').froalaEditor('html.set', "" )
        hideModal()
    }

    var editorModalNo = function()
    {
        hideModal()
    }

    // endregion

    // region Article Submit

    // Upon pressing the submiting button for the article, do this.
    function onArticleSubmit()
    {
        // grab the text in the title and the content
        var title = document.getElementById('article-title').value
        var content = jQuery('div#froala-editor').froalaEditor('html.get')

        // Check the input values
        if( typeof title != 'string' || title == "" ) { 
            onArticleSubmitError( "Title is either empty or invalid." ) 
            return 
        }
        if( typeof content != 'string' || content == "" ) { 
            onArticleSubmitError( "Content is either empty of invalid" ); 
            return 
        }
        
        // Submit the article.
        requestArticleSubmit( title, content )
        return false
    } 

    function requestArticleSubmit( title, content )
    {
        // send ajax request to submit the article
        jQuery.ajax(
            {
                url: "/editor/submit?title="+title,
                data: { "Content": content },
                datatype: "html",
                method: "PUT",
                success: onArticleSubmitSuccess,
                error: onArticleSubmitError,
            }
        )
    }
    
    // Perform error handling here.
    function onArticleSubmitError( jqXHR, status, error )
    {
        //console.log( error )
        //console.log( xhttp )
    }

    // switch webpage here.
    function onArticleSubmitSuccess( data, status, jqXHR )
    {  
        window.location.href = data;
    }

    // endregion

    // region Article Delete

    function onArticleDelete()
    {
        var title = document.getElementById('article-title').value

        // Check the input values
        if( typeof title != 'string' || title == "" ) { 
            onArticleSubmitError( "Title is either empty or invalid." ) 
            return 
        }

        requestArticleDelete( title )
        return false
    }

    function requestArticleDelete( title )
    {
        // send ajax request to submit the article
        jQuery.ajax(
            {
                url: "/editor/delete?title="+title,
                method: "DELETE",
                success: onArticleDeleteSuccess,
                error: onArticleDeleteError,
            }
        )
    }

    // Perform error handling here.
    function onArticleDeleteError( jqXHR, status, error )
    {
        //console.log( status )
        //console.log( error  )
    }

    // switch webpage here.
    function onArticleDeleteSuccess( data, status, jqXHR )
    {  
        console.log( status )
        console.log( data   )
    }

    // endregion
})