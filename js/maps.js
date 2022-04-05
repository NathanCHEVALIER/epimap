const documentTitle = document.title;
const container = document.getElementById("container");
const mapnavname = document.querySelector("#map-nav .map-name");
const mapnavdate = document.querySelector("#map-nav > div:nth-of-type(2) > span");


const btn = document.getElementById("btn-menu");
const menu = document.getElementById("left-menu");
const cache = document.getElementById("cache");


const getURLMap = function()
{
    let path = window.location.href.split('/').pop();

    if (path.length == 0)
        path = "kremlin-bicetre";

    map_ifr.setAttribute("src", "./maps/" + path + ".svg");
    btn.classList.remove("menu-open");
    menu.classList.remove("menu-open");
    container.classList.remove("menu-open");
};

const loadMap = function(url) {
    httpRequest(url, 'image/svg+xml').then( function(body) {
        injectMap(body);
    }).catch( function(body){
        console.log("Error Response: " + body);
    });
};

const httpRequest = function(url, type) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.setRequestHeader('Content-Type', type);
        request.onload = event => {
            if (request.status < 200)
                return reject("1xx Status: Partial Response: " + request.status);
            else if (request.status == 304 || request.status == 200)
                return resolve(request);
            else if (request.status == 401)
                return reject("401 Error: Bad Request, please contact dev team");
            else if (request.status == 404)
                return reject("404 Error: Resource not found");
            else
                return reject(request.status + " Error: Unexpected Error");
        };
        request.onerror = event => {
            reject("Request Error: " + request.status);
        };
        request.send();
    });
};


const injectMap = function(data) {
    console.log("inject data:");
    console.log(data);
    container.innerHTML = data.responseText;
}

loadMap("/maps/kremlin-bicetre.svg");


// Unused
const mapIframeLoaded = function() {
    const map_ifr_document = getIframeDocument(map_ifr);
    const map_id = map_ifr_document.querySelector('svg').getAttribute('sodipodi:docname').replace(/\.[^.]*$/, '');
    ColorizeMap(map_ifr_document.querySelector('svg'));

    map_dname = maps[map_id]['d_name'];
    mapnavname.querySelector("a:nth-of-type(1)").setAttribute("href", "./maps/" + map_id + ".svg");
    mapnavname.querySelector("a:nth-of-type(1)").innerHTML = map_dname;
    mapnavdate.innerHTML = "Last Update: " + maps[map_id]['last_update'];
    document.title = `${documentTitle} – ${map_dname}`;

    window.history.pushState(
        {
            additionalInformation: map_dname
        },
        document.title,
        'https://epimap.fr/' + map_id
    );
};
