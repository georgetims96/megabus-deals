import express, { Express, Request, Response} from "express";
import path from "path";
import dotenv from "dotenv";

import * as routes from "./routes";
import * as api from "./routes/api";
import * as cache from "./middleware/caching";
import * as dataAnalytics from"./middleware/data_analytics";

// Set up configuration
dotenv.config()

const app : Express = express();
const port : string = process.env.SERVER_PORT;

// Set up EJS templating
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up post request
app.use(express.urlencoded());

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up cache middleware
// N.B. cache must come first because API refers to it
cache.register(app, 60 * 60 * 24);

// Set up data analytics middleware
dataAnalytics.register(app);

// Set up routes
routes.register(app);
// Set up API endpoint
api.register(app);

// Run server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server listening at port ${port}`);
});
