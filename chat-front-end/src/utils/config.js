export const ENV_DEV = 'dev';
export const ENV_PRODUCTION = 'production';

export const env =
  process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

/**
 * helper to check if the running environment points to the production backend
 */
export const isProduction = () => env === ENV_PRODUCTION;
/**
 * helper to check if the running environment points to the dev backend
 */
export const isDevelopment = () => env === ENV_DEV || env === 'development';


export const webSocketUrl = process.env.REACT_APP_WEBSOCKET_URL;