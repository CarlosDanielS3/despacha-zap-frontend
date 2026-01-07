function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Only modify API requests
    if (uri.startsWith('/api/')) {
        // Add API key header (hidden from browser)
        request.headers['x-api-key'] = { value: '${api_key}' };
        
        // Remove /api prefix from path for API Gateway
        request.uri = uri.replace('/api', '');
    }
    
    return request;
}
