var billList = [];
var bookList = [];
var userList = [];
var clientList = [];


$(document).ready(() => {
    getUser();
    getBooks();
    getClient();
    getBills();
    setupButtons();

    $('#book').change(()=>{
        var id = $("#book").val();
        var book = bookList.find((item)=>{
            return item.id == id;
        });
        $("#price").val(book.price);
    })
});

function getBooks() {
    return $.ajax({
        url: "http://localhost:8084/bs-api/books",
    }).done((data) => {
        bookList = data;
        fillBookSelect();
    });
}


function getBills() {
    return $.ajax({
        url: "http://localhost:8084/bs-api/bills",
    }).done((data) => {
        billList = data;
        fillTable();
    });
}


function getUser() {
    return $.ajax({
        url: "http://localhost:8084/bs-api/users",
    }).done((data) => {
        userList = data;
        fillUserSelect();
    });
}

function getClient() {
    return $.ajax({
        url: "http://localhost:8084/bs-api/clients",
    }).done((data) => {
        clientList = data;
        fillClientSelect();
    });
}


function setupButtons(){

    $('#refreshBtn').click(() => {
        clearForm(); 
        getBills();
    });
    $('#deleteBtn').click(() => {
        $.ajax({
            url: "http://localhost:8084/bs-api/bills/" +  $('#id').val(),
            method:"DELETE"
        }).fail((err)=>{
            alert("Error");
        }).always(()=>{
            clearForm(); 
            getBills();
        })
    });

    $('#cancelBtn').click(() => {
        clearForm(); // izchistva vsicki polena na formata
        fillTable(); // izchertava otnovo tablicata za da se aktualizira informaciqta
    });

    $('#saveBtn').click(() => {
        $('tr').removeClass('table-info'); // maha ot vsichi tr clasa table info
        var id = $('#id').val(); // vzima ot poleto id stojnostta na samoto pole 
        var bill = billList.find((item)=>{
            return item.id == id;
        }) || {};
        bill.id = id;
        var userId = $('#user').val();
        var user = userList.find((item) => {
            return item.id == userId;
        })
        var clientId = $('#client').val();
        var client = clientList.find((item) => {
            return item.id == clientId;
        })
        bill.user = user;
        bill.client = client;
       
        saveBill(bill).then((savedBill) => {
            clearForm(); // izchistva vsicki polena na formata
            getBills();
        })
    })
};

function saveBill(bill) {

    if (bill.id) {
        return $.ajax({
            url: "http://localhost:8084/bs-api/bills/" + bill.id,
            method: "PUT",
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                'Content-type': 'application/json'
            },
            data: JSON.stringify(bill)
        }).done((data) => {
            return data;
        }).fail((err) => {
            alert("error");
        })
    } else {
        return $.ajax({
            url: "http://localhost:8084/bs-api/bills/",
            method: "POST",
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                'Content-type': 'application/json'
            },
            data: JSON.stringify(bill)
        }).done((data) => {
            return data;
        }).fail((err) => {
            alert("error");
        })
    }
}


function fillBookSelect() {
    $("#book").html("");
    bookList.forEach((item) => {
        var option = createOption(item.id, item.name);

        $('#book')[0].appendChild(option[0]);
    })
}

function fillUserSelect() {
    var users = userList;
    $("#user").html("");
    users.forEach((user) => {
        var option = createOption(user.id, user.username);

        $('#user')[0].appendChild(option[0]);
    })
}

function fillClientSelect() {
    var clients = clientList;
    $('#client').html("");
    clients.forEach((client) => {
        var option = createOption(client.id, client.name);

        $('#client')[0].appendChild(option[0]);
    })
}


function fillTable() {
    var bills = billList;
    $('#billsTBody').html("");
    bills.forEach((bill) => {
        var tr = document.createElement('tr');
        tr.appendChild(createElement(bill.id, 'td'));
        tr.appendChild(createElement(bill.user.username, 'td'));
        tr.appendChild(createElement(bill.client.name, 'td'));

        $(tr).click((event) => {
            $('tr').removeClass('table-info'); // maha na vsichki tr-ta tozi klas
            $('#id').val(bill.id);
            $('#user').val(bill.user.id);
            $('#client').val(bill.client.id);
            $(event.target.parentElement).addClass('table-info');
        })

        $('#billsTBody')[0].appendChild(tr);
    })
}

function clearForm() {
    $('#id').val("");
    $('#user').val("");
    $('#client').val("");
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

