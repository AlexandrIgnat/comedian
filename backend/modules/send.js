export const sendData = function(res, data) {
    res.writeHead(200, {
        "Content-Type": "text/json; charset=utf-8",
    });
    res.end(JSON.stringify(data));
}

export const sendError = function(res, status, error) {
    res.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(error);
}