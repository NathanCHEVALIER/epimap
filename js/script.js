const container = document.getElementById("container");

const menu = document.getElementById("left-menu");
const menuButton = document.getElementById("btn-menu");
const menuOverlay = document.getElementById("cache");

const searchBtn = document.querySelector("#search > div > button");
const searchTemplate = document.getElementById("search-result-template");

const settings = document.querySelector("#settings");
const settingBtn = document.querySelector("#btn-settings");
const darkmodeBtn = document.querySelector("#settings .onoffswitch:nth-of-type(1)");

let maps = null;

const toggleMenu = function() {
    settings.classList.remove("open");
    if (menuButton.classList.contains("menu-open")) {
        menuButton.classList.remove("menu-open");
        menu.classList.remove("menu-open");
        container.classList.remove("menu-open");
        menuOverlay.classList.remove("menu-open");
    }
    else {
        menuButton.classList.add("menu-open");
        menu.classList.add("menu-open");
        container.classList.add("menu-open");
        menuOverlay.classList.add("menu-open");
    }
};

menuButton.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

settingBtn.addEventListener('click', e => {
    if (settings.classList.contains("open"))
        settings.classList.remove("open");
    else
        settings.classList.add("open");
})

darkmodeBtn.addEventListener('change', e => {
    console.log("ttu");
    if (document.querySelector("body").classList.contains("darkmode"))
        document.querySelector("body").classList.remove("darkmode");
    else
        document.querySelector("body").classList.add("darkmode");
})

document.querySelectorAll('#left-menu a').forEach( function(path) {
    path.addEventListener('click', function(e) {
        e.preventDefault();

        var link = e.target.getAttribute("href");

        if (link === "https://github.com/NathanCHEVALIER/epimap") {
            window.open("https://github.com/NathanCHEVALIER/epimap", "_blank");
        }
        else if (link === "") {
            alert("This map does not exist yet !");
        }
        else if (link != null){
            loadMap(link);
            toggleMenu();
        }

        return false;
    });
});
