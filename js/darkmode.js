/** Color Mode */

const darkModeBtn = document.querySelector("#settings .onoffswitch:nth-of-type(1)");

const getColorMode = function()
{
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (matched)
    {
        console.log("System default currently in dark mode");
        return true;
    }
    else
    {
        console.log("System default currently in light mode");
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
    if (document.querySelector("body").classList.contains("darkmode"))
        document.querySelector("body").classList.remove("darkmode");
    else
        document.querySelector("body").classList.add("darkmode");
})

const setColorMode = function(mode) {
    const body = document.querySelector("body");
    const colorModeSwitch = document.querySelector("#settings > div:nth-of-type(1) input[type=checkbox]");

    colorModeSwitch.checked = mode;
    body.className = "";

    if (mode)
        body.classList.add("darkmode");
};

initColorMode();

// Check for Dark Reader plugin
// DarkReader.disable();