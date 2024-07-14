import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

/*
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]


const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}
*/

const initialState = []

//const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    /*
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      )
    },
    */
    appendAnecdote(state, action) {
      state.push(action.payload)
    },

    setAnecdote(state, action) {
      return action.payload
    },

    updateAnecdote(state, action) {
      const id = action.payload.id
      console.log(id)
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : action.payload
      )
    }
  }
})

export const { appendAnecdote, setAnecdote, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const returnedAnecdote = await anecdoteService.update(anecdote.id, updatedAnecdote)
    dispatch(updateAnecdote(returnedAnecdote))
  }
}

export default anecdoteSlice.reducer
