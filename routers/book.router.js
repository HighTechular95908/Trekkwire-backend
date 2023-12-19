var router = require("express").Router();
const BookController = require('../controllers/book.controller');
router.get("/create", BookController.create);
router.get("/cancel/:id", BookController.cancel);
router.get("/all", BookController.Allbook);
module.exports = router;
