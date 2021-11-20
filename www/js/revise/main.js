let n = 0;
window.cards = getCards();

function getCards(){
    id = 0

    var re = new RegExp("\/web\/subject\/[0-9]{1,9999}\/topic\/([0-9]{1,9999})/revise")
    var match = re.exec(window.location.pathname);
    id = match[1]

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/v1/subject/1/topic/${id}/notes`,false);
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

function enableCardEvent(){
    const card = document.querySelector('.card-flip');
    function clickRotate() {card.classList.toggle('rotated');}
    card.addEventListener('click', clickRotate);

}

function init(){
  n = 0;

  console.log(1)

  forward = document.getElementById("cardForward");
  backward = document.getElementById("cardBackward");
  forward.onclick = function(){
    if (n < window.cards.length - 1){
      n += 1;
      console.log("forward "+n)
      getCard(n);
    }
  }
  
  backward.onclick = function(){
    
    if (n){
      n -= 1;
      console.log("back "+n)
      getCard(n);
    }
  }

  getCard(n);
  
}

function getCard(n){
  question = window.cards[n]["question"];
  answer = window.cards[n]["answer"];
  renderCard(question,answer,n.toString());
}

function renderCard(question,answer,n){
    card = document.createElement("div")
    card.setAttribute("class","card-flip")

    cardFront = document.createElement("div")
    cardFront.setAttribute("class","card-contents card-front")

    card_depth = document.createElement("div")
    card_depth.setAttribute("class","card-depth")

    card_depth_h2 = document.createElement("h2")
    card_depth_h2.innerHTML = question;

    card_depth_hr = document.createElement("hr")

    card_depth_p = document.createElement("p")
    card_depth_p.textContent = "Click to reveal answer"

    card_depth.appendChild(card_depth_h2)
    card_depth.appendChild(card_depth_hr)
    card_depth.appendChild(card_depth_p)

    cardFront.appendChild(card_depth)

    cardBack = document.createElement("div")
    cardBack.setAttribute("class","card-contents card-back")

    card_depth_back = document.createElement("div")
    card_depth_back.setAttribute("class","card-depth")

    center = document.createElement("center")

    card_depth_h2_back = document.createElement("h2")
    card_depth_h2_back.setAttribute("class","answerText answerText-"+n);

    card_depth_h2_back.innerHTML = answer;

    card_depth_hr_back = document.createElement("hr")

    card_depth_p_back = document.createElement("p")
    card_depth_p_back.textContent = "Click to hide answer"

    center.appendChild(card_depth_h2_back);

    card_depth_back.appendChild(center)
    card_depth_back.appendChild(card_depth_hr_back)
    card_depth_back.appendChild(card_depth_p_back)

    cardBack.appendChild(card_depth_back)

    card.appendChild(cardFront)
    card.appendChild(cardBack)

    container = document.getElementById("container_card")
    container.innerHTML = ""
    container.appendChild(card)
    enableCardEvent()

    console.log("Textfitting: .answerText-"+n)
    textFit(document.querySelector(".answerText-"+n));
}

window.addEventListener('load', init);

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