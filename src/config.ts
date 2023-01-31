export const dev = process.env.NODE_ENV !== 'production';

/* CONFIGS */
const productionUseHostPort = true;
const productionUseIp = true;
const productionUseHttp = true;
const localIpAddr = "localhost";
const productionPort = 443;
const hostPort = 3000;

export const http = (dev || productionUseHttp) ? "http" : "https";
export const hostname = (dev || productionUseIp) ? localIpAddr : `your_adress_here.com`;
export const port = ( productionUseHostPort || dev ) ? hostPort : productionPort;
export const url = `${http}://${hostname}:${port}`;