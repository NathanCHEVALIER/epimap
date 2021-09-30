var btn = document.getElementById("btn-menu");
var menu = document.getElementById("left-menu");
var container = document.getElementById("container");
var map_ifr = document.getElementById("map-ifr");

btn.classList.add("menu-open");
menu.classList.add("menu-open");
container.classList.add("menu-open");

btn.addEventListener('click', function() {
    if(btn.classList.contains("menu-open")){
        btn.classList.remove("menu-open");
        menu.classList.remove("menu-open");
        container.classList.remove("menu-open");
    }
    else{
        btn.classList.add("menu-open");
        menu.classList.add("menu-open");
        container.classList.add("menu-open");
    }
});

var elements = document.querySelectorAll('#left-menu a');

for ( var i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener('click', function(e) {
        var link = e.target.getAttribute("href");
        if (link == "null" ){
            e.preventDefault();
            return false;
        }
        if (link == "https://github.com/NathanCHEVALIER/epimap" ){
            window.open("https://github.com/NathanCHEVALIER/epimap", "_blank");
        }
        else if (link == "" ){
            alert("This map does not exist yet !")
        }
        else {
            map_ifr.setAttribute("src", link);
            btn.classList.remove("menu-open");
            menu.classList.remove("menu-open");
            container.classList.remove("menu-open");
        }

        e.preventDefault();
        return false;
    });
}
