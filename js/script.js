const container = document.getElementById("container");

const navMenu = document.getElementById("nav-menu");
const infoMenu = document.getElementById("info-menu")
const menuButton = document.getElementById("btn-menu");
const menuOverlay = document.getElementById("cache");

const searchBtn = document.querySelector("header > button");
const searchTemplate = document.getElementById("search-result-template");

const settings = document.querySelector("#settings");
const settingBtn = document.querySelector("#btn-settings");

let maps = null;

const toggleMenu = function() {
    settings.classList.remove("open");

    if (menuButton.classList.contains("menu-back")) {
        menuButton.classList.remove("menu-back");
        infoMenu.classList.remove("menu-open");
    }
    else if (menuButton.classList.contains("menu-open")) {
        menuButton.classList.remove("menu-open");
        navMenu.classList.remove("menu-open");
        container.classList.remove("menu-open");
        menuOverlay.classList.remove("menu-open");
    }
    else {
        menuButton.classList.add("menu-open");
        navMenu.classList.add("menu-open");
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

document.querySelectorAll('#left-menu a').forEach( function(path) {
    path.addEventListener('click', function(e) {
        e.preventDefault();

        var link = e.target.getAttribute("href");

        if (link === "https://github.com/NathanCHEVALIER/epimap") {
            window.open("https://github.com/NathanCHEVALIER/epimap", "_blank");
        }
        else if (link === "") {
            displayError("This map does not exist yet !");
        }
        else if (link != null){
            loadMap("maps/" + link);
            toggleMenu();
        }

        return false;
    });
});

const displayLog = function(message, type="info")
{
    const template = document.querySelector("footer > div.log-box:nth-of-type(1)");
    const container = document.querySelector("footer");

    let newNode = template.cloneNode(true);
    newNode.prepend(message);
    newNode.classList.add(type);
    newNode.style.display = "flex";

    newNode.querySelector("div").addEventListener('click', function() {
        newNode.remove();
    });

    container.append(newNode);
};

const displayError = function(message) {
    displayLog(message, "error");
    console.log(message);
}

const displayWarning = function(message) {
    displayLog(message, "warning");
}

const displayInfo = function(message) {
    displayLog(message, "info");
}