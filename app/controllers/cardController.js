const { Card, List } = require ('../models');

const cardController = {
  getAll: async function(req, res){

    try{

      const cards = await Card.findAll({
        include: 'tags',
        order:  ['position'],
      });

      res.json(cards);
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
     
      const cardId = req.params.id;
      const card = await Card.findByPk(cardId, { include: 'tags' });

      if (card){
        res.json(card);
      }else{
        const errorContent = {
          error: 'Card not found. Please verify the provided id.'
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

      const idToDelete = req.params.id;
      const card = await Card.findByPk(idToDelete);
      
      if (card){
        await card.destroy();
        res.status(204).json();
      }else{
        res.status(404).json({ "error": "Card not found. Please verify the provided id." });
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
      let { content, position, color, list_id } = req.body;

      if (list_id === undefined){
        return res.status(400).json({ "error": "Missing body parameter: list_id" });
      }else{
        if (!await List.findByPk(list_id)){
          return res.status(400).json({ "error": "Should provide a valid list_id" });
        }
      }

      if (content === undefined){
        return res.status(400).json({ "error": "Missing body parameter: content" });
      }

      
      if (position !== undefined){
        if (position === "" || isNaN(position)){
          return res.status(400).json({ "error": "Invalid type: position should be a number" });
        }
      }
      
      // On ajoute une condition car sinon Number(position) nous génère un NaN qui fait planter Sequelize
      if(position === undefined) {
        position = null;
      }

      const insertedCard = await Card.create({
        list_id: Number(list_id),
        position: Number(position),
        content: content,
        color: color,
      });

      res.status(201).json(insertedCard);
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
      const idToUpdate = req.params.id;
      const card = await Card.findByPk(idToUpdate);

      if (card){

        const { content, position, color, list_id } = req.body;

        if (position !== undefined){
          if (position === "" || isNaN(position)){
            return res.status(400).json({ "error": "Invalid type: position should be a number" });
          }
        }   
        
        if (position === undefined && content === undefined && color === undefined){
          return res.status(400).json({ "error": "Invalid body. Should provide at least a 'content' or 'position' or 'color' property" });
        }

        if (position){
          card.set('position', Number(position));
        }
        if (content){
          card.set('content', content);
        }
        if (color){
          card.set('color', color);
        }
        if(list_id) {
          card.set('list_id', list_id);
        }

        await card.save();

        res.json(card);
        
      }else{
        res.status(404).json({ "error": "Card not found. Please verify the provided id." });
      }

    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  getCardsInList: async function(req, res, next){
    try{

      const listId = req.params.id;

      if (!await List.findByPk(listId)){
        return res.status(400).json({ "error": "Should provide a valid list_id" });
      }

      const cards = await Card.findAll({
        where:  {
          list_id: listId
        },
        include: 'tags',
        order: ['position'],
      });

      res.json(cards);
    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }    
  }
};

module.exports = cardController;