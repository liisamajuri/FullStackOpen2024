import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer, { setAnecdote } from './reducers/anecdoteReducer'
import anecdoteService from './services/anecdotes'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

/*
anecdoteService.getAll().then(notes =>
  store.dispatch(setAnecdote(notes))
)
*/

export default store