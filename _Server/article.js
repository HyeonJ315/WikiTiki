const config = require( "../Config.js" )
const striptags = require( 'striptags' )
const REQUEST_TYPE =
{
    READ : 0,
    SEARCH : 1,
}

// obtain the application
const application = global.application

// obtain the mongo client
const mongoClient = global.mongoClient

// region Send CSS, HTML and Javascript.

application.get( '/article', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "article/article.html" )
})
application.get( '*/article.css', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "article/article.css" )
})
application.get( '*/article.js', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "article/article.js"   )
})

// endregion

// region Get the contents of an article

application.get( '/article/read', ( request, response ) =>
{
    var title = request.query.title
    if( title == null || title == undefined || title == "" )
    {
        response.status(400).send( "400: Bad Request" )
        return
    }

    // Find the article.
    mongoClient.collection( config.MONGO_COLLECTION ).find( { "Title": title } )
        .toArray( function( error, document ) 
    {   var body = {}
        if( error ) { response.status( 500 ).send( "500: Internal Database Error." ) }
        if( document.length == 0 )
        { response.status(200).send( {} ) }
        else
        {
            body[title] = document[0].Content
            response.status(200).send( body )
        }
    })
})

// endregion

// region Search for a list of articles matching a search query

const READ_MAX = 256 + 64
application.get( '/article/search', ( request, response ) =>
{
    var search = request.query.search
    if( search == null || search == undefined || search == "" )
        response.status(400).send( "400: Bad Request" )

    // search for a match in either content or title.
    mongoClient.collection( config.MONGO_COLLECTION ).find( 
    { 
        $or: [
            { "Content": { $regex: ".*" + search + "*.", $options: "i" } },
            { "Title"  : { $regex: ".*" + search + "*.", $options: "i" } }
        ]
    }) 
    .toArray( function( error, document )
    {
        var body = {}
        if( error ) { response.status( 500 ).send( "500: Internal Database Error." ) }
        if( document.length == 0 ) { response.status(200).send() }
        else
        {
            document.forEach( function( e ) 
            { 
                body[ e.Title ] = striptags( e.Content, [], " " ).substring(0,READ_MAX) 
            })
            response.status(200).send( body )
        }
    })
})

// endregion
