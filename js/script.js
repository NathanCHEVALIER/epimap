const documentTitle = document.title;

const mapnavname = document.querySelector("#map-nav .map-name");
const mapnavdate = document.querySelector("#map-nav > div:nth-of-type(2) > span");

const btn = document.getElementById("btn-menu");
const menu = document.getElementById("left-menu");
const container = document.getElementById("container");
const cache = document.getElementById("cache");
const searchBtn = document.querySelector("#search > div > button");
const searchTemplate = document.getElementById("search-result-template");

let maps = null;

/*** Menu actions and transition */
btn.classList.add("menu-open");
menu.classList.add("menu-open");
container.classList.add("menu-open");

const toggleMenu = function() {
    if (btn.classList.contains("menu-open")) {
        btn.classList.remove("menu-open");
        menu.classList.remove("menu-open");
        container.classList.remove("menu-open");
        cache.classList.remove("menu-open");
    }
    else {
        btn.classList.add("menu-open");
        menu.classList.add("menu-open");
        container.classList.add("menu-open");
        cache.classList.add("menu-open");
    }
};

btn.addEventListener('click', function(){
    toggleMenu();
});

cache.addEventListener('click', function(){
    toggleMenu();
});

const elements = document.querySelectorAll('#left-menu a');
const len = elements.length;
for (let i = 0; i < len; ++i) {
    elements[i].addEventListener('click', function(e) {
        e.preventDefault();

        var link = e.target.getAttribute("href");
        if (link === "null")
            return false;

        if (link === "https://github.com/NathanCHEVALIER/epimap") {
            window.open("https://github.com/NathanCHEVALIER/epimap", "_blank");
        }
        else if (link === "") {
            alert("This map does not exist yet !");
        }
        else {
            loadMap(link);
            btn.classList.remove("menu-open");
            menu.classList.remove("menu-open");
            container.classList.remove("menu-open");
            cache.classList.remove("menu-open");
        }

        return false;
    });
}

mapnavname.querySelector("a:nth-of-type(1)").addEventListener('click', function(e) {
    e.preventDefault();

    var link = e.target.getAttribute("href");
    if (link === "null" || link === "")
        return false;
    else {
        map_ifr.setAttribute("src", link);
    }

    return false;
});

