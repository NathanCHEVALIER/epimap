const btn = document.getElementById("btn-menu");
const menu = document.getElementById("left-menu");
const container = document.getElementById("container");
const map_ifr = document.getElementById("map-ifr");

btn.classList.add("menu-open");
menu.classList.add("menu-open");
container.classList.add("menu-open");

btn.addEventListener('click', function() {
    if (btn.classList.contains("menu-open")) {
        btn.classList.remove("menu-open");
        menu.classList.remove("menu-open");
        container.classList.remove("menu-open");
    }
    else {
        btn.classList.add("menu-open");
        menu.classList.add("menu-open");
        container.classList.add("menu-open");
    }
});

const documentTitle = document.title;
const filename = document.getElementById("filename");

const getIframeDocument = function(ifr) {
    const elt = (map_ifr.contentWindow || map_ifr.contentDocument);
    return elt.document ? elt.document : elt;
};

const mapIframeLoaded = function() {
    const map_ifr_document = getIframeDocument(map_ifr);
    const map_name = map_ifr_document.querySelector('svg').getAttribute('sodipodi:docname').replace(/\.[^.]*$/, '');
    filename.innerHTML = map_name;
    document.title = `${documentTitle} – ${map_name}`;
    window.history.pushState({
        additionalInformation: map_name},
        document.title,
        'https://epimap.fr/' + map_name);
};

const map_ifr_document = getIframeDocument(map_ifr);
if (map_ifr_document.readyState === "complete")
    setTimeout(mapIframeLoaded, 100);
map_ifr.addEventListener('load', mapIframeLoaded);

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
            map_ifr.setAttribute("src", link);
            btn.classList.remove("menu-open");
            menu.classList.remove("menu-open");
            container.classList.remove("menu-open");
        }

        return false;
    });
}
