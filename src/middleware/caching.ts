import NodeCache from "node-cache";
import { Application, Request, Response } from "express";

export function register(app : Application, cacheStoreTime : number)  {
  // Initialize cache with passed length
  const cache = new NodeCache( { stdTTL : cacheStoreTime });
  // Create cache object that we'll interact with
  const cacheObj = {
    cacheMiddleware:  ( req : Request, res : Response, next : any) => {
      const sourceCity = req.query.sourceCity;
      const destinationCity = req.query.destinationCity;
      const outDay = req.query.outDateSelection;
      const returnDay = req.query.returnDateSelection;

      const uid = `${sourceCity}-${destinationCity}&${outDay}-${returnDay}`;
      const id = cacheObj.stringit(req.query);
      // FIXME return to uid if this doesn't work
      if (cache.has(id)) {
        return res.status(200).json(cache.get(id));
      }
      return next();
    },
    setCache: (id: any, data: JSON) => {
      cache.set(id, data);
    },
    stringit: (queryObj: any) => {
      let runningString = "";
      for (const key in queryObj) {
        if (queryObj.hasOwnProperty(key)) {
          runningString += key;
          runningString += "=";
          runningString += queryObj[key];
          runningString += "&";
        }
      }
      return runningString;
    }
  };
  // Add cache to app.locals
  app.locals.mainCache = cacheObj;
};

