/**
 * Loads a map from the given url
 *
 * Depending on `updateState`, saves the loaded map in the history
 *
 * @param {string} url
 * @param {"push"|"replace"|false} updateState
 */

const loadMap = function(url, updateState = 'push') {
    httpRequest(url, 'image/svg+xml', false).then( function(body) {
        injectMap(body).then( function() {
            const mapId = url.split('/').pop().replace(/\.[^.]*$/, '');
            const mapName = maps[mapId]['d_name'];
            
            document.title = "Epimap: " + mapName;
            document.querySelector("#map-nav > div > div > a").innerHTML = mapName;
            document.querySelector("#map-nav > div > span").innerHTML = "Last Update: " + maps[mapId]['last_update'];

            if (updateState)
            {
                // Saves the loaded map in the history
                // If 'replace', replaces the current history entry instead of pushing a new one
                (updateState === 'replace' ? window.history.replaceState : window.history.pushState)
                    .apply(window.history, [{
                            mapUrl: url,
                            additionalInformation: mapName
                        },
                        document.title,
                        /*
                        'https://www.epimap.fr/' + */
                        mapId
                    ]);
            }
        }).catch( function(e) {
            displayError("Map Loading Error: " + e);
        });
    }).catch( function(body){
        displayError("Error Response: " + body);
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
        displayError("Invalid map link");
    else
        loadMap("/maps/" + pathRef);

    return false;
};

const initMap = function()
{
    httpRequest("/js/data.map.json", 'application/json', false).then( function(body) {
        maps = JSON.parse(body.responseText);
    }).catch( function(body){
        displayError("Map Loading Error: " + body);
    });

    let path = window.location.href.split('/').reverse()[0];
    path = path.split('.svg')[0];

    if (path.length == 0)
        path = "kremlin-bicetre";

    loadMap("/maps/" + path + ".svg", 'replace');
};

initMap();

/**
 * Listener for history changes
 * Loads the map corresponding to the given url in the history
 *
 * @param {PopStateEvent} event
 */
window.onpopstate = function(event) {
    loadMap(event.state.mapUrl, false);
};
