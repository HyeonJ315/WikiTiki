//Constants and config
const config     = require( __dirname + '/Config.js' )
const http       = require( 'http'        )
const express    = require( 'express'     )
const bodyParser = require( 'body-parser' )
const path       = require( 'path'        )
const glob       = require( 'glob'        )

// Set up the http handler
global.application = express()
application.use( bodyParser.json() )
application.use( bodyParser.urlencoded( { extended: false } ) )

// Setup the mongodb connection
const mongoClient = require('mongodb').MongoClient;

mongoClient.connect ( config.MONGO_COMPLETEURL, { useNewUrlParser: true }, function(error, client)
{ 
    if( error !== null ) { mongoConnectionFailed( error ) }
    else { mongoConnectionSuccess( client ) }
})

// Die with console log.
function mongoConnectionFailed( error )
{
    global.mongoClient = null
    console.log( "Unable to connect to mongo server. Could not start nodejs." )
}

// Setup the nodejs Server
function mongoConnectionSuccess( client )   
{
    // Allow global access to the mongo client
    global.mongoClient = client.db( config.MONGODB )

    // setup the server
    const server = http.createServer( global.application )
    server.listen( config.SERVERPORT, () => 
    { 
        includeServerScripts()
        console.log( 'Server is listening on port: ' + config.SERVERPORT ) 
    })
}

// Include all scripts related to the server
function includeServerScripts()
{
    glob.sync( './_Server/**/*.js' ).forEach( function( file ) 
    { require( path.resolve( file ) ); } );
}