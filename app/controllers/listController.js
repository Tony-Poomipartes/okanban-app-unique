const { List } = require ('../models');

const listController = {
  getAll: async function(req, res){

    try{
      // on peut décider du code réponse à renvoyer et du corp de la réponse (ici en json):

      // on récupère les listes à partir du modèle sequelize
      
      // version 1 : on prend toutes les relations et les relations imbriquées
      // à manipuler avec précaution
      /*
      const lists = await List.findAll({
        include:  { all: true, nested: true }
      });
      */

      // version 2 - on prend juste ce qu'il nous faut : les cards et les tags !
      const lists = await List.findAll({
        include:  {
            association: 'cards',
            include: 'tags',
        },
        order: [
          'position',
          ['cards', 'position'],
          ['cards', 'tags', 'name'],
        ]
      });

      // ici, inutile de préciser le statut, c'est 200 par défaut et on veut renvoyer un statut 200 :
      res.json(lists);
      // équivalent à :
      // res.status(200).json(list);
    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }    
  },

  getOne: async function (req, res){

    try{

      // Plan d'action :
      // - prendre connaissance de l'id de la liste à récupérer
      // - récupérer la liste
      // - si la liste existe, on répond avec un code 200 et on donne la liste dans le corps de la réponse
      // - si la liste n'existe pas, on répond avec une 404.

      // - prendre connaissance de l'id de la liste à récupérer
      const listId = req.params.id;

      // - récupérer la liste
      const list = await List.findByPk(
        listId,
        {
          include:  {
              association: 'cards',
              include: 'tags',
          },
        },
      );

      // - si la liste existe, on répond avec un code 200 et on donne la liste dans le corps de la réponse
      if (list){
        res.json(list);
      }else{ // - si la liste n'existe pas, on répond avec une 404.
        const errorContent = {
          error: 'List not found. Please verify the provided id.'
        };
        
        res.status(404).json(errorContent);
      }
    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }   

  },

  delete: async function (req, res) {
    try{
      // on récupère depuis la route, l'id de la liste à supprimer
      const idToDelete = req.params.id;

      // on supprime la liste
      // destroy retourne le nombre d'éléments affectés (donc supprimés).
      const numberOfDeletedRow = await List.destroy({
        where: {
          id: idToDelete,
      }
      });

      // si aucune liste n'a été supprimée (ça veut dire qu'aucune liste avec cet id n'existait)
      if (numberOfDeletedRow === 0){
        // on renvoit une 404 pour indiquer qu'on nous a demander de supprimer une liste qui n'existait pas
        res.status(404).json({ "error": "List not found. Please verify the provided id." });      
      }else{
        // sinon, on indique que la suppression s'est bien supprimée
        res.status(204).json();
      }
    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  deleteAutreApproche: async function (req, res) {
    try{
      // on récupère depuis la route, l'id de la liste à supprimer
      const idToDelete = req.params.id;

      // - récupérer la liste
      const list = await List.findByPk(idToDelete);

      // - si la liste existe, on supprime la liste et répond avec un code 204 et un corp vide
      if (list){
        await list.destroy();
        res.status(204).json();
      }else{ // - si la liste n'existe pas, on répond avec une 404.
        res.status(404).json({ "error": "List not found. Please verify the provided id." });
      }

    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  create: async function (req, res){
    try{
      console.log(req);

      let { name, position } = req.body;

      // si on veut nettoyer un champ en particulier,
      // on pourrait utiliser la fonction sanitizeHtml sur notre champ !
      /*
      name = sanitizeHtml(name, {
        allowedTags: []});
      */

      if (name === undefined){
        return res.status(400).json({ "error": "Missing body parameter: name" });
      }

      if (position !== undefined){
        if (position === "" || isNaN(position)){
          return res.status(400).json({ "error": "Invalid type: position should be a number" });
        }
      }      
        
      const insertedList = await List.create({
        position: position,
        name: name,
      });

      console.log(insertedList);

      res.status(201).json(insertedList);
    } catch (error){
        
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  update: async function(req, res){
    try{
      // on récupère depuis la route, l'id de la liste à mettre à jour
      const idToUpdate = req.params.id;

      // - récupérer la liste
      const list = await List.findByPk(idToUpdate);

      // - si la liste existe
      if (list){

        // on extrait les infos reçues dans le corps de la requête
        const { name, position } = req.body;

        // on effectue les différents test sur nos données d'entrée

        // sur la position, si elle est définie, on vérifie que sa valeur est correcte
        if (position !== undefined){
          if (position === "" || isNaN(position)){
            return res.status(400).json({ "error": "Invalid type: position should be a number" });
          }
        }   

        // on exige la présence d'au moins name ou position
        if (position === undefined && name === undefined){
          return res.status(400).json({ "error": "Invalid body. Should provide at least a 'name' or 'position' property" });
        }

        // on met à jour notre modèle objet, champ position
        if (position){
          list.set('position', Number(position));
        }

        // on met à jour notre modèle objet, champ nom
        if (name){
          list.set('name', name);
        }

        // on enregistre effectivement dans la BDD les modifs
        await list.save();

        // on retourne une réponse en code 200 avec la liste à jour
        res.json(list);
        
      }else{ // - si la liste n'existe pas, on répond avec une 404.
        res.status(404).json({ "error": "List not found. Please verify the provided id." });
      }

    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },
};

module.exports = listController;