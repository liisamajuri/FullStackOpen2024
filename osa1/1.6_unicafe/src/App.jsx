import { useState } from 'react'

const Display = ({ counter, text }) => <div>{text} {counter}</div>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const neutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const badClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <div>
      <h1>Give feedback:</h1>
      <div>
        <Button handleClick={goodClick} text='good' />
        <Button handleClick={neutralClick} text='neutral' />
        <Button handleClick={badClick} text='bad' />
      </div>
      <h1>Statistics:</h1>
      <Display counter={good} text='good' />
      <Display counter={neutral} text='neutral' />
      <Display counter={bad} text='bad' />
    </div>
  )
}

export default App
