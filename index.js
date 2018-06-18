const express = require('express')
const app = express()

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
    }
  ]

app.get('/api/persons', (req, res) => {
    console.log("returning list of persons")
    res.json(persons)
})

app.get('/info', (req, res) => {
  console.log("returning info page")
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
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person) {
    res.json(person)  

  } else {
    res.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})