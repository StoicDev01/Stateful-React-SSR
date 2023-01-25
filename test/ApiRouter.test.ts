import { describe,expect,test} from "vitest"
import apiRouter from "../src/ApiRouter"
import handler1 from "./api/test3"
import handler2 from "./api/test2/test4"

import Path from "path"

describe("API ROUTER", () => {

    test( "API ROUTER ROUTES", async () => {
        const routes = await apiRouter(Path.join(__dirname, "api"));

        expect(routes.stack.length === 2);
        expect(routes.stack[0].regexp.toString() === new RegExp(/(?:^test2\/test4\/?(?=\/|$))/i)).toString();
        expect(routes.stack[0].handle === handler1);

        expect(routes.stack[1].regexp.toString() === new RegExp(/(?:^test3\/?(?=\/|$))/i)).toString();
        expect(routes.stack[1].handle === handler2);

    })
})