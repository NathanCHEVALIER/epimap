import fetch from 'node-fetch'

const getPage = async function (path = "") {
    return new Promise((resolve, reject) => {
        getPageAndHeader(path)
            .then( (response) => {
                let body = response[1];
                resolve(body);
            })
            .catch( (err) => {
                reject(err);
            });
    });
};

const getPageAndHeader = async function (path = "") {
    let url = process.env.SERVER_URL + path;

    //console.log(url);

    return new Promise((resolve, reject) => {
        fetch(url)
        .then(function(response) {
            if(response.ok) {
                response.text().then( (html) => {
                    //console.log(html);
                    resolve([response.headers, html]);
                });
            } else {
                reject('Network Error');
            }
            })
        .catch( (err) => {
            reject('Fetch Error: ' + err.message);
        });
    });
};

export {
    getPage,
}