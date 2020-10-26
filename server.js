const express = require('express');
const bodyParser     = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const proxy = require('express-http-proxy');
var wsProxy = require('http-proxy-middleware');
const app = express();
const path = require('path');
const port = process.env.PORT || 9000;
const server = require('http').Server(app);

app.use(express.static(__dirname + '/app/'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// for http external request, not necessary for https request
app.use('/proxy', proxy('http://www.idref.fr'));
app.use('/sudoc', proxy('http://www.sudoc.fr'));
//Important : proxy to allow bolt (websockets) connection from browser, doesn't work if no proxy
/*app.use(
    '/wsproxy',
    wsProxy({ target: 'bolt://localhost:7687', ws: true })
  );*/

//app.use(express.static('./api/third'));
app.use('/api/third',  express.static(__dirname + '/api/third'));
var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

server.listen(port, function() {
    console.log("App running on port " + port);
})