import express, { Application, Request, Response} from "express";
import { getValidDates, ORIGIN_CITIES, getJourneysOnDates} from "./api";

export function register(app : Application) : void {

  // Homepage
  app.get("/", (req : Request, res : Response) => {
    // Render homepage, passing valid origin cities to template
    res.render("index", {cities: ORIGIN_CITIES.cities});
  });

  // Deal page
  app.post("/search", async (req : Request, res : Response) => {
    // First get valid dates
    // const validOutDates = await getValidDates(req.body.sourceCity, req.body.destinationCity, req.body.outDateSelection);
    // const validReturnDates = await getValidDates(req.body.sourceCity, req.body.destinationCity, req.body.returnDateSelection);

    // Then get all matching jouneys that cost $1
    // const validOutJourneys = await getJourneysOnDates(validOutDates, req.body.sourceCity, req.body.destinationCity);

    // const validReturnJourneys = await getJourneysOnDates(validReturnDates, req.body.sourceCity, req.body.destinationCity);

    // res.render("search", {data: req.body, outJourneys: validOutJourneys, returnJourneys: validReturnJourneys, outDates: req.body.outDateSelection, returnDates: req.body.returnDateSelection, sourceCity: req.body.sourceCity, destinationCity: req.body.destinationCity });

    res.render("search", { outDates: req.body.outDateSelection, returnDates: req.body.returnDateSelection, sourceCity: req.body.sourceCity, destinationCity: req.body.destinationCity });
  });

}
