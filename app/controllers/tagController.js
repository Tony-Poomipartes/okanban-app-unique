const { Tag, Card } = require ('../models');

const tagController = {
  getAll: async function(req, res){

    try{

      const tags = await Tag.findAll({
        order:  ['name'],
      });

      res.json(tags);
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
     
      const tagId = req.params.id;
      const tag = await Tag.findByPk(tagId);

      if (tag){
        res.json(tag);
      }else{
        const errorContent = {
          error: 'Tag not found. Please verify the provided id.'
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
      const tag = await Tag.findByPk(idToDelete);
      
      if (tag){
        await tag.destroy();
        res.status(204).json();
      }else{
        res.status(404).json({ "error": "Tag not found. Please verify the provided id." });
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
      let { name, color } = req.body;

      if (name === undefined){
        return res.status(400).json({ "error": "Missing body parameter: name" });
      }    
        
      const insertedTag = await Tag.create({
        name: name,
        color: color,
      });

      res.status(201).json(insertedTag);
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
      const tag = await Tag.findByPk(idToUpdate);

      if (tag){

        const { name, color } = req.body;
        
        if (name === undefined && color === undefined){
          return res.status(400).json({ "error": "Invalid body. Should provide at least a 'name' or 'color' property" });
        }

        if (name){
          tag.set('name', name);
        }
        if (color){
          tag.set('color', color);
        }

        await tag.save();

        res.json(tag);
        
      }else{
        res.status(404).json({ "error": "Tag not found. Please verify the provided id." });
      }

    } catch (error){
      
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  associateToCard: async (req, res) => {
    try {
      const cardId = req.params.id;
      const tagId = req.body.tag_id;

      let card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      if (!card) {
        return res.status(404).json('Can not find card with id ' + cardId);
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json('Can not find tag with id ' + tagId);
      }

      await card.addTag(tag);

      // les associations de l'instance ne sont pas mises à jour
      // on doit donc refaire un select
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.trace(error);

      const errorContent = {
        error: 'unexpected server error. Please try again later.'
      }

      res.status(500).json(errorContent);
    }
  },

  removeFromCard: async (req, res) => {
    try {
      const { cardId, tagId } = req.params;

      let card = await Card.findByPk(cardId);
      if (!card) {
        return res.status(404).json('Can not find card with id ' + cardId);
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json('Can not find tag with id ' + tagId);
      }

      await card.removeTag(tag);
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  }
};

module.exports = tagController;