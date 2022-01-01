
/** Yet another kind of features to moove */

const setColorMode = function()
{
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (matched)
	    console.log('Currently in dark mode');
    else
	    console.log('Currently in light mode');
};

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setColorMode();
});

DarkReader.disable();

setColorMode();