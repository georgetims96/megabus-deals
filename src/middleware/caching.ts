import { Client } from "memjs";
import NodeCache from "node-cache";
import { Request, Response } from "express";

export class UseCache {
  public cache;

  constructor() {
    this.cache = new NodeCache ( { stdTTL : 60 * 60 * 24} );
  }

  public verifyCache( req : Request, res : Response, next : any) {
    const sourceCity : any = req.query.sourceCity;
    const destinationCity : any = req.query.destinationCity;
    const outDay : any = req.query.outDateSelection;
    const returnDay : any = req.query.returnDateSelection;

    const uid = `${sourceCity}-${destinationCity}&${outDay}-${returnDay}`;

    if ( this.cache.has(uid) ) {
      return res.status(200).json(this.cache.get(uid));
    }
    return next();
  }

}
