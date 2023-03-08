const searchInput = document.querySelector('header > input[name="search"]');

/*** Dev in progress */

let results;

const search = function(str)
{
    displayWarning("Search engine is deprecated. Please consider contributing!");
    results = [];
    
    if (str === "")
        return;

    Object.keys(maps).forEach(campus => {
        Object.keys(maps[campus].buildings).forEach(building => {
            Object.keys(maps[campus].buildings[building].floors).forEach(floor => {
                Object.keys(maps[campus].buildings[building].floors[floor].rooms).forEach(room => {
                    const roomObj = maps[campus].buildings[building].floors[floor].rooms[room];
    
                    const subdist = gradeSet(roomObj.tags.concat(roomObj.name).concat(roomObj.peoples), str);
                    if (subdist >= 0)
                    {
                        insertInPlace({
                            key: roomObj.name,
                            value: 0.1 * subdist,
                            map: floor,
                        });
                    }
            
                });
            });
        });
    });
    
    setTimeout(searchRender, 100);
};

const gradeSet = (set, ref) => {
    let grade = 0;
    ref = ref.toLowerCase();

    set.forEach( elt => {
        elt = elt.toLowerCase();

        if (elt.includes(ref))
            grade += 1;
    });

    return grade == 0 ? -1 : grade;
}

const isSubString = (str1, str2) => {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str1.includes(str2)) {
        return str1.length - str2.length;
    }

    return -1;
};

const insertInPlace = (obj) => {
    for (let i = 0; i < results.length; i++) {
        if (obj['value'] < results[i]['value']) {
            results.splice(i, 0, obj);
            return;
        }
    }

    results.push(obj);
};

searchBtn.addEventListener('click', function() {
    search(searchInput.value);
});

searchInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && searchInput === document.activeElement) {
        e.preventDefault();
        search(searchInput.value);
    }
});

const searchRender = function()
{
    infoMenu.classList.add("menu-open");
    infoMenu.querySelector('div:nth-of-type(1)').style.display = 'none';
    document.getElementById("btn-menu").classList.add("menu-back");

    console.log(results);


    const container = searchTemplate.parentNode;
    while (container.lastChild !== searchTemplate) {
        container.removeChild(container.lastChild);
    }

    for (let i = 0; i < results.length; i++)
    {
        let dupBlock = searchTemplate.cloneNode([true]);

        dupBlock.children[0].innerHTML = results[i]['key'];
        dupBlock.children[1].innerHTML = 'Lol';//aps[results[i]['map']]['d_name'];
        dupBlock.removeAttribute('id');
        dupBlock.setAttribute("href", results[i]['map'])
        dupBlock.style.display = "block";

        dupBlock.addEventListener('click', function() {
            alert('not comptible for the moment');
            //map_ifr.setAttribute("src", "./maps/" + results[i]['map'] + ".svg");
            /*loadMap("/maps/" + results[i]['map'] + ".svg");
            btn.classList.remove("menu-open");
            menu.classList.remove("menu-open");
            container.classList.remove("menu-open");
            cache.classList.remove("menu-open");*/
        });

        container.append(dupBlock);
    }
};
