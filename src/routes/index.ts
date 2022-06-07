import express, { Application, Request, Response} from "express";
import { ORIGIN_CITIES } from "./api_helpers";

export function register(app : Application) : void {
  // Homepage
  app.get("/", (req : Request, res : Response) => {
    // Render homepage, passing valid origin cities to template
    res.render("index", {cities: ORIGIN_CITIES.cities});
  });

  // Deal page
  app.post("/search", async (req : Request, res : Response) => {
    // Render search results page, passing search parameters to template for API call
    res.render("search", { outDates: req.body.outDateSelection, returnDates: req.body.returnDateSelection, sourceCity: req.body.sourceCity, destinationCity: req.body.destinationCity });
  });

}
