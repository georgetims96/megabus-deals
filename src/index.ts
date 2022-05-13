import express, { Express, Request, Response} from "express";
import path from "path";
import dotenv from "dotenv";

import * as routes from "./routes";

// Set up configuration
dotenv.config()

const app : Express = express();
const port : string = process.env.SERVER_PORT;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

routes.register(app);

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server listening at port ${port}`);
});
