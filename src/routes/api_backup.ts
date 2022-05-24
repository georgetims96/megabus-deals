import axios from 'axios';
import express, { Application, Request, Response} from "express";
import { getValidDates, ORIGIN_CITIES, getJourneysOnDates} from "./api";

export function register(app: Application) {
  app.get("/deals", async (req: Request, res : Response) => {
    // TODO fix any typing
    const sourceCity : any = req.query.sourceCity;
    const destinationCity : any = req.query.destinationCity;
    const outDay : any = req.query.outDateSelection;
    const returnDay : any = req.query.returnDateSelection;

    const validOutDates = await getValidDates(sourceCity, destinationCity, outDay);
    const validReturnDates = await getValidDates(destinationCity, sourceCity, returnDay);


    const validOutJourneys = await getJourneysOnDates(validOutDates, sourceCity, destinationCity);

    const validReturnJourneys = await getJourneysOnDates(validReturnDates, destinationCity, sourceCity);

    res.json({
      error: "",
      data: {
        outJourneys: validOutJourneys,
        returnJourneys: validReturnJourneys
      }
    });

  });
}
