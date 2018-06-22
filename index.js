const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json())

morgan.token('type', function (req, res) { return JSON.stringify(req.body)})
const morganString = ':method :url :type :status :res[content-length] - :response-time ms'
app.use(morgan(morganString))

let persons = [
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
  ]

app.get('/api/persons', (req, res) => {
    //console.log("returning list of persons")
    res.json(persons)
})

app.get('/info', (req, res) => {
  //console.log("returning info page")
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

app.get('/api/persons/:id', (req, res) =>{
  //console.log("getting person")
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    res.json(person)  

  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  //console.log("deleting person")
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  //console.log("adding person")
  const body = req.body

  if(body.name === undefined) {
    return res.status(400).json({ error: 'nimi puuttuu' })
  }
  if(body.number === undefined) {
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

})


const PORT = 3001
app.listen(PORT, () => {
  //console.log(`Server running on port ${PORT}`)
})