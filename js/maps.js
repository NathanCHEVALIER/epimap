const userIconPath = 'M 104.77707 65.75516 A 77.134933 77.134933 0 0 0 27.64224 142.88999 A 77.134933 77.134933 0 0 0 104.77707 220.02481 A 77.134933 77.134933 0 0 0 181.91189 142.88999 A 77.134933 77.134933 0 0 0 104.77707 65.75516 z M 107.41101 89.865833 C 110.72823 89.865833 113.5217 91.000599 115.79138 93.270276 C 118.06106 95.539952 119.19583 98.333426 119.19583 101.65064 C 119.19583 104.88057 118.06106 107.67404 115.79138 110.03101 C 113.5217 112.30069 110.72823 113.43545 107.41101 113.43545 C 104.18109 113.43545 101.38762 112.30069 99.030648 110.03101 C 96.760971 107.67404 95.626204 104.88057 95.626204 101.65064 C 95.626204 98.333426 96.760971 95.539952 99.030648 93.270276 C 101.38762 91.000599 104.18109 89.865833 107.41101 89.865833 z M 85.019617 124.17278 L 117.36235 124.17278 L 117.36235 189.12076 L 97.328426 189.12076 L 97.328426 139.36255 L 85.019617 139.36255 L 85.019617 124.17278 z';

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
    httpRequest(url, 'image/svg+xml', false).then( function(body) {
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
            container.innerHTML = data.responseText;
            
            document.querySelectorAll("#container a").forEach( function(elt) {
                elt.addEventListener("click", e => onClickMapLink(e, elt));
                if (isRoomLinkWrapper(elt))
                    elt.classList.add('roomLinkWrapper');
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
    httpRequest("/js/data.map.json", 'application/json', false).then( function(body) {
        maps = JSON.parse(body.responseText);
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
