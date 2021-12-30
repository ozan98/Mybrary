const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => { // '/' is the index of the page
    let book
    try {
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch (error) {
        books = []
    }
    res.render('index', {
        books: books
    })
})


module.exports = router //exporting the info on router