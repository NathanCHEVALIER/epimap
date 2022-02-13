/** Yet another kind of features*/

const map_ifr = document.getElementById("map-ifr");

const getIframeDocument = function(ifr) {
    const elt = (ifr.contentWindow || ifr.contentDocument);
    return elt.document ? elt.document : elt;
};

const getColorMode = function()
{
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (matched)
	    console.log('Currently in dark mode');
    else
	    console.log('Currently in light mode');
};

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    getColorMode();
});

// Check for Dark Reader plugin
// DarkReader.disable();

getColorMode();

/** Colorize Maps */

const ColorizeMap = function(svgDoc)
{
    var paths = svgDoc.querySelectorAll("path");

    document.querySelector("body").classList.add("darkmode");

    for (let i = 0; i < paths.length; i++) {
        paths[i].setAttribute('style', 'stroke: #dddddd !important; fill: transparent;');
    }
};

ColorizeMap();