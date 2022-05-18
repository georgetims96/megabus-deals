import express, { Application, Request, Response} from "express";
import { getValidDates, ORIGIN_CITIES } from "./api";

export function register(app : Application) : void {

  // Homepage
  app.get("/", (req : Request, res : Response) => {
    // Render homepage, passing valid origin cities to template
    res.render("index", {cities: ORIGIN_CITIES.cities});
  });

  // Deal page
  app.post("/search", async (req : Request, res : Response) => {
    // First get valid dates
    const validOutDates = await getValidDates(req.body.sourceCity, req.body.destinationCity, req.body.outDateSelection);
    const validReturnDates = await getValidDates(req.body.sourceCity, req.body.destinationCity, req.body.returnDateSelection);

    // TODO
    // Then get all matching jouneys that cost $1
    // tslint:disable-next-line:no-console
    console.log(validReturnDates);
    res.render("search", {data: req.body, outDates: validOutDates, returnDates: validReturnDates });
  });

}
