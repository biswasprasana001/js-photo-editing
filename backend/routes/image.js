// backend\routes\image.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/save', authMiddleware, imageController.saveImage);
router.get('/list', authMiddleware, imageController.listImages);
router.get('/edit/:imageId', authMiddleware, imageController.editImage);

module.exports = router;