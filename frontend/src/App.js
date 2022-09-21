import { useState, useEffect } from 'react'
import contactService from './services/contacts'
import Notification from './components/Notification'


const Filter = ({ filter, handler }) => {
  return (
    <div>
      Filter: <input
        value={filter}
        onChange={handler}
      />
    </div>
  )
}

const PersonForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addContact }) => {
  return (
    <form onSubmit={addContact}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>number: <input
        value={newNumber}
        onChange={handleNumberChange}
      /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Contact = ({ contact }) => {
  return (
    <>
      {contact.name} {contact.number}
    </>
  )
}

const ButtonDeleteContact = ({ deleteContact }) => {
  return (
    <button onClick={deleteContact}>
      Delete
    </button>
  )
}

const Contacts = ({ contacts, deleteContact }) => {
  return (
    <ul>
      {contacts.map(contact =>
        <li key={contact.name}>
          <Contact contact={contact} />
          <ButtonDeleteContact
            id={contact.id}
            name={contact.name}
            deleteContact={() => deleteContact(contact.id, contact.name)}
          />
        </li>
      )}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [notification, setNotification] = useState(null)

  const addNewContact = (personObject) => {
    contactService
      .createNewContact(personObject)
      .then(newContact => {
        setPersons(persons.concat(newContact));
        setNewName('');
        setNewNumber('');

        setNotification({
          "type": "green",
          "message": `Added ${personObject.name}`
        })

        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
      .catch(error => {
        console.log(error.response.data.error)

        setNotification({
          type: "red",
          message: error.response.data.error
        })

        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
  }

  const updateContact = (oldId, personObject) => {
    contactService
      .updateContact(oldId, personObject)
      .then(response => {
        setPersons(persons.map(
          person => person.id !== oldId
            ? person
            : response
        ));

        setNotification({
          type: "yellow",
          message: `Updated ${personObject.name}`
        })

        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
      .catch(error => {
        console.log(error.response.data.error)

        setNotification({
          type: "red",
          message: error.response.data.error
        })

        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
  }

  const addContact = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    }

    const oldContact = persons.find(person => person.name === newName)
    const alreadyPresent = oldContact !== undefined
    if (!alreadyPresent) {
      addNewContact(personObject);
    } else {

      const replaceOldNumber = window.confirm(`${newName} is already added to the phonebook, replace old number with new one?`)
      if (replaceOldNumber) {
        updateContact(oldContact.id, personObject)
      }
    }
  }

  const deleteContact = (id, name) => {
    const confirmation = window.confirm(`Delete ${name}?`)
    if (!confirmation) {
      return;
    }

    contactService
      .deleteContact(id)
      .then(_response => {
        setPersons(persons.filter(person => person.id !== id))

        setNotification({
          type: "red",
          message: `Deleted ${name}`
        })

        setTimeout(() => {
          setNotification(null)
        }, 5000);

      })
      .catch(error => {
        console.log(`Failed to delete id=${id}, error message: ${error}`);
        setPersons(persons.filter(person => person.id !== id))

        setNotification({
          type: "red",
          message: `${name} has already been removed from server!`
        })

        setTimeout(() => {
          setNotification(null)
        }, 5000);
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const contactsToShow = filter.length === 0
    ? persons
    : persons.filter(
      person => person.name.toLowerCase()
        .includes(filter.toLowerCase())
    );

  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(persons.concat(initialContacts));
      })
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} handler={handleFilterChange} />
      <h3>Add new contact</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addContact={addContact}
      />
      <h2>Numbers</h2>
      <Contacts contacts={contactsToShow} deleteContact={deleteContact} />
    </div>
  )
}

export default App
