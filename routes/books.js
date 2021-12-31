const express = require("express")
const Author = require("../models/authors")
const router = express.Router()
const Book = require("../models/book")
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif',]


// All Books Routes
// Get request sends info through the query.
router.get("/", async (req, res) => {
 try {
  let query = Book.find()
  if(req.query.title != null && req.query.title != ''){
     //.regex is the regular expression query of the book table
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
    //.lte is the less than or equal to query of the book table
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
    //.gte is the greater than or equal to query of the book table
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  //.exec witll call the query 'query' and that is appened to query.regex
  //depending on which query variable is sent by the view.
  //exec will call the corrosponding query which is .regex, .lte, or gte
  const books = await query.exec()
  res.render('books/index', {
    books: books,
    searchOptions: req.query
  })
 } catch (error) {
   res.redirect('/')
 }
})

// New Book Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book())
})

// Create Book Route
// POST request sends info throught the body
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })

  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)/books
  } catch (err) {
    renderNewPage(res, book, true)
  }
})


//showing book route
router.get('/:id', async (req, res) =>{
  try {
    //we are getting book with the id
    //however we also need the information of the author but findById is going to 
    //only send the author id and not the name and such info
    //we need the populate function to populate 'author' with the information of the 
    //author
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show', { book: book})
  } catch (error) {
    res.redirect('/')
  }
})

router.get("/new", async (req, res) => {
  renderNewPage(res, new Book())
})

router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch (error) {
    res.redirect('/')
  }
})

// Update Book 
router.put("/:id", async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover != null && req.body.cover !== ''){
      saveCover(book, req.body.cover)
    }
    await book.save()
    res.redirect(`/books/${book.id}`)
  } catch (err) {
    console.log(err)
    if(book != null){
      renderEditPage(res, book, true)
    }else {
      res.redirect('/')
    }
  }
})

//delete book page
router.delete('/:id', async (req, res,) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch (err) {
    if(book != null){
      res.render('books/show', {
        book: book,
        errorMessage: 'could now remove book'
      })
    }else{
      res.redirect('/')
    }
  }
})





async function renderNewPage(res, book, hasError = false){
 renderFormPage(res, book, 'new', hasError )
}

async function renderEditPage(res, book, hasError = false){
  renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false){
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if(hasError){
      if(form === 'edit'){
        params.errorMessage = 'Error Editing book'
      } else{
        params.errorMessage = 'Error Updating book'
      }
    }
    
    res.render(`books/${form}`, params)
  } catch {
    res.redirect('/books')
  }
}

function saveCover(book, coverEncoded){
  if(coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if(cover != null && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = router
