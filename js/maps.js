const loadMap = function(url) {
    httpRequest(url, 'image/svg+xml', false).then( function(body) {
        injectMap(body).then( function() {
            const mapId = url.split('/').pop().replace(/\.[^.]*$/, '');
            const mapName = maps[mapId]['d_name'];
            
            document.title = "Epimap: " + mapName;
            document.querySelector("#map-nav > div > div > a").innerHTML = mapName;
            document.querySelector("#map-nav > div > span").innerHTML = "Last Update: " + maps[mapId]['last_update'];

            window.history.pushState({
                    additionalInformation: mapName
                },
                document.title,
                'https://epimap.fr/' + mapId
            );
        }).catch( function(e) {
            console.log("Map Loading Error: " + e);
        });
    }).catch( function(body){
        console.log("Error Response: " + body);
    });
};

const injectMap = function(data) {
    return new Promise((resolve, reject) => {
        try {
            container.innerHTML = data.responseText;
            
            document.querySelectorAll("#container a").forEach( function(path) {
                path.addEventListener("click", e => onClickMapLink(e, path));
            });
        }
        catch(e) {
            return reject(e);
        }

        return resolve();
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
};

initMap();