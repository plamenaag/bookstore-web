var clientList = [];

$(document).ready(() => {
    getClients();
    setupButtons();
});

function getClients() {
    $.ajax({
        url: "http://localhost:8084/bs-api/clients",
        method:"GET"
    }).done((data) => {
        clientList = data;
        fillTable();
    }).fail((err)=>{
        clientList = [];
        fillTable();
        console.log(err);
    });
    console.log('getting clients');
}

function setupButtons(){
    
    $('#refreshBtn').click(() => {
        clearForm(); 
        getClients();
    });
    $('#deleteBtn').click(() => {
        $.ajax({
            url: "http://localhost:8084/bs-api/clients/" +  $('#id').val(),
            method:"DELETE"
        }).fail((err)=>{
            alert("Error");
        }).always(()=>{
            clearForm(); 
            getClients();
        })
    });


    $('#cancelBtn').click(() => {
        clearForm(); // izchistva vsicki polena na formata
        fillTable(); // izchertava otnovo tablicata za da se aktualizira informaciqta
    });

    $('#saveBtn').click((client) => {
        $('tr').removeClass('table-info'); // maha ot vsichi tr clasa table info
        var client = {};
        client.id = $('#id').val();; // na obekta slaga idto 
        client.name = $('#name').val(); // na obekta vzima ot poleto name stoinostta mu i go slaga v propurtito na obekta
        client.phoneNumber = $('#phoneNumber').val();
        saveClient(client).then(() => {
            clearForm(); // izchistva vsicki polena na formata
            getClients();
        })
    })
}

function saveClient(client) { //tuk
    var url = "http://localhost:8084/bs-api/clients/";
    var method = "POST";

    if (client.id) {
        url += client.id;
        method = "PUT";
    }
    return $.ajax({
        url: url,
        method: method,
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            'Content-type': 'application/json'
        },
        data: JSON.stringify(client)
    }).done((data) => {
        return data;
    }).fail((err) => {
        alert("error");
    })
}



function fillTable() {
    var clients = clientList;
    $('tbody').html("");
    clients.forEach((client) => {
        var tr = document.createElement('tr');
        tr.appendChild(createElement(client.id, 'td'));
        tr.appendChild(createElement(client.name, 'td'));
        tr.appendChild(createElement(client.phoneNumber, 'td'));

        $(tr).click((event) => {
            $('tr').removeClass('table-info'); // maha na vsichki tr-ta tozi klas
            $('#id').val(client.id);
            $('#name').val(client.name);
            $('#phoneNumber').val(client.phoneNumber);
            $(event.target.parentElement).addClass('table-info');
        })

        $('tbody')[0].appendChild(tr);
    })
}

function clearForm() {
    $('#id').val("");
    $('#name').val("");
    $('#phoneNumber').val("");
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


