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
  const [errorMessage, setErrorMessage] = useState(null)

  const Notification = ({ message, type }) => {
    if (!message) {
      return null
    }
  
    return (
      <div className={type}>
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
            setInfoMessage(`${updatedPerson.name}'s number updated!`)
            setTimeout(() => {setInfoMessage(null)}, 5000)
          })
          .catch(error => {
            console.log(error)
            setNewName('')
            setNewNumber('')
            setErrorMessage(`Information of ${newName} has already been removed from server`            )
            setTimeout(() => {setErrorMessage(null)}, 5000)
            setPersons(persons.filter(person => person.id !== updatedPerson.id))
          })          

      } else {
        setNewName('')
        setNewNumber('')
        setInfoMessage(`Updation cancelled.`)
        setTimeout(() => {setInfoMessage(null)}, 5000)
      }


    } else {
      personsService
        .create(personObject)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          setNewName('')
          setNewNumber('')
          setInfoMessage(`${newName} added!`)
          setTimeout(() => {
            setInfoMessage(null)
          }, 5000)          
        })
        .catch(error => {
          console.log(error)
          const errData = String(error.response.data.error)
          console.log(errData)
      
          if (errData) {
            if (errData.includes('name')) {
              if (errData.includes('minimum allowed length')) {
                setErrorMessage('Name is too short. Minimum length is 3 characters.')
              } else if (errData.includes('`name` is required')){
                setErrorMessage('Name is missing. Please provide a name.')
              } else {
                setErrorMessage(`${errData}`)
              }
            } else if (errData.includes('number')) {
              if (errData.includes('minimum allowed length')) {
                setErrorMessage('Number is too short. Minimum length is 8 characters.')
              } else if (errData.includes('`number` is required')){
                setErrorMessage('Number is missing. Please provide a name.')
              } else if (errData.includes('not a valid phone number')) {
                setErrorMessage(`${newNumber} is not a valid phone number. Right format is 'XX-XXXXXX' or 'XXX-XXXXX'.`)                
              } else {
                setErrorMessage(`${errData}`)
              }
            } else {
              setErrorMessage(`${errData}`)
            }              
          } else {
            setErrorMessage(`${errData}`)
          }
          setTimeout(() => {setErrorMessage(null)}, 5000)
          setNewName('')
          setNewNumber('')          
        })  
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
            setInfoMessage(`${personToDelete.name} deleted.`)
            setTimeout(() => {setInfoMessage(null)}, 5000)          
        })
        .catch(error => {
          console.log(error)
          setErrorMessage(`${personToDelete.name} has already been deleted from server`)
          setTimeout(() => {setErrorMessage(null)}, 5000)
          setPersons(persons.filter(person => person.id !== personToDelete.id))
        })            

    } else {
      setInfoMessage(`Deletion cancelled.`)
      setTimeout(() => {setInfoMessage(null)}, 5000)      
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} type="info" />
      <Notification message={errorMessage} type="error" />
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