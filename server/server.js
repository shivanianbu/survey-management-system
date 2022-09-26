const express=require("express");
require('dotenv').config()
const authRoute=require("./router/auth")
const userRoute=require("./router/user")
const surveyRoute = require("./router/survey");
const responseRoute=require('./router/response')
const app=express();
const cors = require("cors");
const {rateLimiterUsingThirdParty} = require('./rateLimiter')

require('./config/db')

app.use(express.json());
app.use(cors());
app.use(rateLimiterUsingThirdParty)


app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/survey", surveyRoute);
app.use("/api/survey/response", responseRoute);

app.listen(process.env.PORT, 
    () =>
    console.log(`Server Started Running on ${process.env.PORT}...`)
    )
