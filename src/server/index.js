import express from "express";

export default function bootstrap({ handleMove, handleInfo }) {
    const app = express();

    app.use(express.json());

    app.get("/", (_, res) => {
        res.send(handleInfo());
    });

    app.post("/start", (_, res) => {
        res.send("ok");
    });

    app.post("/move", (req, res) => {
        res.send(handleMove(req.body));
    });

    app.post("/end", (_, res) => {
        res.send("ok");
    });

    app.use(function (_, res, next) {
        res.set("Server", "battlesnake/github/starter-snake-javascript");
        next();
    });

    return app
}
