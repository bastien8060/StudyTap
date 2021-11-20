function isLoggedIn(){
    var xhr = new XMLHttpRequest();
    //var JSON_sent = {"your": "JSON"};
    xhr.open('GET', '/api/v1/status',false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    loggedin = false
    xhr.onload = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.login != "True"){
                loggedin = false
                return
            }
            loggedin = true
            return
            

        } else {
            console.log(xhr.responseText);
        }
    };
    xhr.send();
    return loggedin
}

function getSubjects(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/api/v1/subject",false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    returnval = []
    xhr.onload = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            returnval = response
            return
            

        } else {
            console.log(xhr.responseText);
        }
    };
    xhr.send();
    //console.log(returnval)
    return returnval 
}

function getLink(e){
    id = e.srcElement.getAttribute("subject")
    window.location = "/web/subject/"+id+"/topics"
}

function RenderSubjectCards(s){
    s.forEach(element => {
        subject = element["name"]
        subject_id = element["id"]
        teacher = element["teacher"]
        var card = document.createElement('div');
        card.setAttribute("class","card");
        
        var card__content = document.createElement('div');
        card__content.setAttribute("class","card__content");
        
        var card__heading = document.createElement('h2');
        card__heading.setAttribute("class","card__heading");
        card__heading.textContent = subject;

        var card__body = document.createElement('p');
        card__body.setAttribute("class","card__body");
        card__body.textContent = teacher;

        var link = document.createElement('div');
        link.setAttribute("fakehref","#");

        var card__btn = document.createElement('button');
        card__btn.setAttribute("class","card__btn");
        card__btn.setAttribute("subject",subject_id);
        card__btn.onclick = function(e){getLink(e)}
        card__btn.textContent = "Revise Subject";

        link.appendChild(card__btn);

        card__content.appendChild(card__heading);
        card__content.appendChild(card__body);
        card__content.appendChild(link);

        card.appendChild(card__content);

        document.getElementsByClassName("card__wrapper")[0].appendChild(card)

    });

}

if (!isLoggedIn()){
    window.location = "/web/"
}

Subjects = getSubjects()
RenderSubjectCards(Subjects);

var speed = 'slow';

$('body').hide();

$(document).ready(function() {
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
});