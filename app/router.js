const router = require('express').Router();
const path = require('path');

const listController = require ('./controllers/listController');
const cardController = require ('./controllers/cardController');
const tagController = require ('./controllers/tagController');

router.get('/', (request, response) => {
  const filePath = path.join(__dirname, '../assets/index.html');

  response.sendFile(filePath);
})

router.get('/lists', listController.getAll);
router.get('/lists/:id', listController.getOne);
router.delete('/lists/:id', listController.delete);
router.post('/lists', listController.create);
router.patch('/lists/:id', listController.update);

router.get('/lists/:id/cards', cardController.getCardsInList);
router.get('/cards', cardController.getAll);
router.get('/cards/:id', cardController.getOne);
router.delete('/cards/:id', cardController.delete);
router.post('/cards', cardController.create);
router.patch('/cards/:id', cardController.update);

router.get('/tags', tagController.getAll);
router.get('/tags/:id', tagController.getOne);
router.delete('/tags/:id', tagController.delete);
router.post('/tags', tagController.create);
router.patch('/tags/:id', tagController.update);
router.post('/cards/:id/tags', tagController.associateToCard);
router.delete('/cards/:cardId/tags/:tagId', tagController.removeFromCard);

module.exports = router;