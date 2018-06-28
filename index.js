const express = require('express')

const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('type', function (req, res) { return JSON.stringify(req.body)})
const morganString = ':method :url :type :status :res[content-length] - :response-time ms'
app.use(morgan(morganString))


app.get('/api/persons', (req, res) => {
  Person
    .find({}, { __v: 0 })
    .then((persons) => {
      res.json(persons.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  // console.log("returning info page")
  Person
    .find({}, { __v: 0 })
    .then((persons) => {
      const amount = persons.length
      const layout = `<div>
                    <p>Puhelinluettelossa ${amount} henkilön tiedot<p>
                  <div>
                  <div>
                    <p>${new Date()}<p>
                  <div>
                  `
      res.send(layout)
    })
})

app.get('/api/persons/:id', (req, res) =>{

  // console.log("getting person")
  Person
    .findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(() => {
      // console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  // console.log("deleting person")
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(() => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  // console.log("Here")
  const [body] = [req.body]

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(Person.format(updatedPerson))
    })
    .catch(() => {
      // console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  // console.log("adding person")
  const [body] = [req.body]
  // json cant be undefined?
  if (body.name === '' || body.name === null) {
    res.status(400).json({ error: 'nimi puuttuu' })
  } else if (body.number === '' || body.number === null) {
    res.status(400).json({ error: 'numero puuttuu' })
  } else {
    Person.find({ name: body.name })
      .then((result) => {
      // [] == 0 => true, uniqueneess check loose equality
        if (result != 0) {
          res.status(400).json({ error: 'ei uniikki nimi' })
        } else {
          const person = new Person({
            name: body.name,
            number: body.number
          })

          person
            .save()
            .then((savedPerson) => {
              res.json(Person.format(savedPerson))
            })
        }
      })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`)
})
