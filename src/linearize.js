import fs from 'fs';

const toObj = (campus, building, floor, room, name, date, data) => {
    if (campus === null)
        return null;
    
    // Basics
    let type, id, url = null;
    let svg = false;
    if (building === null) {
        type = "campus";
        svg = true;
        id = campus;
        url = campus;
    }
    else if (floor === null) {
        type = "building";
        id = campus + '-' + building;
        url = campus + '/' + building;
    }
    else if (room === null) {
        type = "floor";
        svg = true;
        id = campus + '-' + building + '-f' + floor;
        url = campus + '/' + building + '/' + floor;
    }
    else {
        type = "room";
        id = campus + '-' + building + '-f' + floor + '-' + room;
        url = campus + '/' + building + '/' + floor + '/' + room;
    }

    if (campus == 'others' && type == "campus")
        svg = false;

    // Datas
    let description, tenant, image, peoples, tags = null;
    if (data != null) {
        description = data.description;
        tenant = data.tenant;
        image = data.tenant;
        peoples = data.peoples;
        tags = data.tags;
    }

    return {
        "id": id,
        "url": url,
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

fs.readFile('../js/data.map.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    data = JSON.parse(data);
    console.log(data);

    let maps = [];

    //const toObj = (campus, building, floor, room, name, date, data)
    Object.keys(data).forEach(campus => {
        maps.push(toObj(campus, null, null, null, data[campus].name, data[campus].last_update, null));
        
        Object.keys(data[campus].buildings).forEach(building => {
            let b = data[campus].buildings[building];
            maps.push(toObj(campus, building, null, null, b.name, b.last_update, null));

            Object.keys(data[campus].buildings[building].floors).forEach(floor => {
                let f = data[campus].buildings[building].floors[floor];
                maps.push(toObj(campus, building, f.floor, null, f.name, f.last_update, null));
    
                Object.keys(data[campus].buildings[building].floors[floor].rooms).forEach(room => {
                    let r = data[campus].buildings[building].floors[floor].rooms[room];
                    maps.push(toObj(campus, building, f.floor, room, r.name, f.last_update, r));
                });
            });
        });
    });

    console.log(maps)

    fs.writeFile('../js/min.map.json', JSON.stringify(maps), err => {
        if (err) {
            console.error(err);
        }

        console.log('written');
    });

    maps.forEach( elt => {
        if (elt.svg) {
            fs.exists('../maps/' + elt.id + '.svg', function (exist) {  
                if (!exist) {
                    console.log('WARNING: Missing SVG file for "' + elt.id + '" map');  
                }  
            });
        }
    });
});