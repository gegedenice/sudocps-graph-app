'use strict';
const path = require('path')
module.exports = function(app) {
  var Unicas = require('../models/unicas.js');
  var Presselocale = require('../models/presselocale.js');
  var Middleware = require('../models/middleware.js');

  //testing it's ok
  app.route('/api/test')
  .get(function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

//for API
  app.route('/api/v1/unicas')
  .get(Unicas.unicas);

    app.route('/api/v1/unicas/rcr/:rcr')
  .get(Unicas.unicasByRcr);

  /*app.route('/api/v1/titre2unicas/:title')
  .get(Unicas.unicasByTitle);*/

  app.route('/api/v1/presselocale')
  .get(Presselocale.presselocale);

  app.route('/api/v1/presselocale/rcr/:rcr')
  .get(Presselocale.presselocaleByRcr);

  app.route('/api/v1/graphmiddleware')
  .post(Middleware.data2graph);

//for widget
app.route('/api/v1/widget')
.get(function(req, res) {
  res.sendFile(path.resolve("./api/widget") + '/widget.js');
});
};