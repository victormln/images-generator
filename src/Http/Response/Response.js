class Response {

    success(httpStatusCode, data) {
        return {
            'data': data
        };
    }

    fail(httpStatusCode, error) {
        return {
            'error': error
        }
    }
}

module.exports = Response;