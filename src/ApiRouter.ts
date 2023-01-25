import BodyParser from "body-parser"
import glob from "glob"
import Express  from "express";
import Path from "path"

export default async function apiRouter(apiFolder : string= "./api"){
  const apiRouter = Express.Router();
  const apifiles = Path.join(apiFolder, "/**/*.*s");
  console.log("API FILES ", apifiles)
  const files = glob.sync(apifiles);
  console.log(files);

  for (const apiFile of files){
    const apiPath = apiFile.match(/(?<=\/api)[\w\/]*/g);
    const apiModulePath = (apiFile.replaceAll(/(\.ts$)/g, ".js"));
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