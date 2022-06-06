import { Client } from "memjs";
import NodeCache from "node-cache";
import { Request, Response } from "express";

export function UseCache() : any {

  const cache = new NodeCache ( { stdTTL : 60 * 60 * 24} );
  return {
    cacheMiddleware:  ( req : Request, res : Response, next : any) => {
      const sourceCity : any = req.query.sourceCity;
      const destinationCity : any = req.query.destinationCity;
      const outDay : any = req.query.outDateSelection;
      const returnDay : any = req.query.returnDateSelection;

      const uid = `${sourceCity}-${destinationCity}&${outDay}-${returnDay}`;

      if ( cache.has(uid) ) {
        return res.status(200).json(cache.get(uid));
      }
      return next();
    },
    setCache: (id: string, data: JSON) => {
      cache.set(id, data);
    }
 };

}
