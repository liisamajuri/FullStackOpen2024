const Hello = (props) => {
  console.log(props)

  const { name, age } = props
  /* 
  const name = props.name
  const age = props.age
 */
  const bornYear = () => new Date().getFullYear() - age
  /* 
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }  

  const bornYear = () => {
    return new Date().getFullYear() - age
  }
 */
  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born {bornYear()}</p>
    </div>
  )
}


const App = () => {  
 
  const nimi = 'Pekka'
  const ika = 10
  const friends = [
    { name: 'Leevi', age: 4 },
    { name: 'Venla', age: 10 },
  ]
  

  return (
    <div>
      
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={nimi} age={ika} />
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
         
    </div>
  )
}

export default App