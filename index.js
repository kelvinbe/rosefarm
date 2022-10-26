import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";

import tokenRoutes from './routes/token.js'



const app = express();

const db =
  "mongodb+srv://Kelvin:1234@cluster0.8no4u.mongodb.net/gaming?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port:${PORT} `));
  })
  .catch((err) => console.error(err));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json())

app.use('/token', tokenRoutes)


