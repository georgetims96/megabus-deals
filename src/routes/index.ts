import express, { Application, Request, Response} from "express";

export function register(app : Application) : void {

    // Homepage
    app.get("/", (req : Request, res : Response) => {
        res.render("index");
    });

    app.get("/deals", (req : Request, res : Response) => {
        res.send("TBD");
    });
}
