import { useState } from 'react'

/*
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}

const Display = ({ counter }) => {
  return (
    <div>{counter}</div>
  )
}
*/

const Display = ({ counter }) => <div>{counter}</div>

/*
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}
*/

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

/*
const App = ({counter}) => {
  const {counter} = props
*/

const App = () => {  
  const [ counter, setCounter ] = useState(0)

  console.log('rendering with counter value', counter)

  const increaseByOne = () => setCounter(counter + 1)
  console.log('increasing, value before', counter)

  const decreaseByOne = () => setCounter(counter - 1)
  console.log('decreasing, value before', counter)

  const setToZero = () => setCounter(0)
  console.log('resetting to zero, value before', counter)
  
  const HandleClick = () => {
    console.log('clicked')
    //setCounter(counter + 1)
  }

  {/* 

  setTimeout(
    () => setCounter(counter + 1),
    1000
  )
*/}  
  // Debuggaus:
  console.log('rendering...', counter)
 

  return (
    <div>
      <h1>Calculator:</h1>
      <HandleClick />

      <Display counter={counter}/>

      <Button
        handleClick={increaseByOne}
        text='plus'
      />
      <Button
        handleClick={setToZero}
        text='zero'
      />     
      <Button
        handleClick={decreaseByOne}
        text='minus'
      /> 
    </div>
  )
}

export default App