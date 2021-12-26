const express = require('express')
const router = express.Router()

router.get('/', (req, res) => { // '/' is the index of the page
res.render('index') //this renders a view from the views folder
})


module.exports = router //exporting the info on router