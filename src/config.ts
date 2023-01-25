export const dev = process.env.NODE_ENV !== 'production';

/* CONFIGS */
const productionHighPorts = true;       // Choose to use high ports like 3000 instead of 443 or 80
const productionUseIp = false;
const productionUseHttp = false;
const localIpAddr = "192.168.0.10";
export const name = "ChaoticForge"

export const http = (dev || productionUseHttp) ? "http" : "https";
export const hostname = (dev || productionUseIp) ? localIpAddr : `${name.toLowerCase()}.onrender.com`;

export const hostPort = (dev || productionHighPorts) ? 3000 : 443;
export const productionPort = 443;
export const url = `${http}://${hostname}:${ dev ? hostPort : productionPort}`;