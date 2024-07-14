import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)


export const createAnecdote = async (newAnecdote) => {
  if (newAnecdote.content.length > 4) {
    const response = await axios.post(baseUrl, newAnecdote)
    return response.data
  } else {
    throw new Error('Content must be at least 5 characters long')
  }
}


export const updateAnecdote = async updatedAnecdote => {
  const response = await axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
  return response.data
}