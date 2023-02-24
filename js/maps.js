/**
 * Loads a map from the given url
 *
 * Depending on `updateState`, saves the loaded map in the history
 *
 * @param {string} url
 * @param {"push"|"replace"|false} updateState
 */

const getCurrentMapId = () => {
    let path = window.location.href.split('/').reverse()[0];
    return path.split('.svg')[0];
}

const loadMap = function(url, updateState = 'push') {
    httpRequest(url, 'image/svg+xml').then( function(body) {
        injectMap(body).then( function() {
            const mapId = url.split('/').pop().replace(/\.[^.]*$/, '');
            const mapName = maps[mapId]['d_name'];
            
            document.title = "Epimap: " + mapName;
            document.querySelector("#map-label > div > div > a").innerHTML = mapName;
            document.querySelector("#map-label > div > span").innerHTML = "Last Update: " + maps[mapId]['last_update'];

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
            container.innerHTML = data;
            
            document.querySelectorAll("#container a").forEach( function(elt) {
                elt.addEventListener("click", e => onClickMapLink(e, elt));
                if (isRoomLinkWrapper(elt))
                    elt.classList.add('roomLinkWrapper');

                if (elt.getAttribute('xlink:type') === 'icon')
                    elt.querySelector('path').classList.add('icon');
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
    if (isRoomLinkWrapper(path)) {
        onCLickRoomInfo(e, path);
        return false;
    }

    let pathRef = path.getAttribute("href");
    if (pathRef == null)
        pathRef = path.getAttribute("xlink:href");

    if (pathRef == null)
        displayError("Invalid map link");
    else
        loadMap("/maps/" + pathRef);

    return false;
};

const initMap = function()
{
    httpRequest("/js/data.map.json", 'application/json').then( function(body) {
        maps = body;
    }).catch( function(body){
        displayError("Map Loading Error: " + body);
    });

    let path = getCurrentMapId();

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

const isRoomLinkWrapper = (elt) => {
    return elt.getAttribute("xlink:href") != undefined && elt.getAttribute("xlink:type") === 'room';
}

const onCLickRoomInfo = (e, elt) => {
    const room = elt.getAttribute("xlink:href");
    displayInfoMenu(maps[getCurrentMapId()].rooms[room]);

    infoMenu.classList.add("menu-open");
    document.getElementById("btn-menu").classList.add("menu-back");
}

const displayInfoMenu = (roomInfos) => {
    infoMenu.querySelector('div:nth-of-type(2) > h4').textContent = roomInfos.name;
    infoMenu.querySelector('div:nth-of-type(2) > span').textContent = roomInfos.description;
    infoMenu.querySelector('div:nth-of-type(1)').setAttribute('style', 'background-image: url(' + roomInfos.image + ')');

    infoMenu.querySelectorAll('div:nth-of-type(2) > div').forEach(elt => {
        elt.remove();
    })

    roomInfos.peoples.forEach( people => {
        infoMenu.querySelector('div:nth-of-type(2)').insertAdjacentHTML('beforeend', 
            '<div><div style="background-image: url('
            + 'https://cri.epita.fr/photos/user/' + people +
            ')" ></div><div><h5>' + people + '</h5><span>NaD</span></div></div>');
    });
}
