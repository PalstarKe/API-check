const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set('strictQuery', true);

const url = process.env.MONGOURL;
console.log(url);
mongoose.connect(url,);
