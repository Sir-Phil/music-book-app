import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./Middlewares/errorHandle";

import userRoute from "./Routes/userRoute"
import bookingRoute from "./Routes/bookingRoute"
import eventRoute from "./Routes/eventRoute"
import artistRoute from "./Routes/artistRoute"



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

app.use("/api/users", userRoute )
app.use("/api/booking", bookingRoute)
app.use("/api/events", eventRoute)
app.use("/app/artist", artistRoute)

//for ErrorHandling
app.use(errorHandler);
app.use(notFound);

export default app