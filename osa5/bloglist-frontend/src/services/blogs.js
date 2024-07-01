import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log(token)
}

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl)
    return response.data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    console.log(newObject)
    const response = await axios.post(baseUrl, newObject, config)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error creating blog:', error)
    throw error
  }
}

const update = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  }

  console.log(updatedObject)

  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error updating blog:', error)
    throw error
  }
}


const remove = async id => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error deleting blog:', error)
    throw error
  }
}

export default { getAll, create, setToken, update, remove }