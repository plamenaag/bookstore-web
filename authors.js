var authorList = [];

$(document).ready(() => {
    getAuthors();
    setupButtons();
});

function getAuthors() {
    $.ajax({
        url: "http://localhost:8084/bs-api/authors",
        method:"GET"
    }).done((data) => {
        authorList = data;
        fillTable();
    }).fail((err)=>{
        authorList = [];
        fillTable();
        console.log(err);
    });
    console.log('getting authors');
}

function setupButtons(){
    
    $('#refreshBtn').click(() => {
        clearForm(); 
        getAuthors();
    });
    $('#deleteBtn').click(() => {
        $.ajax({
            url: "http://localhost:8084/bs-api/authors/" +  $('#id').val(),
            method:"DELETE"
        }).fail((err)=>{
            alert("Error");
        }).always(()=>{
            clearForm(); 
            getAuthors();
        })
    });


    $('#cancelBtn').click(() => {
        clearForm(); // izchistva vsicki polena na formata
        fillTable(); // izchertava otnovo tablicata za da se aktualizira informaciqta
    });

    $('#saveBtn').click((author) => {
        $('tr').removeClass('table-info'); // maha ot vsichi tr clasa table info
        var author = {};
        author.id = $('#id').val();; // na obekta slaga idto 
        author.name = $('#name').val(); // na obekta vzima ot poleto name stoinostta mu i go slaga v propurtito na obekta
        author.egn = $('#egn').val();
        saveAuthor(author).then(() => {
            clearForm(); // izchistva vsicki polena na formata
            getAuthors();
        })
    })
}

function saveAuthor(author) { //tuk
    var url = "http://localhost:8084/bs-api/authors/";
    var method = "POST";

    if (author.id) {
        url += author.id;
        method = "PUT";
    }
    return $.ajax({
        url: url,
        method: method,
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            'Content-type': 'application/json'
        },
        data: JSON.stringify(author)
    }).done((data) => {
        return data;
    }).fail((err) => {
        alert("error");
    })
}



function fillTable() {
    var authors = authorList;
    $('tbody').html("");
    authors.forEach((author) => {
        var tr = document.createElement('tr');
        tr.appendChild(createElement(author.id, 'td'));
        tr.appendChild(createElement(author.name, 'td'));
        tr.appendChild(createElement(author.egn, 'td'));

        $(tr).click((event) => {
            $('tr').removeClass('table-info'); // maha na vsichki tr-ta tozi klas
            $('#id').val(author.id);
            $('#name').val(author.name);
            $('#egn').val(author.egn);
            $(event.target.parentElement).addClass('table-info');
        })

        $('tbody')[0].appendChild(tr);
    })
}

function clearForm() {
    $('#id').val("");
    $('#name').val("");
    $('#egn').val("");
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


