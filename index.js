import "colors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import schema from "./graphql/schema.js";
import connectDB from "./db/conn.js";
import useAuth from "./middleware/useAuth.js";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(cookieParser());
// authentication middleware
app.use("*", useAuth);
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
//  if database is connected then only serve app on specified port
connectDB().then(() => {
  app.listen(PORT, (err) => {
    console.log(err || `Server running on PORT:${PORT}`.bgBlue);
  });
});
