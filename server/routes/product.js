const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product');

router.post('/', product_controller.create);
router.get('/', product_controller.read);
router.put('/', product_controller.update);
router.delete('/', product_controller.delete);

module.exports = router;
