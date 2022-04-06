const loadMap = function(url) {
    httpRequest(url, 'image/svg+xml', false).then( function(body) {
        injectMap(body);
        // TODO: Transform inject Map in Promise
        mapLoaded();
    }).catch( function(body){
        console.log("Error Response: " + body);
    });
};

const injectMap = function(data) {
    container.innerHTML = data.responseText;
    
    document.querySelectorAll("#container a").forEach( function(path) {
        path.addEventListener("click", e => onClickMapLink(e, path));
    });
}

const onClickMapLink = function(e, path) {
    e.preventDefault();

    let pathRef = path.getAttribute("href");
    if (pathRef == null)
        pathRef = path.getAttribute("xlink:href");
    
    // TODO: Trigger Error output for user
    if (pathRef == null)
        alert("This link is not legit !");
    else
        loadMap("/maps/" + pathRef);

    return false;
};

const initMap = function()
{
    httpRequest("/js/data.map.json", 'application/json', false).then( function(body) {
        maps = JSON.parse(body.responseText);
    }).catch( function(body){
        alert("Error while loading maps data" + body);
    });

    let path = window.location.href.split('/').pop();

    if (path.length == 0)
        path = "kremlin-bicetre";

    loadMap("/maps/" + path + ".svg");
    btn.classList.remove("menu-open");
    menu.classList.remove("menu-open");
    container.classList.remove("menu-open");
};

const mapLoaded = function() {
    const map_id = container.querySelector('svg').getAttribute('sodipodi:docname').replace(/\.[^.]*$/, '');
    const map_dname = maps[map_id]['d_name'];
    document.title = documentTitle + ": " + map_dname;

    mapnavname.querySelector("a:nth-of-type(1)").setAttribute("href", "./maps/" + map_id + ".svg");
    mapnavname.querySelector("a:nth-of-type(1)").innerHTML = map_dname;
    mapnavdate.innerHTML = "Last Update: " + maps[map_id]['last_update'];

    window.history.pushState({
            additionalInformation: map_dname
        },
        document.title,
        'https://epimap.fr/' + map_id
    );
};

initMap();