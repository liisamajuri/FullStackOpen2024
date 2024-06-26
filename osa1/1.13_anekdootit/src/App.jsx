import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const getRandomInt = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const getAnecdote = () => {
    const updatedSelected = getRandomInt(0, anecdotes.length)
    setSelected(updatedSelected)
    console.log(updatedSelected)
  }

  const getVote = () => {
    const votedItem = selected
    const votesCopy = [...votes]
    console.log(`Voted index: ${votedItem}`)

    votesCopy[votedItem] += 1
    setVotes(votesCopy)
    console.log(`Updated: ${votesCopy}`)
  }

  return (
    <div>
      <h1>Anecdote:<br/></h1>
      <div>
        <p>{anecdotes[selected]}</p>
        <p>votes: {votes[selected]}</p>
      </div>    
      <div>
        <Button handleClick={getVote} text='vote' />
        <Button handleClick={getAnecdote} text='next anecdote' />
      </div>
    </div>
  )
}

export default App

