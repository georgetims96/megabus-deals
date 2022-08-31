import { Application, Request, Response} from "express";
import { getValidDestinations, getValidDates, ORIGIN_CITIES, getJourneysOnDates} from "./api_helpers";

export function register(app: Application) {
  // Set up cache for deals endpoint
  const dealCache = app.locals.mainCache;

  app.get("/deals", dealCache.cacheMiddleware, async (req: Request, res : Response) => {
    const id = dealCache.stringit(req.query);
    // TODO fix any typing
    const sourceCity : any = req.query.sourceCity;
    const destinationCity : any = req.query.destinationCity;
    const outDay : any = req.query.outDateSelection;
    const returnDay : any = req.query.returnDateSelection;

    // Generate UID for caching purposes
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

    // TODO Move into middleware
    if (!dataToReturn.error) {
       // tslint:disable-next-line:no-console
       // console.log(dataToReturn.data);
    }

    // Make sure to cache response to avoid expensive duplicate API calls
    dealCache.setCache(id, dataToReturn);

    // Send journey data
    res.json(dataToReturn);

  });

  app.get("/origin_cities", async (req: Request, res: Response) => {
    // Return all origin cities from API helper file
    res.json(ORIGIN_CITIES);
  });

  app.get("/valid_destinations", dealCache.cacheMiddleware, async (req: Request, res: Response) => {
    // Generate unique id for caching
    const id  = dealCache.stringit(req.query);

    // TODO fix any typing
    const originCity: any = req.query.cityName;

    const dataToReturn = await getValidDestinations(originCity);

    // Cache valid destinations request to avoid unnecessary API calls
    dealCache.setCache(id, dataToReturn);

    // Send valid destination
    res.json(dataToReturn);
  });
}
