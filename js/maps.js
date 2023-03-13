/**
 * Handle Map management (loading, events...)
 */

const urlRegex = /^\/[a-z]{2}(\/[a-z]+(\/-?[0-9]{1}(\/[-a-z0-9]+)?)?)?(\/)?$/g;

/**
 * Sanitize and convert url to get mapId only from the 2 formats
 * @param {string} url 
 * @returns {string} mapId
 */
const getMapId = (url) => {
    try {    
        url = (new URL(url)).pathname;
    }
    catch (e) { }

    if (url == "/")
        return "kb";

    // For /campus/building/floor/room format
    if (url.match(urlRegex) != null) {
        path = url.split('/');
        if (path.at(-1).length == 0)
            path.pop();

        if (path[2] === undefined)
            return path[1];
        else if (path[3] === undefined)
            return path[1] + '-' + path[2];
        else if (path[4] === undefined)
            return path[1] + '-' + path[2] + '-f' + path[3];
        else 
            return path[1] + '-' + path[2] + '-f' + path[3] + '-' + path[4];
    }

    // For /campus-building-ffloor format (still the mapId format)
    path = url.split('/').reverse()[0];
    return path.split('.svg')[0];
}

/**
 * Returns Map Object (from dataset) selected by MapId
 * @param {*} mapId 
 * @returns 
 */
const getMapObject = (mapId) => {
    for (let i = 0; i < maps.length; i++) {
        if (maps[i].id === mapId)
            return maps[i];
    }

    return null;
}

/**
 * Saves the loaded map in the history
 * @param {*} mapObj 
 * @param {*} updateState 
 */
const setHistory = function(mapObj, updateState = 'push') {
    document.title = "Epimap: " + mapObj.name;
    // If 'replace', replaces the current history entry instead of pushing a new one
    (updateState === 'replace' ? window.history.replaceState : window.history.pushState)
        .apply(window.history, [
            {
                mapUrl: mapObj.url,
                additionalInformation: mapObj.name
            },
            document.title,
            '/' + mapObj.url
        ]);
}

/**
 * Loads a map from the given mapId
 * Depending on `updateState, saves the loaded map in the history
 * @param {string} mapId
 * @param {"push"|"replace"|false} updateState
 */
const loadMap = function(mapId, updateState = 'push') {
    const map = getMapObject(mapId);
    if (map === null) {
        displayError("Error: This maps does not exist !");
        return;
    }

    // Request to get XML document
    httpRequest('/maps/' + map.src, 'image/svg+xml').then( function(body) {
        // Inject XML content into the container
        injectMap(map, body).then( function() {
            // Change page document information 
            if (updateState)
                setHistory(map, updateState);

            if (map.type === 'room') {
                document.querySelectorAll("#container a").forEach( function(elt) {
                    if (elt.getAttribute("xlink:type") === 'room' && elt.getAttribute("xlink:href") == map.room)
                        elt.classList.add('choosen');
                });
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
 * @param {Object} map
 * @param {string} data as XML text
 * @returns new Promise 
 */
const injectMap = function(map, data) {
    return new Promise((resolve, reject) => {
        try {
            // Set Map Infos
            container.innerHTML = data;
            document.querySelector("#map-label > div:nth-of-type(2) > div").innerHTML = map.type == "room" ? getMapObject(getMapId(map.campus + '-' + map.building + '-f' + map.floor)).name : map.name;

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
    httpRequest("/js/min.map.json", 'application/json').then( (body) => {
        maps = body;
        loadMap(getMapId(window.location.href), 'replace');
    })
    .catch( function(body){
        displayError("Map Loading Error: " + body);
    });
};

initMap();

/**
 * Listener for history changes: loads the map corresponding to the history
 * @param {PopStateEvent} event
 */
window.onpopstate = function(event) {
    loadMap(getMapId("/" + event.state.mapUrl), false);
    return false;
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
    document.querySelectorAll("#container a").forEach( function(elt) {
        if (elt.getAttribute("xlink:type") === 'room')
            elt.classList.remove('choosen');
    });
    elt.classList.add('choosen');

    let mapObj = getMapObject(getMapId(window.location.href));
    if (mapObj.type === 'room')
        mapObj = getMapObject(mapObj.campus + '-' + mapObj.building + '-f' + mapObj.floor + '-' + room);
    else
        mapObj = getMapObject(mapObj.id + '-' + room);

    displayInfoMenu(mapObj);
    if (window.location.pathname != ('/' + mapObj.url))
        setHistory(mapObj);
}

/**
 * Set room infos on UI (Menu RoomInfo)
 * @param {Array} roomInfos 
 */
const displayInfoMenu = (roomInfos) => {
    // Left menu layers handout
    infoMenu.classList.add("menu-open");
    document.getElementById("btn-menu").classList.add("menu-back");
    infoMenu.querySelector('div:nth-of-type(1)').style.display = 'block';

    // Basic check
    if (roomInfos === undefined) {
        displayError("Undefined Room Infos. Please consider contributing on GitHub!");
        return false;
    }

    // Insert room data into DOM
    infoMenu.querySelector('div:nth-of-type(1) > div:nth-of-type(2) h4').textContent = roomInfos.name;
    infoMenu.querySelector('div:nth-of-type(1) > div:nth-of-type(2) span').textContent = roomInfos.description;
    infoMenu.querySelector('div:nth-of-type(1) > div:nth-of-type(1)').setAttribute('style', 'background-image: url(' + roomInfos.image + ')');

    // Remove search results elements
    infoMenu.querySelectorAll('div:nth-of-type(2) > div').forEach(elt => {
        elt.remove();
    })

    // Add Peoples
    roomInfos.peoples.forEach( people => {
        infoMenu.querySelector('div:nth-of-type(2)').insertAdjacentHTML('beforeend', 
            '<div><div style="background-image: url('
            + 'https://cri.epita.fr/photos/user/' + people +
            ')" ></div><div><h5>' + people + '</h5><span>NaD</span></div></div>');
    });
}



