import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./src/Middlewares/errorHandle";


const app = express();

app.use(cors());
app.use(express.json());
// app.use(cookieParser());
app.use("/test", (_req, res) => {
  res.send("Hi Music")
})

app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "config/.env",
    });
}

//for ErrorHandling
app.use(errorHandler);
app.use(notFound);

export default app