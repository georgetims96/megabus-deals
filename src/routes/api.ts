import { Application, Request, Response} from "express";
import { getValidDestinations, getValidDates, ORIGIN_CITIES, getJourneysOnDates} from "./api_helpers";

export function register(app: Application) {
  // Set up cache for deals endpoint
  const dealCache = app.locals.mainCache;

  app.get("/deals", dealCache.cacheMiddleware, async (req: Request, res : Response) => {
    // TODO fix any typing
    const sourceCity : any = req.query.sourceCity;
    const destinationCity : any = req.query.destinationCity;
    const outDay : any = req.query.outDateSelection;
    const returnDay : any = req.query.returnDateSelection;
    // Generate UID for caching purposes
    // FIXME could probably just use req.params
    const uid = `${sourceCity}-${destinationCity}&${outDay}-${returnDay}`;

    const id = dealCache.stringit(req.query);

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

    // Make sure to cache response to avoid expensive duplicate API calls
    dealCache.setCache(id, dataToReturn);


    res.json(dataToReturn);

  });

  app.get("/origin_cities", async (req: Request, res: Response) => {
    res.json(ORIGIN_CITIES);
  });

  app.get("/valid_destinations", dealCache.cacheMiddleware, async (req: Request, res: Response) => {
    const id  = dealCache.stringit(req.query);
    const originCity: any = req.query.cityName;

    const dataToReturn = await getValidDestinations(originCity);

    dealCache.setCache(id, dataToReturn);
    res.json(dataToReturn);
  });
}
