/**
 * Dynamic URL configuration utility
 * Automatically detects frontend URL based on environment and common ports
 */

const getFrontendUrl = () => {
  // Production environment
  if (process.env.NODE_ENV === 'production') {
    return process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000';
  }

  // Development environment - dynamic detection
  const host = process.env.CLIENT_HOST || 'localhost';
  
  // Check for explicit configuration first
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }
  
  if (process.env.CLIENT_URL) {
    return process.env.CLIENT_URL;
  }
  
  // Support for custom port
  if (process.env.FRONTEND_PORT) {
    return `http://${host}:${process.env.FRONTEND_PORT}`;
  }

  // Common development ports in order of preference
  const commonPorts = [5173, 3000, 5157, 3001, 8080];
  const port = commonPorts.find(p => p) || 5173;
  
  return `http://${host}:${port}`;
};

const getBackendUrl = () => {
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 5000;
  return `http://${host}:${port}`;
};

module.exports = {
  getFrontendUrl,
  getBackendUrl
};
