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

/**let persons = [
    {
      name: "Cary Grant",
      number: "040-123456",
      id: 1  
    },
    {
      name: "James Stewart",
      number: "040-123456",
      id: 2  
    },
    {
      name: "Marlon Brando",
      number: "040-123456",
      id: 3  
    },
    {
      name: "Henry Fonda",
      number: "040-123456",
      id: 4  
    },
    {
      name: "James Dean",
      number: "040-123456",
      id: 5  
    },
    {
      name: "Dick Clarke",
      number: "040-123456",
      id: 6  
    },
    {
      name: "Kirk Douglas",
      number: "040-123456",
      id: 7  
    }
  ]**/

/**const formatPerson = (person) => {
    return {
      name: person.name,
      number: person.number,
      id: person._id
    }
}**/  


app.get('/api/persons', (req, res) => {
    //console.log("returning list of persons")
    //res.json(persons)
    Person
    .find({}, {__v: 0})
    .then(persons => {
      res.json(persons.map(Person.format))
    })

})

app.get('/info', (req, res) => {
  //console.log("returning info page")
  
  Person
    .find({}, {__v: 0})
    .then(persons => {
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

  //console.log("getting person")
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })

  /**const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    res.json(person)  

  } else {
    res.status(404).end()
  }**/
})

app.delete('/api/persons/:id', (req, res) => {
  //console.log("deleting person")
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })

  //const id = Number(req.params.id)
  //persons = persons.filter(person => person.id !== id)
  //res.status(204).end()
})

app.put('/api/persons/:id', (req, res) => {
  console.log("Here")
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  console.log("adding person")
  const body = req.body

  if(body.name === "") {
    res.status(400).json({ error: 'nimi puuttuu' })
  }
  if(body.number === "") {
    res.status(400).json({ error: 'numero puuttuu' })
  }
  //console.log("person name", body.name)
  //const uniqueness = persons.find(person => person.name === body.name)
  //console.log("unique", uniqueness)
  /**if(uniqueness) {
    return res.status(400).json({ error: 'ei uniikki nimi' })
  }**/

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    })

})

/**app.post('/api/persons', (req, res) => {
  //console.log("adding person")
  const body = req.body

  if(body.name === "") {
    return res.status(400).json({ error: 'nimi puuttuu' })
  }
  if(body.number === "") {
    return res.status(400).json({ error: 'numero puuttuu' })
  }
  //console.log("person name", body.name)
  const uniqueness = persons.find(person => person.name === body.name)
  //console.log("unique", uniqueness)
  if(uniqueness) {
    return res.status(400).json({ error: 'ei uniikki nimi' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(100000))
  }
  //persons.push(person) State managemnt problems?
  persons = persons.concat(person)

  res.json(person)

})**/


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})