const { response } = require('express');
const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText)
  .then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title", "published", "isRead")
                   VALUES ($1, $2, $3, $4);`;
  pool.query(queryText, [newBook.author, newBook.title, newBook.published, newBook.isRead])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// []Updates a book to show that it has been read
// [x]Request must include a parameter indicating what book to update - the id
// [x]Request body must include the content to update - the status

router.put('/:id', (req, res) =>{
  let bookId = req.params.id;
  let queryText = `UPDATE "books" SET "isRead" = 'true' WHERE "id"=$1;`;
  
  pool.query(queryText, [bookId])
    .then(response => {
      console.log('Marked read');
      res.sendStatus(200);
    })
    .catch(error => {
      console.log(`Error making databse query ${queryText}`, error);
      res.sendStatus(500);
    });
})

// TODO - DELETE 
// [x]Removes a book to show that it has been read
// [x]Request must include a parameter indicating what book to update - the id
router.delete('/:id', (req, res) => {
  const bookToDelete =req.params.id;
  const queryText = `DELETE FROM "books" WHERE id=$1;`;
  pool.query(queryText, [bookToDelete])
  .then(result => {
    res.sendStatus(200);
  })
  .catch(err => {
    console.log('The delete deleted out delete', err);
  })
});

module.exports = router;
