import express, { Application, Request, Response} from "express";
import { getValidDates } from "./api";

export function register(app : Application) : void {

  // Homepage
  app.get("/", (req : Request, res : Response) => {
    res.render("index");
  });

  // Deal page
  app.post("/search", async (req : Request, res : Response) => {
    // First get valid dates
    const validDates = await getValidDates(123, 127);
    // TODO
    // Then get all matching jouneys that cost $1
    // tslint:disable-next-line:no-console
    console.log(validDates);
    res.render("search", {data: req.body, myName: "James", dates: validDates});
  });

}
