const mongoose = require('mongoose')

const url = 'mongodb://simoa:<...>@ds163730.mlab.com:63730/hymooc_simo_puhelinluettelo'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.statics.format = function(person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
      }
}

const Person = mongoose.model('Person', personSchema)

/**const Person = mongoose.model('Person', {
    name: String,
    number: String
  })**/

module.exports = Person