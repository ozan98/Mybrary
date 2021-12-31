if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

//setting up the server
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const methodOverride = require('method-override')

//routers
const indexRouter = require("./routes/index") //getting a ref to the index.js file in the router folder
const authorRouter = require("./routes/authors") //getting a ref to the authors red file in the router folder
const bookRouter = require("./routes/books")

app.set("view engine", "ejs") //setting the view engine to ejs
app.set("views", __dirname + "/views") //setting the views directory to views folder by appending it to the current directory
app.set("layout", "layouts/layout") //setting the defualt html layout
app.use(expressLayouts) //setting the layouts to use express
app.use(methodOverride('_method'))
app.use(express.static("public")) //tell express where out public files are going to be
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false })) //telling the server to use body parser with urlencoded and upload limit of 10mb

//setting up the database connection
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.log(error))
db.once("open", () => console.log("Connected to Database"))

app.use("/", indexRouter)
app.use("/authors", authorRouter)
app.use("/books", bookRouter)

app.listen(process.env.PORT || 3000) //listen to the adress from the env file or listen to port 3000 by default
