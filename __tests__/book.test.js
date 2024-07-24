/** Integration tests for books route */

process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

// sample isbn
let book_isbn;

beforeEach(async () => {
  let result =
    await db.query(`INSERT into books (isbn, amazon_url, author, pages, publisher, title, year) VALUES (123432122',
        'https://amazon.com/taco',
        'Elie',
        'English',
        100,
        'Nothing publishers',
        'my first book', 2008) RETURNING isbn`);

  book_isbn = result.rows[0].isbn;
});

describe("POST /books", function () {
  test("Creates a new book", async () => {
    const response = await request(app).post(`/books`).send({
      isbn: "32794782",
      amazon_url: "https://taco.com",
      author: "mctest",
      language: "english",
      pages: 1000,
      publisher: "yeah right",
      title: "amazing times",
      year: 2000,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toHaveProperty("isbn");
  });

  test("Prevents creating book without required title", async () => {
    const response = await request(app).post(`/books`).send({ year: 2000 });
    expect(response.statusCode).toBe(400);
  });
});
