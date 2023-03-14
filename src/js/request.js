/**
 * HTTP Request Wrapper using fetch
 * @param {string} url 
 * @param {string} type 
 * @returns {Promise} Body Data as JSON or XML Text, Error in case of reject
 */
const httpRequest = function(url, type) {
    return new Promise ((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': type,
            },
            mode: 'cors',
            cache: 'default'
        })
        .then( (response) => {
            if (!response.ok)
                reject('Response Error');

            if ( type == 'application/json' ) {
                response.json().then(data => {
                    resolve(data)
                });
            }
            else if ( type == 'image/svg+xml' ) {
                response.text().then(data => {
                    resolve(data)
                });
            }
        })
        .catch( (error) => {
            reject(error);
        })
    });
};