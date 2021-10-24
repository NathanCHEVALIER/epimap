/*** Document infos */
const documentTitle = document.title;
const mapnavname = document.querySelector("#map-nav > .map-name");
//const foldmode = "devtest/";

/*** DOM elements */
const btn = document.getElementById("btn-menu");
const menu = document.getElementById("left-menu");
const container = document.getElementById("container");
const cache = document.getElementById("cache");
const map_ifr = document.getElementById("map-ifr");
const searchBtn = document.querySelector("#search > div > button");
const searchTemplate = document.getElementById("search-result-template");

/*** JSON Data about Maps loading */

const initData = async function()
{
    const res = await fetch("./js/data.map.json");
    const json = await res.json();
    maps = json;

    const map_ifr_document = getIframeDocument(map_ifr);
    if (map_ifr_document.readyState === "complete")
        setTimeout(mapIframeLoaded, 100);
    map_ifr.addEventListener('load', mapIframeLoaded);

    getURLMap();
};

let maps = null;
initData();

/*** Maps Handler */

const getURLMap = function()
{
    let path = window.location.href.split('/').pop();

    if (path.length == 0)
        path = "map-kb-overview";

    map_ifr.setAttribute("src", "./maps/" + path + ".svg");
    btn.classList.remove("menu-open");
    menu.classList.remove("menu-open");
    container.classList.remove("menu-open");
};

const getIframeDocument = function(ifr) {
    const elt = (map_ifr.contentWindow || map_ifr.contentDocument);
    return elt.document ? elt.document : elt;
};

const mapIframeLoaded = function() {
    const map_ifr_document = getIframeDocument(map_ifr);
    const map_id = map_ifr_document.querySelector('svg').getAttribute('sodipodi:docname').replace(/\.[^.]*$/, '');
    map_dname = maps[map_id]['d_name'];
    mapnavname.querySelector("a:nth-of-type(1)").setAttribute("href", "./maps/" + map_id + ".svg");
    mapnavname.querySelector("a:nth-of-type(1)").innerHTML = map_dname;
    document.title = `${documentTitle} – ${map_dname}`;
    window.history.pushState({
        additionalInformation: map_dname},
        document.title,
        'https://epimap.fr/devtest/' + map_id);
};

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
            map_ifr.setAttribute("src", link);
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

/*** Dev in progress */

var results;

const search = function(str)
{
    const nbmaps = Object.keys(maps).length;
    results = [];
    
    if (str === "")
        return;

    for (let i = 0; i < nbmaps; ++i)
    {
        searchTextInMap(Object.keys(maps)[i], str);
    }

    console.log(results);

    for (let i = 0; i < 5; i++)
    {
        searchRender("Room", "Building");
            //results[i][key], results[i][map]);
    }
};

const searchTextInMap = function(map, str) {
    let request = new XMLHttpRequest();
    request.open("GET", 'maps/' + map + '.svg');
    request.setRequestHeader("Content-Type", "image/svg+xml");
    request.addEventListener("load", function(event) {
        let response = event.target.responseText;
        let doc = new DOMParser();
        let svg = doc.parseFromString(response, "image/svg+xml");
        const labels = svg.querySelectorAll('text > tspan');

        for (let i = 0; i < labels.length; ++i)
        {
            if (labels[i].textContent === "")
                continue;

            const subdist = isSubString(labels[i].textContent, str);
            if (subdist >= 0)
            {
                insertInPlace({
                    key: labels[i].textContent,
                    value: 0.1 * subdist,
                    map: map,
                });
                continue;
            }
            
            const d = editDist(labels[i].textContent, str, labels[i].textContent.length, str.length);
            if (labels[i].textContent.length > 0 && d <= (0.4 * str.length))
            {
                insertInPlace({
                    key: labels[i].textContent,
                    value: 0.3 * str.length,
                    map: map
                });
            }
        }
    });
    request.send();

    return results;
};

const editDist = function(str1, str2, m, n)
{
    if (m == 0)
        return n;
 
    if (n == 0)
        return m;
 
    if (str1[m - 1] == str2[n - 1])
        return editDist(str1, str2, m - 1, n - 1);
 
    return 1 + Math.min(
        editDist(str1, str2, m, n - 1),
        editDist(str1, str2, m - 1, n),
        editDist(str1, str2, m - 1, n - 1));
};

const isSubString = function(str1, str2)
{
    const len = str2.length;

    for (let i = 0; i <= str1.length - len; i++)
    {
        if (str1.substring(i, i + len) === str2)
            return str1.length - len;
    }

    return -1;
};

const insertInPlace = function(obj)
{
    for (let i = 0; i < results.length; i++)
    {
        if (obj['value'] < results[i]['value'])
        {
            results.splice(i, 0, obj);
            return;
        }
    }

    results.push(obj);
};

searchBtn.addEventListener('click', function() {
    const val = document.querySelector("#search > div > input").value;
    search(val);
});

const searchRender = function(roomName, map)
{
    let dupBlock = searchTemplate.cloneNode([true]);

    dupBlock.children[0].innerHTML = roomName;
    dupBlock.children[1].innerHTML = map;

    searchTemplate.after(dupBlock);

};