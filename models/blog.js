const mongoose = require('mongoose')
const process = require('process')
const uri = process.env.MONGODB_URI

console.log('connecting to', uri)
mongoose.connect(uri)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)

