import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'


const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filteredAnecdotes = filter === '' 
      ? anecdotes 
      : anecdotes.filter(anecdote => 
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
        
    return filteredAnecdotes.slice().sort((a, b) => b.votes - a.votes)
  })
  /*
  const vote = (id) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))
    const anecdote = anecdotes.find(a => a.id === id)
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5000))
  }
  */

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5))
  } 

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div key={anecdote.id}>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
