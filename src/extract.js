import cheerio from 'cheerio';
import fs from 'fs';



const dirPath = '../maps/';

fs.readFile('../js/min.map.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    data = JSON.parse(data);
    data.forEach( elt => {
        if (elt.svg) {
            fs.exists('../maps/' + elt.id + '.svg', function (exist) {  
                if (!exist) {
                    console.log('WARNING: Missing SVG file for "' + elt.id + '" map');  
                }  
            });
        }
    });
});

// check every menu link, link in maps and rooms in map

/*
const extractDataFromMap = async (url) => {
    return new Promise( (resolve) => {
        getPage(url).then( (response) => {
            let $ = cheerio.load(response);
            let articles = [];

            let links = $('a').toArray();

            links.forEach( (link) => {
                const peoples = $(link).attr("role");
                const tags =  $(link).attr("type");

                if (peoples != undefined || tags != undefined) {
                    articles.push({
                        "name": $(link).text().trim(),
                        "people": peoples === undefined ? peoples : peoples.split(', '),
                        "tags": tags === undefined ? tags : tags.split(', ')
                    })
                }
            });

            resolve(articles);
        })
        .catch( (err) => {
            resolve("Unknown Map");
        })
    });
}

const extractData = async () => {
    return new Promise( async (resolve) => {
        const data = JSON.parse(await getPage('/js/data.map.json'));

        let promises = Object.keys(data).map( async (map) => {
            const rooms = await extractDataFromMap('/maps/' + map + '.svg');
            return { 'name': map, 'rooms': rooms };
        })

        const res = await Promise.all(promises);
        
        res.forEach( (elt) => {
            data[elt.name]['rooms'] = elt.rooms;
        });

        resolve(data);
    });
}
*/
/*const r = await extractData();
console.log(r);
*/
fs.readFile(dirPath + 'kb-voltaire-f0.svg', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let $ = cheerio.load(data);
    let links = $('a').toArray();

    links.forEach( (link) => {
        const tags =  $(link).attr("type");
        
        if (tags != undefined)
            console.log($(link).attr('href') + ' - ' + tags);
    });
});

/*
Object.keys(r).forEach( (elt) => {
    console.log(elt + ': ');
    console.log(r[elt]);
})*/