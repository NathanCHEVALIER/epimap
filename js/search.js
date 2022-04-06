// DEPRECATED: should be updated

/*** Dev in progress */

var results;

const search = function(str)
{
    const nbmaps = Object.keys(maps).length;
    results = [];
    
    if (str === "")
        return;

    for (let i = /*nbmaps - 1*/17; i >= 0; --i)
    {
        searchTextInMap(Object.keys(maps)[i], str);
    }
    
    setTimeout(searchRender, 100);
};

const searchTextInMap = function(map, str) {
    let request = new XMLHttpRequest();
    request.open("GET", 'maps/' + map + '.svg');
    request.setRequestHeader("Content-Type", "image/svg+xml");
    request.addEventListener("load", function(event) {
        let response = event.target.responseText;
        let doc = new DOMParser();
        let svg = doc.parseFromString(response, "image/svg+xml");
        const labels = svg.querySelectorAll('text > tspan');

        for (let i = 0; i < labels.length; ++i)
        {
            if (labels[i].textContent === "")
                continue;

            const subdist = isSubString(labels[i].textContent, str);
            if (subdist >= 0)
            {
                insertInPlace({
                    key: labels[i].textContent,
                    value: 0.1 * subdist,
                    map: map,
                });
                continue;
            }
            
            /*const d = editDist(labels[i].textContent, str, labels[i].textContent.length, str.length);
            if (labels[i].textContent.length > 0 && d <= (0.4 * str.length))
            {
                insertInPlace({
                    key: labels[i].textContent,
                    value: 0.3 * str.length,
                    map: map
                });
            }*/
        }
    });
    request.send();
};

const editDist = function(str1, str2, m, n)
{
    if (m == 0)
        return n;
 
    if (n == 0)
        return m;
 
    if (str1[m - 1] == str2[n - 1])
        return editDist(str1, str2, m - 1, n - 1);
 
    return 1 + Math.min(
        editDist(str1, str2, m, n - 1),
        editDist(str1, str2, m - 1, n),
        editDist(str1, str2, m - 1, n - 1));
};

const isSubString = function(str1, str2)
{
    const len = str2.length;
    str1 = str1.toUpperCase();
    str2 = str2.toUpperCase();

    for (let i = 0; i <= str1.length - len; i++)
    {
        if (str1.substring(i, i + len) === str2)
            return str1.length - len;
    }

    return -1;
};

const insertInPlace = function(obj)
{
    for (let i = 0; i < results.length; i++)
    {
        if (obj['value'] < results[i]['value'])
        {
            results.splice(i, 0, obj);
            return;
        }
    }

    results.push(obj);
};

searchBtn.addEventListener('click', function() {
    search(document.querySelector("#search > div > input").value);
});

document.querySelector("#search > div > input").addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && 
        document.querySelector("#search > div > input") === document.activeElement) 
    {
        e.preventDefault();
        search(document.querySelector("#search > div > input").value);
    }
});

const searchRender = function()
{
    console.log(results);
    const container = searchTemplate.parentNode;

    while (container.lastChild !== searchTemplate) {
        container.removeChild(container.lastChild);
    }

    for (let i = 0; i < results.length; i++)
    {
        let dupBlock = searchTemplate.cloneNode([true]);

        dupBlock.children[0].innerHTML = results[i]['key'];
        dupBlock.children[1].innerHTML = map_dname = maps[results[i]['map']]['d_name'];
        dupBlock.removeAttribute('id');
        dupBlock.setAttribute("href", results[i]['map'])
        dupBlock.style.display = "block";

        dupBlock.addEventListener('click', function() {
            //map_ifr.setAttribute("src", "./maps/" + results[i]['map'] + ".svg");
            loadMap("/maps/" + results[i]['map'] + ".svg");
            btn.classList.remove("menu-open");
            menu.classList.remove("menu-open");
            container.classList.remove("menu-open");
            cache.classList.remove("menu-open");
        });

        container.append(dupBlock);
    }
};
