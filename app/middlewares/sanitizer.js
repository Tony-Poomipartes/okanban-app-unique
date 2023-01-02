const sanitizeHtml = require('sanitize-html');

function sanitize(obj) {
  // for in permet d'itérer sur les propriétés d'un objet
  for (const prop in obj){    
    obj[prop] = sanitizeHtml(obj[prop], { allowedTags: []});
  }  

  // si notre objet est :
  /*
  {
    test: 'valeur1',
    tost: 'valeur2',
  }

  Au premier tour de boucle, prop vaudra test et obj[prop] vaudra valeur1,
  Au second tour de boucle, prop vaudra tost et obj[prop] vaudra valeur2,

  Ainsi, obj['tost'] donne valeur2.
  */
}

// on prépare un middleware qui va nettoyer toute les propriérés de body, params et query
// puis laisse la main à la suite
function sanitizeMiddleware (req, res, next){

  sanitize(req.query);
  sanitize(req.params);

  if (req.body){
    sanitize(req.body);
  }

  next();
}

module.exports = sanitizeMiddleware;