import { useState } from 'react'

const Display = ({ counter, text }) => <div>{text} {counter}</div>

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [feedbackValues, setValues] = useState([])
  const [total, setTotal] = useState(0)

  const goodClick = () => {
    setValues(feedbackValues.concat(1))
    console.log(feedbackValues)
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad)
  }

  const neutralClick = () => {
    setValues(feedbackValues.concat(0))
    console.log(feedbackValues)
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + updatedNeutral + bad)
  }

  const badClick = () => {
    setValues(feedbackValues.concat(-1))
    console.log(feedbackValues)
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(good + neutral + updatedBad)
  }

  const getAverage = ({ array, total }) => {
    if (total === 0) return 0
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return sum / total;
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
      <Display counter={total} text='all' />
      <Display counter={getAverage({ array: feedbackValues, total })} text='average' />
      <Display counter={total === 0 ? 0 : (good / total) * 100} text='positive (%)' />
    </div>
  )
}

export default App
