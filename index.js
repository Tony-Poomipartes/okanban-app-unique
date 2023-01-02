require("dotenv").config();
const cors = require('cors');
const express = require('express');
const sanitizerMiddleware = require ('./app/middlewares/sanitizer');
const multer  = require('multer');

const bodyParser = multer();

const app = express();

// le middleware cors permet de définir la politique CORS sur notre serveur
// par défaut, on autorise toutes les origines.
// app.use(cors());

// ici, j'autorise seulement les requête :
// - depuis une application sans domaine,
// - depuis le domaine http://localhost:5000,
app.use(cors());

app.use( bodyParser.none() );

// gestion de l'extraction du corps des requêtes
app.use(express.urlencoded({ extended: true }));

app.use(sanitizerMiddleware);

app.use(express.static('public'));

const router = require ("./app/router");

const PORT = process.env.PORT || 5000;


app.use(router);

app.listen(PORT, () => {
  console.log(`Okanban REST API listening on port ${PORT}`)
})