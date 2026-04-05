const router     = require('express').Router();
const controller = require('../controllers/galleryController');
const upload     = require('../middleware/upload');

router.get('/',       controller.getGallery);
router.post('/',      upload.single('media'), controller.uploadMedia);
router.patch('/:id',  controller.updateMedia);
router.delete('/:id', controller.deleteMedia);

module.exports = router;