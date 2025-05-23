import * as dotenv from "dotenv";
import app from "./src/app";

dotenv.config();



process.on("uncaughtException", (err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`Server shutting down for handling uncaught exception`)
});



const server = app.listen(process.env.PORT, () => {
    console.log(
        `Server running on http://localhost:${process.env.PORT}`
    );
});


process.on("unhandledRejection", (err) => {
    console.log(`Server is shutting down for ${err}`);
    console.log(`Server is shutting down for unhandled promise rejection`);

    server.close(() => {
        process.exit(1)
    });
});
