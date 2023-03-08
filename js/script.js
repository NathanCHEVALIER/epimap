/**
 * Handle UI basics
 * Contains DOM element selectors and Event listeners
 */

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

/**
 * Left Menu (Nav menu and Info menu) Event listener
 */
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

/**
 * Settings Menu Event listener
 */
settingBtn.addEventListener('click', e => {
    if (settings.classList.contains("open"))
        settings.classList.remove("open");
    else
        settings.classList.add("open");
})

/**
 * Left menu (Nav menu only) links action replacement
 */
document.querySelectorAll('#left-menu a').forEach( function(path) {
    path.addEventListener('click', function(e) {
        e.preventDefault();

        const link = e.target.getAttribute("href");

        if (link === "https://github.com/NathanCHEVALIER/epimap") {
            window.open("https://github.com/NathanCHEVALIER/epimap", "_blank");
        }
        else if (link === "") {
            displayError("This map does not exist yet !");
        }
        else if (link != null){
            loadMap(link);
            toggleMenu();
        }

        return false;
    });
});

/**
 * Display Logs for UI
 * @param {*} message 
 * @param {*} type 
 */
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

    setTimeout(() => { newNode.remove() }, 8000);

    container.append(newNode);
};

/**
 * displayLog wrapper for Errors
 * @param {*} message 
 */
const displayError = function(message) {
    displayLog(message, "error");
    console.log(message);
}

/**
 * displayLog wrapper for Warnings
 * @param {*} message 
 */
const displayWarning = function(message) {
    displayLog(message, "warning");
}

/**
 * displayLog wrapper for Infos
 * @param {*} message 
 */
const displayInfo = function(message) {
    displayLog(message, "info");
}