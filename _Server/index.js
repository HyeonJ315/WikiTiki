const config = require( "../Config.js" )

// obtain the application
const application = global.application

// region GET: Initial Webpage HTML/CSS/Javascript Loading

application.get( '/', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "index/index.html" )
})
application.get( '/index', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "index/index.html" )
})
application.get( '*/index.css', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "index/index.css"  )
})
application.get( '*/index.js', ( request, response ) =>
{   response.sendFile( config.CLIENTDIR + "index/index.js"   )
})

// endregion