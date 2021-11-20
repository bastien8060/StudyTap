function isLoggedIn() {
    window.resp = false;
    var xhr = new XMLHttpRequest();
    //var JSON_sent = {"your": "JSON"};
    xhr.open('GET', '/api/v1/status', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.login == "True") {
                window.resp = true;
            }


        } else {
            console.log(xhr.responseText);
        }
    };
    xhr.send();
    return window.resp;
}

function CreateAccount(data) {
    var xhr = new XMLHttpRequest();
    //var JSON_sent = {"your": "JSON"};
    xhr.open('POST', '/api/v1/register');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status == "true") {
                console.log(response)
                if (isLoggedIn()) {
                    window.location = "/web/home"
                }
            } else {
                alert(response.msg)
                console.error(response.msg)
                throw "Registering Failed. API Server Side Error"
            }


        } else {
            console.log(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(data));
}

form = document.getElementsByTagName('form')[0]
form.onsubmit = function(event) {
    event.preventDefault();
    datafields = ['age', 'firstname', 'email', 'password']
    var formData = new FormData(form);
    var object = {};
    formData.forEach(function(value, key) {
        object[key] = value;
    });
    var AccountData = JSON.stringify(object);
    console.log(AccountData)
    CreateAccount(AccountData)
    event.preventDefault();
    return false;
}

var speed = 'slow';

$('body').hide();

$(document).ready(function() {
    if (!isLoggedIn()) {
        $('body').fadeIn(speed, function() {
            $('a[href], button[href]').click(function(event) {
                var url = $(this).attr('href');
                if (url.indexOf('#') == 0 || url.indexOf('javascript:') == 0) return;
                event.preventDefault();
                $('body').fadeOut(speed, function() {
                    window.location = url;
                });
            });
        });
    } else {
        window.location = "/web/home"
    }
});