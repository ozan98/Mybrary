const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Author', authorSchema) //exporting the model. 
                                                        //Name of the model is Author
                                                        //which is the name of the table in
                                                        //the database