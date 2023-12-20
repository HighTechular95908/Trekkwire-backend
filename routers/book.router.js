var router = require("express").Router();
const BookController = require('../controllers/book.controller');
router.post("/create", BookController.create);
router.delete("/delete/:id", BookController.bookDelete);
router.get("/all", BookController.Allbook);
module.exports = router;
