import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 
 * @param {*} campus 
 * @param {*} building 
 * @param {*} floor 
 * @param {*} room 
 * @param {*} name 
 * @param {*} date 
 * @param {*} data 
 * @returns
 */
const toMapObj = (campus, building, floor, room, name, date, data) => {
    if (campus === null)
        return null;
    
    // Basics
    let type, id, url, src = null;
    let svg = false;
    if (building === null) {
        type = "campus";
        svg = true;
        id = campus;
        url = campus;
        src = campus + '.svg';
    }
    else if (floor === null) {
        type = "building";
        id = campus + '-' + building;
        url = campus + '/' + building;
        src = campus + '.svg';
    }
    else if (room === null) {
        type = "floor";
        svg = true;
        id = campus + '-' + building + '-f' + floor;
        url = campus + '/' + building + '/' + floor;
        src = campus + '-' + building + '-f' + floor + '.svg';
    }
    else {
        type = "room";
        id = campus + '-' + building + '-f' + floor + '-' + room;
        url = campus + '/' + building + '/' + floor + '/' + room;
        src = campus + '-' + building + '-f' + floor + '.svg';
    }

    if (campus == 'others' && type == "campus")
        svg = false;

    // Datas
    let description = null;
    let tenant = null;
    let image = null;
    let peoples = [];
    let tags = [];
    if (data != null) {
        description = data.description == undefined ? null : data.description;
        tenant = data.tenant == undefined ? null : data.tenant;
        image = data.image == undefined ? null : data.image;
        peoples = (data.peoples === undefined || data.peoples === null ? [] : data.peoples);
        tags = (data.tags === undefined || data.tags === null ? [] : data.tags);
    }

    return {
        "id": id,
        "url": url,
        "src": src,
        "type": type,
        "svg": svg,
        "campus": campus,
        "building": building,
        "floor": floor,
        "room": room,
        "name": name,
        "last_update": date,
        "description": description,
        "tenant": tenant,
        "image": image,
        "peoples": peoples,
        "tags": tags
    }
}

/**
 * 
 * @param {*} path 
 * @returns 
 */
const getJSON = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                reject(null);
            }
        
            resolve(JSON.parse(data));
        });
    });
}

const isInArray = (maps, str) => {
    for (let i = 0; i < maps.length; i++) {
        if (maps[i].id === str)
            return true;
    }

    return false;
}

/**
 * Main Scope
 */
getJSON(path.join(__dirname, '../src/js/data.map.json')).then( async (data) => {
    let maps = [];
    let errors = 0;
    let warnings = 0;

    //Minimify Data Map
    Object.keys(data).forEach(campus => {
        maps.push(toMapObj(campus, null, null, null, data[campus].name, data[campus].last_update, null));

        Object.keys(data[campus].buildings).forEach(building => {
            let b = data[campus].buildings[building];
            maps.push(toMapObj(campus, building, null, null, b.name, b.last_update, null));

            Object.keys(data[campus].buildings[building].floors).forEach(floor => {
                let f = data[campus].buildings[building].floors[floor];
                maps.push(toMapObj(campus, building, f.floor, null, f.name, f.last_update, null));

                Object.keys(data[campus].buildings[building].floors[floor].rooms).forEach(room => {
                    let r = data[campus].buildings[building].floors[floor].rooms[room];
                    maps.push(toMapObj(campus, building, f.floor, room, r.name, f.last_update, r));
                });
            });
        });
    });

    // Add People
    await getJSON(path.join(__dirname, '../src/js/data.people.json')).then((peoples) => {
        maps = maps.map( (m) => {
            if (m.peoples.length == 0)
                return m;

            m.peoples = m.peoples.map( (people) => {
                if (peoples[people] === undefined || peoples[people] === null) {
                    console.log('❌ ERROR: Missing people infos (' + people + ')');
                    errors++;
                }

                return peoples[people];
            });

            return m;
        });
    });

    // Check
    fs.readdirSync(path.join(__dirname, '../src/maps/')).forEach(function (file) {
        let locErr = 0;
        if (!isInArray(maps, file.split('.svg')[0])) {
            console.log('Error: Missing DATA for "' + file);
            locErr++;
        }
        else {
            const data = fs.readFileSync(path.join(__dirname, '../src/maps/', file), { encoding:'utf8', flag:'r' });
            let $ = cheerio.load(data);
            let svgHeader = $('svg')[0].attribs;

            // Check header properties
            if (svgHeader['width'] != '100%' || svgHeader['height'] != '100%') {
                console.log('    Error: Map format error (width or height differs from 100%) in "' + file.split('.svg')[0]);
                locErr++;
            }

            // Check for room existence in data map
            let links = $('a').toArray().filter( (l) => {
                return $(l)[0].attribs['type'] === 'room';
            }).map( (l) => {
                return $(l)[0].attribs['href'];
            }).forEach( (l) => {
                if (!isInArray(maps, file.split('.svg')[0] + '-' + l)) {
                    console.log('    Error: Missing DATA for "' + file.split('.svg')[0] + '-' + l + '"');
                    locErr++;
                }
            });
        }

        errors += locErr;
        if (locErr == 0)
            console.log('✅ ' + file.split('.svg')[0] + ' is valid'); //✔️
        else
            console.log('❌ ' + file.split('.svg')[0] + ' contains errors, see above')
    });

    maps.forEach( (elt) => {
        if (elt.svg && !fs.existsSync(path.join(__dirname, '../src/maps/' + elt.id + '.svg'))) {
            console.log('❌ ERROR: Missing SVG file for "' + elt.id + '" map');
            errors++;
        }

        if (elt.type === 'room') {
            if (elt.name == null || elt.image == null || elt.description == null) {
                console.log('⚠️ Warning: Missing name, image or description for ' + elt.id);
                warnings++;
            }
        }
    });

    // TODO: check for unused room datas (and people ?) -> ⚠️ Warnings

    console.log(errors + ' errors, ' + warnings + ' warnings');
    if (errors != 0) {
        console.log('Cannot Write JSON Datafile');
        process.exit(1);
    }

    // Write File
    fs.writeFile(path.join(__dirname, '../src/js/data.min.json'), JSON.stringify(maps), err => {
        if (err) 
            console.log(err);

        console.log('✔️ Map JSON Datafile is written');
    });

    return 0;
});