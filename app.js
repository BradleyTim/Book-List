// book class
class Book {
  constructor(title, author, id) {
    this.title = title;
    this.author = author;
    this.id = id;
  }
}

// view class
class View {
  static displayBooks() {

    const books = Store.getBooks();

    books.forEach((book) => {View.addBookToList(book)});
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `<td>${book.title}</td>
                      <td>${book.author}</td>
                      <td>${book.id}</td>
                      <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>`;
    
    list.appendChild(row);
  }

  static deleteBook(element) {
    if(element.classList.contains('delete')) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlerts(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');

    container.insertBefore(div, form);

    // clear in 2 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#id').value = '';
  }

}

// store class
class Store {
  static getBooks() {
    let books;

    if(localStorage.getItem('books') == null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(id) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if(book.id === id) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// display books
document.addEventListener('DOMContentLoaded', View.displayBooks);

// add book
document.querySelector('#book-form').addEventListener('submit', (e) => {

  //prevent default
  e.preventDefault();

  // get form-values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const id = document.querySelector('#id').value;

  // validation
  if(title === '' || author === '' || id === '' ) {
    View.showAlerts('Please fill in all fields', 'danger');
  } else {
    //initailaize book
    const book = new Book(title, author, id)

    //console.log(book);

    // add book to View
    View.addBookToList(book);

    // add book to store
    Store.addBook(book);

    // success alert
    View.showAlerts('Book added!', 'success');

    // clear fields
    View.clearFields();
  }

});

// remove book
document.querySelector('#book-list').addEventListener('click', e => {
  View.deleteBook(e.target);

  // delete book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // alert deleted
  View.showAlerts('Deleted', 'info');
});
