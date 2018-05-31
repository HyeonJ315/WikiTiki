
module.exports = function()
{
    "use strict";
    let self = {};
    self.ROOTDIR      = __dirname
    self.CLIENTDIR    = self.ROOTDIR   + "/_Client/"
    self.COMPONENTDIR = self.CLIENTDIR + "/_component"
    self.SERVERDIR    = self.ROOTDIR   + "/_Server"
    self.SERVERPORT   = 1337;

    self.MONGO_COLLECTION = "Articles"
    self.MONGOURL  = "mongodb://54.149.49.22"
    self.MONGOPORT = "27017"
    self.MONGODB   = "WikiTiki"
    self.MONGO_COMPLETEURL = self.MONGOURL + ":" + self.MONGOPORT
    return self; 
}();