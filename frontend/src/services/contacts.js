import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const createNewContact = contact => {
    const request = axios.post(baseUrl, contact)
    return request.then(response => response.data)
}

const deleteContact = id => {
    const url = `${baseUrl}/${id}`
    const request = axios.delete(url)
    return request.then(response => response.data)
}

const updateContact = (id, newContact) => {
    const url = `${baseUrl}/${id}`
    const response = axios.put(url, newContact)
    return response.then(response => response.data)
}

export default {
    getAll, createNewContact, deleteContact, updateContact
}
