if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//setting up the server
const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index') //getting a ref to the index.js file in the router folder

app.set('view engine', 'ejs') //setting the view engine to ejs
app.set('views', __dirname + '/views') //setting the views directory to views folder by appending it to the current directory
app.set('layout', 'layouts/layout') //setting the defualt header and footer for the html layouts
app.use(expressLayouts) //setting the layouts to use express
app.use(express.static('public')) //tell express where out public files are going to be 

//setting up the database connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL) 
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to Database'))




app.use('/', indexRouter)

app.listen(process.env.PORT || 3000) //listen to the adress from the env file or listen to port 3000 by default


