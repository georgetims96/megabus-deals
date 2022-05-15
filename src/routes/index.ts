import express, { Application, Request, Response} from "express";
import { getValidDates, getJourneyOnDate, getJourneysOnDates } from "./api";

export function register(app : Application) : void {

    // Homepage
    app.get("/", (req : Request, res : Response) => {
        res.render("index");
    });

    // Deal page
    app.post("/search", (req : Request, res : Response) => {
        res.render("search", {data: req.body, myName: "James"});
    });

    // Deal page
    app.get("/search", (req : Request, res : Response) => {
        res.render("search", {data: req.body});
    });

}
