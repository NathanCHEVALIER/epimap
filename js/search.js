const searchInput = document.querySelector('header > input[name="search"]');
let results;

/**
 * Search Handler: returns a set of value corresponding to input value
 * @param {string} str 
 * @returns 
 */
const search = function(str)
{
    displayWarning("Dataset is incomplete, results could be incomplete. Please consider contributing !");
    results = [];
    
    if (str === "")
        return;

    console.log(str);

    for (let i = 0; i < maps.length; i++) {
        if ((grade = gradeSet(maps[i].tags.concat(maps[i].name), str.split(' '))) >= 0) {
            insertInPlace({
                'title': maps[i].name,
                'label': getLabel(maps[i]),
                'url': maps[i].url,
                'grade': grade,
            });
        }
        
        if ((grade = gradeSet(maps[i].peoples, str.split(' '))) >= 0) {
            insertInPlace({
                'title': maps[i].name,
                'label': maps[i].peoples.join(', '),
                'url': maps[i].url,
                'grade': grade,
            });
        }
    }
    
    searchRender();
};

/**
 * 
 * @param {*} set 
 * @param {*} keywords 
 * @returns 
 */
const gradeSet = (set, keywords) => {
    let grade = 0;

    keywords.forEach( keyword => {
        keyword = keyword.toLowerCase();
        set.forEach( elt => {
            elt = elt.toLowerCase();
    
            if (elt.includes(keyword))
                grade += 1;
            else if (keyword.includes(elt))
                grade += 1;
        });
    });
    
    return grade == 0 ? -1 : grade;
}

/**
 * 
 * @param {*} str1 
 * @param {*} str2 
 * @returns 
 */
const isSubString = (str1, str2) => {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    if (str1.includes(str2)) {
        return str1.length - str2.length;
    }

    return -1;
};

/**
 * 
 * @param {*} obj 
 * @returns 
 */
const insertInPlace = (obj) => {
    for (let i = 0; i < results.length; i++) {
        if (obj.grade < results[i].grade) {
            results.splice(i, 0, obj);
            return;
        }
    }

    results.push(obj);
};

const getLabel = (mapObj) => {
    if (mapObj.type === 'campus')
        return mapObj.campus;
    else if (mapObj.type === 'building')
        return mapObj.campus;
    else if (mapObj.type === 'floor')
        return mapObj.campus + ' > ' + mapObj.building;
    else
        return mapObj.campus + ' > ' + mapObj.building + ' > ' + mapObj.floor;
}

/** Events Listener for start search process */
searchBtn.addEventListener('click', function() {
    search(searchInput.value);
});

searchInput.addEventListener("keydown", function(e) {
    if (e.keyCode === 13 && searchInput === document.activeElement) {
        e.preventDefault();
        search(searchInput.value);
    }
});

/**
 * Event Handler
 * @param {} elt 
 */
const searchResultClickHandler = (elt) => {
    loadMap(getMapId(elt.getAttribute('href')));
    menuButton.classList.remove("menu-back");
    infoMenu.classList.remove("menu-open");
}

/**
 * Injects search results in UI
 */
const searchRender = function()
{
    infoMenu.classList.add("menu-open");
    navMenu.classList.remove("menu-open");
    infoMenu.querySelector('div:nth-of-type(1)').style.display = 'none';
    menuButton.classList.add("menu-back");
    menuButton.classList.remove("menu-open");
    
    const searchContainer = document.querySelector("#info-menu > div:nth-of-type(2)");
    searchContainer.innerHTML = '';

    if (results.length === 0) {
        searchContainer.insertAdjacentHTML('beforeend', 'Pas de résultats');
    }

    for (let i = 0; i < results.length; i++)
    {
        searchContainer.insertAdjacentHTML('beforeend', 
            '<div class="search-result" href="/' + results[i].url + '" onclick="searchResultClickHandler(this)" > \
                <h4>' + results[i].title + '</h4> \
                <span>' + results[i].label + '</span> \
            </div>'
        );

/*
        dupBlock.children[0].innerHTML = results[i].title;
        dupBlock.children[1].innerHTML = results[i].label;
        dupBlock.removeAttribute('id');
        dupBlock.setAttribute("href", results[i].url)
        dupBlock.style.display = "block";
*/
        /*document.querySelectorAll(".search-result").forEach(elt => {
                .addEventListener('click', function() {
                //alert('not comptible for the moment');
                //map_ifr.setAttribute("src", "./maps/" + results[i]['map'] + ".svg");
                loadMap(getMapId(results[i].url));
                btn.classList.remove("menu-open");
                menu.classList.remove("menu-open");
                container.classList.remove("menu-open");
                cache.classList.remove("menu-open");
            });
        });

        container.append(dupBlock);*/
    }
};
