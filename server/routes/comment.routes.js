const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getComments).post(addComment);
router.delete('/:id', deleteComment);

module.exports = router;
