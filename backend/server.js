import express from 'express';
import { readdirSync } from 'fs';

import mongoose from "mongoose";
const morgan = require("morgan");
require("dotenv").config();




// db
mongoose.connect(process.env.DATABASE, {
  userNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));


//aplicando middlewares


app.use(express.json());
app.use(morgan('dev'));

//importando rutas
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

//definiendo puerto
const port = process.env.PORT || 8000;

//escuchando el puerto
app.listen(port, () => {
  console.log(`Server corriendo en puerto:  ${port}`);
}
);
