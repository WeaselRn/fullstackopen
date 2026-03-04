import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 18,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return <div style={style}>{message}</div>
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  /* fetch persons */
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  /* add or update person */
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {

      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {

        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {

            setPersons(
              persons.map(p =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            )

            setNotification(`Updated ${returnedPerson.name}`)
            setNotificationType('success')

            setTimeout(() => {
              setNotification(null)
            }, 5000)

            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification(error.response.data.error)
            setNotificationType('error')

            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }

      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(returnedPerson => {

        setPersons(persons.concat(returnedPerson))

        setNotification(`Added ${returnedPerson.name}`)
        setNotificationType('success')

        setTimeout(() => {
          setNotification(null)
        }, 5000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {

        setNotification(error.response.data.error)
        setNotificationType('error')

        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  /* delete person */
  const deletePerson = (id) => {

    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {

      personService
        .remove(id)
        .then(() => {

          setPersons(persons.filter(p => p.id !== id))

          setNotification(`Deleted ${person.name}`)
          setNotificationType('success')

          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {

          setNotification(
            `Information of ${person.name} has already been removed from server`
          )

          setNotificationType('error')

          setPersons(persons.filter(p => p.id !== id))

          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>

      <h2>Phonebook</h2>

      <Notification message={notification} type={notificationType} />

      <Filter
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        numberValue={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        onDelete={deletePerson}
      />

    </div>
  )
}

export default App