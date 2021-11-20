function getSubjectInfo(id){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/api/v1/subject/"+id,false);
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

function getTopicInfo(id){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/api/v1/subject/1/topic/"+id,false);
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

function CreateSubject(data){
    console.log(data)
    var xhr = new XMLHttpRequest();
    //http://127.0.0.1/api/v1/subject/add?name=History&description=SusanCashell%206th%20year%20continuation
    xhr.open('POST', '/api/v1/subject/add');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status == "true"){
                console.log(response)
                document.getElementById("done").click()
            }else{
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


function CreateNote(topicID,data,reload=true){
    console.log(data)
    window.returnval = false;
    var xhr = new XMLHttpRequest();
    //http://127.0.0.1/api/v1/subject/add?name=History&description=SusanCashell%206th%20year%20continuation
    xhr.open('POST', `/api/v1/subject/1/topic/${topicID}/note/add`,false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status == "true"){
                console.log(response)
                window.returnval = true;
                if (reload){
                  window.location.reload(true);
                }
            }else{
                alert(response.msg)
                console.error(response.msg)
                throw "Registering Failed. API Server Side Error"
            }
            

        } else {
            console.log(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(data));
    return window.returnval
}


function CreateTopic(subjectID,data){
    console.log(data)
    var xhr = new XMLHttpRequest();
    //http://127.0.0.1/api/v1/subject/add?name=History&description=SusanCashell%206th%20year%20continuation
    xhr.open('POST', '/api/v1/subject/'+subjectID+'/topic/add');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status == "true"){
                console.log(response)
                document.getElementById("done").click()
            }else{
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

if (window.location.pathname.includes("/note")){
    console.log("Adding note")
    var re = new RegExp("\/web\/add\/subject\/[0-9]{1,9999}\/topic\/([0-9]{1,9999})\/note")
    var match = re.exec(window.location.pathname);

    topicName = getTopicInfo(match[1])["name"]

    var toReplace = document.getElementsByClassName("topicName");

    for (var i = 0; i < toReplace.length; i++) {
        toReplace[i].innerHTML = topicName;
    }


    form = document.getElementsByClassName('add_notes')[0]
    form.onsubmit = function(event) {
        var re = new RegExp("\/web\/add\/subject\/[0-9]{1,9999}\/topic\/([0-9]{1,9999})\/note")
        var match = re.exec(window.location.pathname);
        event.preventDefault();
        datafields = ['question','answer']
        var formData = new FormData(form);
        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var NoteData = JSON.stringify(object);
        
        console.log(NoteData)
        if (CreateNote(match[1],NoteData)){
          alert("Added Note");
        }
        event.preventDefault();
        return false;
    }
    







}
else if (window.location.pathname.includes("/topic")){
    var re = new RegExp("\/web\/add\/subject\/([0-9]{1,9999})\/topic")
    var match = re.exec(window.location.pathname);

    var toReplace = document.getElementsByClassName("back");
    for (var i = 0; i < toReplace.length; i++) {
        toReplace[i].setAttribute("href","/web/subject/"+match[1]+"/topics");
    }

    id = 0

    var re = new RegExp("\/web\/add\/subject\/([0-9]{1,9999})\/topic")
    var match = re.exec(window.location.pathname);

    subjectName = getSubjectInfo(match[1])["name"]

    var toReplace = document.getElementsByClassName("subjectName");

    for (var i = 0; i < toReplace.length; i++) {
        toReplace[i].innerHTML = subjectName;
    }

    form = document.getElementsByClassName('add_topics')[0]
    form.onsubmit = function(event) {
        id = 0
        var re = new RegExp("\/web\/add\/subject\/([0-9]{1,9999})\/topic")
        var match = re.exec(window.location.pathname);
        event.preventDefault();
        datafields = ['topic','description']
        var formData = new FormData(form);
        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var SubjectData = JSON.stringify(object);
        console.log(SubjectData)
        CreateTopic(match[1],SubjectData)
        event.preventDefault();
        return false;
    }
    

}else
{
    form = document.getElementsByClassName('add_subjects')[0]
    form.onsubmit = function(event) {
        event.preventDefault();
        datafields = ['subject','description']
        var formData = new FormData(form);
        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var SubjectData = JSON.stringify(object);
        console.log(SubjectData)
        CreateSubject(SubjectData)
        event.preventDefault();
        return false;
    }
}

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

$("#fileupload_cover").click(function(){
  $("#ankiFile").click();
});