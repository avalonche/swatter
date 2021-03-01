import express from "express";
import http from "http";
import cors from "cors";
import ApiServer from "./setup/api";

const app = express();

// Redirect to https on Heroku
if (
  process.env.NODE_ENV === "production" &&
  process.env.FORCE_HTTPS !== undefined
) {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

const httpServer = http.createServer(app);
const port = process.env.PORT || 8080;
httpServer.listen(port);
console.log(`Server listening on port: ${port}`);

if (!process.env.DISABLE_API) {
  app.use(cors());
  app.use(express.json());
  ApiServer.start(app, httpServer);
}
