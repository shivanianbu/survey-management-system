const express=require("express");
require('dotenv').config()
const cors = require("cors");
const authRoute=require("./router/auth")
const app=express();

require('./config/db')

app.use(express.json());
app.use(cors());

app.use("/api/auth/", authRoute);


app.listen(process.env.PORT, 
    () => 
    console.log(`Server Started Running on ${process.env.PORT}...`)
    )