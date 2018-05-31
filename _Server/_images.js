const config = require( "../Config.js" )

// obtain the application
const application = global.application

// Send requested component.
application.get( '*/_images/*', ( request, response ) =>
{
    var tokenIndex = request.url.indexOf( "/" )

    // Check if the url is readable. if it isn't return not found.
    if( tokenIndex === -1 ) { response.status(404).send('404: Not found.'); return }

    var componentDir = config.CLIENTDIR + request.url.substring( tokenIndex + 1 )
    var questionIndex = componentDir.indexOf( "?" )

    // Check if there is a question mark if there is one, pop it out along with the rest
    if( questionIndex != -1 ) 
    { 
        componentDir = componentDir.substring(0,questionIndex) 
    }
    response.sendFile( componentDir )
})