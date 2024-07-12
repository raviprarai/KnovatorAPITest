const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const  {connect}  = require("./connection/db");
dotenv.config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
connect();



app.use("/api/User", require("./user/Router/userRouter"));
app.use("/api/post", require("./post/Router/postRouter"));


app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));