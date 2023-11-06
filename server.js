const { configDotenv } = require('dotenv')
const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler");
const jwt = require('jsonwebtoken')
const user = require('./routes/user')
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const Dbconnection = require('./database/config/mongodb')
app= express()



// config dev mode
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "privacy/.env",
    });
  }
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
 

// calling database connection
Dbconnection()

app.use("/api/v2/user", user)
app.listen(process.env.PORT,()=>{
    console.log( `app is running on http://localhost:${process.env.PORT}`)
})
