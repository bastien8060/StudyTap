var button_signup = document.getElementsByClassName("main_home_btn_1")[0]
var button_login = document.getElementsByClassName("main_home_btn_2")[0]
var button_about = document.getElementsByClassName("main_home_btn_3")[0]

button_login.onclick = function(e){
    window.location = 'login'
}

button_about.onclick = function(e){
    window.location = 'about'
}

button_signup.onclick = function(e){
    window.location = 'register'
}

logo = atob("IF9fIF8gICAgICAgICAgICAgXyAgICAgIF9fX19fICAgICAgICAgICAgCi8gX1wgfF8gXyAgIF8gIF9ffCB8XyAgIC9fXyAgIFxfXyBfIF8gX18gIApcIFx8IF9ffCB8IHwgfC8gX2AgfCB8IHwgfC8gL1wvIF9gIHwgJ18gXCAKX1wgXCB8X3wgfF98IHwgKF98IHwgfF98IC8gLyB8IChffCB8IHxfKSB8ClxfXy9cX198XF9fLF98XF9fLF98XF9fLCBcLyAgIFxfXyxffCAuX18vIAogICAgICAgICAgICAgICAgICAgIHxfX18vICAgICAgICAgIHxffCAgICA=");
console.log(logo);

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