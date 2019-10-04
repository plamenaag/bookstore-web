var userList = [];

$(document).ready(() => {
    getUsers();
    setupButtons();
});

function getUsers() {
    $.ajax({
        url: "http://localhost:8084/bs-api/users",
        method:"GET"
    }).done((data) => {
        userList = data;
        fillTable();
    }).fail((err)=>{
        userList = [];
        fillTable();
        console.log(err);
    });
    console.log('getting users');
}

function setupButtons(){
    
    $('#refreshBtn').click(() => {
        clearForm(); 
        getUsers();
    });
    $('#deleteBtn').click(() => {
        $.ajax({
            url: "http://localhost:8084/bs-api/users/" +  $('#id').val(),
            method:"DELETE"
        }).fail((err)=>{
            alert("Error");
        }).always(()=>{
            clearForm(); 
            getUsers();
        })
    });


    $('#cancelBtn').click(() => {
        clearForm(); // izchistva vsicki polena na formata
        fillTable(); // izchertava otnovo tablicata za da se aktualizira informaciqta
    });

    $('#saveBtn').click((user) => {
        $('tr').removeClass('table-info'); // maha ot vsichi tr clasa table info
        var user = {};
        user.id = $('#id').val();; // na obekta slaga idto 
        user.username = $('#username').val(); // na obekta vzima ot poleto name stoinostta mu i go slaga v propurtito na obekta
        user.password = $('#password').val();
        saveUser(user).then(() => {
            clearForm(); // izchistva vsicki polena na formata
            getUsers();
        })
    })
}

function saveUser(user) { //tuk
    var url = "http://localhost:8084/bs-api/users/";
    var method = "POST";

    if (user.id) {
        url += user.id;
        method = "PUT";
    }
    return $.ajax({
        url: url,
        method: method,
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            'Content-type': 'application/json'
        },
        data: JSON.stringify(user)
    }).done((data) => {
        return data;
    }).fail((err) => {
        alert("error");
    })
}



function fillTable() {
    var users = userList;
    $('tbody').html("");
    users.forEach((user) => {
        var tr = document.createElement('tr');
        tr.appendChild(createElement(user.id, 'td'));
        tr.appendChild(createElement(user.username, 'td'));
        tr.appendChild(createElement(user.password, 'td'));

        $(tr).click((event) => {
            $('tr').removeClass('table-info'); // maha na vsichki tr-ta tozi klas
            $('#id').val(user.id);
            $('#username').val(user.username);
            $('#password').val(user.password);
            $(event.target.parentElement).addClass('table-info');
        })

        $('tbody')[0].appendChild(tr);
    })
}

function clearForm() {
    $('#id').val("");
    $('#username').val("");
    $('#password').val("");
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


