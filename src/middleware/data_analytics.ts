import { Application, Request, Response } from "express";
import * as fs from "fs";

export function register(app : Application) {
  const dataObj = {
    saveResponse(req: Request, res: Response, next: any) {
      res.on("finish", () => {
        // tslint:disable-next-line:no-console
        console.log(res.json);
      });
      next();
    }
  };
  app.locals.dataAnalytics = dataObj;
}