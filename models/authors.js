const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

//mongoose has the function to run code before, after, or during an execution of a model method
//this is the function that will be called before a remove method is called on the authors model.
authorSchema.pre('remove', function(next){
    Book.find({ author: this.id}, (err, books) => {
        if (err) {
            next(err)
        }else if(books.length > 0) {
            next(new Error('this author has books still'))
        }else{
            next()
        }
    })
})

module.exports = mongoose.model('Author', authorSchema) //exporting the model. 
                                                        //Name of the model is Author
                                                        //which is the name of the table in
                                                        //the database