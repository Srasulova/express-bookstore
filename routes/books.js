const express = require("express");
const Book = require("../models/book");

const router = new express.Router();

const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const ExpressError = require("../expressError");

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, bookSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map((error) => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    if ("isbn" in req.body) {
      return next({
        status: 400,
        message: "Not allowed",
      });
    }

    const result = jsonschema.validate(req.body, bookSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map((error) => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
