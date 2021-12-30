const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName:{
        type: String,
        required: true
    },
    author:{
        //This is telling mongoose that author key is a ref to another objection in out 
        //collection in the database
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author' //this is what we are refrecening. The author model called Author

    }

})
//this is creating a virtual property that acts any variables from the model keys
//the virtual property is called coverImagePath
//when we call coverImagePath, It is going to call the .get() function
//using normal function because we need to use 'this' so we can link to the book it self
bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema) //exporting the model. 
                                                        //Name of the model is Author
                                                        //which is the name of the table in
                                                        //the database
module.exports.coverImageBasePath = coverImageBasePath