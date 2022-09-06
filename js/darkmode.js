/** Color Mode */

const darkModeBtn = document.querySelector("#settings .onoffswitch:nth-of-type(1)");

const getColorMode = function()
{
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('theme='))
        ?.split('=')[1];

    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (cookieValue === 'false') {
        console.log("Set Light Mode (Cookie previous user choice)");
        return false;
    }
    else if (cookieValue === 'true' || matched)
    {
        console.log("Set Dark Mode (System and/or browser default)");
        return true;
    }
    else
    {
        console.log("Set Light Mode (System and/or browser default)");
        return false;
    }
};

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setColorMode(getColorMode());
});

const initColorMode = function() {
    setColorMode(getColorMode());
};

darkModeBtn.addEventListener('change', e => {
    setColorMode(!document.querySelector("body").classList.contains("darkmode"));
})

const setColorMode = function(mode) {
    const body = document.querySelector("body");
    const colorModeSwitch = document.querySelector("#settings > div:nth-of-type(1) input[type=checkbox]");

    colorModeSwitch.checked = mode;
    body.className = "";

    body.classList.remove("darkmode");
    if (mode)
        body.classList.add("darkmode");
    
    document.cookie = "theme=" + mode + "; SameSite=None; Secure";
};

initColorMode();

// Check for Dark Reader plugin
// DarkReader.disable();