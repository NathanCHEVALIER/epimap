import cheerio from 'cheerio';
import { 
    getPage,
} from './utils.js'

process.env.SERVER_URL = 'http://0.0.0.0:8000';

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

const r = await extractData();
console.log(r);

Object.keys(r).forEach( (elt) => {
    console.log(elt + ': ');
    console.log(r[elt]);
})