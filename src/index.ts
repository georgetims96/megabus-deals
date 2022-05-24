import express, { Express, Request, Response} from "express";
import path from "path";
import dotenv from "dotenv";

import * as routes from "./routes";
import * as api from "./routes/api_backup";

// Set up configuration
dotenv.config()

const app : Express = express();
const port : string = process.env.SERVER_PORT;

// Set up EJS templating
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up post request
app.use(express.urlencoded());

// Set up routes
routes.register(app);
api.register(app);

// Run server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server listening at port ${port}`);
});
