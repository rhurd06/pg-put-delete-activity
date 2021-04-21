$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delete-book', deleteBookHandler);
  $('#bookShelf').on('click', '.mark-read', markReadHandler);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  book.published = $('#published').val();
  book.isRead = $('#isRead').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let myBooks = $(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.published}</td>
        <td>${book.isRead}</td>
        <td>
          <button type="button" class="delete-book" data-id="${book.id}">Delete</button>
          <button type="button" class="mark-read" data-id="${book.id}">Mark As Read</button>
        </td>
      </tr>
    `);
    $('#bookShelf').append(myBooks);
  }
}
//handler for clicks on Mark Read button
function markReadHandler(){
  //call AJAZ to mark book as read
  markRead($(this).data("id"))
}//end markReadHandler

function markRead(){
  console.log('This book was read');
}//markRead

//Handler for clicks on Delete button
function deleteBookHandler(){
  //console.log('Delete me');
  //call AJAX to Delete book
  deleteBook($(this).data("id"))
}// end deleteBookHandler

function deleteBook(bookId){
  $.ajax({
    method: 'DELETE',
    url: `/books/${bookId}`,
  })
  .then( response => {
    console.log('Deleted it, woot!');
    //refresh book list
    refreshBooks();
  })
  .catch( error => {
    alert(`Error on deleting book.`, error);
  });
}// end deleteBook