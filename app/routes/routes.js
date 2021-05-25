module.exports = function(app) {

                  /*--------  Home & error page -------*/

  app.get('/', function(req, res, next) {
    res.render('index', {page:'Home', menuId:'home'});
  });

  app.get('/error', function(req, res, next) {
    res.render('error', {page:'Erreur', menuId:'error',message:"erreur"});
  });

                   /*--------  public app pages -------*/

  app.get('/unicas', function(req, res, next) {
    res.render('pages/unicas', {page:'Unicas', menuId:'unicas'});
  });
  app.get('/presselocale', function(req, res, next) {
    res.render('pages/presselocale', {page:'Presse locale ancienne', menuId:'presselocale'});
  });
  /*app.get('/record', function(req, res, next) {
    res.render('pages/record', {page:"Détail titre", menuId:'record',ppn: req.ppn});
  }); */
  app.get('/graphe', function(req, res, next) {
    res.render('pages/graphe', {page:'Visualiser les données en graphe', menuId:'graphe'});
  });
  app.get('/export', function(req, res, next) {
    res.render('pages/export', {page:'Exporter les données', menuId:'export'});
  });
  app.get('/documentation', function(req, res, next) {
    res.render('pages/documentation', {page:'Documentation pour les Centres du réseau', menuId:'documentation'});
  });
}
