var bookList = [];
var authorList = [];

$(document).ready(() => {
    getBooks();
    getAuthor();
    setupButtons();
});

function getBooks() {
    return $.ajax({
        url: "http://localhost:8084/bs-api/books",
    }).done((data) => {
        bookList = data;
        fillTable();
    });
}

function getAuthor() {
    return $.ajax({
        url: "http://localhost:8084/bs-api/authors",
    }).done((data) => {
        authorList = data;
        fillAuthorSelect();
    });
}


function setupButtons(){

    $('#refreshBtn').click(() => {
        clearForm(); 
        getBooks();
    });
    $('#deleteBtn').click(() => {
        $.ajax({
            url: "http://localhost:8084/bs-api/books/" +  $('#id').val(),
            method:"DELETE"
        }).fail((err)=>{
            alert("Error");
        }).always(()=>{
            clearForm(); 
            getBooks();
        })
    });

    $('#cancelBtn').click(() => {
        clearForm(); // izchistva vsicki polena na formata
        fillTable(); // izchertava otnovo tablicata za da se aktualizira informaciqta
    });

    $('#saveBtn').click(() => {
        $('tr').removeClass('table-info'); // maha ot vsichi tr clasa table info
        var id = $('#id').val(); // vzima ot poleto id stojnostta na samoto pole 
        var book = bookList.find((item)=>{
            return item.id == id;
        }) || {};//[id - 1] || {}; // na bazata na id vzima ot spisuka knigata ili ako e null suzdava prazen ovekt
        book.id = id; // na obekta slaga idto 
        book.name = $('#name').val(); // na obekta vzima ot poleto name stoinostta mu i go slaga v propurtito na obekta
        var authorId = $('#author').val();
        var author = authorList.find((author) => {
            return author.id == authorId;
        })
        book.author = author;
        book.price = $('#price').val();
        book.count = $('#count').val();
        saveBook(book).then((savedBook) => {
            clearForm(); // izchistva vsicki polena na formata
            getBooks();
        })
    })
};

function saveBook(book) {

    if (book.id) {
        return $.ajax({
            url: "http://localhost:8084/bs-api/books/" + book.id,
            method: "PUT",
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                'Content-type': 'application/json'
            },
            data: JSON.stringify(book)
        }).done((data) => {
            return data;
        }).fail((err) => {
            alert("error");
        })
    } else {
        return $.ajax({
            url: "http://localhost:8084/bs-api/books/",
            method: "POST",
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                'Content-type': 'application/json'
            },
            data: JSON.stringify(book)
        }).done((data) => {
            return data;
        }).fail((err) => {
            alert("error");
        })
    }
}

function fillAuthorSelect() {
    var authors = authorList;
    $('select').html("");
    authors.forEach((author) => {
        var option = createOption(author.id, author.name);

        $('select')[0].appendChild(option[0]);
    })
}


function fillTable() {
    var books = bookList;
    $('tbody').html("");
    books.forEach((book) => {
        var tr = document.createElement('tr');
        tr.appendChild(createElement(book.id, 'td'));
        tr.appendChild(createElement(book.name, 'td'));
        tr.appendChild(createElement(book.author.name, 'td'));
        tr.appendChild(createElement(book.price, 'td'));
        tr.appendChild(createElement(book.count, 'td'));

        $(tr).click((event) => {
            $('tr').removeClass('table-info'); // maha na vsichki tr-ta tozi klas
            $('#id').val(book.id);
            $('#name').val(book.name);
            $('#author').val(book.author.id);
            $(event.target.parentElement).addClass('table-info');
        })

        $('tbody')[0].appendChild(tr);
    })
}

function clearForm() {
    $('#id').val("");
    $('#name').val("");
    $('#author').val("");
    $('#price').val("");
    $('#count').val("");
}

function addElement(target, el) {
    $(target).append(el);
}

function createElement(content, type, cssClass) {
    var el = document.createElement(type);
    $(el).addClass(cssClass).html(content);
    // $(el).click((event) => {
    //     var elText = $(event.target).html();
    //     $('.content').html(elText);
    // })
    return el;
}

function createOption(value, text) {
    var el = new Option(text, value)
    return $(el);
}

