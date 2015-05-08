var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic('./dist')).listen(8080);
