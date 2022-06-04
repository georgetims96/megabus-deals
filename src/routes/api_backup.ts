import axios from 'axios';
import express, { Application, Request, Response} from "express";
import { getValidDates, ORIGIN_CITIES, getJourneysOnDates} from "./api";
import { UseCache } from "../middleware/caching";
import NodeCache from "node-cache";

export function register(app: Application) {

  const cache = new NodeCache ( { stdTTL : 60 * 60 * 24} );
  // FIXME need to figure how to put this in separate middleware file
  function verifyCache( req : Request, res : Response, next : any) {
    const sourceCity : any = req.query.sourceCity;
    const destinationCity : any = req.query.destinationCity;
    const outDay : any = req.query.outDateSelection;
    const returnDay : any = req.query.returnDateSelection;

    const uid = `${sourceCity}-${destinationCity}&${outDay}-${returnDay}`;

    if (cache.has(uid)) {
      return res.status(200).json(cache.get(uid));
    }
    return next();
  }

  app.get("/deals", verifyCache, async (req: Request, res : Response) => {
    // TODO fix any typing
    const sourceCity : any = req.query.sourceCity;
    const destinationCity : any = req.query.destinationCity;
    const outDay : any = req.query.outDateSelection;
    const returnDay : any = req.query.returnDateSelection;
    // Generate UID for caching purposes
    // FIXME could probably just use req.params
    const uid = `${sourceCity}-${destinationCity}&${outDay}-${returnDay}`;

    const validOutDates = await getValidDates(sourceCity, destinationCity, outDay);
    const validReturnDates = await getValidDates(destinationCity, sourceCity, returnDay);


    const validOutJourneys = await getJourneysOnDates(validOutDates, sourceCity, destinationCity);

    const validReturnJourneys = await getJourneysOnDates(validReturnDates, destinationCity, sourceCity);


    const dataToReturn = {
      error: "",
      data: {
        outJourneys: validOutJourneys,
        returnJourneys: validReturnJourneys
      }
    };

    cache.set(uid, dataToReturn);


    res.json(dataToReturn);

  });
}
