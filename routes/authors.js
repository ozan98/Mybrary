const express = require("express")
const router = express.Router()
const Author = require("../models/authors")

// All Authors Routes
// Get request sends info through the query.
router.get("/", async (req, res) => {
  let searchOptions = {} //this is an empty object
  if(req.query.name != null && req.query.name !== ''){
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    //find is a method of the model that finds an author
    //we pass a condition for find as an object
    //if its an empty object that means we want all 
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
      } catch (err) {
        
  }
})

// New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() })
})

// Create Author Route
// POST request sends info throught the body
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  })
  try {
    const newAuthor = await author.save()
    // res.redirect(`authors${newAuthor.id}`)
    res.redirect(`authors`)
  } catch (err) {
    res.render("authors/new", { //sending this object to the view. Object properties can be used in ejs files
      author: author,
      errorMessage: "Error creating Author",
    })
  }
})

module.exports = router
