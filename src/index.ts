import express, { Express, Request, Response} from "express";
const app : Express = express();
const port : number = 8080;

app.get("/", (req : Request, res: Response) => {
    res.send("<b>Hello world</b>");
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server listening at port ${port}`);
});
