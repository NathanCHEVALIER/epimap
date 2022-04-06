const httpRequest = function(url, type, policy) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url, policy);
        request.setRequestHeader('Content-Type', type);
        request.onload = event => {
            if (request.status < 200)
                return reject("1xx Status: Partial Response: " + request.status);
            else if (request.status == 304 || request.status == 200)
                return resolve(request);
            else if (request.status == 401)
                return reject("401 Error: Bad Request, please contact dev team");
            else if (request.status == 404)
                return reject("404 Error: Resource not found");
            else
                return reject(request.status + " Error: Unexpected Error");
        };
        request.onerror = event => {
            reject("Request Error: " + request.status);
        };
        request.send();
    });
};