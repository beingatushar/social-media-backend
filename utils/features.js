export const sendResponse = (req, res, statusCode, data = null, error = null) => {
    const success = !error;

    const response = {
        success,
        status: statusCode,
        statusText: getStatusText(statusCode) || (success ? 'Success' : 'Error')
    };

    if (data !== null) {
        response.data = data;
    }

    if (error !== null) {
        response.error = {
            message: error.message || 'An error occurred',
            code: error.code || 'UNKNOWN_ERROR'
        };
    }

    return res.status(statusCode).json(response);
};

const getStatusText = (statusCode) => {
    switch (statusCode) {
        case 200:
            return 'OK';
        case 400:
            return 'Bad Request';
        case 401:
            return 'Unauthorized';
        case 404:
            return 'Not Found';
        case 500:
            return 'Internal Server Error';
        default:
            return null;
    }
};

// Example usage:
// sendResponse(req, res, 200, { message: 'Data retrieved successfully' });
// sendResponse(req, res, 404, null, { message: 'Resource not found', code: 'RESOURCE_NOT_FOUND' });
// sendResponse(req, res, 500, null, { message: 'Internal server error', code: 'INTERNAL_SERVER_ERROR' });
