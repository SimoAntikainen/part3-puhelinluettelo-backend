const mongoose = require('mongoose')

const url = 'mongodb://simoa:<...>@ds263109.mlab.com:63109/puhtuotanto'
// mongodb://simoa:<....>@ds163730.mlab.com:63730/hymooc_simo_puhelinluettelo
mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})


const argCapture = new Array(4)

process.argv.forEach((val, index) => {
  argCapture[index] = val
  // console.log(`${index}: ${argCapture[index]}`)
})

if (argCapture[2] && argCapture[3]) {
  // console.log("adding to database")
  const person = new Person({
    name: argCapture[2],
    number: argCapture[3]
  })
  person
    .save()
    .then(() => {
      // console.log('person saved!')
      mongoose.connection.close()
    })
} else {
  // console.log("printing database")
  Person
    .find({})
    .then((result) => {
      result.forEach(() => {
      // console.log(person)
      })
      mongoose.connection.close()
    })
}
