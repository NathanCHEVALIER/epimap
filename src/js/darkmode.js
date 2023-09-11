/**
 * Handle Color Mode preferences for UI
 */

const darkModeBtn = document.querySelector("#settings .onoffswitch:nth-of-type(1)");

/**
 * Get color mode preferences, based on:
 * - previous session preferences set in cookies
 * - Browser and OS color preferences
 * 
 * @returns {boolean} true if darkmode is prefered, light otherwise
 */
const getColorMode = function() {
    // Get cookie preference value
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('theme='))
        ?.split('=')[1];

    // Get cookie browser/os preference
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine Epimap Color Mode preference
    if (cookieValue === 'false') {
        console.log("Set Light Mode (Cookie previous user choice)");
        return false;
    }
    else if (cookieValue === 'true' || matched) {
        console.log("Set Dark Mode (System and/or browser default)");
        return true;
    }
    else {
        console.log("Set Light Mode (System and/or browser default)");
        return false;
    }
};

/**
 * Handle Browser preference change Event
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setColorMode(getColorMode());
});

/**
 * Handle Setting preference change Event
 */
darkModeBtn.addEventListener('change', e => {
    setColorMode(!document.querySelector("body").classList.contains("darkmode"));
})

/**
 * Apply Color Mode preference to UI
 * @param {boolean} mode: true for darkmode, false for light mode
 */
const setColorMode = function(mode) {
    const body = document.querySelector("body");
    const colorModeSwitch = document.querySelector("#settings > div:nth-of-type(1) input[type=checkbox]");

    colorModeSwitch.checked = mode;
    body.className = "";

    body.classList.remove("darkmode");
    if (mode)
        body.classList.add("darkmode");
    
    // Set cookie for next session
    document.cookie = "theme=" + mode + "; SameSite=None; Secure";
};

/**
 * Init Color Mode at page loading
 */
setColorMode(getColorMode());

// TODO: Check for Dark Reader plugin
// DarkReader.disable();