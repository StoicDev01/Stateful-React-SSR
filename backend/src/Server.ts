import Express, { Router } from "express";
import { backendPort, backendURL } from "./config.js";
import glob from "glob"
import { ServerData } from "./ServerData.js";
import cors from "cors"
import bodyParser from "body-parser";

const isDev = process.env.NODE_ENV !== "production"
const server = Express();

if (isDev){
  server.use(cors());
}

async function apiRouter(){
  const apiRouter = Router();

  const files = glob.sync("./api/**/*.ts");

  for (const apiFile of files){
    const apiPath = apiFile.replaceAll(/(^.)|(api\/)|(\.ts$)/g, "");
    const apiModulePath = apiFile.replaceAll(/(\.ts$)/g, "");
    const apiModule = await import(apiModulePath);

    if (apiModule.default){
      console.log(`Importing Route /api${apiPath}`)
      apiRouter.use(apiPath, apiModule.default);
    }
    else{
      console.log(`Could not import Route /api/${apiPath} because doesnt have export default`);
    }
  }
  return apiRouter;
}

async function main() {

  ServerData.load();

  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  server.use(bodyParser.json())
  
  server.use("/api", await apiRouter());



  try {
    server.listen(backendPort, () => {
      console.log("BACKEND Server started on : ", backendURL);
    })
  }
  catch ( error){
    console.error(error);
  }
} 

main();
