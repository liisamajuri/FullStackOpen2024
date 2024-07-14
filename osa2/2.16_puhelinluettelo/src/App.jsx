import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)

  const Notification = ({ message }) => {
    if (!message) {
      return null
    }
  
    return (
      <div className="info">
        {message}
      </div>
    )
  }

  useEffect(() => {
    personsService
      .getAll()
        .then(initialNotes => {
        setPersons(initialNotes)
      })
  }, [])

  console.log('render', persons.length, 'persons')


  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    
    const nameExists = persons.some(person => person.name === newName)
    const updatedPerson = persons.find(person => person.name === newName)
    const updatedObject = { ...updatedPerson, number: newNumber } 

    if (nameExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .update(updatedPerson.id, updatedObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
        setInfoMessage(`${updatedPerson.name}'s number updated!`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      } else {
        setNewName('')
        setNewNumber('')
        setInfoMessage(`Updation cancelled.`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      }


    } else {
      personsService
        .create(personObject)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          setNewName('')
          setNewNumber('')
        })
        setInfoMessage(`${newName} added!`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filter.toLowerCase())
      );

  const deletePerson = id => {
    const personToDelete = persons.find(person => person.id === id)
    
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        setInfoMessage(`${personToDelete.name} deleted.`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
    } else {
      setInfoMessage(`Deletion cancelled.`)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)      
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} />
      <br></br>      
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      
      <PersonForm 
        addPerson={addPerson} 
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons 
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  );
}


export default App