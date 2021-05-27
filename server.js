//launch with npm run start, or npm run start:dev for nodemon autoreload
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

const app = express();
const path = require('path');
//const port = process.env.PORT || 9000;
const port = process.env.APP_PORT

/*used to generate automatically the first swagger Json file, see the doc here 
const expressOasGenerator = require('express-oas-generator');
expressOasGenerator.init(app, {});
*/

/*Standard way to serve Swagger, here the route is declared in app/routes/routes.js
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
*/

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use('/', swaggerUi.serve); 

// app files
app.use(express.static(__dirname + '/app/'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//serve widget as a static js
app.use('/api/widget',  express.static(__dirname + '/widget/widget.js'));

//api routing
var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

//public routing 
var public_routes = require('./app/routes/routes')
public_routes(app)

app.listen(port, function() {
    console.log("App running on port " + port);
})