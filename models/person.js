const mongoose = require('mongoose')

const url = 'mongodb://simoa:koodarispagetti1337@ds163730.mlab.com:63730/hymooc_simo_puhelinluettelo'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
  })

module.exports = Person