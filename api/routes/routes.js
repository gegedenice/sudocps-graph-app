'use strict';
const path = require('path')
module.exports = function(app) {
  var Unicas = require('../models/unicas.js');
  var Presselocale = require('../models/presselocale.js');

  //testing it's ok
  app.route('/test')
  .get(function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});
app.route('/widget')
.get(function(req, res) {
  res.sendFile(path.resolve("./api/third") + '/sudocps-unicabyrcr.js');

});
//for API
  app.route('/api/unicas')
  .get(Unicas.unicas);

    app.route('/api/rcr2unicas/:rcr')
  .get(Unicas.unicasByRcr);

  app.route('/api/titre2unicas/:title')
  .get(Unicas.unicasByTitle);

  app.route('/api/presselocale')
  .get(Presselocale.presselocale);

  app.route('/api/rcr2presselocale/:rcr')
  .get(Presselocale.presselocaleByRcr);

    };