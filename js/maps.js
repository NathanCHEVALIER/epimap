/**
 * Handle Map management (loading, events...)
 */

/**
 * Sanitize url to get mapId only
 * @param {string} url 
 * @returns {string} mapId
 */
const getMapId = (url) => {
    let path = url.split('/').reverse()[0];
    return path.split('.svg')[0];
}

/**
 * Loads a map from the given mapId
 * Depending on `updateState, saves the loaded map in the history
 * @param {string} mapId
 * @param {"push"|"replace"|false} updateState
 */
const loadMap = function(mapId, updateState = 'push') {
    // Request to get XML document
    httpRequest('/maps/' + mapId + '.svg', 'image/svg+xml').then( function(body) {
        // Inject XML content into the container
        injectMap(mapId, body).then( function() {
            // Change page document information 
            document.title = "Epimap: " + maps[mapId].name;
            if (updateState) {
                // Saves the loaded map in the history
                // If 'replace', replaces the current history entry instead of pushing a new one
                (updateState === 'replace' ? window.history.replaceState : window.history.pushState)
                    .apply(window.history, [{
                            mapUrl: mapId,
                            additionalInformation: maps[mapId].name
                        },
                        document.title,
                        mapId
                    ]);
            }
        }).catch( function(error) {
            displayError("Map Loading Error: " + error);
        });
    }).catch( function(error){
        displayError("Response Error: " + error);
    });
};

/** 
 * Inject Map as XML (SVG) into DOM container
 * @param {string} mapId
 * @param {string} data as XML text
 * @returns new Promise 
 */
const injectMap = function(mapId, data) {
    return new Promise((resolve, reject) => {
        try {
            // Set Map Infos
            container.innerHTML = data;
            document.querySelector("#map-label > div > div > a").innerHTML = maps[mapId].name;
            document.querySelector("#map-label > div > span").innerHTML = "Last Update: " + maps[mapId]['last_update'];
            
            // Add Event Listener for links in new map DOM elements
            document.querySelectorAll("#container a").forEach( function(elt) {
                elt.addEventListener("click", e => onClickMapLink(e, elt));
                if (isRoomLinkWrapper(elt))
                    elt.classList.add('roomLinkWrapper');

                if (elt.getAttribute('xlink:type') === 'icon')
                    elt.querySelector('path').classList.add('icon');
            });

            return resolve();
        }
        catch(error) {
            return reject(error);
        }
    });
}

/**
 * Handle Map Links Events
 * @param {Event} e
 * @param {string} path 
 */
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
        loadMap(getMapId(pathRef));

    return false;
};

/**
 * Init Map: load map data and set default map
 */
const initMap = function() {
    httpRequest("/js/data.map.json", 'application/json').then( function(body) {
        maps = body;
    }).catch( function(body){
        displayError("Map Loading Error: " + body);
    });

    let path = getMapId(window.location.href);
    if (path.length == 0)
        path = "kremlin-bicetre";

    loadMap(path, 'replace');
};

initMap();

/**
 * Listener for history changes: loads the map corresponding to the history
 * @param {PopStateEvent} event
 */
window.onpopstate = function(event) {
    loadMap(event.state.mapUrl, false);
};

/**
 * Check if DOM Object Element contains a room link
 * @param {Object} elt 
 * @returns true if object is a room link, false otherwise
 */
const isRoomLinkWrapper = (elt) => {
    return elt.getAttribute("xlink:href") != undefined && elt.getAttribute("xlink:type") === 'room';
}

/**
 * Click on room link Event listener
 * @param {Event} e 
 * @param {Object} elt 
 */
const onCLickRoomInfo = (e, elt) => {
    const room = elt.getAttribute("xlink:href");
    displayInfoMenu(maps[getMapId(window.location.href)].rooms[room]);

    infoMenu.classList.add("menu-open");
    document.getElementById("btn-menu").classList.add("menu-back");
}

/**
 * Set room infos on UI (Menu RoomInfo)
 * @param {Array} roomInfos 
 */
const displayInfoMenu = (roomInfos) => {
    if (roomInfos === undefined) {
        displayError("Undefined Room Infos. Please consider contributing on GitHub!");
        return false;
    }

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



