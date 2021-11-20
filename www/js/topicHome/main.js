Vue.config.devtools = true;
Vue.component('card', {
  template: `
    <div class="card-wrap"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="card">
      <div class="card-3d"
        :style="cardStyle">
        <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
        <div class="card-info">
          <slot name="header"></slot>
          <slot name="content"></slot>
        </div>
      </div>
    </div>`,

  mounted() {
    this.width = this.$refs.card.offsetWidth;
    this.height = this.$refs.card.offsetHeight;
  },

  props: ['dataImage'],
  data: () => ({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0,
    mouseLeaveDelay: null
  }),
  computed: {
    mousePX() {
      return this.mouseX / this.width;
    },

    mousePY() {
      return ($('body').scrollTop()+this.mouseY) / this.height;
    },

    cardStyle() {
      const rX = this.mousePX * 30;
      const rY = this.mousePY * -30;
      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
      };
    },

    cardBgTransform() {
      const tX = this.mousePX * -40;
      const tY = this.mousePY * -40;
      return {
        transform: `translateX(${tX}px) translateY(${tY}px)`
      };
    },

    cardBgImage() {
      return {
        backgroundImage: `url(${this.dataImage})`
      };
    }

  },
  methods: {
    handleMouseMove(e) {
      this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width / 2;
      this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height / 2;
    },

    handleMouseEnter() {
      clearTimeout(this.mouseLeaveDelay);
    },

    handleMouseLeave() {
      this.mouseLeaveDelay = setTimeout(() => {
        this.mouseX = 0;
        this.mouseY = 0-$('body').scrollTop();
      }, 1000);
    }

  }
});

function isLoggedIn(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/v1/status',false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var loggedin = false
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

function getNotes(){
    id = 0

    var re = new RegExp("\/web\/subject\/[0-9]{1,9999}\/topic\/([0-9]{1,9999})")
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


function RenderTopicsCards(s,subjectName="null"){
    s.forEach(element => {

        var line = document.createElement("br")

        question = element["question"]
        answer = element["answer"]
        topic_id = element["id"]

        var card = document.createElement('card');
        card.setAttribute("data-image","https://st2.depositphotos.com/1954507/10837/v/950/depositphotos_108371572-stock-illustration-abstract-gray-triangles-background.jpg");
        
        var card__title = document.createElement('h1');
        card__title.setAttribute("slot","header");
        card__title.innerHTML = question + "<br><br><br><br>";

        var card__content = document.createElement('p');
        card__content.setAttribute("slot","content");
        card__content.textContent = answer;

        card.appendChild(card__title);
        card.appendChild(card__content);

        document.getElementsByClassName("container")[0].appendChild(card)

    });

}

function addCard(){
    var re = new RegExp("\/web\/subject\/[0-9]{1,9999}\/topic\/([0-9]{1,9999})")
    var topic = re.exec(window.location.pathname)[1];
    re = new RegExp("\/web\/subject\/([0-9]{1,9999})\/topic\/[0-9]{1,9999}")
    var subject = re.exec(window.location.pathname)[1];
    window.location = `/web/add/subject/${subject}/topic/${topic}/note`

}

function startStudy(){
    var re = new RegExp("\/web\/subject\/[0-9]{1,9999}\/topic\/([0-9]{1,9999})")
    var topic = re.exec(window.location.pathname)[1];
    re = new RegExp("\/web\/subject\/([0-9]{1,9999})\/topic\/[0-9]{1,9999}")
    var subject = re.exec(window.location.pathname)[1];
    url = `/web/subject/${subject}/topic/${topic}/revise`
    window.location = url
}

if (!isLoggedIn()){
    window.location = "/web/"
}

Notes = getNotes()
msg = document.getElementById("msg")
if (Notes.length == 0){
    msg.textContent = "No cards were added yet to this topic. Press the + button above to add one."
}else{
    button = document.createElement("button")
    button.setAttribute("class","studyAll")
    button.setAttribute("green","")
    button.textContent = "Start Study"
    button.onclick = function(){startStudy()}
    msg.appendChild(button)
}
RenderTopicsCards(Notes,subjectName="dummy")

const app = new Vue({
  el: '#app'
});


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
