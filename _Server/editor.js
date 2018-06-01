const config = require( "../Config.js" )

// obtain the application
const application = global.application

// obtain the mongo client
const mongoClient = global.mongoClient

// region GET: Initial Webpage HTML/CSS/Javascript Loading
application.get( '/editor', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "editor/editor.html" )
})
application.get( '*/editor.css', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "editor/editor.css"  )
})
application.get( '*/editor.js', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "editor/editor.js"  )
})

// endregion

// region GET: Get an article.

application.get( '/editor/verify', ( request, response ) =>
{   
    var title = request.query.title
    if( title  == undefined || title  == null ) response.status(400).send("Bad request.")
    else
    {   
        // Verify if the title exists in the mongodb or not.
        mongoClient.collection( config.MONGO_COLLECTION ).find( { "Title": title } )
            .toArray( function( error, document ) 
        {   
            if( document.length == 0 ) { response.status(200).send( "" ) }
            else response.status(200).send( document[0].Content )
        })
    }
})

// endregion

// region PUT: Attempt to place the requested article into mongoDB

application.put( '/editor/submit', ( request, response ) =>
{   
    // place the title and content into local variables
    var title   = request.query.title
    var content = request.body.Content

    // check the validity of the request.
    if( title   == undefined || title   == null || title   == "" ||
        content == undefined || content == null || content == "" )
    {   response.status(400).send('400: Bad Request.');
        return;
    }

    // Create the JSON to send to MongoDB 
    var uploadJSON = 
    {   "Title": title,
        "Content": content,
    }

    // Search for the JSON request
    mongoClient.collection( config.MONGO_COLLECTION )
        .find( { "Title": title } )
        .toArray( function( error, document ) 
    {   if( document.length == 0 ) 
            onNewArticle( response, uploadJSON )
        else 
            onEditArticle( response, uploadJSON )
    })
})

function onEditArticle( response, uploadJSON )
{
    var title = uploadJSON.Title
    var content = uploadJSON.Content
    mongoClient.collection( config.MONGO_COLLECTION ).update( 
        { "Title": title }, { "$set": { "Content": content } },
        function( error, result )
        {
            if( error ) response.status( 500 ).send( '500: Internal Database Error.' )
            else response.status( 200 ).send( '/article?title=' + uploadJSON.Title )
        } )
}

// Insert the article and send a response when finished.
function onNewArticle( response, uploadJSON )
{
    mongoClient.collection( config.MONGO_COLLECTION ).insertOne( uploadJSON, {}, function( error, result )
    {
        if( error ) response.status(500).send( '500: Internal Database Error.' )
        else response.status(200).send( '/article?title=' + uploadJSON.Title )
    })
}

// endregion

// region Attempt to delete the equested article from mongoDB

application.delete( '/editor/delete', ( request, response ) =>
{
    title = request.query.title
    
    // check the validity of the request.
    if( title   == undefined || title   == null || title == "" )
    {   response.status(400).send('400: Bad Request.');
        return;
    }

    mongoClient.collection( config.MONGO_COLLECTION ).remove(
        { "Title": title }, true, function( error, result )
        {
            if( error ) response.status( 500 ).send( '500: Internal Database Error.' )
            else response.status( 200 ).send( 'Success!' )
        }
    )
})